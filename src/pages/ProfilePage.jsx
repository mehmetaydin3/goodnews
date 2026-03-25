import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavBar } from '../components/features/NavBar/NavBar';
import { Footer } from '../components/features/Footer/Footer';
import { ProfileEditForm } from '../components/ProfileEditForm/ProfileEditForm';

export default function ProfilePage({ isDark = false, onThemeToggle } = {}) {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-subtle, #f7f7f8)' }}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />
      <div style={{ flex: 1, maxWidth: 800, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl, 24px)', fontWeight: 700 }}>Edit profile</h1>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-text-secondary, #888)' }}>
              Update your public musician profile and services
            </p>
          </div>
          <a
            href="/dashboard"
            style={{
              padding: '8px 16px',
              border: '1px solid var(--color-border-default, #d4d4d4)',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              color: 'var(--color-text-primary, #111)',
            }}
          >
            ← Dashboard
          </a>
        </div>
        <ProfileEditForm
          token={token}
          onSaved={() => navigate('/dashboard')}
        />
      </div>
      <Footer />
    </div>
  );
}
