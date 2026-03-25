import { Button } from './Button';

export default {
  title: 'Design System/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Book Session',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'View Profile',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Contact',
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    size: 'md',
    children: 'Cancel Booking',
  },
};

export const Small = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Follow',
  },
};

export const Large = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Get Started Free',
  },
};

export const WithLeftIcon = {
  args: {
    variant: 'primary',
    size: 'md',
    leftIcon: '🎵',
    children: 'Preview Track',
  },
};

export const WithRightIcon = {
  args: {
    variant: 'secondary',
    size: 'md',
    rightIcon: '→',
    children: 'See All Results',
  },
};

export const Loading = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Booking...',
  },
};

export const Disabled = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Unavailable',
  },
};

export const FullWidth = {
  args: {
    variant: 'primary',
    size: 'md',
    fullWidth: true,
    children: 'Book Now',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button variant="primary">Book Session</Button>
      <Button variant="secondary">View Profile</Button>
      <Button variant="ghost">Contact</Button>
      <Button variant="danger">Cancel</Button>
    </div>
  ),
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
