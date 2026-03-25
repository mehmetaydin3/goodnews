import styles from './Hero.module.css';

export function Hero({
  title,
  subtitle,
  imageUrl,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className={styles.hero}>
      <div 
        className={styles.bgImage} 
        style={{ backgroundImage: `url(${imageUrl})` }} 
      />
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        
        {(primaryAction || secondaryAction) && (
          <div className={styles.actions}>
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
