import type { Meta, StoryObj } from '@storybook/react';
import GoodNewsApp from './GoodNewsApp';

const meta: Meta<typeof GoodNewsApp> = {
  title: 'Good News/App',
  component: GoodNewsApp,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Good News Daily

A full good-news website with:
- **Automatic daily RSS scraping** from NASA, NIH, Nature, ScienceDaily, WHO, Good News Network, Positive News, The Guardian Environment, and TechCrunch
- **Keyword filtering** — only uplifting, positive stories pass through
- **Category filters** — Science, Health, Space, Environment, Technology, Awards, Good Vibes
- **Search** across titles, summaries, and sources
- **Social sharing** — X/Twitter, Facebook, LinkedIn, WhatsApp, Reddit, copy link
- **Share tracking** stored in SQLite
- **Daily cron** at 06:00 UTC + boot-time seed
- **Load more** pagination

## Running

Start the backend:
\`\`\`
cd server && npm run dev
\`\`\`

The server auto-fetches news on first boot. Trigger a manual refresh:
\`\`\`
POST http://localhost:5001/api/goodnews/refresh
\`\`\`

Storybook shows the live app (requires server running on port 5001).
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GoodNewsApp>;

export const Default: Story = {};
