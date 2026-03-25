import { useState, useEffect } from 'react';
import { musiciansData } from '../../../mocks/musicians';
import { MusicianDetailPage } from './MusicianDetailPage';

export default {
  title: 'Pages/MusicianDetailPage',
  component: MusicianDetailPage,
  parameters: { layout: 'fullscreen' },
};

const elena = musiciansData.find((m) => m.id === 'm5');
const marcus = musiciansData.find((m) => m.id === 'm1');
const quartet = musiciansData.find((m) => m.id === 'm7');
const related = musiciansData.filter((m) => m.id !== 'm5').slice(0, 4);

// ── ElenaRostova — default profile view ──────────────────────────────────────
export const ElenaRostova = {
  args: {
    musician: elena,
    relatedMusicians: related,
    isDark: false,
  },
};

// ── MarcusJohnson — hip-hop producer with audio sample ───────────────────────
export const MarcusJohnson = {
  args: {
    musician: marcus,
    relatedMusicians: musiciansData.filter((m) => m.id !== 'm1').slice(0, 4),
    isDark: false,
  },
};

// ── EmberQuartet — wedding quartet; no audio sample, high price ───────────────
export const EmberQuartet = {
  args: {
    musician: quartet,
    relatedMusicians: musiciansData.filter((m) => m.services?.wedding).slice(0, 4),
    isDark: false,
  },
};

// ── ServiceSelected — page loads with booking drawer already open ─────────────
// Shows the "Standard" package (index 1) pre-selected in the drawer.
export const ServiceSelected = {
  args: {
    musician: marcus,
    relatedMusicians: musiciansData.filter((m) => m.id !== 'm1').slice(0, 4),
    isDark: false,
    defaultDrawerOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer opens on load with the first service pre-selected. Use initialSelectedPkg to vary the selected package.',
      },
    },
  },
};

// ── BookingSuccess — fetch mocked to succeed; click through steps to confirm ──
export const BookingSuccess = {
  render: () => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ booking: { id: 'bk-story-success-001' } }),
      });
      return () => { window.fetch = orig; };
    }, []);
    return (
      <MusicianDetailPage
        musician={marcus}
        relatedMusicians={musiciansData.filter((m) => m.id !== 'm1').slice(0, 4)}
        isDark={false}
        defaultDrawerOpen={open}
        onThemeToggle={() => {}}
      />
    );
  },
};

// ── Unauthenticated — fetch returns 401; shows auth error in drawer ───────────
export const Unauthenticated = {
  render: () => {
    const [open] = useState(true);
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = async () => ({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Please log in to make a booking.' }),
      });
      return () => { window.fetch = orig; };
    }, []);
    return (
      <MusicianDetailPage
        musician={elena}
        relatedMusicians={related}
        isDark={false}
        defaultDrawerOpen={open}
        onThemeToggle={() => {}}
      />
    );
  },
};
