import figma from '@figma/code-connect';
import { Typography } from './Typography';

// TODO: Replace FIGMA_URL with the URL of your Typography component in Figma.
figma.connect(Typography, 'FIGMA_URL', {
  props: {
    variant: figma.enum('Variant', {
      display: 'display',
      heading1: 'heading1',
      heading2: 'heading2',
      heading3: 'heading3',
      body: 'body',
      bodySmall: 'bodySmall',
      label: 'label',
      caption: 'caption',
    }),
    children: figma.string('Text'),
  },
  example: ({ variant, children }) => (
    <Typography variant={variant}>{children}</Typography>
  ),
});
