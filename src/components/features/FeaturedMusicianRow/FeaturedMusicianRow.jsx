import { useRef } from 'react';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { Typography } from '../../ui/Typography/Typography';
import styles from './FeaturedMusicianRow.module.css';

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function FeaturedMusicianRow({
  musicians = [],
  title = 'Featured This Week',
  subtitle,
  onBook,
  onContact,
  className = '',
  ...props
}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label={title}
      {...props}
    >
      <div className={styles.header}>
        <div>
          <Typography as="h2" variant="heading2" className={styles.title}>{title}</Typography>
          {subtitle && (
            <Typography variant="body" className={styles.subtitle}>{subtitle}</Typography>
          )}
        </div>
        <div className={styles.controls}>
          <button className={styles.arrow} onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft />
          </button>
          <button className={styles.arrow} onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.row} ref={scrollRef} role="list">
          {musicians.map((musician) => (
            <div key={musician.id} className={styles.cardWrap} role="listitem">
              <ProfileCard
                musician={musician}
                pdpUrl={`/musicians/${musician.id}`}
                onBook={onBook ? () => onBook(musician) : undefined}
                onContact={onContact ? () => onContact(musician) : undefined}
              />
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className={styles.fadeLeft} aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />
      </div>
    </section>
  );
}

export default FeaturedMusicianRow;
