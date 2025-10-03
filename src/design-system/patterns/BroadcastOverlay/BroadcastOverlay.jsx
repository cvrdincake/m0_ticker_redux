import React, { forwardRef, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReducedMotion } from '@/hooks';
import styles from './BroadcastOverlay.module.css';

/**
 * BroadcastOverlay pattern component for ticker-style notifications and announcements
 */
const BroadcastOverlay = forwardRef(({
  isVisible = false,
  text = '',
  duration = 20000,
  autoHide = false,
  autoHideDelay = 5000,
  onComplete,
  onShow,
  onHide,
  className,
  ...props
}, ref) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      // Small delay to trigger transition
      const timeoutId = setTimeout(() => {
        setIsActive(true);
        onShow?.();
      }, 50);

      return () => clearTimeout(timeoutId);
    } else {
      setIsActive(false);
      onHide?.();
    }
  }, [isVisible, onShow, onHide]);

  // Handle auto-hide functionality
  useEffect(() => {
    if (isVisible && autoHide) {
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
        onHide?.();
      }, autoHideDelay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isVisible, autoHide, autoHideDelay, onHide]);

  // Handle animation completion
  useEffect(() => {
    if (isActive && !prefersReducedMotion) {
      const animationTimeout = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(animationTimeout);
    }
  }, [isActive, duration, onComplete, prefersReducedMotion]);

  const containerClasses = [
    styles.lowerThird,
    isActive && styles.active,
    className
  ].filter(Boolean).join(' ');

  if (!text && !isVisible) return null;

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      <div className={styles.lowerThirdTrack}>
        <div 
          className={styles.lowerThirdText}
          data-testid="broadcast-text"
          style={{
            animationDuration: prefersReducedMotion ? '0s' : `${duration}ms`
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
});

BroadcastOverlay.displayName = 'BroadcastOverlay';

BroadcastOverlay.propTypes = {
  /** Whether the overlay is visible */
  isVisible: PropTypes.bool,
  /** Text content to display in the ticker */
  text: PropTypes.string.isRequired,
  /** Animation duration in milliseconds */
  duration: PropTypes.number,
  /** Whether to automatically hide after a delay */
  autoHide: PropTypes.bool,
  /** Delay before auto-hiding in milliseconds */
  autoHideDelay: PropTypes.number,
  /** Callback when animation completes */
  onComplete: PropTypes.func,
  /** Callback when overlay is shown */
  onShow: PropTypes.func,
  /** Callback when overlay is hidden */
  onHide: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string
};

export default BroadcastOverlay;