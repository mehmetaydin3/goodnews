import Anthropic from '@anthropic-ai/sdk';
import { prisma, createWorker, summarizerQueue, CATEGORIES } from '@goodnews/shared';

interface ClassifierJob {
  articleId: string;
  title: string;
  content: string;
}

interface ClassifyResult {
  category: string;
  sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

const KEYWORD_MAP: Record<string, string[]> = {
  'Science & Nature': ['science', 'research', 'discovery', 'study', 'nature', 'space', 'planet', 'animal', 'species', 'biology', 'physics', 'chemistry'],
  'Health & Medicine': ['health', 'medical', 'doctor', 'treatment', 'cure', 'vaccine', 'hospital', 'therapy', 'cancer', 'disease', 'medicine', 'wellness'],
  'Community & Society': ['community', 'volunteer', 'charity', 'donation', 'help', 'support', 'people', 'family', 'neighborhood', 'local', 'social'],
  'Innovation & Tech': ['technology', 'innovation', 'startup', 'ai', 'robot', 'software', 'app', 'digital', 'internet', 'tech', 'invention', 'breakthrough'],
  'Environment': ['environment', 'climate', 'renewable', 'solar', 'green', 'sustainability', 'ocean', 'forest', 'recycle', 'carbon', 'energy', 'conservation'],
  'Sports & Achievement': ['sports', 'athlete', 'win', 'championship', 'record', 'team', 'competition', 'olympic', 'marathon', 'football', 'achievement'],
  'Arts & Culture': ['art', 'music', 'film', 'culture', 'museum', 'theater', 'dance', 'book', 'creative', 'artist', 'performance', 'exhibition'],
  'Business & Economy': ['business', 'economy', 'company', 'jobs', 'growth', 'market', 'investment', 'entrepreneur', 'revenue', 'profit', 'employment'],
  'Education': ['education', 'school', 'student', 'teacher', 'learning', 'university', 'scholarship', 'graduate', 'classroom', 'literacy', 'training'],
  'World Affairs': ['global', 'international', 'country', 'government', 'peace', 'treaty', 'united nations', 'diplomacy', 'world', 'nation', 'policy'],
};

function keywordClassify(title: string, content: string): ClassifyResult {
  const text = `${title} ${content}`.toLowerCase();
  let bestCategory = 'Community & Society';
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(KEYWORD_MAP)) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  const uplifting = ['amazing', 'incredible', 'inspiring', 'hero', 'triumph', 'overcome', 'hope'];
  const inspiring = ['breakthrough', 'first', 'record', 'historic', 'pioneer', 'transform', 'revolutio'];
  const sentimentText = text;

  let sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING' = 'POSITIVE';
  if (inspiring.some((w) => sentimentText.includes(w))) sentiment = 'INSPIRING';
  else if (uplifting.some((w) => sentimentText.includes(w))) sentiment = 'UPLIFTING';

  return { category: bestCategory, sentiment };
}

async function classifyWithClaude(
  title: string,
  content: string
): Promise<ClassifyResult> {
  const snippet = content.slice(0, 500);

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Classify this news article into exactly one category and assign a sentiment.

Title: ${title}
Content snippet: ${snippet}

Categories (choose exactly one):
${CATEGORY_NAMES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Sentiments (choose exactly one):
- POSITIVE: generally good news
- UPLIFTING: emotionally moving, heartwarming
- INSPIRING: motivational, achievement-focused

Respond with ONLY valid JSON, no markdown, no explanation:
{"category": "<category name>", "sentiment": "<POSITIVE|UPLIFTING|INSPIRING>", "confidence": <0.0-1.0>}`,
      },
    ],
  });

  const text =
    message.content[0].type === 'text' ? message.content[0].text.trim() : '';
  const parsed = JSON.parse(text) as {
    category: string;
    sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
  };

  if (!CATEGORY_NAMES.includes(parsed.category as typeof CATEGORY_NAMES[number])) {
    throw new Error(`Invalid category: ${parsed.category}`);
  }

  return {
    category: parsed.category,
    sentiment: parsed.sentiment,
  };
}

const worker = createWorker<ClassifierJob>('classifier', async (job) => {
  const { articleId, title, content } = job.data;

  let result: ClassifyResult;

  try {
    result = await classifyWithClaude(title, content);
    console.log(
      `[Classifier] Claude classified "${title}" as: ${result.category} (${result.sentiment})`
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Classifier] Claude failed, using keyword fallback: ${msg}`);
    result = keywordClassify(title, content);
  }

  const catDef = CATEGORIES.find((c) => c.name === result.category);

  let category = await prisma.category.findUnique({
    where: { name: result.category },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: result.category,
        slug: catDef?.slug ?? result.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        color: catDef?.color ?? '#10B981',
        emoji: catDef?.emoji ?? '✨',
      },
    });
  }

  await prisma.article.update({
    where: { id: articleId },
    data: { categoryId: category.id },
  });

  await prisma.category.update({
    where: { id: category.id },
    data: { articleCount: { increment: 1 } },
  });

  await summarizerQueue.add(
    'summarize',
    {
      articleId,
      title,
      content,
      sentiment: result.sentiment,
    },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );

  console.log(`[Classifier] Article ${articleId} classified and queued for summarization`);
});

console.log('[Classifier] Worker started');
