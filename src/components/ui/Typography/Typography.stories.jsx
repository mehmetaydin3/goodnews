import { Typography } from './Typography';

export default {
  title: 'Design System/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'heading1', 'heading2', 'heading3', 'body', 'bodySmall', 'label', 'caption'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label'],
    },
    children: { control: 'text' },
  },
};

export const Display = {
  args: {
    variant: 'display',
    children: 'Find Your Sound',
  },
};

export const Heading1 = {
  args: {
    variant: 'heading1',
    children: 'Top Musicians Near You',
  },
};

export const Heading2 = {
  args: {
    variant: 'heading2',
    children: 'Featured Producers',
  },
};

export const Heading3 = {
  args: {
    variant: 'heading3',
    children: 'Hip-Hop & R&B',
  },
};

export const Body = {
  args: {
    variant: 'body',
    children:
      'Connect with world-class musicians, producers, and audio engineers. Book sessions, preview tracks, and bring your music to life.',
  },
};

export const BodySmall = {
  args: {
    variant: 'bodySmall',
    children: 'Sessions starting from $40/hr. Cancel anytime.',
  },
};

export const Label = {
  args: {
    variant: 'label',
    children: 'Genre',
  },
};

export const Caption = {
  args: {
    variant: 'caption',
    children: 'Last active 2 hours ago',
  },
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <Typography variant="display">Find Your Sound</Typography>
      <Typography variant="heading1">Top Musicians Near You</Typography>
      <Typography variant="heading2">Featured Producers</Typography>
      <Typography variant="heading3">Hip-Hop & R&B</Typography>
      <Typography variant="body">
        Connect with world-class musicians, producers, and audio engineers. Book sessions, preview
        tracks, and bring your music to life.
      </Typography>
      <Typography variant="bodySmall">Sessions starting from $40/hr. Cancel anytime.</Typography>
      <Typography variant="label">Genre</Typography>
      <Typography variant="caption">Last active 2 hours ago</Typography>
    </div>
  ),
};
