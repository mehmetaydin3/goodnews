import { useEffect } from 'react';
import { MusicianListingPage } from './MusicianListingPage';
import { musiciansData } from '../../../mocks/musicians';

export default {
  title: 'Pages/MusicianListingPage',
  component: MusicianListingPage,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onBook: { action: 'booked' },
    onContact: { action: 'contacted' },
  },
};

// ── Default — full mock dataset, API will fail gracefully and show mocks ─────
export const Default = {
  args: {
    musicians: musiciansData,
  },
};

// ── Empty — no musicians match (API down + empty prop) ────────────────────────
export const Empty = {
  args: {
    musicians: [],
  },
};

// ── LoadingState — fetch never resolves so the skeleton grid stays visible ────
export const LoadingState = {
  render: () => {
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = () => new Promise(() => {}); // never resolves
      return () => { window.fetch = orig; };
    }, []);
    return (
      <MusicianListingPage
        musicians={[]}
        isDark={false}
        onThemeToggle={() => {}}
      />
    );
  },
};

// ── JazzFiltered — Jazz subset passed as prop; no fetch mock, API falls back to prop ─
export const JazzFiltered = {
  args: {
    musicians: musiciansData.filter((m) => m.genres?.includes('Jazz')),
  },
};

// ── FilteredState — only Jazz musicians; API rejects immediately so mocks show ─
export const FilteredState = {
  render: () => {
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = () => Promise.reject(new Error('Mock: API unavailable'));
      return () => { window.fetch = orig; };
    }, []);
    return (
      <MusicianListingPage
        musicians={musiciansData.filter((m) => m.genres?.includes('Jazz'))}
        isDark={false}
        onThemeToggle={() => {}}
      />
    );
  },
};
