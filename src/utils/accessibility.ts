import { useEffect } from 'react';

/**
 * useFocusTrap
 *
 * Trap keyboard focus within a container when active, and restore focus on cleanup.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    const focusableNodes = container.querySelectorAll<HTMLElement>(focusableSelectors);
    const first = focusableNodes[0];
    const last = focusableNodes[focusableNodes.length - 1];

    if (first) first.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || focusableNodes.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [containerRef, active]);
}

/**
 * useAriaLive
 *
 * Return props for a polite aria-live region to announce dynamic messages.
 */
export function useAriaLive(message?: string) {
  return {
    role: 'status',
    'aria-live': 'polite' as const,
    'aria-atomic': 'true' as const,
    children: message || null
  };
}
