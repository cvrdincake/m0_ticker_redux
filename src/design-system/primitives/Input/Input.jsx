import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

const Input = forwardRef(({ 
  type = 'text',
  size = 'md',
  error = false,
  className,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        styles.input,
        styles[size],
        error && styles.error,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };