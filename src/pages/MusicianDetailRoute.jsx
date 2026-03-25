import { useParams } from 'react-router-dom';
import { useMusicianById } from '../hooks/useMusicians';
import { MusicianDetailPage } from '../components/pages/MusicianDetailPage/MusicianDetailPage';
import { musiciansData } from '../mocks/musicians';

function LoadingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-ui, system-ui)',
      color: 'var(--color-neutral-500, #888)',
      fontSize: '1rem',
    }}>
      Loading musician profile…
    </div>
  );
}

function ErrorPage({ message }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: 'var(--font-ui, system-ui)',
    }}>
      <p style={{ color: 'var(--color-error, #e53)', fontSize: '1.1rem' }}>
        {message || 'Musician not found.'}
      </p>
      <a href="/musicians" style={{ color: 'var(--color-primary, #7928CA)', textDecoration: 'underline' }}>
        Browse all musicians
      </a>
    </div>
  );
}

export default function MusicianDetailRoute({ isDark = false, onThemeToggle } = {}) {
  const { id } = useParams();
  const { musician, loading, error } = useMusicianById(id);

  if (loading) return <LoadingPage />;
  if (error || !musician) return <ErrorPage message={error} />;

  // Pass a few other musicians as "related" suggestions (exclude self)
  const relatedMusicians = musiciansData.filter((m) => String(m.id) !== String(id)).slice(0, 4);

  return (
    <MusicianDetailPage
      musician={musician}
      relatedMusicians={relatedMusicians}
      isDark={isDark}
      onThemeToggle={onThemeToggle}
    />
  );
}
