import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useReducedMotion } from '@/hooks';
import styles from './Drawer.module.css';

/**
 * Drawer pattern component for slide-in panels with focus management
 */
const Drawer = forwardRef(({
  isOpen = false,
  onClose,
  title,
  children,
  position = 'right',
  size = 'medium',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  overlay = true,
  initialFocus,
  className,
  overlayClassName,
  contentClassName,
  ...props
}, ref) => {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus management after drawer opens
    const focusDrawer = () => {
      const drawer = drawerRef.current;
      if (!drawer) return;

      if (initialFocus) {
        const element = typeof initialFocus === 'string' 
          ? drawer.querySelector(initialFocus)
          : initialFocus.current;
        if (element) {
          element.focus();
          return;
        }
      }

      // Focus first interactive element in body or drawer itself
      const bodyElement = drawer.querySelector(`.${styles.body}`);
      const focusableElements = bodyElement ? bodyElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) : [];
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // Fallback to all focusable elements if no body elements
        const allFocusable = drawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (allFocusable.length > 0) {
          allFocusable[0].focus();
        } else {
          drawer.focus();
        }
      }
    };

    // Delay focus to ensure drawer is rendered
    const timeoutId = setTimeout(focusDrawer, 100);

    return () => {
      clearTimeout(timeoutId);
      // Restore focus when drawer closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, initialFocus]);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose?.();
      }

      // Tab trapping
      if (event.key === 'Tab') {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const focusableElements = Array.from(drawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const drawerClasses = [
    styles.drawer,
    styles[`position-${position}`],
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    prefersReducedMotion && styles.reducedMotion,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    styles.overlay,
    overlayClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    styles.content,
    contentClassName
  ].filter(Boolean).join(' ');

  const drawerContent = (
    <div className={styles.container}>
      {overlay && (
        <div 
          className={overlayClasses}
          onClick={handleOverlayClick}
          role="presentation"
        />
      )}
      
      <div
        ref={ref || drawerRef}
        className={drawerClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        <div className={contentClasses}>
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <h2 id="drawer-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className={styles.body}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render drawer in portal
  const portalRoot = document.getElementById('drawer-root') || document.body;
  return createPortal(drawerContent, portalRoot);
});

Drawer.displayName = 'Drawer';

Drawer.propTypes = {
  /** Whether the drawer is open */
  isOpen: PropTypes.bool,
  /** Function called when drawer should close */
  onClose: PropTypes.func,
  /** Drawer title */
  title: PropTypes.string,
  /** Drawer content */
  children: PropTypes.node.isRequired,
  /** Drawer position */
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  /** Drawer size */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  /** Drawer variant */
  variant: PropTypes.oneOf(['default', 'push', 'overlay']),
  /** Whether clicking overlay closes drawer */
  closeOnOverlayClick: PropTypes.bool,
  /** Whether escape key closes drawer */
  closeOnEscape: PropTypes.bool,
  /** Whether to show close button */
  showCloseButton: PropTypes.bool,
  /** Whether to show overlay backdrop */
  overlay: PropTypes.bool,
  /** Element to focus initially (selector string or ref) */
  initialFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Additional CSS classes for drawer */
  className: PropTypes.string,
  /** Additional CSS classes for overlay */
  overlayClassName: PropTypes.string,
  /** Additional CSS classes for content */
  contentClassName: PropTypes.string
};

export default Drawer;