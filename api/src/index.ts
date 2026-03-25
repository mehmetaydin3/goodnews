import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import { prisma } from '@goodnews/shared';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ANALYTICS_URL = process.env.ANALYTICS_URL || 'http://localhost:3002';

app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', limiter);

app.get('/api/articles', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
    const category = String(req.query.category || '').trim();
    const search = String(req.query.search || '').trim();

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: true,
          summary: {
            select: {
              shortSummary: true,
              longSummary: true,
              sentiment: true,
              keyTakeaway: true,
            },
          },
          analytics: {
            select: {
              views: true,
              shares: true,
              likes: true,
              clickThrough: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API] GET /api/articles error:', msg);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        summary: true,
        analytics: true,
        shares: {
          select: {
            platform: true,
            shareUrl: true,
            sharedAt: true,
            engagement: true,
          },
          orderBy: { sharedAt: 'desc' },
        },
      },
    });

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(article);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API] GET /api/articles/:id error:', msg);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { articleCount: 'desc' },
    });
    res.json(categories);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API] GET /api/categories error:', msg);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    const [totalArticles, analyticsAgg, topCategory] = await Promise.all([
      prisma.article.count(),
      prisma.articleAnalytics.aggregate({
        _sum: { views: true, shares: true, likes: true },
      }),
      prisma.category.findFirst({
        orderBy: { articleCount: 'desc' },
      }),
    ]);

    res.json({
      totalArticles,
      totalViews: analyticsAgg._sum.views ?? 0,
      totalShares: analyticsAgg._sum.shares ?? 0,
      totalLikes: analyticsAgg._sum.likes ?? 0,
      topCategory: topCategory
        ? {
            name: topCategory.name,
            slug: topCategory.slug,
            emoji: topCategory.emoji,
            articleCount: topCategory.articleCount,
          }
        : null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API] GET /api/stats error:', msg);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/track', async (req: Request, res: Response) => {
  try {
    const { articleId, event, platform } = req.body as {
      articleId?: string;
      event?: string;
      platform?: string;
    };

    if (!articleId || !event) {
      res.status(400).json({ error: 'Missing articleId or event' });
      return;
    }

    try {
      await axios.post(
        `${ANALYTICS_URL}/track`,
        { articleId, event, platform },
        { timeout: 3000 }
      );
    } catch {
      const validEvents = ['view', 'share', 'like', 'click'];
      if (validEvents.includes(event)) {
        const incrementField: Record<string, object> = {
          view: { views: { increment: 1 } },
          share: { shares: { increment: 1 } },
          like: { likes: { increment: 1 } },
          click: { clickThrough: { increment: 1 } },
        };

        await prisma.articleAnalytics.upsert({
          where: { articleId },
          update: incrementField[event],
          create: {
            articleId,
            views: event === 'view' ? 1 : 0,
            shares: event === 'share' ? 1 : 0,
            likes: event === 'like' ? 1 : 0,
            clickThrough: event === 'click' ? 1 : 0,
          },
        });
      }
    }

    res.status(204).end();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API] POST /api/track error:', msg);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'api', timestamp: new Date().toISOString() });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[API] Server running on port ${PORT}`);
  console.log(`[API] CORS allowed for: ${FRONTEND_URL}`);
});

export default app;
