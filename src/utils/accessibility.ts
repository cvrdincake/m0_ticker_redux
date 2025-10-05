import { useEffect } from 'react';

/**
 * useFocusTrap
 *
 * A custom React hook that traps keyboard focus within a designated container
 * element when active.  This is commonly used in modals, popovers and other
 * overlays to prevent users from tabbing to elements outside the overlay.
 *
 * When the trap is activated, the hook stores the element that was focused
 * previously, moves focus to the first focusable element within the
 * container and wraps focus between the first and last focusable elements
 * when the user presses Tab or Shift+Tab.  When deactivated, focus is
 * restored to the previously focused element.
 *
 * @param containerRef - React ref pointing to the element to trap focus within.
 * @param active - Whether the focus trap should be active.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // CSS selector for all focusable elements
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
    // Focus the first element when activating
    if (first) first.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || focusableNodes.length === 0) return;
      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element when deactivated
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, active]);
}

/**
 * useAriaLive
 *
 * Utility hook that returns props for a live region container.  When a
 * message is provided, the hook ensures screen readers announce it
 * politely.  Live regions should be placed near the top of the DOM tree
 * to ensure announcements are not missed.
 *
 * @param message - The message to announce.  If undefined, nothing is announced.
 */
export function useAriaLive(message?: string) {
  return {
    role: 'status',
    'aria-live': 'polite' as const,
    'aria-atomic': 'true' as const,
    children: message || null
  };
}
