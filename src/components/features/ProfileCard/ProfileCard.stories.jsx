import { ProfileCard } from './ProfileCard';

export default {
  title: 'Design System/ProfileCard',
  component: ProfileCard,
  argTypes: {
    onBook: { action: 'booked' },
    onContact: { action: 'contacted' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: '520px' }}>
        <Story />
      </div>
    ),
  ],
};

// ── Story 1: Default — Hip-Hop Producer ────────────────────────────────────
export const Default = {
  name: 'Default — Hip-Hop Producer',
  args: {
    musician: {
      name: 'Marcus Johnson',
      tagline: 'Grammy-nominated hip-hop producer & beatmaker',
      avatarSrc: 'https://i.pravatar.cc/150?img=12',
      location: 'Atlanta, GA',
      online: true,
      tier: 'pro',
      badges: ['pro', 'topRated'],
      genres: ['Hip-Hop', 'Trap', 'R&B'],
      skills: ['Beat Making', 'Mixing', 'Sampling'],
      rating: 4.9,
      reviewCount: 214,
      startingPrice: 75,
      currency: 'USD',
      audioSample: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '2:34',
        title: 'Late Night Vibes (Instrumental)',
      },
    },
  },
};

// ── Story 2: Top Rated — Verified Mixing Engineer ──────────────────────────
export const TopRated = {
  name: 'Top Rated — Mixing Engineer',
  args: {
    musician: {
      name: 'Sofia Chen',
      tagline: 'Certified mixing & mastering engineer — 10+ years',
      avatarSrc: 'https://i.pravatar.cc/150?img=47',
      location: 'Los Angeles, CA',
      online: true,
      tier: 'verified',
      badges: ['verified', 'topRated', 'pro'],
      genres: ['Pop', 'R&B', 'Electronic', 'Soul'],
      skills: ['Mixing', 'Mastering', 'Vocal Production', 'Stem Separation'],
      rating: 5.0,
      reviewCount: 389,
      startingPrice: 120,
      currency: 'USD',
      audioSample: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '3:02',
        title: 'Pop Ballad Mix (Before & After)',
      },
    },
  },
};

// ── Story 3: New — Up-and-coming Vocalist ─────────────────────────────────
export const New = {
  name: 'New — Rising Vocalist',
  args: {
    musician: {
      name: 'Aaliyah Rivera',
      tagline: 'Soulful vocalist & songwriter — specializing in R&B hooks',
      avatarSrc: 'https://i.pravatar.cc/150?img=34',
      location: 'New York, NY',
      online: false,
      tier: 'none',
      badges: ['new'],
      genres: ['R&B', 'Soul', 'Neo-Soul'],
      skills: ['Songwriting', 'Vocal Production', 'Ad-libs', 'Harmonies'],
      rating: 4.6,
      reviewCount: 18,
      startingPrice: 45,
      currency: 'USD',
      audioSample: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '1:58',
        title: 'Original Hook Demo — "Golden Hour"',
      },
    },
  },
};

// ── Story 4: No audio / minimal data ──────────────────────────────────────
export const MinimalNoAudio = {
  name: 'Minimal — No Audio Sample',
  args: {
    musician: {
      name: 'Devon Miles',
      tagline: 'Electronic producer & sound designer',
      location: 'Berlin, Germany',
      online: false,
      tier: 'none',
      badges: [],
      genres: ['Electronic', 'Techno', 'Ambient'],
      skills: ['Sound Design', 'Synthesis', 'Mixing'],
      rating: 4.3,
      reviewCount: 42,
      startingPrice: 60,
      currency: 'EUR',
    },
  },
};

// ── Story 5: Grid of cards ────────────────────────────────────────────────
export const CardGrid = {
  name: 'Example Grid',
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: 'var(--space-5)',
          padding: 'var(--space-6)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <ProfileCard
        musician={{
          name: 'Marcus Johnson',
          tagline: 'Grammy-nominated hip-hop producer',
          avatarSrc: 'https://i.pravatar.cc/150?img=12',
          location: 'Atlanta, GA',
          online: true,
          tier: 'pro',
          badges: ['pro', 'topRated'],
          genres: ['Hip-Hop', 'Trap'],
          skills: ['Beat Making', 'Mixing'],
          rating: 4.9,
          reviewCount: 214,
          startingPrice: 75,
          audioSample: {
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            duration: '2:34',
            title: 'Late Night Vibes',
          },
        }}
        onBook={args.onBook}
        onContact={args.onContact}
      />
      <ProfileCard
        musician={{
          name: 'Sofia Chen',
          tagline: 'Certified mixing & mastering engineer',
          avatarSrc: 'https://i.pravatar.cc/150?img=47',
          location: 'Los Angeles, CA',
          online: true,
          tier: 'verified',
          badges: ['verified', 'topRated'],
          genres: ['Pop', 'R&B', 'Electronic'],
          skills: ['Mixing', 'Mastering', 'Vocal Production'],
          rating: 5.0,
          reviewCount: 389,
          startingPrice: 120,
          audioSample: {
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            duration: '3:02',
            title: 'Pop Ballad Mix',
          },
        }}
        onBook={args.onBook}
        onContact={args.onContact}
      />
      <ProfileCard
        musician={{
          name: 'Aaliyah Rivera',
          tagline: 'Soulful vocalist & songwriter',
          avatarSrc: 'https://i.pravatar.cc/150?img=34',
          location: 'New York, NY',
          online: false,
          tier: 'none',
          badges: ['new'],
          genres: ['R&B', 'Soul', 'Neo-Soul'],
          skills: ['Songwriting', 'Harmonies'],
          rating: 4.6,
          reviewCount: 18,
          startingPrice: 45,
          audioSample: {
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            duration: '1:58',
            title: 'Golden Hour Hook Demo',
          },
        }}
        onBook={args.onBook}
        onContact={args.onContact}
      />
    </>
  ),
};

// ── Story 6: New with no rating — shows "New on Prova" state ──────────────
export const NewWithNoRating = {
  name: 'New — No Ratings Yet',
  args: {
    musician: {
      name: 'Tomás Ferreira',
      tagline: 'Classical guitarist & arranger — flamenco and fingerstyle',
      avatarSrc: 'https://i.pravatar.cc/150?img=61',
      location: 'Lisbon, Portugal',
      online: true,
      tier: 'none',
      badges: ['new'],
      genres: ['Classical', 'Flamenco', 'Acoustic'],
      skills: ['Guitar', 'Arranging', 'Composition'],
      rating: 0,
      reviewCount: 0,
      startingPrice: 35,
      currency: 'EUR',
    },
  },
};

// ── Story 7: Many genres — overflow badge visible ──────────────────────────
export const ManyGenres = {
  name: 'Many Genres — Overflow Badge',
  args: {
    musician: {
      name: 'Yuki Tanaka',
      tagline: 'Multi-genre session musician & producer',
      avatarSrc: 'https://i.pravatar.cc/150?img=52',
      location: 'Tokyo, Japan',
      online: false,
      tier: 'verified',
      badges: ['verified', 'pro'],
      genres: ['Jazz', 'Fusion', 'Electronic', 'Soul', 'R&B', 'Blues'],
      skills: ['Piano', 'Keys', 'Production'],
      rating: 4.7,
      reviewCount: 93,
      startingPrice: 90,
      currency: 'USD',
      audioSample: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '2:15',
        title: 'Midnight Fusion — Keys Session',
      },
    },
  },
};

// ── Story 9: Dark Mode ────────────────────────────────────────────────────
export const DarkMode = {
  name: 'Dark Mode',
  globals: { theme: 'dark' },
  args: {
    musician: {
      name: 'Marcus Johnson',
      tagline: 'Grammy-nominated hip-hop producer & beatmaker',
      avatarSrc: 'https://i.pravatar.cc/150?img=12',
      location: 'Atlanta, GA',
      online: true,
      tier: 'pro',
      badges: ['pro', 'topRated'],
      genres: ['Hip-Hop', 'Trap', 'R&B'],
      skills: ['Beat Making', 'Mixing', 'Sampling'],
      rating: 4.9,
      reviewCount: 214,
      startingPrice: 75,
      currency: 'USD',
      audioSample: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '2:34',
        title: 'Late Night Vibes (Instrumental)',
      },
    },
  },
};
