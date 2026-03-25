import { useState } from 'react';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { Typography } from '../../ui/Typography/Typography';
import styles from './MusicianGrid.module.css';

const EmptyIllustration = () => (
  <div className={styles.empty}>
    <span className={styles.emptyIcon} aria-hidden="true">🎵</span>
    <Typography as="h3" variant="heading3" className={styles.emptyTitle}>No musicians found</Typography>
    <Typography variant="body" className={styles.emptyDesc}>
      Try adjusting your filters or search term to discover more artists.
    </Typography>
  </div>
);

export function MusicianGrid({
  musicians = [],
  onBook,
  onContact,
  loading = false,
  className = '',
  ...props
}) {
  if (loading) {
    return (
      <div className={styles.grid} aria-label="Loading musicians" aria-busy="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (musicians.length === 0) return <EmptyIllustration />;

  return (
    <div
      className={[styles.grid, className].filter(Boolean).join(' ')}
      role="list"
      aria-label={`${musicians.length} musicians`}
      {...props}
    >
      {musicians.map((musician) => (
        <div key={musician.id} role="listitem" className={styles.listItem}>
          <ProfileCard
            musician={musician}
            pdpUrl={`/musicians/${musician.id}`}
            onBook={onBook ? () => onBook(musician) : undefined}
            onContact={onContact ? () => onContact(musician) : undefined}
          />
        </div>
      ))}
    </div>
  );
}

export default MusicianGrid;
