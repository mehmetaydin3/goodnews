import { TrackItem } from './TrackItem';

export default {
  title: 'Components/TrackItem',
  component: TrackItem,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  args: {
    rank: 1,
    title: 'Neon Nights',
    artist: 'Cyber Synth',
    duration: '3:45',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
    isPlaying: false,
  },
};

export const Playing = {
  args: {
    ...Default.args,
    rank: 2,
    title: 'Digital Dreams',
    isPlaying: true,
  },
};

export const NoCover = {
  args: {
    ...Default.args,
    rank: 3,
    title: 'Lost in the Grid',
    coverUrl: null,
  },
};
