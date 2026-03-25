import figma from '@figma/code-connect';
import { Tag } from './Tag';

// TODO: Replace FIGMA_URL with the URL of your Tag component in Figma.
figma.connect(Tag, 'FIGMA_URL', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      default: 'default',
      genre: 'genre',
      skill: 'skill',
    }),
    removable: figma.boolean('Removable'),
  },
  example: ({ label, variant, removable }) => (
    <Tag label={label} variant={variant} removable={removable} />
  ),
});
