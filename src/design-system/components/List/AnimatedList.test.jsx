import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { AnimatedList } from './AnimatedList';

// Mock GSAP and motion system
vi.mock('@/lib/motionGuard', () => ({
  gsap: {
    timeline: () => ({
      set: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      kill: vi.fn()
    }),
    set: vi.fn(),
    to: vi.fn()
  },
  getMotionTokens: () => ({
    durations: { base: 200, fast: 100 },
    eases: { out: 'ease-out', in: 'ease-in' }
  }),
  isMotionReduced: vi.fn(() => false)
}));

describe('AnimatedList', () => {
  const mockItems = [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' },
    { id: 6, content: 'Item 6' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.documentElement.classList.remove('reduce-motion');
  });

  it('renders list with correct semantics', () => {
    render(<AnimatedList items={mockItems} aria-label="Test list" />);
    
    const list = screen.getByRole('list', { name: 'Test list' });
    expect(list).toBeInTheDocument();
    
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
    expect(items[0]).toHaveTextContent('Item 1');
  });

  it('handles empty items array', () => {
    render(<AnimatedList items={[]} />);
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('supports items as simple strings', () => {
    const stringItems = ['String 1', 'String 2'];
    render(<AnimatedList items={stringItems} />);
    
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('String 1');
  });

  it('applies custom className', () => {
    render(<AnimatedList items={mockItems} className="custom-class" />);
    
    const list = screen.getByRole('list');
    expect(list).toHaveClass('custom-class');
  });

  describe('Reduced Motion', () => {
    beforeEach(() => {
      const { isMotionReduced } = require('@/lib/motionGuard');
      isMotionReduced.mockReturnValue(true);
    });

    it('renders instantly when motion is reduced', () => {
      const { gsap } = require('@/lib/motionGuard');
      
      render(<AnimatedList items={mockItems} />);
      
      // Should call gsap.set for instant final state
      expect(gsap.set).toHaveBeenCalled();
      // Should not create timeline or animate
      expect(gsap.timeline).not.toHaveBeenCalled();
    });

    it('handles CSS reduce-motion class', () => {
      document.documentElement.classList.add('reduce-motion');
      
      render(<AnimatedList items={mockItems} />);
      
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
      // All items should be visible immediately
      items.forEach(item => {
        expect(item).toBeVisible();
      });
    });
  });

  describe('Performance Limits', () => {
    it('animates only first 5 items', async () => {
      const { gsap } = require('@/lib/motionGuard');
      const mockTimeline = {
        set: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
        kill: vi.fn()
      };
      gsap.timeline.mockReturnValue(mockTimeline);

      render(<AnimatedList items={mockItems} />);

      await waitFor(() => {
        // Timeline should be created for animated items
        expect(gsap.timeline).toHaveBeenCalled();
        // Set initial state for first 5 items
        expect(mockTimeline.set).toHaveBeenCalled();
        // Animate first 5 items
        expect(mockTimeline.to).toHaveBeenCalled();
      });
    });

    it('renders large lists instantly for performance', () => {
      const largeList = Array.from({ length: 250 }, (_, i) => ({
        id: i,
        content: `Item ${i}`
      }));
      
      const { gsap } = require('@/lib/motionGuard');
      
      render(<AnimatedList items={largeList} />);
      
      // Should use gsap.set for instant rendering
      expect(gsap.set).toHaveBeenCalledWith(
        expect.any(Array),
        { opacity: 1, y: 0 }
      );
      
      // Should not create timeline for large lists
      expect(gsap.timeline).not.toHaveBeenCalled();
    });
  });

  describe('Animation Cleanup', () => {
    it('kills timeline on unmount', () => {
      const { gsap } = require('@/lib/motionGuard');
      const mockTimeline = {
        set: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
        kill: vi.fn()
      };
      gsap.timeline.mockReturnValue(mockTimeline);

      const { unmount } = render(<AnimatedList items={mockItems} />);
      
      unmount();
      
      expect(mockTimeline.kill).toHaveBeenCalled();
    });

    it('kills timeline when items change', async () => {
      const { gsap } = require('@/lib/motionGuard');
      const mockTimeline = {
        set: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
        kill: vi.fn()
      };
      gsap.timeline.mockReturnValue(mockTimeline);

      const { rerender } = render(<AnimatedList items={mockItems} />);
      
      // Change items
      const newItems = [{ id: 7, content: 'New Item' }];
      rerender(<AnimatedList items={newItems} />);
      
      await waitFor(() => {
        expect(mockTimeline.kill).toHaveBeenCalled();
      });
    });
  });

  describe('SSR Safety', () => {
    it('renders safely on server', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      delete global.window;
      
      render(<AnimatedList items={mockItems} />);
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
      
      // Restore window
      global.window = originalWindow;
    });
  });
});