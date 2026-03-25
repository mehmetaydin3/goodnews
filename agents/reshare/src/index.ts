import { TwitterApi } from 'twitter-api-v2';
import { prisma, createWorker } from '@goodnews/shared';

interface ReshareJob {
  articleId: string;
  summary: string;
  title: string;
  categories: string[];
  articleUrl: string;
}

const SENTIMENT_EMOJIS = ['✨', '🌟', '💚', '🎉', '🌈', '💡', '🌱', '🕊️'];

function getEmoji(categories: string[]): string {
  const emojiMap: Record<string, string> = {
    'Science & Nature': '🔬',
    'Health & Medicine': '💊',
    'Community & Society': '🤝',
    'Innovation & Tech': '💡',
    'Environment': '🌿',
    'Sports & Achievement': '🏆',
    'Arts & Culture': '🎨',
    'Business & Economy': '📈',
    'Education': '📚',
    'World Affairs': '🌍',
  };

  for (const cat of categories) {
    if (emojiMap[cat]) return emojiMap[cat];
  }

  return SENTIMENT_EMOJIS[Math.floor(Math.random() * SENTIMENT_EMOJIS.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postTweetWithBackoff(
  client: TwitterApi,
  tweetText: string,
  attempt = 0
): Promise<{ id: string; text: string }> {
  const maxAttempts = 4;
  const baseDelay = 60000;

  try {
    const result = await client.v2.tweet(tweetText);
    return result.data;
  } catch (err: unknown) {
    const error = err as { code?: number; data?: { status?: number } };
    const status = error.code || error.data?.status;

    if (status === 429 && attempt < maxAttempts) {
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(
        `[Reshare] Rate limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxAttempts})`
      );
      await sleep(delay);
      return postTweetWithBackoff(client, tweetText, attempt + 1);
    }

    throw err;
  }
}

const worker = createWorker<ReshareJob>('reshare', async (job) => {
  const { articleId, summary, categories, articleUrl } = job.data;

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const twitterApiKey = process.env.TWITTER_API_KEY;
  const twitterApiSecret = process.env.TWITTER_API_SECRET;
  const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
  const twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!twitterApiKey || !twitterApiSecret || !twitterAccessToken || !twitterAccessSecret) {
    if (!bearerToken) {
      console.log(`[Reshare] No Twitter credentials configured, skipping share for article ${articleId}`);

      await prisma.articleAnalytics.upsert({
        where: { articleId },
        update: {},
        create: {
          articleId,
          views: 0,
          shares: 0,
          likes: 0,
          clickThrough: 0,
        },
      });
      return;
    }
  }

  const emoji = getEmoji(categories);
  const hashtags = '#GoodNews #Positive';
  const linkLine = `\n\n🔗 ${articleUrl}`;
  const hashtagLine = `\n\n${hashtags}`;
  const overhead = linkLine.length + hashtagLine.length + emoji.length + 1;
  const maxSummaryLength = 280 - overhead;

  const truncatedSummary =
    summary.length > maxSummaryLength
      ? summary.slice(0, maxSummaryLength - 3) + '...'
      : summary;

  const tweetText = `${emoji} ${truncatedSummary}${linkLine}${hashtagLine}`;

  try {
    const client = new TwitterApi({
      appKey: twitterApiKey!,
      appSecret: twitterApiSecret!,
      accessToken: twitterAccessToken!,
      accessSecret: twitterAccessSecret!,
    });

    const tweet = await postTweetWithBackoff(client, tweetText);

    const shareUrl = `https://twitter.com/i/web/status/${tweet.id}`;

    await prisma.socialShare.create({
      data: {
        articleId,
        platform: 'TWITTER',
        shareUrl,
      },
    });

    await prisma.articleAnalytics.upsert({
      where: { articleId },
      update: { shares: { increment: 1 } },
      create: {
        articleId,
        views: 0,
        shares: 1,
        likes: 0,
        clickThrough: 0,
      },
    });

    console.log(`[Reshare] Tweet posted for article ${articleId}: ${shareUrl}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Reshare] Failed to post tweet for ${articleId}:`, msg);

    await prisma.articleAnalytics.upsert({
      where: { articleId },
      update: {},
      create: {
        articleId,
        views: 0,
        shares: 0,
        likes: 0,
        clickThrough: 0,
      },
    });
  }
});

console.log('[Reshare] Worker started');
