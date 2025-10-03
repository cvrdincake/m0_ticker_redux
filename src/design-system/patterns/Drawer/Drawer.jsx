import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useFocusTrap } from '@/hooks';
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
  className,
  overlayClassName,
  contentClassName,
  ...props
}, ref) => {
  const drawerRef = useRef(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Focus trap implementation
  const focusTrap = useFocusTrap(drawerRef, isOpen);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
      return () => {
        document.body.classList.remove('drawer-open');
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
    prefersReducedMotion && styles.reducedMotion,
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
  /** Additional CSS classes for drawer */
  className: PropTypes.string,
  /** Additional CSS classes for overlay */
  overlayClassName: PropTypes.string,
  /** Additional CSS classes for content */
  contentClassName: PropTypes.string
};

export default Drawer;