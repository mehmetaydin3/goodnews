import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavBar } from '../components/features/NavBar/NavBar';
import { Footer } from '../components/features/Footer/Footer';
import styles from './ClientBookingsPage.module.css';

const API_BASE = 'http://localhost:5001';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };

const STATUS_LABELS = {
  pending:     'Awaiting response',
  accepted:    'Accepted',
  declined:    'Declined',
  in_progress: 'In progress',
  delivered:   'Delivered',
  completed:   'Completed',
  cancelled:   'Cancelled',
};

const STATUS_CLASSES = {
  pending:     styles.statusPending,
  accepted:    styles.statusAccepted,
  declined:    styles.statusDeclined,
  in_progress: styles.statusInProgress,
  delivered:   styles.statusDelivered,
  completed:   styles.statusCompleted,
  cancelled:   styles.statusCancelled,
};

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function BookingCard({ booking }) {
  const sym = CURRENCY_SYMBOLS[booking.currency] || '$';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardMain}>
          <span className={styles.packageName}>{booking.packageName || 'Booking request'}</span>
          {booking.packagePrice != null && (
            <span className={styles.price}>{sym}{booking.packagePrice}</span>
          )}
        </div>
        <span className={[styles.status, STATUS_CLASSES[booking.status] || styles.statusPending].join(' ')}>
          {STATUS_LABELS[booking.status] || booking.status}
        </span>
      </div>

      {booking.scheduledDate && (
        <div className={styles.meta}>
          <span className={styles.metaIcon}>📅</span>
          {booking.scheduledDate}
        </div>
      )}

      {booking.brief && (
        <p className={styles.brief}>{booking.brief}</p>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.date}>Submitted {formatDate(booking.createdAt)}</span>
        {booking.totalPrice != null && (
          <span className={styles.total}>Total {sym}{booking.totalPrice}</span>
        )}
      </div>
    </div>
  );
}

export default function ClientBookingsPage({ isDark = false, onThemeToggle } = {}) {
  const { token, isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    fetch(`${API_BASE}/api/bookings`, { headers })
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [token, isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  return (
    <div className={styles.page}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>My Bookings</h1>
            <p className={styles.subtitle}>Track the status of your booking requests.</p>
          </div>
          <a href="/musicians" className={styles.browseBtn}>Browse musicians →</a>
        </div>

        {loading && (
          <div className={styles.loading}>Loading your bookings…</div>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">📬</span>
            <p className={styles.emptyTitle}>No bookings yet</p>
            <p className={styles.emptyDesc}>
              When you send a booking request to a musician, it will appear here.
            </p>
            <a href="/musicians" className={styles.emptyCta}>Find a musician</a>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className={styles.list}>
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
