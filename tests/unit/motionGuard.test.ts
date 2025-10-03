import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as motionGuard from '@/lib/motionGuard';

// Mock GSAP
const mockGsap = {
  defaults: vi.fn(),
  globalTimeline: {
    timeScale: vi.fn(),
    pause: vi.fn(),
    play: vi.fn()
  },
  ticker: {
    sleep: vi.fn(),
    wake: vi.fn()
  }
};

vi.mock('gsap', () => ({
  gsap: mockGsap
}));

// Mock DOM APIs
const mockMatchMedia = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
  
  // Mock window and document
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia
  });
  
  Object.defineProperty(document, 'addEventListener', {
    writable: true,
    value: mockAddEventListener
  });
  
  Object.defineProperty(document, 'removeEventListener', {
    writable: true,
    value: mockRemoveEventListener
  });
  
  Object.defineProperty(document, 'documentElement', {
    writable: true,
    value: {
      classList: {
        toggle: vi.fn()
      }
    }
  });
  
  Object.defineProperty(document, 'hidden', {
    writable: true,
    value: false
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('motionGuard', () => {
  describe('setContext', () => {
    it('sets dashboard context with correct timeScale', () => {
      motionGuard.setContext('dashboard');
      
      expect(mockGsap.globalTimeline.timeScale).toHaveBeenCalledWith(1.5);
      expect(motionGuard.getCurrentContext()).toBe('dashboard');
    });

    it('sets overlay context with correct timeScale', () => {
      motionGuard.setContext('overlay');
      
      expect(mockGsap.globalTimeline.timeScale).toHaveBeenCalledWith(1.0);
      expect(motionGuard.getCurrentContext()).toBe('overlay');
    });

    it('defaults to dashboard context', () => {
      motionGuard.setContext();
      
      expect(mockGsap.globalTimeline.timeScale).toHaveBeenCalledWith(1.5);
      expect(motionGuard.getCurrentContext()).toBe('dashboard');
    });
  });

  describe('applyReducedMotion', () => {
    it('enables reduced motion by pausing timeline and sleeping ticker', () => {
      motionGuard.applyReducedMotion(true);
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('reduce-motion', true);
      expect(mockGsap.globalTimeline.pause).toHaveBeenCalledWith(0, true);
      expect(mockGsap.ticker.sleep).toHaveBeenCalled();
    });

    it('disables reduced motion by waking ticker and playing timeline', () => {
      motionGuard.applyReducedMotion(false);
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('reduce-motion', false);
      expect(mockGsap.ticker.wake).toHaveBeenCalled();
      expect(mockGsap.globalTimeline.play).toHaveBeenCalled();
    });
  });

  describe('initMotion', () => {
    it('initialises with dashboard context by default', () => {
      const mockMql = {
        matches: false,
        addEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      const disposal = motionGuard.initMotion();
      
      expect(mockGsap.globalTimeline.timeScale).toHaveBeenCalledWith(1.5);
      expect(mockGsap.defaults).toHaveBeenCalledWith({
        duration: 0.2,
        ease: 'power2.out'
      });
      expect(mockAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
      expect(disposal.dispose).toBeDefined();
    });

    it('initialises with specified context', () => {
      const mockMql = {
        matches: false,
        addEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      motionGuard.initMotion({ context: 'overlay' });
      
      expect(mockGsap.globalTimeline.timeScale).toHaveBeenCalledWith(1.0);
    });

    it('applies reduced motion if preferred', () => {
      const mockMql = {
        matches: true,
        addEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      motionGuard.initMotion();
      
      expect(mockGsap.globalTimeline.pause).toHaveBeenCalledWith(0, true);
      expect(mockGsap.ticker.sleep).toHaveBeenCalled();
    });

    it('returns disposal function that removes listeners', () => {
      const mockMql = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      const disposal = motionGuard.initMotion();
      disposal.dispose();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
      expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('visibility handling', () => {
    it('sleeps ticker when page becomes hidden', () => {
      const mockMql = {
        matches: false,
        addEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      motionGuard.initMotion();
      
      // Get the visibility change handler
      const visibilityHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'visibilitychange'
      )[1];
      
      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', { value: true });
      visibilityHandler();
      
      expect(mockGsap.ticker.sleep).toHaveBeenCalled();
      expect(mockGsap.globalTimeline.pause).toHaveBeenCalled();
    });

    it('wakes ticker when page becomes visible', () => {
      const mockMql = {
        matches: false,
        addEventListener: vi.fn()
      };
      mockMatchMedia.mockReturnValue(mockMql);
      
      motionGuard.initMotion();
      
      // Get the visibility change handler
      const visibilityHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'visibilitychange'
      )[1];
      
      // Simulate page becoming visible
      Object.defineProperty(document, 'hidden', { value: false });
      visibilityHandler();
      
      expect(mockGsap.ticker.wake).toHaveBeenCalled();
      expect(mockGsap.globalTimeline.play).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('ensures no duplicate AnimatedList exports', () => {
      // This test verifies the design system structure
      expect(() => {
        require('@/design-system/components/List');
      }).not.toThrow();
    });
  });
});