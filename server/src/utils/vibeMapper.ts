/**
 * Vibe mapping logic for translating natural language queries into genres and instruments.
 */

interface VibeMap {
  genres: string[];
  instruments: string[];
}

const MAPPINGS: Record<string, VibeMap> = {
  moody: {
    genres: ['Ambient', 'Cinematic', 'Experimental', 'Classical'],
    instruments: ['Cello', 'Piano', 'Synthesizer', 'Viola'],
  },
  cinematic: {
    genres: ['Cinematic', 'Ambient', 'Classical', 'World Music'],
    instruments: ['Cello', 'Violin', 'Synthesizer', 'Piano', 'Percussion', 'Film Scoring'],
  },
  upbeat: {
    genres: ['Pop', 'Funk', 'Hip-Hop', 'Electronic', 'Afrobeats'],
    instruments: ['Drums', 'Guitar', 'Bass', 'Vocals', 'Percussion', 'Beat Making'],
  },
  chill: {
    genres: ['Jazz', 'Ambient', 'Soul', 'R&B', 'Bossa Nova'],
    instruments: ['Guitar', 'Piano', 'Saxophone', 'Synthesizer', 'Bass'],
  },
  energetic: {
    genres: ['Trap', 'Hip-Hop', 'Techno', 'Rock', 'Afrobeats'],
    instruments: ['Drums', 'Synthesizer', 'Beat Making', 'Bass', 'Percussion'],
  },
  soulful: {
    genres: ['Soul', 'R&B', 'Gospel', 'Blues', 'Jazz'],
    instruments: ['Vocals', 'Piano', 'Saxophone', 'Bass', 'Guitar'],
  },
  experimental: {
    genres: ['Experimental', 'Electronic', 'Techno', 'Ambient'],
    instruments: ['Synthesizer', 'Sound Design', 'Ableton Live', 'Sample Manipulation'],
  },
  traditional: {
    genres: ['Classical', 'Indian Classical', 'World Music', 'Flamenco'],
    instruments: ['Violin', 'Piano', 'Guitar', 'Vocals', 'Cello'],
  },
};

// Direct keyword matches for instruments and genres
const INSTRUMENTS = ['Guitar', 'Piano', 'Violin', 'Viola', 'Cello', 'Drums', 'Percussion', 'Vocals', 'Synthesizer', 'Bass', 'Saxophone', 'Trumpet'];
const GENRES = ['Hip-Hop', 'Pop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Afrobeats', 'Flamenco', 'World Music', 'Ambient', 'Rock', 'Soul', 'Gospel', 'Blues', 'Latin', 'Indian Classical', 'Fusion', 'Cinematic', 'Experimental'];

export function mapVibeToKeywords(query: string): { genres: string[]; instruments: string[] } {
  const normalized = query.toLowerCase();
  const genres = new Set<string>();
  const instruments = new Set<string>();

  // Check for vibe keywords
  for (const [vibe, map] of Object.entries(MAPPINGS)) {
    if (normalized.includes(vibe)) {
      map.genres.forEach(g => genres.add(g));
      map.instruments.forEach(i => instruments.add(i));
    }
  }

  // Check for direct genre matches
  for (const genre of GENRES) {
    if (normalized.includes(genre.toLowerCase())) {
      genres.add(genre);
    }
  }

  // Check for direct instrument matches
  for (const instrument of INSTRUMENTS) {
    if (normalized.includes(instrument.toLowerCase())) {
      instruments.add(instrument);
    }
  }

  // Handle specific requests like "cello" or "beat making" (which might be in skills/instruments but not our simple list)
  const additionalInstruments = ['beat making', 'mixing', 'mastering', 'sound design', 'ableton live', 'film scoring'];
  for (const inst of additionalInstruments) {
    if (normalized.includes(inst)) {
      // Find the proper casing if possible, or just capitalize the words
      const properlyCased = inst.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      instruments.add(properlyCased);
    }
  }

  return {
    genres: Array.from(genres),
    instruments: Array.from(instruments),
  };
}
