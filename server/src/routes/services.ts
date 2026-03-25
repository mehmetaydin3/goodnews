import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { serviceSchema } from '../schemas/validation.js';

const router = Router();

// Resolve the musician id for the authenticated user, or 404
async function getMusicianId(userId: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.get('SELECT id FROM musicians WHERE userId = ?', userId);
  return row?.id ?? null;
}

function parseService(s: any) {
  return {
    ...s,
    deliverables: JSON.parse(s.deliverables || '[]'),
    tags: JSON.parse(s.tags || '[]'),
    revisionsIncluded: s.revisionsIncluded ?? 0,
  };
}

// GET /api/services — list services for the authenticated musician
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const musicianId = await getMusicianId(req.user!.id);
    if (!musicianId) {
      return res.status(404).json({ message: 'Musician profile not found. Create your profile first.' });
    }

    const db = await getDb();
    const rows = await db.all('SELECT * FROM services WHERE musicianId = ? ORDER BY createdAt ASC', musicianId);
    res.json(rows.map(parseService));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/services — create a new service
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const musicianId = await getMusicianId(req.user!.id);
    if (!musicianId) {
      return res.status(404).json({ message: 'Musician profile not found. Create your profile first.' });
    }

    const data = serviceSchema.parse(req.body);
    const db = await getDb();
    const id = uuidv4();

    await db.run(
      `INSERT INTO services
        (id, musicianId, serviceType, title, description, deliverables, startingPrice, priceType,
         turnaroundTime, revisionsIncluded, tags, deliveryMode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        musicianId,
        data.serviceType,
        data.title,
        data.description ?? null,
        JSON.stringify(data.deliverables ?? []),
        data.startingPrice,
        data.priceType,
        data.turnaroundTime ?? null,
        data.revisionsIncluded ?? 0,
        JSON.stringify(data.tags ?? []),
        data.deliveryMode,
      ]
    );

    // Update musician's startingPrice to the lowest service price
    await db.run(
      `UPDATE musicians SET startingPrice = (
        SELECT MIN(startingPrice) FROM services WHERE musicianId = ?
      ) WHERE id = ?`,
      [musicianId, musicianId]
    );

    const created = await db.get('SELECT * FROM services WHERE id = ?', id);
    res.status(201).json(parseService(created));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/services/:id — update an existing service (must belong to caller)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const musicianId = await getMusicianId(req.user!.id);
    if (!musicianId) {
      return res.status(404).json({ message: 'Musician profile not found.' });
    }

    const db = await getDb();
    const existing = await db.get(
      'SELECT id FROM services WHERE id = ? AND musicianId = ?',
      [req.params.id, musicianId]
    );
    if (!existing) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const data = serviceSchema.parse(req.body);

    await db.run(
      `UPDATE services SET
        serviceType = ?, title = ?, description = ?, deliverables = ?,
        startingPrice = ?, priceType = ?, turnaroundTime = ?,
        revisionsIncluded = ?, tags = ?, deliveryMode = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND musicianId = ?`,
      [
        data.serviceType,
        data.title,
        data.description ?? null,
        JSON.stringify(data.deliverables ?? []),
        data.startingPrice,
        data.priceType,
        data.turnaroundTime ?? null,
        data.revisionsIncluded ?? 0,
        JSON.stringify(data.tags ?? []),
        data.deliveryMode,
        req.params.id,
        musicianId,
      ]
    );

    // Sync musician's startingPrice
    await db.run(
      `UPDATE musicians SET startingPrice = (
        SELECT MIN(startingPrice) FROM services WHERE musicianId = ?
      ) WHERE id = ?`,
      [musicianId, musicianId]
    );

    const updated = await db.get('SELECT * FROM services WHERE id = ?', req.params.id);
    res.json(parseService(updated));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/services/:id — remove a service (must belong to caller)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const musicianId = await getMusicianId(req.user!.id);
    if (!musicianId) {
      return res.status(404).json({ message: 'Musician profile not found.' });
    }

    const db = await getDb();
    const result = await db.run(
      'DELETE FROM services WHERE id = ? AND musicianId = ?',
      [req.params.id, musicianId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Sync musician's startingPrice after deletion
    await db.run(
      `UPDATE musicians SET startingPrice = (
        SELECT MIN(startingPrice) FROM services WHERE musicianId = ?
      ) WHERE id = ?`,
      [musicianId, musicianId]
    );

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
