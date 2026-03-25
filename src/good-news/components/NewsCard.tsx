import React, { useState } from 'react';
import { ShareMenu } from './ShareMenu';
import { NewsItem } from '../GoodNewsApp';
import styles from './NewsCard.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  science: '#2563eb',
  health: '#16a34a',
  space: '#7c3aed',
  environment: '#059669',
  technology: '#d97706',
  awards: '#dc2626',
  general: '#0891b2',
};

const CATEGORY_LABELS: Record<string, string> = {
  science: '🔬 Science',
  health: '💊 Health',
  space: '🚀 Space',
  environment: '🌿 Environment',
  technology: '⚡ Technology',
  awards: '🏆 Awards',
  general: '☀ Good News',
};

const FALLBACK_IMAGES: Record<string, string> = {
  science: 'https://images.unsplash.com/photo-1532094349884-543559244ac7?w=400&q=80',
  health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
  environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  awards: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80',
  general: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Props {
  item: NewsItem;
  featured?: boolean;
}

export function NewsCard({ item, featured = false }: Props) {
  const [showShare, setShowShare] = useState(false);
  const [imgError, setImgError] = useState(false);

  const color = CATEGORY_COLORS[item.category] || '#6b7280';
  const label = CATEGORY_LABELS[item.category] || item.category;
  const imgSrc = (!imgError && item.imageUrl) ? item.imageUrl : FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.general;

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img
            src={imgSrc}
            alt={item.title}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <span className={styles.badge} style={{ background: color }}>
            {label}
          </span>
        </div>
      </a>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.source}>{item.source}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{timeAgo(item.publishedAt)}</span>
        </div>

        <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
          <h2 className={styles.title}>{item.title}</h2>
        </a>

        {item.summary && (
          <p className={styles.summary}>{item.summary}</p>
        )}

        <div className={styles.footer}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
            Read full story →
          </a>
          <div className={styles.shareWrap}>
            <button
              className={styles.shareBtn}
              onClick={() => setShowShare(!showShare)}
              aria-label="Share this story"
            >
              ↗ Share
            </button>
            {showShare && (
              <ShareMenu
                item={item}
                onClose={() => setShowShare(false)}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
