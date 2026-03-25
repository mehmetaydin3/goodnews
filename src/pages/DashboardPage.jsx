import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavBar } from '../components/features/NavBar/NavBar';
import { Footer } from '../components/features/Footer/Footer';
import styles from './DashboardPage.module.css';

const API_BASE = 'http://localhost:5001';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };

function statusClass(status) {
  const map = {
    pending:     styles.statusPending,
    accepted:    styles.statusAccepted,
    declined:    styles.statusDeclined,
    in_progress: styles.statusInProgress,
    delivered:   styles.statusDelivered,
    completed:   styles.statusCompleted,
    cancelled:   styles.statusCancelled,
  };
  return map[status] || styles.statusPending;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

// ── Profile header ────────────────────────────────────────────────────────────

function ProfileHeader({ profile }) {
  const initials = (profile.name || '?').slice(0, 1).toUpperCase();
  const sym = CURRENCY_SYMBOLS[profile.currency] || '$';

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        {profile.avatarSrc
          ? <img src={profile.avatarSrc} alt={profile.name} className={styles.avatar} />
          : <div className={styles.avatarPlaceholder} aria-hidden="true">{initials}</div>
        }

        <div className={styles.headerInfo}>
          <h1 className={styles.headerName}>{profile.name}</h1>
          {profile.headline && <p className={styles.headerTagline}>{profile.headline}</p>}
          <div className={styles.headerMeta}>
            {profile.location && (
              <span className={styles.metaStat}>
                📍 <span className={styles.metaStatValue}>{profile.location}</span>
              </span>
            )}
            {profile.ratingAverage > 0 && (
              <span className={styles.metaStat}>
                ⭐ <span className={styles.metaStatValue}>{profile.ratingAverage.toFixed(1)}</span>
                {profile.ratingCount > 0 && ` (${profile.ratingCount})`}
              </span>
            )}
            {profile.completedJobs > 0 && (
              <span className={styles.metaStat}>
                ✅ <span className={styles.metaStatValue}>{profile.completedJobs}</span> jobs completed
              </span>
            )}
            {profile.startingPrice != null && (
              <span className={styles.metaStat}>
                From <span className={styles.metaStatValue}>{sym}{profile.startingPrice}</span>
              </span>
            )}
            {profile.remoteAvailable && (
              <span className={styles.metaStat}>🌍 Remote available</span>
            )}
          </div>
        </div>

        <div className={styles.headerActions}>
          {profile.id && (
            <a href={`/musicians/${profile.id}`} className={styles.viewProfileBtn}>View public profile ↗</a>
          )}
          <a href="/profile" className={styles.editProfileBtn}>Edit profile</a>
        </div>
      </div>
    </div>
  );
}

// ── Booking card ──────────────────────────────────────────────────────────────

function BookingCard({ booking, onStatusChange, updatingId }) {
  const sym = CURRENCY_SYMBOLS[booking.currency] || '$';
  const isPending = booking.status === 'pending';
  const isUpdating = updatingId === booking.id;

  return (
    <div className={styles.bookingCard}>
      <div className={styles.bookingMain}>
        <div className={styles.bookingTopRow}>
          <span className={styles.bookingPackage}>{booking.packageName || 'Booking request'}</span>
          {booking.packagePrice != null && (
            <span className={styles.bookingPrice}>{sym}{booking.packagePrice}</span>
          )}
          <span className={[styles.statusBadge, statusClass(booking.status)].join(' ')}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        {booking.scheduledDate && (
          <div className={styles.bookingDate}>📅 {booking.scheduledDate}</div>
        )}

        {booking.brief && (
          <p className={styles.bookingBrief}>{booking.brief}</p>
        )}

        <div className={styles.bookingMeta}>
          Received {formatDate(booking.createdAt)}
          {booking.totalPrice != null && ` · Total ${sym}${booking.totalPrice}`}
        </div>
      </div>

      {isPending && (
        <div className={styles.bookingActions}>
          <button
            className={styles.acceptBtn}
            onClick={() => onStatusChange(booking.id, 'accepted')}
            disabled={isUpdating}
            aria-label="Accept booking"
          >
            {isUpdating ? '…' : 'Accept'}
          </button>
          <button
            className={styles.declineBtn}
            onClick={() => onStatusChange(booking.id, 'declined')}
            disabled={isUpdating}
            aria-label="Decline booking"
          >
            {isUpdating ? '…' : 'Decline'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Bookings tab ──────────────────────────────────────────────────────────────

function BookingsTab({ bookings, onStatusChange, updatingId }) {
  if (bookings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon} aria-hidden="true">📬</span>
        <p className={styles.emptyTitle}>No bookings yet</p>
        <p className={styles.emptyDesc}>
          Booking requests from clients will appear here once your profile is live.
        </p>
        <a href="/musicians" className={styles.emptyAction}>View your public listing →</a>
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === 'pending');
  const others  = bookings.filter((b) => b.status !== 'pending');

  return (
    <div>
      {pending.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8, 32px)' }}>
          <h2 className={styles.sectionHeading}>Awaiting response ({pending.length})</h2>
          <div className={styles.bookingList}>
            {pending.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatusChange={onStatusChange}
                updatingId={updatingId}
              />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className={styles.sectionHeading}>Past bookings</h2>
          <div className={styles.bookingList}>
            {others.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatusChange={onStatusChange}
                updatingId={updatingId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Services tab ──────────────────────────────────────────────────────────────

function ServicesTab({ services }) {
  if (services.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon} aria-hidden="true">🎵</span>
        <p className={styles.emptyTitle}>No services listed</p>
        <p className={styles.emptyDesc}>
          Add services so clients can browse and book what you offer.
        </p>
        <a href="/profile" className={styles.emptyAction}>Add your first service →</a>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4, 16px)' }}>
        <h2 className={styles.sectionHeading} style={{ margin: 0 }}>Your services</h2>
        <a href="/profile" className={styles.editProfileBtn}>Manage services</a>
      </div>
      <div className={styles.serviceGrid}>
        {services.map((svc) => (
          <div key={svc.id} className={styles.serviceCard}>
            <p className={styles.serviceTitle}>{svc.title}</p>
            <p className={styles.servicePrice}>
              ${svc.startingPrice}
              <span style={{ fontSize: 'var(--font-size-xs, 12px)', fontWeight: 400, color: 'var(--color-text-secondary, #888)', marginLeft: 4 }}>
                / {svc.priceType}
              </span>
            </p>
            <div className={styles.serviceMeta}>
              {svc.deliveryMode && <span>📦 {svc.deliveryMode}</span>}
              {svc.turnaroundTime && <span>⏱ {svc.turnaroundTime}</span>}
              {svc.revisionsIncluded > 0 && <span>↩ {svc.revisionsIncluded} revision{svc.revisionsIncluded !== 1 ? 's' : ''}</span>}
            </div>
            {svc.description && (
              <p className={styles.serviceDesc}>{svc.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard page ────────────────────────────────────────────────────────────

export default function DashboardPage({ isDark = false, onThemeToggle } = {}) {
  const { token, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/api/profile`, { headers }),
        fetch(`${API_BASE}/api/bookings/incoming`, { headers }),
      ]);

      if (profileRes.status === 404) {
        // No profile yet — let user create one
        setProfile(null);
      } else if (!profileRes.ok) {
        throw new Error('Failed to load profile');
      } else {
        setProfile(await profileRes.json());
      }

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(bData.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Auth check after all hooks
  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  async function handleStatusChange(bookingId, newStatus) {
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? (updated.id ? updated : { ...b, status: newStatus }) : b))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />
        <div className={styles.loading}>Loading your dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />
        <div className={styles.errorBanner} role="alert">{error}</div>
      </div>
    );
  }

  // No musician profile yet
  if (!profile) {
    return (
      <div className={styles.page}>
        <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />
        <div className={styles.noProfile}>
          <p className={styles.noProfileTitle}>Set up your musician profile</p>
          <p className={styles.noProfileDesc}>
            Create your profile to get listed on Prova and start receiving booking requests.
          </p>
          <a href="/profile" className={styles.createProfileBtn}>Create your profile →</a>
        </div>
        <Footer />
      </div>
    );
  }

  const services = profile.services || [];
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className={styles.page}>
      <NavBar />
      <ProfileHeader profile={profile} />

      <div className={styles.tabs} role="tablist">
        <div className={styles.tabsInner}>
          <button
            role="tab"
            aria-selected={activeTab === 'bookings'}
            className={[styles.tab, activeTab === 'bookings' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
            {pendingCount > 0 && <span className={styles.tabBadge}>{pendingCount}</span>}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'services'}
            className={[styles.tab, activeTab === 'services' ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab('services')}
          >
            Services
            {services.length > 0 && <span className={styles.tabBadge}>{services.length}</span>}
          </button>
        </div>
      </div>

      <div className={styles.content} role="tabpanel">
        {activeTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        )}
        {activeTab === 'services' && (
          <ServicesTab services={services} />
        )}
      </div>

      <Footer />
    </div>
  );
}
