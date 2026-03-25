import { AudioPreview } from './AudioPreview';

export default {
  title: 'Design System/AudioPreview',
  component: AudioPreview,
  argTypes: {
    title: { control: 'text' },
    duration: { control: 'text' },
    src: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '480px' }}>
        <Story />
      </div>
    ),
  ],
};

// Using a real freely-licensed audio file for demo purposes
const DEMO_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const Default = {
  args: {
    title: 'Late Night Vibes (Beat)',
    duration: '2:34',
    src: DEMO_AUDIO,
  },
};

export const WithCustomWaveform = {
  args: {
    title: 'Soulful Loop',
    duration: '1:48',
    src: DEMO_AUDIO,
    waveformData: [
      0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.6, 0.8,
      0.9, 0.7, 0.5, 0.3, 0.4, 0.6, 0.8, 0.7, 0.9, 0.6,
      0.5, 0.7, 0.9, 0.8, 0.6, 0.4, 0.3, 0.5, 0.7, 0.9,
      0.8, 0.6, 0.5, 0.7, 0.8, 0.9, 0.6, 0.4, 0.3, 0.5,
    ],
  },
};

export const ShortTrack = {
  args: {
    title: 'Hook Idea #3',
    duration: '0:45',
    src: DEMO_AUDIO,
  },
};

export const LongTitle = {
  args: {
    title: 'Metropolitan Nights — Extended Mix (Unreleased)',
    duration: '5:12',
    src: DEMO_AUDIO,
  },
};

export const NoSource = {
  args: {
    title: 'Unavailable Track',
    duration: '3:00',
    src: '',
  },
};

export const MultiplePreviewsInContext = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
      <AudioPreview title="Late Night Vibes (Beat)" duration="2:34" src={DEMO_AUDIO} />
      <AudioPreview title="Trap Soul Instrumental" duration="3:12" src={DEMO_AUDIO} />
      <AudioPreview title="808 Melody Loop" duration="1:55" src={DEMO_AUDIO} />
    </div>
  ),
};
