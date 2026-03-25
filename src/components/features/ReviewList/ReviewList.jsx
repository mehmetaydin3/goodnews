import { RatingStars } from '../../ui/RatingStars/RatingStars';
import { Typography } from '../../ui/Typography/Typography';
import styles from './ReviewList.module.css';

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}★</span>
      <div className={styles.barTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} star: ${pct}%`}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.barPct}>{pct}%</span>
    </div>
  );
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = (Date.now() - d) / 1000;
  if (diff < 86400 * 30) return `${Math.round(diff / 86400)} days ago`;
  if (diff < 86400 * 365) return `${Math.round(diff / (86400 * 30))} months ago`;
  return `${Math.round(diff / (86400 * 365))} years ago`;
}

export function ReviewList({
  reviews = [],
  rating = 0,
  reviewCount = 0,
  className = '',
  ...props
}) {
  // Compute distribution (fake for demo)
  const dist = { 5: Math.round(reviewCount * 0.72), 4: Math.round(reviewCount * 0.18), 3: Math.round(reviewCount * 0.06), 2: Math.round(reviewCount * 0.03), 1: Math.round(reviewCount * 0.01) };

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label={`Reviews (${reviewCount})`}
      {...props}
    >
      <Typography as="h2" variant="heading2" className={styles.title}>
        Client Reviews
      </Typography>

      <div className={styles.summary}>
        <div className={styles.scoreBlock}>
          <span className={styles.score}>{rating.toFixed(1)}</span>
          <RatingStars rating={rating} size="lg" showCount={false} />
          <Typography variant="caption" className={styles.scoreCount}>{reviewCount} reviews</Typography>
        </div>

        <div className={styles.distribution}>
          {[5, 4, 3, 2, 1].map((n) => (
            <RatingBar key={n} label={n} count={dist[n]} total={reviewCount} />
          ))}
        </div>
      </div>

      {reviews.length > 0 ? (
        <ul className={styles.list} role="list">
          {reviews.map((rev) => (
            <li key={rev.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <img src={rev.avatar} alt="" className={styles.reviewAvatar} loading="lazy" />
                <div className={styles.reviewMeta}>
                  <Typography as="p" variant="label" className={styles.reviewName}>{rev.author}</Typography>
                  <Typography as="p" variant="caption" className={styles.reviewDate}>{timeAgo(rev.date)}</Typography>
                </div>
                <RatingStars rating={rev.rating} size="sm" showCount={false} />
              </div>
              <Typography variant="body" className={styles.reviewText}>{rev.text}</Typography>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.noReviews}>
          <Typography variant="body" className={styles.noReviewsText}>
            {reviewCount > 0
              ? `This musician has ${reviewCount} verified review${reviewCount !== 1 ? 's' : ''} — detailed feedback visible after booking.`
              : 'No reviews yet. Reviews are collected from verified bookings made through Prova.'
            }
          </Typography>
          <Typography variant="caption" className={styles.noReviewsText} style={{ marginTop: 8, opacity: 0.7 }}>
            All reviews on Prova come from real clients who completed a booking.
          </Typography>
        </div>
      )}
    </section>
  );
}

export default ReviewList;
