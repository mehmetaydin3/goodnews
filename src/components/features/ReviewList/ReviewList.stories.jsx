import { musiciansData } from '../../../mocks/musicians';
import { ReviewList } from './ReviewList';

export default {
  title: 'Features/ReviewList',
  component: ReviewList,
  parameters: { layout: 'padded' },
};

const m1 = musiciansData.find(m => m.id === 'm1');
const m2 = musiciansData.find(m => m.id === 'm2');

// m1 — Marcus Johnson, 2 reviews, rating 4.9
export const WithReviews = {
  args: {
    reviews: m1.reviews,
    rating: 4.9,
    reviewCount: 2,
  },
};

export const NoReviews = {
  args: {
    reviews: [],
    rating: 0,
    reviewCount: 0,
  },
};

// m2 — Sofia Chen, perfect 5.0 rating, 1 review
export const HighRating = {
  args: {
    reviews: m2.reviews,
    rating: 5,
    reviewCount: 1,
  },
};
