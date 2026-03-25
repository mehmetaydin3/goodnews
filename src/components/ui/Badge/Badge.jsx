import styles from './Badge.module.css';

const BADGE_CONFIG = {
  verified: {
    icon: '✓',
    label: 'Verified',
  },
  topRated: {
    icon: '★',
    label: 'Top Rated',
  },
  pro: {
    icon: null,
    label: 'PRO',
  },
  new: {
    icon: null,
    label: 'New',
  },
  fastResponder: {
    icon: '⚡',
    label: 'Fast Responder',
  },
};

export function Badge({ variant = 'verified', size = 'md', className = '' }) {
  const config = BADGE_CONFIG[variant] || BADGE_CONFIG.verified;

  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames}>
      {config.icon && (
        <span className={styles.icon} aria-hidden="true">
          {config.icon}
        </span>
      )}
      <span className={styles.label}>{config.label}</span>
    </span>
  );
}

export default Badge;
