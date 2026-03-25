import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../ui/Avatar/Avatar';
import { Badge } from '../../ui/Badge/Badge';
import { Tag } from '../../ui/Tag/Tag';
import { RatingStars } from '../../ui/RatingStars/RatingStars';
import { AudioPreview } from '../../ui/AudioPreview/AudioPreview';
import { Button } from '../../ui/Button/Button';
import { Typography } from '../../ui/Typography/Typography';
import styles from './ProfileCard.module.css';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
};

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.625 3.5 6.5 3.5 6.5S9.5 7.125 9.5 4.5C9.5 2.567 7.933 1 6 1Zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ProfileCard({
  musician = {},
  onBook,
  onContact,
  pdpUrl,
  className = '',
  ...props
}) {
  const {
    id,
    name = 'Unknown Musician',
    tagline = '',
    avatarSrc,
    location = '',
    online = false,
    tier = 'none',
    badges = [],
    genres = [],
    skills = [],
    rating = 0,
    reviewCount = 0,
    responseTime = '',
    completedGigs = 0,
    startingPrice,
    currency = 'USD',
    audioSample,
  } = musician;

  const visibleGenres = genres.slice(0, 3);
  const hiddenGenreCount = genres.length > 3 ? genres.length - 3 : 0;

  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (pdpUrl) navigate(pdpUrl);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (pdpUrl) navigate(pdpUrl);
    else if (onBook) onBook();
  };

  return (
    <article
      className={[
        styles.card, 
        pdpUrl ? styles.clickable : '',
        className
      ].filter(Boolean).join(' ')}
      aria-label={`Profile card for ${name}`}
      onClick={handleCardClick}
      {...props}
    >
      {/* Header: Avatar + identity info */}
      <div className={styles.header}>
        <Avatar
          src={avatarSrc}
          name={name}
          size="xl"
          online={online}
          tier={tier}
        />

        <div className={styles.identity}>
          <div className={styles.identityGroup}>
            <div className={styles.nameRow}>
              <Typography as="h3" variant="heading3" className={styles.name}>
                {name}
              </Typography>
              {online && (
                <span className={styles.onlineLabel} aria-label="Available now">
                  Available
                </span>
              )}
            </div>

            <div className={styles.metaRow}>
              {tagline && (
                <Typography variant="bodySmall" className={styles.tagline}>
                  {tagline}
                </Typography>
              )}

              {location && (
                <div className={styles.location}>
                  <LocationIcon />
                  <Typography as="span" variant="caption">
                    {location}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {badges.length > 0 && (
            <div className={styles.badgeRow} aria-label="Badges">
              {badges.map((variant) => (
                <Badge key={variant} variant={variant} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Audio sample */}
        {audioSample && (
          <div className={styles.audioSection} onClick={(e) => e.stopPropagation()}>
            <AudioPreview
              src={audioSample.src}
              duration={audioSample.duration}
              title={audioSample.title || `${name} — Sample`}
              waveformData={audioSample.waveformData}
            />
          </div>
        )}

        {/* Genres — max 3 visible + overflow count */}
        {visibleGenres.length > 0 && (
          <div className={styles.genreRow} aria-label="Genres">
            {visibleGenres.map((g) => (
              <Tag key={g} label={g} variant="genre" />
            ))}
            {hiddenGenreCount > 0 && (
              <span className={styles.genreOverflow}>+{hiddenGenreCount}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Rating + Price row, then CTA row */}
      <div className={styles.footer}>
        <div className={styles.footerMeta}>
          <div className={styles.trustGroup}>
            {rating > 0 ? (
              <RatingStars
                rating={rating}
                reviewCount={reviewCount}
                size="sm"
                showCount={reviewCount > 0}
              />
            ) : (
              <Typography as="span" variant="caption" className={styles.metric} style={{ color: 'var(--color-text-tertiary)' }}>
                New on Prova
              </Typography>
            )}
            {completedGigs > 0 && (
              <Typography as="span" variant="caption" className={styles.metric}>
                · {completedGigs} jobs
              </Typography>
            )}
          </div>

          {startingPrice != null && (
            <div className={styles.priceContainer}>
              <Typography as="span" variant="caption" className={styles.pricePrefix}>From</Typography>
              <Typography as="span" variant="h3" className={styles.priceAmount}>
                {currencySymbol}{startingPrice}
              </Typography>
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onContact && onContact(); }}
            aria-label={`Contact ${name}`}
          >
            Contact
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={styles.bookBtn}
            onClick={handleBookClick}
            aria-label={`Book a session with ${name}`}
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProfileCard;
