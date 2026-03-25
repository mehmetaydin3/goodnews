import figma from '@figma/code-connect';
import { RatingStars } from './RatingStars';

// TODO: Replace FIGMA_URL with the URL of your RatingStars component in Figma.
figma.connect(RatingStars, 'FIGMA_URL', {
  props: {
    rating: figma.number('Rating'),
    reviewCount: figma.number('Review Count'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
    showCount: figma.boolean('Show Count'),
  },
  example: ({ rating, reviewCount, size, showCount }) => (
    <RatingStars
      rating={rating}
      reviewCount={reviewCount}
      size={size}
      showCount={showCount}
    />
  ),
});
