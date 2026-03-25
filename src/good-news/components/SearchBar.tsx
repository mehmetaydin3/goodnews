import React, { useRef } from 'react';
import styles from './SearchBar.module.css';

interface Props {
  onChange: (value: string) => void;
}

export function SearchBar({ onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>⌕</span>
      <input
        ref={ref}
        type="text"
        placeholder="Search stories…"
        className={styles.input}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
