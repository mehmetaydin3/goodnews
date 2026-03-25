import React from 'react';
import { Typography } from '../../ui/Typography/Typography';
import styles from './HeroSection.module.css';

export function HeroSection({
  headline,
  subheadline,
  metadata = [],
  imageSrc,
  imageAlt = "Hero Showcase",
  className = '',
  ...props
}) {
  return (
    <section className={[styles.hero, className].filter(Boolean).join(' ')} {...props}>
      <div className={styles.content}>
        <Typography as="h1" variant="display" className={styles.headline}>
          {headline}
        </Typography>
        
        {subheadline && (
          <p className={styles.subheadline}>
            {subheadline}
          </p>
        )}
        
        {metadata.length > 0 && (
          <div className={styles.metadata}>
            {metadata.map((item, index) => (
              <Typography key={index} as="span" variant="label" className={styles.metaItem}>
                {item}
              </Typography>
            ))}
          </div>
        )}
      </div>

      {imageSrc && (
        <div className={styles.visualContainer}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} loading="lazy" />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
