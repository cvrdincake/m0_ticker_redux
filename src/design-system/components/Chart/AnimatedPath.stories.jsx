import { AnimatedPath } from './AnimatedPath';

export default {
  title: 'Components/Chart/AnimatedPath',
  component: AnimatedPath,
  decorators: [
    (Story) => (
      <div style={{ 
        width: '400px', 
        height: '300px', 
        padding: '1rem',
        background: 'var(--surface-canvas)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius)'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          <Story />
        </svg>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Animated SVG path with draw-on animation using GSAP. Respects reduced-motion preferences.',
      },
    },
  },
};

// Sample path data
const simpleLine = "M 20 50 L 100 30 L 180 80 L 260 40 L 340 70";
const curvePath = "M 20 100 Q 100 50 180 100 T 340 80";
const complexPath = "M 20 120 C 20 120, 50 60, 100 100 S 180 140, 220 100 C 260 60, 300 140, 340 100";
const zigzagPath = "M 20 80 L 60 40 L 100 80 L 140 40 L 180 80 L 220 40 L 260 80 L 300 40 L 340 80";

export const Default = {
  args: {
    d: simpleLine,
    stroke: 'var(--ink)',
    strokeWidth: 2,
  },
};

export const CurvedPath = {
  args: {
    d: curvePath,
    stroke: 'var(--ink-soft)',
    strokeWidth: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Smooth curved path using quadratic Bézier curves.',
      },
    },
  },
};

export const ComplexPath = {
  args: {
    d: complexPath,
    stroke: 'var(--ink)',
    strokeWidth: 2,
    duration: 1.2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex path with cubic Bézier curves and longer animation duration.',
      },
    },
  },
};

export const ZigzagPattern = {
  args: {
    d: zigzagPath,
    stroke: 'var(--ink-muted)',
    strokeWidth: 1.5,
    duration: 0.8,
    ease: 'power3.out',
  },
  parameters: {
    docs: {
      description: {
        story: 'Zigzag pattern with custom easing and faster duration.',
      },
    },
  },
};

export const ThickStroke = {
  args: {
    d: simpleLine,
    stroke: 'var(--ink)',
    strokeWidth: 6,
    duration: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Thick stroke width with fast animation for bold effects.',
      },
    },
  },
};

export const SubtleStroke = {
  args: {
    d: curvePath,
    stroke: 'var(--ink-subtle)',
    strokeWidth: 1,
    duration: 0.9,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle stroke using muted colour for background elements.',
      },
    },
  },
};

// Multiple paths in one SVG
export const MultiplePaths = {
  render: () => (
    <svg width="100%" height="100%" viewBox="0 0 400 200">
      <AnimatedPath 
        d="M 20 50 Q 100 20 180 50 T 340 30"
        stroke="var(--ink)"
        strokeWidth={2}
        duration={0.8}
      />
      <AnimatedPath 
        d="M 20 100 Q 100 70 180 100 T 340 80"
        stroke="var(--ink-soft)"
        strokeWidth={2}
        duration={1.0}
      />
      <AnimatedPath 
        d="M 20 150 Q 100 120 180 150 T 340 130"
        stroke="var(--ink-muted)"
        strokeWidth={1.5}
        duration={1.2}
      />
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple animated paths with staggered timing and different stroke styles.',
      },
    },
  },
};

// Reduced motion story
export const ReducedMotion = {
  args: {
    d: complexPath,
    stroke: 'var(--ink)',
    strokeWidth: 2,
  },
  decorators: [
    (Story) => (
      <div 
        className="reduce-motion"
        style={{ 
          width: '400px', 
          height: '300px', 
          padding: '1rem',
          background: 'var(--surface-canvas)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--border-radius)'
        }}
      >
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--ink-subtle)', 
          marginBottom: '1rem',
          fontFamily: 'var(--font-mono)'
        }}>
          Reduced motion enabled - path appears instantly
        </p>
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          <Story />
        </svg>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'With reduced motion enabled, the path appears instantly without animation.',
      },
    },
  },
};

export const ErrorHandling = {
  args: {
    d: "", // Empty path
    stroke: 'var(--ink)',
    strokeWidth: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Graceful handling of invalid or empty path data.',
      },
    },
  },
};