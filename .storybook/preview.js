import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../src/tokens/tokens.css';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
      showName: true,
      dynamicTitle: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.backgroundColor = 'var(--color-surface-default)';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.backgroundColor = 'var(--color-surface-default)';
    }
    return Story();
  },
  // Provide React Router context so components using useNavigate/Link work in Storybook
  (Story) => React.createElement(MemoryRouter, null, React.createElement(Story)),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    disabled: true,
  },
};
