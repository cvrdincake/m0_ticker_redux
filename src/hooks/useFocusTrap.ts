import { useEffect, RefObject } from 'react';

/**
 * Focus trap hook for modals and dialogs
 * Traps focus within the provided element when active
 */
export function useFocusTrap(
  elementRef: RefObject<HTMLElement>, 
  isActive: boolean = true
): void {
  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    
    // Get all focusable elements
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (!firstElement) return;
    
    // Focus first element initially
    firstElement.focus();
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [elementRef, isActive]);
}