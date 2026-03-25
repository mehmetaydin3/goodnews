import styles from './Avatar.module.css';

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToColor(str) {
  const palette = [
    '#6C47FF', '#FF6B35', '#22C55E', '#3B82F6',
    '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({
  src,
  name,
  size = 'md',
  online = false,
  tier = 'none',
  className = '',
  ...props
}) {
  const px = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(name);
  const bgColor = name ? stringToColor(name) : '#A3A3A3';

  const containerClass = [
    styles.container,
    styles[size],
    tier !== 'none' ? styles[`tier-${tier}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClass}
      style={{ '--avatar-size': `${px}px` }}
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
      role="img"
      {...props}
    >
      <div className={styles.ring}>
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className={styles.image}
            width={px}
            height={px}
          />
        ) : (
          <div
            className={styles.fallback}
            style={{ backgroundColor: bgColor }}
            aria-hidden="true"
          >
            <span className={styles.initials}>{initials}</span>
          </div>
        )}
      </div>
      {online && (
        <span className={styles.onlineDot} aria-label="Online" role="status" />
      )}
    </div>
  );
}

export default Avatar;
