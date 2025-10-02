// hooks/useFocusTrap.js
import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element on mount
    firstElement?.focus();
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Dispatch custom event for parent to handle
        container.dispatchEvent(new CustomEvent('escapepressed'));
      }
    };
    
    container.addEventListener('keydown', handleTab);
    container.addEventListener('keydown', handleEscape);
    
    return () => {
      container.removeEventListener('keydown', handleTab);
      container.removeEventListener('keydown', handleEscape);
    };
  }, [isActive]);
  
  return containerRef;
}