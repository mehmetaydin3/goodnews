import { CategoryExplorer } from './CategoryExplorer';

export default {
  title: 'Features/CategoryExplorer',
  component: CategoryExplorer,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {
    onSelect: (category) => console.log('Selected category:', category),
  },
};
