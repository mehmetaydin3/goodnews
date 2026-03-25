import { musiciansData } from '../../../mocks/musicians';
import { ServicePackages } from './ServicePackages';

export default {
  title: 'Features/ServicePackages',
  component: ServicePackages,
  parameters: { layout: 'padded' },
};

const m1 = musiciansData.find(m => m.id === 'm1');
const m7 = musiciansData.find(m => m.id === 'm7');

// m1 — Marcus Johnson, 3 production packages (Basic/Standard/Premium)
export const Default = {
  args: {
    packages: m1.packages,
    currency: m1.currency,
  },
};

// m7 — The Ember Quartet, wedding/event packages (Ceremony/Reception/Full Day)
export const WeddingPackages = {
  args: {
    packages: m7.packages,
    currency: m7.currency,
  },
};

// Single package — just m1's Basic tier
export const SinglePackage = {
  args: {
    packages: [m1.packages[0]],
    currency: m1.currency,
  },
};

export const DarkMode = {
  globals: { theme: 'dark' },
  args: {
    packages: m1.packages,
    currency: m1.currency,
  },
};
