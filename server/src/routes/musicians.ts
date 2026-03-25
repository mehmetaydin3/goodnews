import { Router } from 'express';
import type { Request, Response } from 'express';
import { getDb } from '../db.js';
import { mapVibeToKeywords } from '../utils/vibeMapper.js';

const router = Router();

// GET /api/musicians
// Query params:
//   q           - text search against name and headline
//   vibe        - natural language "vibe" search (e.g. "moody cello")
//   genre       - exact genre match (e.g. "Jazz")
//   instrument  - instrument match (e.g. "Guitar")
//   serviceType - service type: remote | in-person | etc.
//   sortBy      - featured | rating | price_asc | price_desc | reviews
//   page        - page number (default 1)
//   limit       - results per page (default 20)
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      q,
      vibe,
      genre,
      instrument,
      service,
      onlineOnly,
      sortBy = 'featured',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    // Vibe search: maps natural language to genres and instruments
    if (vibe && vibe.trim()) {
      const { genres, instruments } = mapVibeToKeywords(vibe);
      
      const vibeConditions: string[] = [];
      
      // If we found specific genres/instruments from the vibe, add them to OR conditions
      if (genres.length > 0) {
        genres.forEach(g => {
          vibeConditions.push('genres LIKE ?');
          params.push(`%"${g}"%`);
        });
      }
      
      if (instruments.length > 0) {
        instruments.forEach(i => {
          vibeConditions.push('instruments LIKE ? OR skills LIKE ?');
          params.push(`%"${i}"%`, `%"${i}"%`);
        });
      }

      // Also include general text search for the vibe string itself as a fallback
      vibeConditions.push('name LIKE ? OR headline LIKE ? OR bio LIKE ?');
      params.push(`%${vibe.trim()}%`, `%${vibe.trim()}%`, `%${vibe.trim()}%`);

      if (vibeConditions.length > 0) {
        conditions.push(`(${vibeConditions.join(' OR ')})`);
      }
    }

    // Text search: name or headline
    if (q && q.trim()) {
      conditions.push('(name LIKE ? OR headline LIKE ?)');
      params.push(`%${q.trim()}%`, `%${q.trim()}%`);
    }

    // Genre filter
    if (genre && genre !== 'All Genres') {
      conditions.push(`genres LIKE ?`);
      params.push(`%"${genre}"%`);
    }

    // Instrument filter
    if (instrument && instrument !== 'All Instruments') {
      conditions.push(`instruments LIKE ?`);
      params.push(`%"${instrument}"%`);
    }

    // Service type filter
    if (service && service !== 'all') {
      conditions.push(`id IN (SELECT musicianId FROM services WHERE serviceType = ?)`);
      params.push(service);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort order
    let orderClause = 'ORDER BY ratingAverage DESC';
    if (sortBy === 'rating') orderClause = 'ORDER BY ratingAverage DESC';
    else if (sortBy === 'price_asc') orderClause = 'ORDER BY startingPrice ASC';
    else if (sortBy === 'price_desc') orderClause = 'ORDER BY startingPrice DESC';
    else if (sortBy === 'reviews') orderClause = 'ORDER BY ratingCount DESC';
    else if (sortBy === 'featured') orderClause = 'ORDER BY (tier = "pro") DESC, ratingAverage DESC';

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();

    const total = await db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM musicians ${whereClause}`,
      params
    );

    const rows = await db.all(
      `SELECT * FROM musicians ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Fetch services for these musicians
    const musicians = await Promise.all(rows.map(async (row: any) => {
      const services = await db.all('SELECT * FROM services WHERE musicianId = ?', row.id);
      
      return {
        ...row,
        badges: JSON.parse(row.badges || '[]'),
        genres: JSON.parse(row.genres || '[]'),
        instruments: JSON.parse(row.instruments || '[]'),
        languages: JSON.parse(row.languages || '[]'),
        skills: JSON.parse(row.skills || '[]'),
        gallery: JSON.parse(row.gallery || '[]'),
        audioSamples: JSON.parse(row.audioSamples || '[]'),
        videoSamples: JSON.parse(row.videoSamples || '[]'),
        services: services.map(s => ({
          ...s,
          deliverables: JSON.parse(s.deliverables || '[]'),
          tags: JSON.parse(s.tags || '[]'),
        })),
        // Compatibility field for old UI components
        rating: row.ratingAverage,
        reviewCount: row.ratingCount,
        tagline: row.headline,
        completedGigs: row.completedJobs,
      };
    }));

    res.json({
      musicians,
      total: total?.count ?? 0,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil((total?.count ?? 0) / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/musicians/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT * FROM musicians WHERE id = ?', req.params.id) as any;

    if (!row) {
      return res.status(404).json({ message: 'Musician not found' });
    }

    const services = await db.all('SELECT * FROM services WHERE musicianId = ?', row.id);

    res.json({
      ...row,
      badges: JSON.parse(row.badges || '[]'),
      genres: JSON.parse(row.genres || '[]'),
      instruments: JSON.parse(row.instruments || '[]'),
      languages: JSON.parse(row.languages || '[]'),
      skills: JSON.parse(row.skills || '[]'),
      gallery: JSON.parse(row.gallery || '[]'),
      audioSamples: JSON.parse(row.audioSamples || '[]'),
      videoSamples: JSON.parse(row.videoSamples || '[]'),
      services: services.map(s => ({
        ...s,
        deliverables: JSON.parse(s.deliverables || '[]'),
        tags: JSON.parse(s.tags || '[]'),
      })),
      rating: row.ratingAverage,
      reviewCount: row.ratingCount,
      tagline: row.headline,
      completedGigs: row.completedJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
