import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BroadcastOverlay from './BroadcastOverlay';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false)
}));

describe('BroadcastOverlay', () => {
  const defaultProps = {
    isVisible: true,
    text: 'This is a test broadcast message'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders when isVisible is true', () => {
      render(<BroadcastOverlay {...defaultProps} />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('This is a test broadcast message')).toBeInTheDocument();
    });

    it('does not render when isVisible is false and no text', () => {
      render(<BroadcastOverlay isVisible={false} text="" />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders with text even when not visible initially', () => {
      render(<BroadcastOverlay isVisible={false} text="Hidden message" />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Hidden message')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      const { container } = render(
        <BroadcastOverlay 
          {...defaultProps} 
          className="custom-overlay"
        />
      );
      
      const overlay = container.firstChild;
      expect(overlay.className).toContain('lowerThird');
      expect(overlay).toHaveClass('custom-overlay');
    });

    it('applies active class when visible', async () => {
      const { container } = render(<BroadcastOverlay {...defaultProps} />);
      
      // Wait for the activation delay
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(container.firstChild).toHaveClass('active');
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<BroadcastOverlay {...defaultProps} />);
      
      const overlay = screen.getByRole('alert');
      expect(overlay).toHaveAttribute('aria-live', 'polite');
      expect(overlay).toHaveAttribute('aria-atomic', 'true');
    });

    it('announces content to screen readers', () => {
      render(<BroadcastOverlay {...defaultProps} />);
      
      // The role="alert" and aria-live="polite" ensure screen reader announcement
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Animation and Timing', () => {
    it('activates after a short delay when visible', async () => {
      const { container } = render(<BroadcastOverlay {...defaultProps} />);
      
      // Initially not active
      expect(container.firstChild).not.toHaveClass('active');
      
      // Advance past the activation delay
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(container.firstChild).toHaveClass('active');
      });
    });

    it('calls onShow when becoming visible', async () => {
      const onShow = vi.fn();
      render(<BroadcastOverlay {...defaultProps} onShow={onShow} />);
      
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(onShow).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onHide when becoming invisible', () => {
      const onHide = vi.fn();
      const { rerender } = render(
        <BroadcastOverlay {...defaultProps} onHide={onHide} />
      );
      
      rerender(<BroadcastOverlay {...defaultProps} isVisible={false} onHide={onHide} />);
      
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete after animation duration', async () => {
      const onComplete = vi.fn();
      render(<BroadcastOverlay {...defaultProps} duration={5000} onComplete={onComplete} />);
      
      // Activate the overlay first
      vi.advanceTimersByTime(100);
      
      // Wait for animation duration
      vi.advanceTimersByTime(5000);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('uses custom animation duration', () => {
      const { container } = render(
        <BroadcastOverlay {...defaultProps} duration={10000} />
      );
      
      const textElement = container.querySelector('[data-testid="broadcast-text"]');
      expect(textElement).toHaveStyle({ animationDuration: '10000ms' });
    });
  });

  describe('Auto-hide Functionality', () => {
    it('auto-hides when autoHide is enabled', async () => {
      const onHide = vi.fn();
      render(
        <BroadcastOverlay 
          {...defaultProps} 
          autoHide={true}
          autoHideDelay={3000}
          onHide={onHide}
        />
      );
      
      // Advance past auto-hide delay
      vi.advanceTimersByTime(3100);
      
      await waitFor(() => {
        expect(onHide).toHaveBeenCalledTimes(1);
      });
    });

    it('does not auto-hide when autoHide is disabled', () => {
      const onHide = vi.fn();
      render(
        <BroadcastOverlay 
          {...defaultProps} 
          autoHide={false}
          autoHideDelay={1000}
          onHide={onHide}
        />
      );
      
      vi.advanceTimersByTime(2000);
      
      expect(onHide).not.toHaveBeenCalled();
    });

    it('uses custom auto-hide delay', async () => {
      const onHide = vi.fn();
      render(
        <BroadcastOverlay 
          {...defaultProps} 
          autoHide={true}
          autoHideDelay={7000}
          onHide={onHide}
        />
      );
      
      // Should not hide before the delay
      vi.advanceTimersByTime(5000);
      expect(onHide).not.toHaveBeenCalled();
      
      // Should hide after the delay
      vi.advanceTimersByTime(2100);
      
      await waitFor(() => {
        expect(onHide).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Reduced Motion', () => {
    it('disables animation when reduced motion is preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(true);
      
      const { container } = render(<BroadcastOverlay {...defaultProps} />);
      
      const textElement = container.querySelector('[data-testid="broadcast-text"]');
      expect(textElement).toHaveStyle({ animationDuration: '0s' });
    });

    it('does not call onComplete when reduced motion is enabled', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(true);
      
      const onComplete = vi.fn();
      render(<BroadcastOverlay {...defaultProps} onComplete={onComplete} />);
      
      // Activate the overlay
      vi.advanceTimersByTime(100);
      
      // Even after duration, onComplete should not be called with reduced motion
      vi.advanceTimersByTime(20000);
      
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Props and Configuration', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      
      render(<BroadcastOverlay {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'alert');
    });

    it('spreads additional props to overlay element', () => {
      render(
        <BroadcastOverlay 
          {...defaultProps} 
          data-testid="broadcast-overlay"
          aria-describedby="overlay-description"
        />
      );
      
      const overlay = screen.getByRole('alert');
      expect(overlay).toHaveAttribute('data-testid', 'broadcast-overlay');
      expect(overlay).toHaveAttribute('aria-describedby', 'overlay-description');
    });

    it('handles empty text prop', () => {
      render(<BroadcastOverlay isVisible={true} text="" />);
      
      const overlay = screen.getByRole('alert');
      expect(overlay).toBeInTheDocument();
      expect(overlay.textContent).toBe('');
    });
  });

  describe('Lifecycle Management', () => {
    it('cleans up timers when unmounted', () => {
      const { unmount } = render(
        <BroadcastOverlay 
          {...defaultProps} 
          autoHide={true}
          autoHideDelay={5000}
        />
      );
      
      unmount();
      
      // Advancing time should not cause any errors
      vi.advanceTimersByTime(10000);
    });

    it('resets state when visibility changes', async () => {
      const { container, rerender } = render(
        <BroadcastOverlay {...defaultProps} />
      );
      
      // Activate
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(container.firstChild).toHaveClass('active');
      });
      
      // Hide
      rerender(<BroadcastOverlay {...defaultProps} isVisible={false} />);
      expect(container.firstChild).not.toHaveClass('active');
      
      // Show again
      rerender(<BroadcastOverlay {...defaultProps} isVisible={true} />);
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(container.firstChild).toHaveClass('active');
      });
    });
  });

  describe('CSS Classes Structure', () => {
    it('has correct DOM structure', () => {
      const { container } = render(<BroadcastOverlay {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay.className).toContain('lowerThird');
      
      const track = overlay.firstChild;
      expect(track.className).toContain('lowerThirdTrack');
      
      const text = track.firstChild;
      expect(text.className).toContain('lowerThirdText');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid visibility changes', async () => {
      const onShow = vi.fn();
      const onHide = vi.fn();
      
      const { rerender } = render(
        <BroadcastOverlay 
          isVisible={false} 
          text="Test"
          onShow={onShow}
          onHide={onHide}
        />
      );
      
      // Rapidly toggle visibility
      rerender(
        <BroadcastOverlay 
          isVisible={true} 
          text="Test"
          onShow={onShow}
          onHide={onHide}
        />
      );
      
      rerender(
        <BroadcastOverlay 
          isVisible={false} 
          text="Test"
          onShow={onShow}
          onHide={onHide}
        />
      );
      
      vi.advanceTimersByTime(100);
      
      expect(onHide).toHaveBeenCalledTimes(2);
    });

    it('handles missing callback props gracefully', () => {
      expect(() => {
        render(<BroadcastOverlay {...defaultProps} />);
        vi.advanceTimersByTime(100);
      }).not.toThrow();
    });
  });
});