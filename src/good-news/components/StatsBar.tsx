import React from 'react';
import styles from './StatsBar.module.css';

interface Stats {
  total: number;
  lastFetch: string | null;
  sources: string[];
}

interface Props {
  stats: Stats;
}

export function StatsBar({ stats }: Props) {
  const lastFetch = stats.lastFetch
    ? new Date(stats.lastFetch).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.stat}>
          <span className={styles.value}>{stats.total.toLocaleString()}</span>
          <span className={styles.label}>stories indexed</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.value}>{stats.sources.length}</span>
          <span className={styles.label}>trusted sources</span>
        </div>
        {lastFetch && (
          <>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.value}>{lastFetch}</span>
              <span className={styles.label}>last updated</span>
            </div>
          </>
        )}
        <div className={styles.divider} />
        <div className={styles.sources}>
          {stats.sources.slice(0, 6).map(s => (
            <span key={s} className={styles.sourceTag}>{s}</span>
          ))}
          {stats.sources.length > 6 && (
            <span className={styles.sourceTag}>+{stats.sources.length - 6} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
