import { useState } from 'react';
import styles from './TrackItem.module.css';

export function TrackItem({
  rank,
  title,
  artist,
  duration,
  coverUrl,
  isPlaying = false,
  onPlay,
  onLike,
}) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) onLike(!liked);
  };

  const handlePlay = () => {
    if (onPlay) onPlay();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <div className={styles.container} onClick={handlePlay} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      <div className={styles.left}>
        {rank && <span className={styles.rank}>{rank}</span>}
        <div className={styles.coverWrapper}>
          {coverUrl ? (
            <img src={coverUrl} alt={`${title} cover`} className={styles.cover} />
          ) : (
            <div className={styles.coverPlaceholder} />
          )}
          <button
            className={`${styles.playOverlay} ${isPlaying ? styles.isPlaying : ''}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <span className={styles.bars}>
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </span>
            ) : (
              <PlayIcon />
            )}
          </button>
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <span className={styles.artist}>{artist}</span>
        </div>
      </div>
      <div className={styles.right}>
        {duration && <span className={styles.duration}>{duration}</span>}
        <button
          className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.5 2.5L13 8L4.5 13.5V2.5Z" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? '0' : '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default TrackItem;
