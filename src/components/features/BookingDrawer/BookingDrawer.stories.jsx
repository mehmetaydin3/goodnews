import { useState, useEffect } from 'react';
import { BookingDrawer } from './BookingDrawer';
import { Button } from '../../ui/Button/Button';
import { musiciansData } from '../../../mocks/musicians';

export default {
  title: 'Booking/BookingDrawer',
  component: BookingDrawer,
  parameters: { layout: 'fullscreen' },
};

const marcus = musiciansData[0];
const quartet = musiciansData.find((m) => m.id === 'm7');

// ── Interactive — click "Open Booking Drawer" to start the flow ─────────────
export const Interactive = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
          Open Booking Drawer
        </Button>
        <BookingDrawer
          isOpen={open}
          musician={marcus}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── WithWeddingQuartet — package names: Ceremony / Reception / Full Day ──────
export const WithWeddingQuartet = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
          Book The Ember Quartet
        </Button>
        <BookingDrawer
          isOpen={open}
          musician={quartet}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── DefaultOpen — drawer open immediately, second package pre-selected ───────
export const DefaultOpen = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <BookingDrawer
          isOpen={open}
          musician={marcus}
          initialSelectedPkg={1}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── SubmissionLoading — fetch never resolves; click Review → Confirm to see spinner ──
export const SubmissionLoading = {
  render: () => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = () => new Promise(() => {}); // never resolves
      return () => { window.fetch = orig; };
    }, []);
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <p style={{ padding: '16px 24px', fontFamily: 'var(--font-base, system-ui)', fontSize: 13, color: 'var(--color-text-secondary, #888)', borderBottom: '1px solid var(--color-border, #eee)' }}>
          Fetch mocked to never resolve. Click "Review Order →" then "Confirm &amp; Send →" to see the loading state.
        </p>
        <BookingDrawer
          isOpen={open}
          musician={marcus}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── SuccessConfirmation — fetch succeeds; click through to see booking reference ──
export const SuccessConfirmation = {
  render: () => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
      const orig = window.fetch;
      window.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ booking: { id: 'bk-story-demo-001' } }),
      });
      return () => { window.fetch = orig; };
    }, []);
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <p style={{ padding: '16px 24px', fontFamily: 'var(--font-base, system-ui)', fontSize: 13, color: 'var(--color-text-secondary, #888)', borderBottom: '1px solid var(--color-border, #eee)' }}>
          Fetch mocked to succeed. Click "Review Order →" then "Confirm &amp; Send →" to see the success state.
        </p>
        <BookingDrawer
          isOpen={open}
          musician={marcus}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── UnauthenticatedError — fetch returns 401; shows auth error message ───────
export const UnauthenticatedError = {
  render: () => {
    const [open, setOpen] = useState(true);
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
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-default)' }}>
        <p style={{ padding: '16px 24px', fontFamily: 'var(--font-base, system-ui)', fontSize: 13, color: 'var(--color-text-secondary, #888)', borderBottom: '1px solid var(--color-border, #eee)' }}>
          Fetch returns 401. Click "Review Order →" then "Confirm &amp; Send →" to see the unauthenticated error.
        </p>
        <BookingDrawer
          isOpen={open}
          musician={marcus}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};
