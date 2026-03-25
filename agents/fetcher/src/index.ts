import Parser from 'rss-parser';
import axios from 'axios';
import cron from 'node-cron';
import { prisma, deduperQueue } from '@goodnews/shared';

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'GoodNews Bot/1.0 (goodnews.app)',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
});

const DEFAULT_RSS_FEEDS = [
  'https://www.positive.news/feed/',
  'https://www.goodnewsnetwork.org/feed/',
  'https://www.happynews.com/rss.xml',
  'https://feeds.feedburner.com/GoodNewsNetwork',
];

function getRssFeeds(): string[] {
  const envFeeds = process.env.RSS_FEEDS;
  if (envFeeds) {
    return envFeeds
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }
  return DEFAULT_RSS_FEEDS;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

interface NewsApiArticle {
  url: string;
  title: string;
  description: string | null;
  content: string | null;
  source: { name: string };
  publishedAt: string;
  urlToImage: string | null;
}

async function fetchFromNewsApi(): Promise<
  Array<{
    url: string;
    title: string;
    content: string;
    source: string;
    publishedAt: string;
    imageUrl?: string;
  }>
> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'good news OR positive news OR inspiring story OR breakthrough',
        sortBy: 'publishedAt',
        pageSize: 20,
        language: 'en',
        apiKey,
      },
      timeout: 15000,
    });

    const articles: NewsApiArticle[] = response.data?.articles ?? [];
    return articles
      .filter((a) => a.url && a.title && a.title !== '[Removed]')
      .map((a) => ({
        url: a.url,
        title: stripHtml(a.title),
        content: stripHtml(a.content || a.description || ''),
        source: a.source.name,
        publishedAt: a.publishedAt,
        imageUrl: a.urlToImage ?? undefined,
      }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Fetcher] NewsAPI error:', msg);
    return [];
  }
}

async function fetchRssFeed(feedUrl: string): Promise<
  Array<{
    url: string;
    title: string;
    content: string;
    source: string;
    publishedAt?: string;
    imageUrl?: string;
  }>
> {
  try {
    const feed = await rssParser.parseURL(feedUrl);
    const sourceName = feed.title || new URL(feedUrl).hostname;

    return (feed.items || [])
      .filter((item) => item.link && item.title)
      .map((item) => ({
        url: item.link!,
        title: stripHtml(item.title || ''),
        content: stripHtml(
          item['content:encoded'] || item.content || item.contentSnippet || ''
        ),
        source: sourceName,
        publishedAt: item.pubDate || item.isoDate,
        imageUrl:
          item.enclosure?.url ||
          (item as Record<string, unknown>)['media:content'] as string | undefined,
      }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Fetcher] RSS error for ${feedUrl}:`, msg);
    return [];
  }
}

async function runFetch(): Promise<void> {
  console.log('[Fetcher] Starting fetch run at', new Date().toISOString());

  const feeds = getRssFeeds();
  const allArticles: Array<{
    url: string;
    title: string;
    content: string;
    source: string;
    publishedAt?: string;
    imageUrl?: string;
  }> = [];

  const rssResults = await Promise.allSettled(feeds.map(fetchRssFeed));
  for (const result of rssResults) {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    }
  }

  const newsApiArticles = await fetchFromNewsApi();
  allArticles.push(...newsApiArticles);

  console.log(`[Fetcher] Found ${allArticles.length} raw articles`);

  let newCount = 0;

  for (const article of allArticles) {
    if (!article.url || !article.title) continue;

    try {
      const existing = await prisma.rawArticle.findUnique({
        where: { url: article.url },
      });

      if (existing) continue;

      const raw = await prisma.rawArticle.create({
        data: {
          url: article.url,
          title: article.title.slice(0, 500),
          content: article.content.slice(0, 50000),
          source: article.source.slice(0, 200),
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt
            ? new Date(article.publishedAt)
            : null,
        },
      });

      await deduperQueue.add(
        'dedup',
        { rawArticleId: raw.id },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );

      newCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Fetcher] Error storing article "${article.title}":`, msg);
    }
  }

  console.log(
    `[Fetcher] Run complete. New articles: ${newCount}/${allArticles.length}`
  );
}

async function start() {
  console.log('[Fetcher] Agent starting...');

  await runFetch();

  cron.schedule('*/30 * * * *', async () => {
    await runFetch();
  });

  console.log('[Fetcher] Scheduled to run every 30 minutes');
}

start().catch((err) => {
  console.error('[Fetcher] Fatal error:', err);
  process.exit(1);
});
