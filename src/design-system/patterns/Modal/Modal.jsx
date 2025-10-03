import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useReducedMotion } from '@/hooks';
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
  const previousActiveElement = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus management after modal opens
    const focusModal = () => {
      const modal = modalRef.current;
      if (!modal) return;

      if (initialFocus) {
        const element = typeof initialFocus === 'string' 
          ? modal.querySelector(initialFocus)
          : initialFocus.current;
        if (element) {
          element.focus();
          return;
        }
      }

      // Focus first interactive element in body or modal itself
      const bodyElement = modal.querySelector(`.${styles.body}`);
      const focusableElements = bodyElement ? bodyElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) : [];
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // Fallback to all focusable elements if no body elements
        const allFocusable = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (allFocusable.length > 0) {
          allFocusable[0].focus();
        } else {
          modal.focus();
        }
      }
    };

    // Delay focus to ensure modal is rendered
    const timeoutId = setTimeout(focusModal, 100);

    return () => {
      clearTimeout(timeoutId);
      // Restore focus when modal closes
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
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = Array.from(modal.querySelectorAll(
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

  // Prevent body scroll when modal is open
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

  const modalClasses = [
    styles.modal,
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