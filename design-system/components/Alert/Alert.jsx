import { useState, useEffect } from 'react';
import { Text } from '@/design-system/primitives';
import { Portal } from '@/design-system/components/Portal';
import { cn } from '@/lib/utils';
import styles from './Alert.module.css';

const Alert = ({ 
  title, 
  message, 
  icon, 
  variant = 'info',
  position = 'top-right',
  isOpen = false, 
  duration = 5000,
  onClose,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <Portal>
      <div 
        className={cn(
          styles.alert,
          styles[variant],
          styles[position],
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {icon && (
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        )}
        
        <div className={styles.content}>
          {title && (
            <Text 
              as="h3" 
              size="sm" 
              weight="medium" 
              className={styles.title}
            >
              {title}
            </Text>
          )}
          
          {message && (
            <Text 
              size="sm" 
              color="secondary" 
              className={styles.message}
            >
              {message}
            </Text>
          )}
        </div>
        
        <button
          className={styles.dismiss}
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
    </Portal>
  );
};

export { Alert };