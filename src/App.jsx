// ROUTING DECISION — LandingPage vs HomePage:
// LandingPage (src/components/pages/LandingPage/) uses a different set of components
// (HeroSection, ContextBlock, FeatureSpotlight, MetricsGrid) and is a Storybook-only
// portfolio/showcase page. It is NOT routed here intentionally — it exists purely for
// design review in Storybook. HomePage is the live marketplace home page served at "/".
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { musiciansData } from './mocks/musicians';
import { HomePage } from './components/pages/HomePage/HomePage';
import { MusicianListingPage } from './components/pages/MusicianListingPage/MusicianListingPage';
import MusicianDetailRoute from './pages/MusicianDetailRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ClientBookingsPage from './pages/ClientBookingsPage';

const API_BASE = 'http://localhost:5001';

function App() {
  const [homeMusicians, setHomeMusicians] = useState(musiciansData);

  // Dark mode — persisted to localStorage, applied as data-theme on <html>
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  }, [isDark]);

  const handleThemeToggle = () => setIsDark((d) => !d);

  useEffect(() => {
    fetch(`${API_BASE}/api/musicians?limit=12&sortBy=featured`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.musicians?.length) setHomeMusicians(data.musicians);
      })
      .catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"              element={<HomePage musicians={homeMusicians} isDark={isDark} onThemeToggle={handleThemeToggle} />} />
        <Route path="/musicians"     element={<MusicianListingPage isDark={isDark} onThemeToggle={handleThemeToggle} />} />
        <Route path="/musicians/:id" element={<MusicianDetailRoute isDark={isDark} onThemeToggle={handleThemeToggle} />} />
        <Route path="/auth"          element={<AuthPage />} />

        {/* Auth-guarded pages */}
        <Route path="/dashboard"     element={<DashboardPage isDark={isDark} onThemeToggle={handleThemeToggle} />} />
        <Route path="/profile"       element={<ProfilePage isDark={isDark} onThemeToggle={handleThemeToggle} />} />
        <Route path="/my-bookings"   element={<ClientBookingsPage isDark={isDark} onThemeToggle={handleThemeToggle} />} />

        {/* Fallback */}
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
