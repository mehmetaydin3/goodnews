import figma from '@figma/code-connect';
import { Badge } from './Badge';

// TODO: Replace FIGMA_URL with the URL of your Badge component in Figma.
figma.connect(Badge, 'FIGMA_URL', {
  props: {
    variant: figma.enum('Variant', {
      verified: 'verified',
      topRated: 'topRated',
      pro: 'pro',
      new: 'new',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
  },
  example: ({ variant, size }) => (
    <Badge variant={variant} size={size} />
  ),
});
