import figma from '@figma/code-connect';
import { Avatar } from './Avatar';

// TODO: Replace FIGMA_URL with the URL of your Avatar component in Figma.
figma.connect(Avatar, 'FIGMA_URL', {
  props: {
    src: figma.string('Image Src'),
    name: figma.string('Name'),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    online: figma.boolean('Online'),
    tier: figma.enum('Tier', {
      none: 'none',
      verified: 'verified',
      pro: 'pro',
    }),
  },
  example: ({ src, name, size, online, tier }) => (
    <Avatar src={src} name={name} size={size} online={online} tier={tier} />
  ),
});
