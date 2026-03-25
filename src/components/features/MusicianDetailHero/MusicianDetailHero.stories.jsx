import { musiciansData } from '../../../mocks/musicians';
import { MusicianDetailHero } from './MusicianDetailHero';

export default {
  title: 'Features/MusicianDetailHero',
  component: MusicianDetailHero,
  parameters: { layout: 'fullscreen' },
};

// m1 — Marcus Johnson, Grammy-nominated producer, high rating
export const Default = {
  args: {
    musician: musiciansData.find(m => m.id === 'm1'),
  },
};

// m3 — Aaliyah Rivera, badge: new, reviews: [], rating: 4.6, reviewCount: 18, completedGigs: 22
export const WithLowRating = {
  args: {
    musician: musiciansData.find(m => m.id === 'm3'),
  },
};

// m7 — The Ember Quartet, wedding/event specialist, ensemble: quartet
export const WeddingAct = {
  args: {
    musician: musiciansData.find(m => m.id === 'm7'),
  },
};

export const DarkMode = {
  globals: { theme: 'dark' },
  args: {
    musician: musiciansData.find(m => m.id === 'm1'),
  },
};
