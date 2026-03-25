import { useState } from 'react';
import { NavBar } from './NavBar';

export default {
  title: 'Navigation/NavBar',
  component: NavBar,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: { isDark: false },
};

export const DarkMode = {
  args: { isDark: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const Interactive = {
  render: () => {
    const [dark, setDark] = useState(false);
    return (
      <div data-theme={dark ? 'dark' : undefined} style={{ minHeight: '200px', background: dark ? '#000' : '#f4f4f5' }}>
        <NavBar isDark={dark} onThemeToggle={() => setDark((d) => !d)} />
      </div>
    );
  },
};
