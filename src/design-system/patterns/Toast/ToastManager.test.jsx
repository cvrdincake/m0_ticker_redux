import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastManager';

// Mock GSAP and motion system
vi.mock('@/lib/motionGuard', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn()
  },
  getMotionTokens: () => ({
    durations: { base: 200, fast: 100 },
    eases: { out: 'ease-out', in: 'ease-in' }
  }),
  isMotionReduced: vi.fn(() => false)
}));

// Test component to interact with toasts
function ToastTestComponent() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast('Test message', 1000)}>Add Toast</button>
      <button onClick={() => addToast('Long message', 5000)}>Add Long Toast</button>
    </div>
  );
}

describe('ToastManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.documentElement.classList.remove('reduce-motion');
  });

  it('renders toast provider with correct A11Y attributes', () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-atomic', 'true');
  });

  it('adds and displays toasts', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    const toast = screen.getByRole('button', { name: /test message/i });
    expect(toast).toHaveAttribute('tabIndex', '0');
  });

  it('auto-dismisses toasts after duration', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  it('dismisses toast on click', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    const toast = screen.getByRole('button', { name: /test message/i });
    fireEvent.click(toast);
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  it('dismisses toast with keyboard (Enter/Space)', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    const toast = screen.getByRole('button', { name: /test message/i });
    toast.focus();
    
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  it('pauses auto-dismiss on hover and resumes on mouse leave', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    await user.click(addButton);
    
    const toast = await screen.findByRole('button', { name: /test message/i });
    
    // Hover to pause
    await user.hover(toast);
    
    // Advance time - should not dismiss while hovered
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    // Unhover to resume
    await user.unhover(toast);
    
    // Now it should dismiss
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  it('respects queue cap of 4 toasts', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByText('Add Toast');
    
    // Add 6 toasts rapidly
    for (let i = 0; i < 6; i++) {
      fireEvent.click(addButton);
    }
    
    await waitFor(() => {
      const toasts = screen.getAllByText('Test message');
      expect(toasts).toHaveLength(4); // Only 4 should be shown
    });
  });

  describe('Reduced Motion', () => {
    beforeEach(() => {
      const { isMotionReduced } = require('@/lib/motionGuard');
      isMotionReduced.mockReturnValue(true);
    });

    it('uses fade-only animation in reduced motion', async () => {
      const { gsap } = require('@/lib/motionGuard');
      
      render(
        <ToastProvider>
          <ToastTestComponent />
        </ToastProvider>
      );
      
      const addButton = screen.getByText('Add Toast');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
      
      // Should use fade animation only (no x transform)
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        { opacity: 0 },
        expect.objectContaining({
          opacity: 1,
          duration: expect.any(Number)
        })
      );
    });
  });

  describe('Visibility Pause', () => {
    it('pauses on document hidden and resumes on visible', async () => {
      render(
        <ToastProvider>
          <ToastTestComponent />
        </ToastProvider>
      );
      
      const addButton = screen.getByText('Add Toast');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
      
      // Simulate document hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true
      });
      
      fireEvent(document, new Event('visibilitychange'));
      
      // Advance time - should not dismiss while hidden
      act(() => {
        vi.advanceTimersByTime(1200);
      });
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      
      // Simulate document visible
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false
      });
      
      fireEvent(document, new Event('visibilitychange'));
      
      // Now should resume and dismiss
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      });
    });
  });

  describe('SSR Safety', () => {
    it('renders safely on server', () => {
      const originalWindow = global.window;
      delete global.window;
      
      render(
        <ToastProvider>
          <ToastTestComponent />
        </ToastProvider>
      );
      
      const container = screen.getByRole('status');
      expect(container).toBeInTheDocument();
      
      global.window = originalWindow;
    });
  });

  it('throws error when useToast used outside provider', () => {
    const TestComponent = () => {
      useToast(); // This should throw
      return <div>Test</div>;
    };
    
    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });
});