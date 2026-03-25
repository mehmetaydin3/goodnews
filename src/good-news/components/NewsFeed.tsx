import React from 'react';
import { NewsCard } from './NewsCard';
import { NewsItem } from '../GoodNewsApp';
import styles from './NewsFeed.module.css';

interface Props {
  items: NewsItem[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  total: number;
}

export function NewsFeed({ items, loading, onLoadMore, hasMore, total }: Props) {
  if (!loading && items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>☀</div>
        <h3>No stories found</h3>
        <p>Try a different category or search term. Click "Refresh Feed" to fetch the latest news.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.count}>
        {total > 0 && !loading && (
          <span>{total.toLocaleString()} stories found</span>
        )}
      </div>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <NewsCard key={item.id} item={item} featured={i === 0} />
        ))}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={`skel-${i}`} className={styles.skeleton} />
        ))}
      </div>

      {hasMore && !loading && (
        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn} onClick={onLoadMore}>
            Load more stories
          </button>
        </div>
      )}
    </div>
  );
}
