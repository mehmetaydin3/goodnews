import Anthropic from '@anthropic-ai/sdk';
import { prisma, createWorker, reshareQueue, analyticsQueue } from '@goodnews/shared';

interface SummarizerJob {
  articleId: string;
  title: string;
  content: string;
  sentiment?: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const worker = createWorker<SummarizerJob>('summarizer', async (job) => {
  const { articleId, title, content, sentiment = 'POSITIVE' } = job.data;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { category: true },
  });

  if (!article) {
    console.warn(`[Summarizer] Article not found: ${articleId}`);
    return;
  }

  const existing = await prisma.summary.findUnique({
    where: { articleId },
  });

  if (existing) {
    console.log(`[Summarizer] Summary already exists for: ${articleId}`);
    return;
  }

  const contentSnippet = content.slice(0, 2000);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a joyful news summarizer for GoodNews, a platform dedicated to positive, uplifting stories.

Article Title: ${title}
Article Content: ${contentSnippet}

Write summaries with an optimistic, engaging tone. Focus on the hopeful and positive aspects.

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "shortSummary": "<tweet-length summary, ≤280 chars, optimistic and engaging, makes people want to share>",
  "longSummary": "<2-3 sentences, engaging narrative that draws readers in, highlights the positive impact>",
  "keyTakeaway": "<one sentence explaining why this story matters and why readers should care>",
  "sentiment": "<POSITIVE|UPLIFTING|INSPIRING>"
}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  let summaryData: {
    shortSummary: string;
    longSummary: string;
    keyTakeaway: string;
    sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
  };

  try {
    summaryData = JSON.parse(responseText);
  } catch {
    console.error(
      `[Summarizer] Failed to parse Claude response for ${articleId}:`,
      responseText
    );
    summaryData = {
      shortSummary: title.slice(0, 280),
      longSummary: content.slice(0, 500),
      keyTakeaway: 'A positive development worth celebrating.',
      sentiment,
    };
  }

  if (summaryData.shortSummary.length > 280) {
    summaryData.shortSummary = summaryData.shortSummary.slice(0, 277) + '...';
  }

  const summary = await prisma.summary.create({
    data: {
      articleId,
      shortSummary: summaryData.shortSummary,
      longSummary: summaryData.longSummary,
      sentiment: summaryData.sentiment || sentiment,
      keyTakeaway: summaryData.keyTakeaway,
    },
  });

  const categoryNames = article.category ? [article.category.name] : [];

  await Promise.all([
    reshareQueue.add(
      'reshare',
      {
        articleId,
        summary: summary.shortSummary,
        title: article.title,
        categories: categoryNames,
        articleUrl: article.url,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    ),
    analyticsQueue.add(
      'analytics',
      { articleId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    ),
  ]);

  console.log(
    `[Summarizer] Summary created for article ${articleId}: "${summaryData.shortSummary.slice(0, 60)}..."`
  );
});

console.log('[Summarizer] Worker started');
