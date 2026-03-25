import { musiciansData } from '../../../mocks/musicians';
import { HomePage } from './HomePage';

export default {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {
    musicians: musiciansData,
    isDark: false,
  },
};

export const DarkMode = {
  args: {
    musicians: musiciansData,
    isDark: true,
  },
  globals: { theme: 'dark' },
};
