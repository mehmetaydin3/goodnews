import { Footer } from './Footer';

export default {
  title: 'Features/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {},
};

export const DarkMode = {
  render: () => (
    <div data-theme="dark" style={{ background: 'var(--color-surface-default)' }}>
      <Footer />
    </div>
  ),
};
