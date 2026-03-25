import figma from '@figma/code-connect';
import { ProfileCard } from './ProfileCard';

// TODO: Replace FIGMA_URL with the URL of your ProfileCard component in Figma.
figma.connect(ProfileCard, 'FIGMA_URL', {
  props: {
    name: figma.string('Name'),
    tagline: figma.string('Tagline'),
    location: figma.string('Location'),
    online: figma.boolean('Online'),
    tier: figma.enum('Tier', {
      none: 'none',
      verified: 'verified',
      pro: 'pro',
    }),
    rating: figma.number('Rating'),
    reviewCount: figma.number('Review Count'),
    startingPrice: figma.number('Starting Price'),
  },
  example: ({ name, tagline, location, online, tier, rating, reviewCount, startingPrice }) => (
    <ProfileCard
      musician={{
        name,
        tagline,
        location,
        online,
        tier,
        rating,
        reviewCount,
        startingPrice,
      }}
    />
  ),
});
