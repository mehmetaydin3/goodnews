import { useId } from 'react';
import styles from './Input.module.css';

export function Input({
  label,
  placeholder,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  disabled = false,
  size = 'md',
  value,
  onChange,
  type = 'text',
  id: idProp,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = idProp || generatedId;
  const hasError = Boolean(errorText);

  const wrapperClass = [
    styles.wrapper,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputWrapClass = [
    styles.inputWrap,
    styles[size],
    hasError ? styles.error : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={inputWrapClass}>
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={styles.input}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />
        {rightIcon && (
          <span className={styles.iconRight} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {hasError && (
        <p id={`${id}-error`} className={styles.errorText} role="alert">
          {errorText}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${id}-helper`} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
