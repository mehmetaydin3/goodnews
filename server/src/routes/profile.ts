import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { musicianProfileSchema } from '../schemas/validation.js';

const router = Router();

// Shared helper: parse JSON array fields on a musician row
function parseMusicianRow(row: any) {
  if (!row) return null;
  return {
    ...row,
    instruments: JSON.parse(row.instruments || '[]'),
    genres: JSON.parse(row.genres || '[]'),
    languages: JSON.parse(row.languages || '[]'),
    skills: JSON.parse(row.skills || '[]'),
    badges: JSON.parse(row.badges || '[]'),
    gallery: JSON.parse(row.gallery || '[]'),
    audioSamples: JSON.parse(row.audioSamples || '[]'),
    videoSamples: JSON.parse(row.videoSamples || '[]'),
    remoteAvailable: Boolean(row.remoteAvailable),
    rating: row.ratingAverage,
    reviewCount: row.ratingCount,
    tagline: row.headline,
  };
}

// GET /api/profile — return the authenticated user's musician record
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const row = await db.get(
      'SELECT * FROM musicians WHERE userId = ?',
      req.user?.id
    );

    if (!row) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const services = await db.all(
      'SELECT * FROM services WHERE musicianId = ?',
      row.id
    );

    res.json({
      ...parseMusicianRow(row),
      services: services.map((s: any) => ({
        ...s,
        deliverables: JSON.parse(s.deliverables || '[]'),
        tags: JSON.parse(s.tags || '[]'),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/profile — create or update the authenticated user's musician record
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = musicianProfileSchema.parse(req.body);
    const userId = req.user?.id as string;
    const db = await getDb();

    const existing = await db.get(
      'SELECT id FROM musicians WHERE userId = ?',
      userId
    );

    // Serialize array fields to JSON strings for storage
    const instrumentsJson = JSON.stringify(data.instruments ?? []);
    const genresJson = JSON.stringify(data.genres ?? []);

    if (existing) {
      await db.run(
        `UPDATE musicians SET
          name = ?,
          headline = ?,
          bio = ?,
          location = ?,
          remoteAvailable = ?,
          instruments = ?,
          genres = ?,
          avatarSrc = ?,
          updatedAt = CURRENT_TIMESTAMP
        WHERE userId = ?`,
        [
          data.name,
          data.headline ?? null,
          data.bio ?? null,
          data.location ?? null,
          data.remoteAvailable ? 1 : 0,
          instrumentsJson,
          genresJson,
          data.avatarSrc ?? null,
          userId,
        ]
      );
    } else {
      const id = uuidv4();
      await db.run(
        `INSERT INTO musicians
          (id, userId, name, headline, bio, location, remoteAvailable, instruments, genres, avatarSrc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          data.name,
          data.headline ?? null,
          data.bio ?? null,
          data.location ?? null,
          data.remoteAvailable ? 1 : 0,
          instrumentsJson,
          genresJson,
          data.avatarSrc ?? null,
        ]
      );
    }

    const updated = await db.get(
      'SELECT * FROM musicians WHERE userId = ?',
      userId
    );
    const services = await db.all(
      'SELECT * FROM services WHERE musicianId = ?',
      updated.id
    );

    res.json({
      ...parseMusicianRow(updated),
      services: services.map((s: any) => ({
        ...s,
        deliverables: JSON.parse(s.deliverables || '[]'),
        tags: JSON.parse(s.tags || '[]'),
      })),
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
