import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useFocusTrap } from '@/hooks';
import styles from './Modal.module.css';

/**
 * Modal pattern component with focus management and accessibility features
 */
const Modal = forwardRef(({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocus,
  className,
  overlayClassName,
  contentClassName,
  ...props
}, ref) => {
  const modalRef = useRef(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Focus trap implementation
  const focusTrap = useFocusTrap(modalRef, isOpen);

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
      document.body.classList.add('modal-open');
      return () => {
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const modalClasses = [
    styles.modal,
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

  const modalContent = (
    <div 
      className={overlayClasses}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={ref || modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        <div className={contentClasses}>
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
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

  // Render modal in portal
  const portalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(modalContent, portalRoot);
});

Modal.displayName = 'Modal';

Modal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool,
  /** Function called when modal should close */
  onClose: PropTypes.func,
  /** Modal title */
  title: PropTypes.string,
  /** Modal content */
  children: PropTypes.node.isRequired,
  /** Modal size */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'extra-large', 'full']),
  /** Modal variant */
  variant: PropTypes.oneOf(['default', 'centered', 'sidebar']),
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick: PropTypes.bool,
  /** Whether escape key closes modal */
  closeOnEscape: PropTypes.bool,
  /** Whether to show close button */
  showCloseButton: PropTypes.bool,
  /** Element to focus initially (selector string or ref) */
  initialFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Additional CSS classes for modal */
  className: PropTypes.string,
  /** Additional CSS classes for overlay */
  overlayClassName: PropTypes.string,
  /** Additional CSS classes for content */
  contentClassName: PropTypes.string
};

export default Modal;