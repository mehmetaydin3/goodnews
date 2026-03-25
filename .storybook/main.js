import react from '@vitejs/plugin-react';

export default {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.plugins = config.plugins.filter(
      (p) => !(Array.isArray(p) ? p[0]?.name : p?.name)?.includes('vite:react')
    );
    config.plugins.push(react({ jsxRuntime: 'automatic' }));
    return config;
  },
};
