import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PopupAlert } from './PopupAlert.jsx';

// Mock ReactDOM.createPortal for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children) => children
  };
});

// Mock motionGuard
vi.mock('@/lib/motionGuard', () => ({
  getGSAP: vi.fn(() => ({
    to: vi.fn((target, options) => {
      // Call onComplete immediately for tests
      setTimeout(() => options.onComplete?.(), 0);
    }),
    fromTo: vi.fn((target, fromOptions, toOptions) => {
      // Call onComplete immediately for tests
      setTimeout(() => toOptions.onComplete?.(), 0);
    }),
  })),
  shouldUseMotion: vi.fn(() => true),
}));

describe('PopupAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders when active is true', () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.getByTestId('popup-alert')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('does not render when active is false', () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={false}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.queryByTestId('popup-alert')).not.toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          icon={<TestIcon />}
          active={true}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('has correct accessibility attributes', () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      const alert = screen.getByTestId('popup-alert');
      expect(alert).toHaveAttribute('role', 'alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('has correct CSS classes for entering state', () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      const alert = screen.getByTestId('popup-alert');
      expect(alert.className).toContain('popupAlertEntering');
    });
  });

  describe('Auto-dismiss functionality', () => {
    it('calls onDismiss after duration', async () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          duration={2000}
          onDismiss={mockOnDismiss}
        />
      );

      // Fast-forward time by duration in act()
      await act(async () => {
        vi.advanceTimersByTime(2000);
        await waitFor(() => {
          expect(mockOnDismiss).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('does not auto-dismiss when duration is 0', async () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          duration={0}
          onDismiss={mockOnDismiss}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('does not auto-dismiss when onDismiss is not provided', async () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          duration={2000}
        />
      );

      // Should not throw error
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
    });
  });

  describe('Hover pause functionality', () => {
    it('pauses timer on mouse enter and resumes on mouse leave', async () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          duration={2000}
          onDismiss={mockOnDismiss}
        />
      );

      const alert = screen.getByTestId('popup-alert');

      await act(async () => {
        // Advance halfway through duration
        vi.advanceTimersByTime(1000);

        // Hover - should pause timer
        fireEvent.mouseEnter(alert);
        
        // Advance past original duration - should not dismiss
        vi.advanceTimersByTime(2000);
      });
      
      expect(mockOnDismiss).not.toHaveBeenCalled();

      await act(async () => {
        // Mouse leave - should resume timer with remaining time
        fireEvent.mouseLeave(alert);
        
        // Advance by remaining time (1000ms) + exit animation
        vi.advanceTimersByTime(1000);
        
        await waitFor(() => {
          expect(mockOnDismiss).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('Keyboard interaction', () => {
    it('dismisses on Escape key', async () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={mockOnDismiss}
        />
      );

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
        
        // Wait for exit animation
        await waitFor(() => {
          expect(mockOnDismiss).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('does not dismiss on other keys', () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={mockOnDismiss}
        />
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab' });

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('only responds to Escape when active', () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={false}
          onDismiss={mockOnDismiss}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Dismiss button', () => {
    it('calls onDismiss when dismiss button is clicked', async () => {
      const mockOnDismiss = vi.fn();
      
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={mockOnDismiss}
        />
      );

      const dismissButton = screen.getByLabelText('Dismiss alert');
      
      await act(async () => {
        fireEvent.click(dismissButton);

        await waitFor(() => {
          expect(mockOnDismiss).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('has correct accessibility attributes', () => {
      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      const dismissButton = screen.getByLabelText('Dismiss alert');
      expect(dismissButton).toHaveAttribute('type', 'button');
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
    });
  });

  describe('State transitions', () => {
    it('changes from entering to exiting state when dismissed', async () => {
      const mockOnDismiss = vi.fn();
      
      const { rerender } = render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={mockOnDismiss}
        />
      );

      const alert = screen.getByTestId('popup-alert');
      expect(alert.className).toContain('popupAlertEntering');

      // Trigger dismiss by changing active to false
      await act(async () => {
        rerender(
          <PopupAlert
            title="Test Title"
            message="Test message"
            active={false}
            onDismiss={mockOnDismiss}
          />
        );

        await waitFor(() => {
          expect(alert.className).toContain('popupAlertExiting');
        });
      });
    });

    it('cleans up timers when unmounted', async () => {
      const mockOnDismiss = vi.fn();
      
      const { unmount } = render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          duration={2000}
          onDismiss={mockOnDismiss}
        />
      );

      // Unmount immediately before timer triggers
      unmount();

      // Advance past duration - should not call onDismiss since component is unmounted
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Reduced motion', () => {
    it('applies reduced motion styles when preference is set', () => {
      // Mock reduced motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      const alert = screen.getByTestId('popup-alert');
      expect(alert).toBeInTheDocument();
      // Note: Testing actual CSS animation behavior would require a more sophisticated test environment
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for default state', () => {
      const { container } = render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          active={true}
          onDismiss={vi.fn()}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with icon', () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      
      const { container } = render(
        <PopupAlert
          title="Test Title"
          message="Test message"
          icon={<TestIcon />}
          active={true}
          onDismiss={vi.fn()}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for long message', () => {
      const { container } = render(
        <PopupAlert
          title="Long Title"
          message="This is a very long message that should wrap across multiple lines to test the layout and styling of the popup alert component when dealing with longer content."
          active={true}
          onDismiss={vi.fn()}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});