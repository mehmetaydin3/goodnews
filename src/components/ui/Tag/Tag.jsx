import styles from './Tag.module.css';

export function Tag({
  label,
  variant = 'default',
  removable = false,
  onRemove,
  className = '',
  ...props
}) {
  const classNames = [
    styles.tag,
    styles[variant],
    removable ? styles.removable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      <span className={styles.label}>{label}</span>
      {removable && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Tag;
