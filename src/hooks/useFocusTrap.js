// hooks/useFocusTrap.js
import { useEffect, useRef, useCallback } from 'react';

export function useFocusTrap(isActive = true, options = {}) {
  const { 
    initialFocus = null, 
    onEscape = null,
    restoreFocus = true 
  } = options;
  
  const containerRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const mutationObserver = useRef(null);
  const focusableElements = useRef([]);
  
  // SSR safety
  const isBrowser = typeof window !== 'undefined';
  
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current || !isBrowser) return [];
    
    const container = containerRef.current;
    const elements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    
    return Array.from(elements).filter(element => {
      // Additional checks for visibility and interactability
      const style = window.getComputedStyle(element);
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none'
      );
    });
  }, [isBrowser]);
  
  const updateFocusableElements = useCallback(() => {
    focusableElements.current = getFocusableElements();
  }, [getFocusableElements]);
  
  const focusFirstElement = useCallback(() => {
    if (!isActive || !isBrowser) return;
    
    updateFocusableElements();
    const elements = focusableElements.current;
    
    if (elements.length === 0) return;
    
    let elementToFocus = elements[0];
    
    // Handle initialFocus option
    if (initialFocus) {
      if (typeof initialFocus === 'string') {
        const customElement = containerRef.current?.querySelector(initialFocus);
        if (customElement && elements.includes(customElement)) {
          elementToFocus = customElement;
        }
      } else if (initialFocus instanceof HTMLElement && elements.includes(initialFocus)) {
        elementToFocus = initialFocus;
      }
    }
    
    elementToFocus.focus();
  }, [isActive, initialFocus, updateFocusableElements, isBrowser]);
  
  const handleTab = useCallback((e) => {
    if (!isActive || e.key !== 'Tab' || !isBrowser) return;
    
    updateFocusableElements();
    const elements = focusableElements.current;
    
    if (elements.length === 0) return;
    
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = document.activeElement;
    
    if (e.shiftKey && activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, [isActive, updateFocusableElements, isBrowser]);
  
  const handleEscape = useCallback((e) => {
    if (!isActive || e.key !== 'Escape') return;
    
    if (onEscape) {
      onEscape(e);
    } else if (containerRef.current) {
      // Fallback: dispatch custom event
      containerRef.current.dispatchEvent(new CustomEvent('escapepressed', {
        detail: { originalEvent: e }
      }));
    }
  }, [isActive, onEscape]);
  
  const handleKeyDown = useCallback((e) => {
    handleTab(e);
    handleEscape(e);
  }, [handleTab, handleEscape]);
  
  useEffect(() => {
    if (!isActive || !containerRef.current || !isBrowser) return;
    
    const container = containerRef.current;
    
    // Store previously focused element for restoration
    if (restoreFocus) {
      previouslyFocusedElement.current = document.activeElement;
    }
    
    // Focus first element on activation
    focusFirstElement();
    
    // Set up event listeners
    container.addEventListener('keydown', handleKeyDown);
    
    // Set up MutationObserver to track dynamic content changes
    mutationObserver.current = new MutationObserver(() => {
      updateFocusableElements();
    });
    
    mutationObserver.current.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
    });
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
        mutationObserver.current = null;
      }
      
      // Restore focus to previously focused element
      if (restoreFocus && previouslyFocusedElement.current && document.contains(previouslyFocusedElement.current)) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive, focusFirstElement, handleKeyDown, updateFocusableElements, restoreFocus, isBrowser]);
  
  // Manual focus methods for external control
  const focusFirst = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [updateFocusableElements]);
  
  const focusLast = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [updateFocusableElements]);
  
  return {
    ref: containerRef,
    focusFirst,
    focusLast,
    updateFocusableElements,
    getFocusableElements: () => focusableElements.current
  };
}