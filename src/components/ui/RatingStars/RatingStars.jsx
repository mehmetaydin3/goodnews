import styles from './RatingStars.module.css';

function StarIcon({ fill = 'empty', size = 14 }) {
  const id = `star-grad-${fill}-${size}`;

  if (fill === 'full') {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M7 1l1.545 3.13L12 4.635l-2.5 2.437.59 3.441L7 8.875l-3.09 1.638L4.5 7.072 2 4.635l3.455-.505L7 1z"
          fill="#F59E0B"
        />
      </svg>
    );
  }

  if (fill === 'half') {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>
        <path
          d="M7 1l1.545 3.13L12 4.635l-2.5 2.437.59 3.441L7 8.875l-3.09 1.638L4.5 7.072 2 4.635l3.455-.505L7 1z"
          fill={`url(#${id})`}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M7 1l1.545 3.13L12 4.635l-2.5 2.437.59 3.441L7 8.875l-3.09 1.638L4.5 7.072 2 4.635l3.455-.505L7 1z"
        fill="#A1A1AA"
      />
    </svg>
  );
}

function buildStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('full');
    } else if (rating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
}

export function RatingStars({
  rating = 0,
  reviewCount,
  size = 'md',
  showCount = true,
  className = '',
  ...props
}) {
  const clampedRating = Math.min(5, Math.max(0, rating));
  const stars = buildStars(clampedRating);
  const starSize = size === 'sm' ? 12 : 14;

  const displayRating = clampedRating.toFixed(1);

  return (
    <div
      className={[styles.container, styles[size], className].filter(Boolean).join(' ')}
      aria-label={`Rated ${displayRating} out of 5${reviewCount ? `, ${reviewCount} reviews` : ''}`}
      role="img"
      {...props}
    >
      <span className={styles.ratingNumber}>{displayRating}</span>
      <span className={styles.stars}>
        {stars.map((fill, i) => (
          <StarIcon key={i} fill={fill} size={starSize} />
        ))}
      </span>
      {showCount && reviewCount != null && (
        <span className={styles.reviewCount}>
          ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

export default RatingStars;
