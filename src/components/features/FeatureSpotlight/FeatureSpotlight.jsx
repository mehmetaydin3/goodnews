import React from 'react';
import { Typography } from '../../ui/Typography/Typography';
import styles from './FeatureSpotlight.module.css';

export function FeatureSpotlight({
  title,
  description,
  imageSrc,
  imageAlt = "Feature Spotlight Visual",
  reverse = false,
  className = '',
  ...props
}) {
  return (
    <section 
      className={[
        styles.spotlight, 
        reverse ? styles.reverse : '', 
        className
      ].filter(Boolean).join(' ')} 
      {...props}
    >
      <div className={styles.content}>
        <Typography as="h2" variant="heading2" className={styles.title}>
          {title}
        </Typography>
        <Typography as="p" variant="body" className={styles.description}>
          {description}
        </Typography>
      </div>

      <div className={styles.visualContainer}>
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className={styles.image} loading="lazy" />
        ) : (
          <div style={{ aspectRatio: '4/3', width: '100%', backgroundColor: 'var(--color-neutral-100)' }} />
        )}
      </div>
    </section>
  );
}

export default FeatureSpotlight;
