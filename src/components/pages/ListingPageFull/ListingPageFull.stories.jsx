import { musiciansData } from '../../../mocks/musicians';
import { ListingPageFull } from './ListingPageFull';

export default {
  title: 'Pages/ListingPageFull',
  component: ListingPageFull,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {
    musicians: musiciansData,
    isDark: false,
  },
};

export const WithTeachingFilter = {
  args: {
    musicians: musiciansData,
    isDark: false,
  },
};
