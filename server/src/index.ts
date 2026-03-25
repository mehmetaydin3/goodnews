import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import musicianRoutes from './routes/musicians.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import goodNewsRoutes from './routes/goodnews.js';
import { getDb } from './db.js';
import { fetchAllGoodNews } from './services/newsFetcher.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/goodnews', goodNewsRoutes);

// Legacy health check (root level)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Primary health check at /api/health — includes db connectivity probe
app.get('/api/health', async (_req, res) => {
  try {
    const db = await getDb();
    // Lightweight query to verify the DB connection is alive
    await db.get('SELECT 1');
    res.json({ status: 'ok', timestamp: Date.now(), db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', timestamp: Date.now(), db: 'disconnected' });
  }
});

// Daily cron: refresh good news at 06:00 UTC every day
cron.schedule('0 6 * * *', async () => {
  console.log('[cron] Running daily good news refresh...');
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
    await db.run(
      `DELETE FROM good_news WHERE id NOT IN (
        SELECT id FROM good_news ORDER BY publishedAt DESC LIMIT 500
      )`
    );
    console.log(`[cron] Daily refresh done — ${inserted} new items`);
  } catch (err) {
    console.error('[cron] Daily refresh failed:', err);
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Seed good news on first boot if DB is empty
  try {
    const db = await getDb();
    const count = await db.get('SELECT COUNT(*) as c FROM good_news');
    if ((count as any)?.c === 0) {
      console.log('[boot] Good news table empty — running initial fetch...');
      const items = await fetchAllGoodNews();
      for (const item of items) {
        await db.run(
          `INSERT OR IGNORE INTO good_news (id, title, summary, url, source, category, imageUrl, publishedAt, fetchedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.id, item.title, item.summary, item.url, item.source, item.category, item.imageUrl || null, item.publishedAt, item.fetchedAt]
        );
      }
      console.log(`[boot] Seeded ${items.length} good news items`);
    }
  } catch (err) {
    console.error('[boot] Initial news fetch failed:', err);
  }
});
