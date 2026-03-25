import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const API_BASE = 'http://localhost:5001';

const MusicNoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PANEL_AVATARS = [12, 47, 34, 11, 5, 60, 26, 44, 38, 8, 52, 1];

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const regRes = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.message || 'Registration failed');

      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error('Registered but login failed — please sign in manually');
      onSuccess(loginData.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-password">
          Password <span className={styles.labelHint}>(min 8 characters)</span>
        </label>
        <input
          id="reg-password"
          className={styles.input}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>
      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className={styles.hint}>
        You'll set up your musician profile after signing in.
      </p>
    </form>
  );
}

export default function AuthPage() {
  const { login, isLoggedIn } = useAuth();
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  function handleSuccess(token) {
    login(token);
    navigate('/dashboard');
  }

  return (
    <div className={styles.page}>
      {/* Left — brand panel */}
      <div className={styles.brandPanel} aria-hidden="true">
        <div className={styles.brandOrb1} />
        <div className={styles.brandOrb2} />

        <div className={styles.brandContent}>
          <a href="/" className={styles.brandLogo}>
            <span className={styles.brandLogoIcon}><MusicNoteIcon /></span>
            <span className={styles.brandLogoText}>prova</span>
          </a>

          <div className={styles.brandHeadline}>
            <h2 className={styles.brandTitle}>
              Where musicians<br />find their next job.
            </h2>
            <p className={styles.brandDesc}>
              Join 12,400+ professional musicians earning on their own terms.
              Create a profile, list your services, and start receiving bookings.
            </p>
          </div>

          <div className={styles.brandStats}>
            {[
              { value: '12,400+', label: 'Musicians' },
              { value: '$2.4M+', label: 'Paid out' },
              { value: '98%', label: 'Satisfaction' },
            ].map((s) => (
              <div key={s.label} className={styles.brandStat}>
                <span className={styles.brandStatValue}>{s.value}</span>
                <span className={styles.brandStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.brandAvatars}>
            {PANEL_AVATARS.slice(0, 8).map((img, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/56?img=${img}`}
                alt=""
                className={styles.brandAvatar}
                style={{ zIndex: 8 - i }}
              />
            ))}
            <span className={styles.brandAvatarLabel}>and thousands more</span>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          {/* Mobile logo */}
          <a href="/" className={styles.mobileLogo} aria-label="Prova Home">
            <span className={styles.mobileLogoIcon}><MusicNoteIcon /></span>
            <span className={styles.mobileLogoText}>prova</span>
          </a>

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className={styles.formSubtitle}>
              {tab === 'login'
                ? 'Sign in to manage your musician profile'
                : 'Get listed and start receiving bookings'}
            </p>
          </div>

          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'login'}
              className={[styles.tab, tab === 'login' ? styles.tabActive : ''].join(' ')}
              onClick={() => setTab('login')}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={tab === 'register'}
              className={[styles.tab, tab === 'register' ? styles.tabActive : ''].join(' ')}
              onClick={() => setTab('register')}
            >
              Create account
            </button>
          </div>

          {tab === 'login'
            ? <LoginForm onSuccess={handleSuccess} />
            : <RegisterForm onSuccess={handleSuccess} />
          }

          <p className={styles.footerNote}>
            By continuing, you agree to Prova's{' '}
            <a href="#" className={styles.footerLink}>Terms of Service</a>{' '}
            and{' '}
            <a href="#" className={styles.footerLink}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
