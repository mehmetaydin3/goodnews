import { Badge } from './Badge';

export default {
  title: 'Design System/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['verified', 'topRated', 'pro', 'new'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export const Verified = {
  args: { variant: 'verified', size: 'md' },
};

export const TopRated = {
  args: { variant: 'topRated', size: 'md' },
};

export const Pro = {
  args: { variant: 'pro', size: 'md' },
};

export const New = {
  args: { variant: 'new', size: 'md' },
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Badge variant="verified" />
      <Badge variant="topRated" />
      <Badge variant="pro" />
      <Badge variant="new" />
    </div>
  ),
};

export const SmallSize = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Badge variant="verified" size="sm" />
      <Badge variant="topRated" size="sm" />
      <Badge variant="pro" size="sm" />
      <Badge variant="new" size="sm" />
    </div>
  ),
};

export const InContext = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '13px', color: '#737373', marginBottom: '6px', fontFamily: 'sans-serif' }}>
          Marcus Johnson — Hip-Hop Producer
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Badge variant="verified" size="sm" />
          <Badge variant="topRated" size="sm" />
          <Badge variant="pro" size="sm" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '13px', color: '#737373', marginBottom: '6px', fontFamily: 'sans-serif' }}>
          Aaliyah Rivera — Vocalist
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Badge variant="new" size="sm" />
        </div>
      </div>
    </div>
  ),
};
