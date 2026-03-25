import { HeroBanner } from './HeroBanner';

export default {
  title: 'Features/HeroBanner',
  component: HeroBanner,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {},
};

export const DarkMode = {
  globals: { theme: 'dark' },
  args: {},
};

export const WithSearchValue = {
  args: {
    onSearch: (q) => console.log('Search:', q),
    onCategorySelect: (cat) => console.log('Category:', cat),
  },
};

export const WithCategorySelected = {
  name: 'With Category Pre-selected',
  args: {
    initialCategory: 'guitarists',
  },
};
