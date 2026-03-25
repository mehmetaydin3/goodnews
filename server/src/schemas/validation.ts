import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Legacy schema (musician_profiles table) — kept for backward compatibility
export const profileSchema = z.object({
  fullName: z.string().min(2),
  stageName: z.string().optional(),
  bio: z.string().optional(),
  instruments: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.string().optional(),
});

// Primary profile schema — maps to the musicians table
export const musicianProfileSchema = z.object({
  name: z.string().min(2, 'Display name must be at least 2 characters'),
  headline: z.string().max(120).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  remoteAvailable: z.boolean().optional().default(false),
  instruments: z.array(z.string()).optional().default([]),
  genres: z.array(z.string()).optional().default([]),
  avatarSrc: z.string().url().optional().or(z.literal('')),
});

export const serviceSchema = z.object({
  serviceType: z.enum(['remote', 'in-person', 'both']),
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional().or(z.literal('')),
  deliverables: z.array(z.string()).optional().default([]),
  startingPrice: z.number().min(0),
  priceType: z.enum(['fixed', 'hourly', 'per-project']),
  turnaroundTime: z.string().optional().or(z.literal('')),
  revisionsIncluded: z.number().int().min(0).optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  deliveryMode: z.enum(['remote', 'in-person', 'both']),
});

export const bookingSchema = z.object({
  musicianId: z.string().min(1, 'musicianId is required'),
  serviceId: z.string().min(1, 'serviceId is required'),
  // eventDate is the structured ISO date for the event (required, must not be in the past).
  // scheduledDate remains accepted as a legacy free-text alias when eventDate is absent.
  eventDate: z
    .string()
    .min(1, 'eventDate is required')
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, { message: 'eventDate must be a valid date string' })
    .refine((val) => {
      const d = new Date(val);
      // Compare against start-of-today (midnight UTC) so same-day bookings are allowed
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return d >= today;
    }, { message: 'eventDate must not be in the past' })
    .optional(),
  scheduledDate: z.string().max(200).nullable().optional(),
  brief: z.string().max(2000, 'Brief must be 2000 characters or fewer').nullable().optional(),
});
