import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    tier: {
      control: 'select',
      options: ['none', 'pro', 'verified'],
    },
    online: { control: 'boolean' },
    name: { control: 'text' },
    src: { control: 'text' },
  },
};

export const WithImage = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    name: 'Marcus Johnson',
    size: 'md',
    online: false,
    tier: 'none',
  },
};

export const WithInitials = {
  args: {
    name: 'Aaliyah Rivera',
    size: 'md',
    online: false,
    tier: 'none',
  },
};

export const Online = {
  args: {
    name: 'Jordan Lee',
    size: 'md',
    online: true,
    tier: 'none',
  },
};

export const TierVerified = {
  args: {
    name: 'Sofia Chen',
    size: 'lg',
    online: true,
    tier: 'verified',
  },
};

export const TierPro = {
  args: {
    name: 'Devon Miles',
    size: 'lg',
    online: false,
    tier: 'pro',
  },
};

export const ExtraLarge = {
  args: {
    name: 'Marcus Johnson',
    size: 'xl',
    online: true,
    tier: 'verified',
  },
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
      <Avatar name="Alex Kim" size="xs" />
      <Avatar name="Alex Kim" size="sm" />
      <Avatar name="Alex Kim" size="md" />
      <Avatar name="Alex Kim" size="lg" />
      <Avatar name="Alex Kim" size="xl" />
    </div>
  ),
};

export const AllTiers = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Basic User" size="lg" tier="none" online />
        <p style={{ fontSize: '12px', marginTop: '8px', color: '#737373' }}>None</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Pro User" size="lg" tier="pro" online />
        <p style={{ fontSize: '12px', marginTop: '8px', color: '#737373' }}>Pro</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Verified User" size="lg" tier="verified" online />
        <p style={{ fontSize: '12px', marginTop: '8px', color: '#737373' }}>Verified</p>
      </div>
    </div>
  ),
};
