import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };