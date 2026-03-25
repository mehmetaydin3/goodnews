import React from 'react';
import styles from './CategoryFilter.module.css';

interface Category {
  id: string;
  label: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Stories', emoji: '✦' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'health', label: 'Health', emoji: '💊' },
  { id: 'space', label: 'Space', emoji: '🚀' },
  { id: 'environment', label: 'Environment', emoji: '🌿' },
  { id: 'technology', label: 'Technology', emoji: '⚡' },
  { id: 'awards', label: 'Awards', emoji: '🏆' },
  { id: 'general', label: 'Good Vibes', emoji: '☀' },
];

interface Props {
  selected: string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <nav className={styles.nav}>
      <h3 className={styles.heading}>Categories</h3>
      <ul className={styles.list}>
        {CATEGORIES.map(cat => (
          <li key={cat.id}>
            <button
              className={`${styles.btn} ${selected === cat.id ? styles.active : ''}`}
              onClick={() => onChange(cat.id)}
            >
              <span className={styles.emoji}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
