import { Router } from 'express';
import type { Request, Response } from 'express';
import { getDb } from '../db.js';
import { fetchAllGoodNews } from '../services/newsFetcher.js';

const router = Router();

// GET /api/goodnews - list cached news with optional category filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { category, limit = '30', offset = '0', search } = req.query as Record<string, string>;

    let query = 'SELECT * FROM good_news';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(title LIKE ? OR summary LIKE ? OR source LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY publishedAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const items = await db.all(query, params);

    const countQuery = 'SELECT COUNT(*) as total FROM good_news' +
      (conditions.length ? ' WHERE ' + conditions.join(' AND ') : '');
    const countResult = await db.get(countQuery, params.slice(0, -2));

    res.json({
      items,
      total: (countResult as any)?.total || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    console.error('[goodnews] GET /', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST /api/goodnews/refresh - trigger a manual refresh (also used by daily cron)
router.post('/refresh', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const items = await fetchAllGoodNews();

    let inserted = 0;
    for (const item of items) {
      const existing = await db.get('SELECT id FROM good_news WHERE id = ?', [item.id]);
      if (!existing) {
        await db.run(
          `INSERT INTO good_news (id, title, summary, url, source, category, imageUrl, publishedAt, fetchedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.id, item.title, item.summary, item.url, item.source, item.category, item.imageUrl || null, item.publishedAt, item.fetchedAt]
        );
        inserted++;
      }
    }

    // Keep only last 500 items to prevent DB bloat
    await db.run(
      `DELETE FROM good_news WHERE id NOT IN (
        SELECT id FROM good_news ORDER BY publishedAt DESC LIMIT 500
      )`
    );

    res.json({ message: 'Refresh complete', fetched: items.length, inserted, total: items.length });
  } catch (err) {
    console.error('[goodnews] POST /refresh', err);
    res.status(500).json({ error: 'Refresh failed' });
  }
});

// GET /api/goodnews/categories - list available categories with counts
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const rows = await db.all(
      `SELECT category, COUNT(*) as count FROM good_news GROUP BY category ORDER BY count DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/goodnews/stats - overall stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const total = await db.get('SELECT COUNT(*) as count FROM good_news');
    const lastFetch = await db.get('SELECT MAX(fetchedAt) as lastFetch FROM good_news');
    const sources = await db.all('SELECT DISTINCT source FROM good_news ORDER BY source');
    res.json({
      total: (total as any)?.count || 0,
      lastFetch: (lastFetch as any)?.lastFetch || null,
      sources: sources.map((s: any) => s.source),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/goodnews/:id/share - track share events
router.post('/:id/share', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { platform } = req.body as { platform: string };

    await db.run(
      `INSERT INTO news_shares (newsId, platform, sharedAt) VALUES (?, ?, ?)`,
      [id, platform || 'unknown', new Date().toISOString()]
    );

    const result = await db.get('SELECT COUNT(*) as count FROM news_shares WHERE newsId = ?', [id]);
    res.json({ shareCount: (result as any)?.count || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track share' });
  }
});

// GET /api/goodnews/:id/shares - get share count for an article
router.get('/:id/shares', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.get('SELECT COUNT(*) as count FROM news_shares WHERE newsId = ?', [req.params.id]);
    res.json({ shareCount: (result as any)?.count || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get share count' });
  }
});

export default router;
