import Groq from 'groq-sdk';
import { prisma, createWorker, reshareQueue, analyticsQueue } from '@goodnews/shared';

interface SummarizerJob {
  articleId: string;
  title: string;
  content: string;
  sentiment?: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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

  const contentSnippet = content.slice(0, 600);

  const message = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `You are an editorial summarizer for GoodNews, a premium platform for positive, uplifting stories.

Article Title: ${title}
Article Content: ${contentSnippet}

Write with an optimistic, intelligent, editorial tone. Be specific — use names, numbers, and facts from the article.

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "shortSummary": "<tweet-length, ≤280 chars, specific and shareable>",
  "longSummary": "<2-3 sentences of engaging editorial narrative that draws readers in>",
  "tldr": ["<key fact or finding #1>", "<key fact or finding #2>", "<key fact or finding #3>"],
  "keyTakeaway": "<one sentence: why this matters to the world>",
  "sentiment": "<POSITIVE|UPLIFTING|INSPIRING>"
}`,
      },
    ],
  });

  const responseText = message.choices[0]?.message?.content?.trim() ?? '';

  let summaryData: {
    shortSummary: string;
    longSummary: string;
    tldr: string[];
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
      tldr: [],
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
      tldr: Array.isArray(summaryData.tldr) ? summaryData.tldr.slice(0, 5) : [],
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

async function requeueUnsummarized() {
  const articles = await prisma.article.findMany({
    where: { summary: null },
    select: { id: true, title: true, cleanContent: true },
    take: 100,
    orderBy: { createdAt: 'desc' },
  });

  if (articles.length === 0) return;
  console.log(`[Summarizer] Re-queuing ${articles.length} unsummarized articles…`);

  const { summarizerQueue } = await import('@goodnews/shared');
  for (const a of articles) {
    await summarizerQueue.add(
      'summarize',
      { articleId: a.id, title: a.title, content: a.cleanContent.slice(0, 600) },
      { attempts: 5, backoff: { type: 'exponential', delay: 10000 }, removeOnComplete: 100, removeOnFail: 50 }
    );
  }
}

console.log('[Summarizer] Worker started');
requeueUnsummarized().catch((e) => console.error('[Summarizer] Requeue error:', e.message));
