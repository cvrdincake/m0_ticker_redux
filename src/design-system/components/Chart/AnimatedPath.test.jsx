import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AnimatedPath } from './AnimatedPath';

// Mock GSAP and motion guard
const mockGsap = {
  to: vi.fn(),
  set: vi.fn(),
};

vi.mock('@/lib/motionGuard', () => ({
  getGSAP: vi.fn(() => mockGsap),
  shouldUseMotion: vi.fn(() => true),
}));

import { getGSAP, shouldUseMotion } from '@/lib/motionGuard';

// Mock getTotalLength method
const mockGetTotalLength = vi.fn(() => 100);

// Mock path element
Object.defineProperty(SVGPathElement.prototype, 'getTotalLength', {
  value: mockGetTotalLength,
  writable: true,
});

describe('AnimatedPath', () => {
  const defaultProps = {
    d: 'M 10 10 L 90 90',
    stroke: 'var(--ink)',
    strokeWidth: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    shouldUseMotion.mockReturnValue(true);
    getGSAP.mockReturnValue(mockGsap);
    mockGetTotalLength.mockReturnValue(100);
    
    // Mock console.warn
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders path element with correct attributes', () => {
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('d', defaultProps.d);
    expect(path).toHaveAttribute('stroke', defaultProps.stroke);
    expect(path).toHaveAttribute('stroke-width', '2');
    expect(path).toHaveAttribute('fill', 'none');
  });

  it('sets up animation when motion is enabled', () => {
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    
    // Should call getTotalLength
    expect(mockGetTotalLength).toHaveBeenCalled();
    
    // Should animate with GSAP
    expect(mockGsap.to).toHaveBeenCalledWith(path, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  it('skips animation when reduced motion is enabled', () => {
    shouldUseMotion.mockReturnValue(false);
    
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    
    // Should still call getTotalLength for setup
    expect(mockGetTotalLength).toHaveBeenCalled();
    
    // Should not animate with GSAP
    expect(mockGsap.to).not.toHaveBeenCalled();
    
    // Should show path immediately
    expect(path.style.strokeDashoffset).toBe('0');
  });

  it('handles custom duration and easing', () => {
    const { container } = render(
      <svg>
        <AnimatedPath 
          {...defaultProps} 
          duration={1.2}
          ease="bounce.out"
        />
      </svg>
    );

    const path = container.querySelector('path');
    
    expect(mockGsap.to).toHaveBeenCalledWith(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'bounce.out',
    });
  });

  it('falls back gracefully when GSAP is unavailable', () => {
    getGSAP.mockReturnValue(null);
    
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    
    // Should not attempt GSAP animation
    expect(mockGsap.to).not.toHaveBeenCalled();
    
    // Should show path immediately as fallback
    expect(path.style.strokeDashoffset).toBe('0');
  });

  it('handles empty or invalid path gracefully', () => {
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} d="" />
      </svg>
    );

    // Should not call getTotalLength for empty path
    expect(mockGetTotalLength).not.toHaveBeenCalled();
    
    // Should not attempt animation
    expect(mockGsap.to).not.toHaveBeenCalled();
  });

  it('handles getTotalLength errors gracefully', () => {
    mockGetTotalLength.mockImplementation(() => {
      throw new Error('Invalid path');
    });
    
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    
    // Should log warning
    expect(console.warn).toHaveBeenCalledWith(
      'AnimatedPath: Unable to calculate path length',
      expect.any(Error)
    );
    
    // Should reset dash properties
    expect(path.style.strokeDasharray).toBe('none');
    expect(path.style.strokeDashoffset).toBe('0');
  });

  it('resets animation state when path data changes', () => {
    const { container, rerender } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    
    // Initial render should set up animation
    expect(mockGsap.to).toHaveBeenCalledTimes(1);
    
    // Change path data
    rerender(
      <svg>
        <AnimatedPath {...defaultProps} d="M 20 20 L 80 80" />
      </svg>
    );
    
    // Should clear existing animation state
    expect(path.style.strokeDasharray).toBe('');
    expect(path.style.strokeDashoffset).toBe('');
    
    // Should set up new animation
    expect(mockGsap.to).toHaveBeenCalledTimes(2);
  });

  it('applies custom className and additional props', () => {
    const { container } = render(
      <svg>
        <AnimatedPath 
          {...defaultProps} 
          className="custom-path"
          data-testid="animated-path"
        />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path).toHaveClass('custom-path');
    expect(path).toHaveAttribute('data-testid', 'animated-path');
  });

  it('sets willChange style when motion is enabled', () => {
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path.style.willChange).toBe('stroke-dashoffset');
  });

  it('sets willChange to auto when motion is disabled', () => {
    shouldUseMotion.mockReturnValue(false);
    
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path.style.willChange).toBe('auto');
  });

  it('guards against SSR issues', () => {
    // Mock window as undefined (SSR environment)
    const originalWindow = global.window;
    delete global.window;
    
    const { container } = render(
      <svg>
        <AnimatedPath {...defaultProps} />
      </svg>
    );

    // Should render without errors
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    
    // Should not attempt any DOM operations
    expect(mockGetTotalLength).not.toHaveBeenCalled();
    expect(mockGsap.to).not.toHaveBeenCalled();
    
    // Restore window
    global.window = originalWindow;
  });

  it('renders snapshot correctly', () => {
    const { container } = render(
      <svg viewBox="0 0 100 100">
        <AnimatedPath 
          d="M 10 10 Q 50 5 90 10 T 90 50"
          stroke="var(--ink)"
          strokeWidth={3}
          className="test-path"
        />
      </svg>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});