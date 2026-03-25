import { Avatar } from '../../ui/Avatar/Avatar';
import { Badge } from '../../ui/Badge/Badge';
import { RatingStars } from '../../ui/RatingStars/RatingStars';
import { Typography } from '../../ui/Typography/Typography';
import { Button } from '../../ui/Button/Button';
import styles from './MusicianDetailHero.module.css';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.625 3.5 6.5 3.5 6.5S9.5 7.125 9.5 4.5C9.5 2.567 7.933 1 6 1Zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" fill="currentColor"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GigIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function MusicianDetailHero({
  musician = {},
  onBook,
  onContact,
  className = '',
  ...props
}) {
  const {
    name = 'Unknown Musician',
    tagline = '',
    bio = '',
    avatarSrc,
    coverSrc,
    location = '',
    online = false,
    tier = 'none',
    badges = [],
    genres = [],
    rating = 0,
    reviewCount = 0,
    startingPrice,
    currency = 'USD',
    responseTime,
    completedGigs,
    remoteAvailable,
    languages = [],
    ensembleType,
  } = musician;

  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  return (
    <div className={[styles.hero, className].filter(Boolean).join(' ')} {...props}>
      {/* Cover image */}
      <div className={styles.cover} aria-hidden="true">
        {coverSrc ? (
          <img src={coverSrc} alt="" className={styles.coverImg} loading="eager" />
        ) : null}
        <div className={styles.coverOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.avatarWrap}>
          <Avatar src={avatarSrc} name={name} size="xl" online={online} tier={tier} />
          {online && <span className={styles.onlinePill}>Available now</span>}
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <Typography as="h1" variant="display" className={styles.name}>{name}</Typography>
            {badges.length > 0 && (
              <div className={styles.badges} aria-label="Badges">
                {badges.map((v) => <Badge key={v} variant={v} size="sm" />)}
              </div>
            )}
          </div>

          {tagline && (
            <Typography variant="body" className={styles.tagline}>{tagline}</Typography>
          )}

          {/* Meta row */}
          <div className={styles.metaRow}>
            {location && (
              <div className={styles.metaItem}><LocationIcon /><span>{location}</span></div>
            )}
            {remoteAvailable && (
              <div className={styles.metaItem}><span aria-hidden="true">🌍</span><span>Remote available</span></div>
            )}
            {responseTime && (
              <div className={styles.metaItem}><ClockIcon /><span>Responds {responseTime}</span></div>
            )}
            {completedGigs > 0 && (
              <div className={styles.metaItem}><GigIcon /><span>{completedGigs} completed</span></div>
            )}
            {ensembleType && ensembleType !== 'solo' && (
              <div className={styles.metaItem}>
                <span>👥</span><span className={styles.ensembleText}>{ensembleType}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className={styles.genreRow} aria-label="Genres">
              {genres.map((g) => <span key={g} className={styles.genreChip}>{g}</span>)}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Typography variant="caption" className={styles.languages}>
              Speaks: {languages.join(', ')}
            </Typography>
          )}

          {/* Rating + price */}
          <div className={styles.statsRow}>
            {rating > 0 ? (
              <RatingStars rating={rating} reviewCount={reviewCount} size="md" showCount />
            ) : (
              <span className={styles.newMusician}>New on Prova</span>
            )}
            {startingPrice != null && (
              <div className={styles.price}>
                <span className={styles.priceFrom}>From</span>
                <span className={styles.priceAmount}>{currencySymbol}{startingPrice}</span>
                <span className={styles.priceUnit}>/session</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA column */}
        <div className={styles.ctaBox}>
          <Button variant="primary" size="lg" fullWidth onClick={onBook}>
            Book Now
          </Button>
          <Button variant="ghost" size="lg" fullWidth onClick={onContact}>
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MusicianDetailHero;
