import { Hero } from './Hero';
import { Button } from '../../ui/Button/Button';

export default {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    title: 'Discover Next-Gen Sounds',
    subtitle: 'Join the premier marketplace for electronic music creators. Buy, sell, and collaborate on premium tracks and samples.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1920',
    primaryAction: <Button variant="primary" size="lg">Start Exploring</Button>,
    secondaryAction: <Button variant="secondary" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.4)' }}>Sign Up Free</Button>,
  },
};

export const Minimal = {
  args: {
    title: 'Artist Spotlight: Sarah Synths',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f923?auto=format&fit=crop&q=80&w=1920',
    primaryAction: <Button variant="primary" size="md">Follow Artist</Button>,
  },
};
