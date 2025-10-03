import { forwardRef, useState } from 'react';
import styles from './Input.module.css';

/**
 * Input - Form input component with validation states
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} size - Input size (sm, md, lg)
 * @param {string} variant - Input style (default, filled)
 * @param {boolean} disabled - Disabled state
 * @param {boolean} invalid - Invalid/error state
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Associated label text
 * @param {string} hint - Helper text
 * @param {string} error - Error message
 */
export const Input = forwardRef(({
  type = 'text',
  size = 'md',
  variant = 'default',
  disabled = false,
  invalid = false,
  placeholder,
  label,
  hint,
  error,
  className = '',
  value,
  onChange,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const hasError = invalid || !!error;
  const hasValue = value !== undefined && value !== '';

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className={styles.inputContainer}>
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            ${styles.input}
            ${styles[`input--${size}`]}
            ${styles[`input--${variant}`]}
            ${focused ? styles['input--focused'] : ''}
            ${hasError ? styles['input--invalid'] : ''}
            ${hasValue ? styles['input--filled'] : ''}
          `.trim()}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={hasError}
          aria-describedby={
            [
              hint && `${props.id}-hint`,
              error && `${props.id}-error`
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
      </div>

      {hint && !error && (
        <div id={`${props.id}-hint`} className={styles.hint}>
          {hint}
        </div>
      )}

      {error && (
        <div id={`${props.id}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;