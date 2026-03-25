import { RatingStars } from './RatingStars';

export default {
  title: 'Design System/RatingStars',
  component: RatingStars,
  argTypes: {
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    reviewCount: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showCount: { control: 'boolean' },
  },
};

export const Default = {
  args: {
    rating: 4.8,
    reviewCount: 124,
    size: 'md',
    showCount: true,
  },
};

export const PerfectScore = {
  args: {
    rating: 5.0,
    reviewCount: 231,
    size: 'md',
    showCount: true,
  },
};

export const HalfStar = {
  args: {
    rating: 3.5,
    reviewCount: 48,
    size: 'md',
    showCount: true,
  },
};

export const LowRating = {
  args: {
    rating: 2.3,
    reviewCount: 11,
    size: 'md',
    showCount: true,
  },
};

export const NoReviews = {
  args: {
    rating: 5.0,
    size: 'md',
    showCount: false,
  },
};

export const Small = {
  args: {
    rating: 4.9,
    reviewCount: 89,
    size: 'sm',
    showCount: true,
  },
};

export const AllRatings = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[5.0, 4.8, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0].map((r) => (
        <RatingStars key={r} rating={r} reviewCount={Math.floor(r * 30)} size="md" showCount />
      ))}
    </div>
  ),
};
