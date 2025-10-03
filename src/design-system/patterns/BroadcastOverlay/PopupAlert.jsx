import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './PopupAlert.module.css';

/**
 * PopupAlert - Broadcast overlay pattern for non-intrusive notifications
 * Renders via portal at document.body with proper a11y and motion policies
 * 
 * @param {string} title - Alert title (required)
 * @param {string} message - Alert message content (required)
 * @param {React.ReactNode} icon - Optional icon element
 * @param {boolean} active - Controls visibility (default: false)
 * @param {number} duration - Auto-dismiss duration in ms (default: 5000)
 * @param {function} onDismiss - Callback fired on dismiss/timeout
 */
export const PopupAlert = ({
  title,
  message,
  icon,
  active = false,
  duration = 5000,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);
  const isPausedRef = useRef(false);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(null);

  // Clear any active timeout
  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handle dismiss with exit animation
  const handleDismiss = useCallback(() => {
    setIsAnimating(false);
    // Allow exit animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      clearTimeout();
      isPausedRef.current = false;
      remainingTimeRef.current = duration;
      onDismiss?.();
    }, 240); // Match --duration-base
  }, [clearTimeout, duration, onDismiss]);

  // Start auto-dismiss timeout
  const startTimeout = useCallback(() => {
    if (duration <= 0 || !onDismiss) return;
    
    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      if (!isPausedRef.current) {
        handleDismiss();
      }
    }, remainingTimeRef.current);
  }, [duration, onDismiss, handleDismiss]);

  // Handle pause on hover (preserve remaining time)
  const handleMouseEnter = useCallback(() => {
    if (!isPausedRef.current && timeoutRef.current) {
      isPausedRef.current = true;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      clearTimeout();
    }
  }, [clearTimeout]);

  // Resume timeout on mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      startTimeout();
    }
  }, [startTimeout]);

  // Handle show/hide with proper animation timing
  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setIsAnimating(true);
      remainingTimeRef.current = duration;
      startTimeout();
    } else {
      handleDismiss();
    }

    return () => clearTimeout();
  }, [active, duration, startTimeout, handleDismiss, clearTimeout]);

  // Handle Esc key to dismiss
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && active) {
        handleDismiss();
      }
    };

    if (active) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [active, handleDismiss]);

  // Don't render if not visible
  if (!isVisible) return null;

  const alertContent = (
    <div
      className={`
        ${styles.popupAlert}
        ${isAnimating ? styles.popupAlertEntering : styles.popupAlertExiting}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-testid="popup-alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.popupAlertContent}>
        {icon && (
          <div className={styles.popupAlertIcon} aria-hidden="true">
            {icon}
          </div>
        )}
        <div className={styles.popupAlertText}>
          <div className={styles.popupAlertTitle}>{title}</div>
          <div className={styles.popupAlertMessage}>{message}</div>
        </div>
        <button
          className={styles.popupAlertDismiss}
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.854 4.854a.5.5 0 0 0-.708-.708L8 8.293 3.854 4.146a.5.5 0 1 0-.708.708L7.293 9l-4.147 4.146a.5.5 0 0 0 .708.708L8 9.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 9l4.147-4.146z"/>
          </svg>
        </button>
      </div>
    </div>
  );

  // Render via portal to document.body
  return createPortal(alertContent, document.body);
};