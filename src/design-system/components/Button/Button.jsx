import { forwardRef } from 'react';
import styles from './Button.module.css';

/**
 * Button - Interactive element with multiple variants
 * @param {string} variant - Button style (primary, secondary, ghost, danger)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state with spinner
 * @param {string} type - HTML button type (button, submit, reset)
 * @param {function} onClick - Click handler
 */
export const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        ${styles.button}
        ${styles[`button--${variant}`]}
        ${styles[`button--${size}`]}
        ${loading ? styles['button--loading'] : ''}
        ${className}
      `.trim()}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.spinnerIcon}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 64;32 32;0 64" repeatCount="indefinite" />
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-32;-64" repeatCount="indefinite" />
            </circle>
          </svg>
        </span>
      )}
      <span className={loading ? styles.contentHidden : ''}>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;