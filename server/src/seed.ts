import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db.js';

const users = [
  { id: uuidv4(), email: 'jazz@prova.com',     password: 'password123' },
  { id: uuidv4(), email: 'producer@prova.com', password: 'password123' },
  { id: uuidv4(), email: 'strings@prova.com',  password: 'password123' },
];

const musicians = [
  {
    id: 'marcus-cole',
    userEmail: 'jazz@prova.com',
    name: 'Marcus Cole',
    headline: 'Jazz pianist & composer for film and live sessions',
    bio: 'Marcus Cole is a New York-based jazz pianist with credits spanning film scores, world-class live sessions, and three critically acclaimed solo albums. His harmonic sensibility bridges classic bebop and modern cinematic music.',
    location: 'New York, NY',
    timezone: 'America/New_York',
    languages: ['English'],
    instruments: ['Piano', 'Rhodes'],
    genres: ['Jazz', 'Neo-Soul', 'Cinematic'],
    skills: ['Improvisation', 'Composition', 'Sight Reading', 'Studio Recording'],
    ratingAverage: 4.9,
    ratingCount: 47,
    completedJobs: 52,
    responseTime: '< 2 hrs',
    avatarSrc: 'https://i.pravatar.cc/150?img=68',
    coverSrc: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=75&auto=format',
    badges: ['pro', 'topRated'],
    tier: 'pro',
    startingPrice: 350,
    currency: 'USD',
    remoteAvailable: 1,
    services: [
      {
        id: uuidv4(),
        serviceType: 'session',
        title: 'Studio Session — Jazz Piano',
        description: 'A professional remote jazz piano session recorded in my NYC home studio. Stems, dry and wet tracks delivered.',
        deliverables: ['Stereo mix', 'Dry stems', 'Project file on request'],
        startingPrice: 350,
        priceType: 'flat',
        turnaroundTime: '3 days',
        revisionsIncluded: 2,
        tags: ['jazz', 'piano', 'session', 'remote'],
        deliveryMode: 'remote',
      },
      {
        id: uuidv4(),
        serviceType: 'composition',
        title: 'Original Jazz Composition',
        description: 'A fully original jazz composition tailored to your project — film cue, album track, or sync placement.',
        deliverables: ['Lead sheet', 'Full arrangement', 'Session-ready recording'],
        startingPrice: 800,
        priceType: 'flat',
        turnaroundTime: '7 days',
        revisionsIncluded: 3,
        tags: ['jazz', 'composition', 'original', 'cinematic'],
        deliveryMode: 'remote',
      },
    ],
  },
  {
    id: 'yael-ronen',
    userEmail: 'producer@prova.com',
    name: 'Yael Ronen',
    headline: 'Electronic producer, mixing engineer, sound designer',
    bio: 'Yael Ronen is a Berlin-based electronic music producer and sound designer whose work spans Berghain resident sets to sync placements in European film. With a decade of studio experience, she delivers world-class production with a distinctly forward-thinking sonic identity.',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    languages: ['English', 'Hebrew', 'German'],
    instruments: ['Synthesizer', 'MPC', 'Ableton'],
    genres: ['Electronic', 'Ambient', 'Techno'],
    skills: ['Sound Design', 'Mixing', 'Mastering', 'Synthesis', 'Sampling'],
    ratingAverage: 5.0,
    ratingCount: 31,
    completedJobs: 38,
    responseTime: '< 4 hrs',
    avatarSrc: 'https://i.pravatar.cc/150?img=47',
    coverSrc: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d84?w=800&q=75&auto=format',
    badges: ['elite', 'topRated', 'fastResponder'],
    tier: 'elite',
    startingPrice: 600,
    currency: 'EUR',
    remoteAvailable: 1,
    services: [
      {
        id: uuidv4(),
        serviceType: 'production',
        title: 'Full Track Production',
        description: 'End-to-end electronic track production — from initial concept and sound design through arrangement, mixdown, and master-ready delivery.',
        deliverables: ['Mastered stereo WAV', 'Stems', 'Project file'],
        startingPrice: 600,
        priceType: 'flat',
        turnaroundTime: '10 days',
        revisionsIncluded: 3,
        tags: ['electronic', 'production', 'techno', 'ambient'],
        deliveryMode: 'remote',
      },
      {
        id: uuidv4(),
        serviceType: 'mixing',
        title: 'Mixing & Mastering',
        description: 'Professional mixing and mastering for electronic and hybrid music. Club-ready loudness and clarity on any playback system.',
        deliverables: ['Mastered WAV', 'DDPi image on request', 'Streaming-optimised MP3'],
        startingPrice: 280,
        priceType: 'flat',
        turnaroundTime: '4 days',
        revisionsIncluded: 2,
        tags: ['mixing', 'mastering', 'electronic', 'club'],
        deliveryMode: 'remote',
      },
      {
        id: uuidv4(),
        serviceType: 'sound_design',
        title: 'Custom Sound Design Pack',
        description: 'A bespoke pack of synthesized sounds, one-shots, and loops built to your creative brief. Perfect for producers seeking a unique sonic palette.',
        deliverables: ['50+ samples', 'Synth presets', 'Organised folder structure'],
        startingPrice: 400,
        priceType: 'flat',
        turnaroundTime: '5 days',
        revisionsIncluded: 2,
        tags: ['sound design', 'samples', 'synthesis', 'custom'],
        deliveryMode: 'remote',
      },
    ],
  },
  {
    id: 'sofia-reyes',
    userEmail: 'strings@prova.com',
    name: 'Sofia Reyes',
    headline: 'Classical violinist for recording sessions and live events',
    bio: 'A Royal Academy of Music graduate, Sofia Reyes has recorded with major London orchestras and as a session violinist on platinum-selling albums. She brings impeccable intonation, expressive phrasing, and studio professionalism to every engagement.',
    location: 'London, UK',
    timezone: 'Europe/London',
    languages: ['English', 'Spanish'],
    instruments: ['Violin', 'Viola'],
    genres: ['Classical', 'Cinematic', 'Folk'],
    skills: ['Sight Reading', 'Studio Recording', 'String Arrangement', 'Live Performance'],
    ratingAverage: 4.8,
    ratingCount: 23,
    completedJobs: 29,
    responseTime: '< 3 hrs',
    avatarSrc: 'https://i.pravatar.cc/150?img=5',
    coverSrc: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=75&auto=format',
    badges: ['pro', 'fastResponder'],
    tier: 'pro',
    startingPrice: 420,
    currency: 'GBP',
    remoteAvailable: 1,
    services: [
      {
        id: uuidv4(),
        serviceType: 'session',
        title: 'Violin Session Recording',
        description: 'Remote violin session recording captured in a professional acoustically treated studio. Ideal for film scores, albums, and sync.',
        deliverables: ['Stereo mix', 'Multi-take stems', 'DI and room mic options'],
        startingPrice: 420,
        priceType: 'flat',
        turnaroundTime: '5 days',
        revisionsIncluded: 2,
        tags: ['violin', 'session', 'classical', 'cinematic'],
        deliveryMode: 'remote',
      },
      {
        id: uuidv4(),
        serviceType: 'arrangement',
        title: 'String Arrangement',
        description: 'Full string arrangement written and recorded for your track. From intimate solo lines to lush quartet textures.',
        deliverables: ['Score PDF', 'MIDI mockup', 'Live recording (optional add-on)'],
        startingPrice: 550,
        priceType: 'flat',
        turnaroundTime: '7 days',
        revisionsIncluded: 3,
        tags: ['strings', 'arrangement', 'orchestral', 'score'],
        deliveryMode: 'remote',
      },
    ],
  },
];

async function seed() {
  const db = await getDb();

  // Clear existing data in dependency order
  await db.run('DELETE FROM bookings');
  await db.run('DELETE FROM services');
  await db.run('DELETE FROM musicians');
  await db.run('DELETE FROM users');

  // Insert users
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.run(
      `INSERT INTO users (id, email, passwordHash) VALUES (?, ?, ?)`,
      [u.id, u.email, passwordHash]
    );
  }
  console.log(`Seeded ${users.length} users.`);

  // Build email -> userId map
  const userMap = new Map(users.map((u) => [u.email, u.id]));

  // Insert musicians and their services
  let serviceCount = 0;
  for (const m of musicians) {
    const userId = userMap.get(m.userEmail)!;
    const musicianId = m.id;

    await db.run(
      `INSERT INTO musicians (
        id, userId, name, headline, bio, location, timezone, languages, instruments,
        genres, skills, ratingAverage, ratingCount, completedJobs, responseTime,
        gallery, audioSamples, videoSamples, badges, avatarSrc, coverSrc,
        tier, startingPrice, currency, remoteAvailable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        musicianId,
        userId,
        m.name,
        m.headline,
        m.bio,
        m.location,
        m.timezone,
        JSON.stringify(m.languages),
        JSON.stringify(m.instruments),
        JSON.stringify(m.genres),
        JSON.stringify(m.skills),
        m.ratingAverage,
        m.ratingCount,
        m.completedJobs,
        m.responseTime,
        JSON.stringify([]),
        JSON.stringify([]),
        JSON.stringify([]),
        JSON.stringify(m.badges),
        m.avatarSrc,
        m.coverSrc,
        m.tier,
        m.startingPrice,
        m.currency,
        m.remoteAvailable,
      ]
    );

    for (const s of m.services) {
      await db.run(
        `INSERT INTO services (
          id, musicianId, serviceType, title, description, deliverables,
          startingPrice, priceType, turnaroundTime, revisionsIncluded,
          tags, deliveryMode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id,
          musicianId,
          s.serviceType,
          s.title,
          s.description,
          JSON.stringify(s.deliverables),
          s.startingPrice,
          s.priceType,
          s.turnaroundTime,
          s.revisionsIncluded,
          JSON.stringify(s.tags),
          s.deliveryMode,
        ]
      );
      serviceCount++;
    }
  }

  console.log(`Seeded ${musicians.length} musicians and ${serviceCount} services.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
