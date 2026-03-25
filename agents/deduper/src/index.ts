import stringSimilarity from 'string-similarity';
import { prisma, createWorker, classifierQueue } from '@goodnews/shared';

interface DeduperJob {
  rawArticleId: string;
  images?: string[];
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

const worker = createWorker<DeduperJob>('deduper', async (job) => {
  const { rawArticleId, images = [] } = job.data;

  const rawArticle = await prisma.rawArticle.findUnique({
    where: { id: rawArticleId },
  });

  if (!rawArticle) {
    console.warn(`[Deduper] RawArticle not found: ${rawArticleId}`);
    return;
  }

  if (rawArticle.processed) {
    console.log(`[Deduper] Already processed: ${rawArticleId}`);
    return;
  }

  const normalizedTitle = normalizeTitle(rawArticle.title);

  const recentArticles = await prisma.article.findMany({
    take: 500,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, url: true },
  });

  if (recentArticles.length > 0) {
    const existingTitles = recentArticles.map((a) => normalizeTitle(a.title));
    const { bestMatch } = stringSimilarity.findBestMatch(
      normalizedTitle,
      existingTitles
    );

    if (bestMatch.rating > 0.85) {
      console.log(
        `[Deduper] Duplicate detected (similarity: ${bestMatch.rating.toFixed(2)}): "${rawArticle.title}"`
      );

      await prisma.rawArticle.update({
        where: { id: rawArticleId },
        data: { processed: true, duplicate: true },
      });
      return;
    }
  }

  const cleanContent = stripHtml(rawArticle.content);

  const article = await prisma.article.create({
    data: {
      rawArticleId: rawArticle.id,
      url: rawArticle.url,
      title: rawArticle.title,
      cleanContent,
      source: rawArticle.source,
      publishedAt: rawArticle.publishedAt ?? rawArticle.fetchedAt,
      imageUrl: rawArticle.imageUrl,
      images,
    },
  });

  await prisma.rawArticle.update({
    where: { id: rawArticleId },
    data: { processed: true },
  });

  await classifierQueue.add(
    'classify',
    {
      articleId: article.id,
      title: article.title,
      content: article.cleanContent.slice(0, 1000),
    },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );

  console.log(
    `[Deduper] Article created and queued for classification: ${article.id}`
  );
});

console.log('[Deduper] Worker started');
