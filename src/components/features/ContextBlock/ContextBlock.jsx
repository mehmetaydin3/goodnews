import React from 'react';
import styles from './ContextBlock.module.css';

export function ContextBlock({ text, pullQuote, className = '', ...props }) {
  return (
    <section className={[styles.contextBlock, className].filter(Boolean).join(' ')} {...props}>
      {text && (
        <p className={styles.text}>
          {text}
        </p>
      )}
      
      {pullQuote && (
        <blockquote className={styles.quoteContainer}>
          <p className={styles.quoteText}>"{pullQuote}"</p>
        </blockquote>
      )}
    </section>
  );
}

export default ContextBlock;
