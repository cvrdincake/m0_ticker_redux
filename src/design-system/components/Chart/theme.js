/**
 * Chart Theme - Monochrome design system theme for Recharts/D3
 */

export const chartTheme = {
  series: [
    { 
      stroke: '#ffffff', 
      strokeWidth: 2, 
      fill: 'rgba(255,255,255,0.1)',
      strokeDasharray: '0'
    },
    { 
      stroke: '#a3a3a3', 
      strokeWidth: 2, 
      fill: 'rgba(163,163,163,0.08)', 
      strokeDasharray: '4 2' 
    },
    { 
      stroke: '#737373', 
      strokeWidth: 1.5, 
      fill: 'none', 
      strokeDasharray: '8 4' 
    },
    { 
      stroke: '#ffffff', 
      strokeWidth: 1, 
      fill: 'none', 
      strokeDasharray: '2 2' 
    },
    { 
      stroke: '#a3a3a3', 
      strokeWidth: 1, 
      fill: 'none', 
      strokeDasharray: '6 3' 
    }
  ],
  grid: { 
    stroke: 'var(--border)', 
    strokeWidth: 1 
  },
  axis: { 
    stroke: 'var(--border-strong)', 
    tick: { 
      fill: 'var(--ink-subtle)', 
      fontSize: 10,
      fontFamily: 'var(--font-body)'
    }, 
    label: { 
      fill: 'var(--ink-muted)', 
      fontSize: 11, 
      fontWeight: 600 
    },
    axisLine: { 
      stroke: 'var(--border-strong)' 
    }
  },
  tooltip: { 
    background: 'var(--surface-strong)', 
    border: '1px solid var(--border-strong)', 
    borderRadius: 'var(--radius-sm)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    color: 'var(--ink)',
    fontSize: '11px',
    fontFamily: 'var(--font-body)'
  }
};

/**
 * Apply monochrome theme to Recharts component props
 * @param {Object} baseProps - Base component props
 * @param {number} seriesIndex - Series index for styling
 * @returns {Object} Props with applied theme
 */
export const applyMonochromeTheme = (baseProps = {}, seriesIndex = 0) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seriesStyle = chartTheme.series[seriesIndex % chartTheme.series.length];
  
  return {
    ...baseProps,
    // Apply series styling
    ...seriesStyle,
    // Animation settings
    animationDuration: reducedMotion ? 0 : 600,
    animationEasing: 'ease-out',
    // Disable animation for reduced motion
    isAnimationActive: !reducedMotion
  };
};

/**
 * Get grid theme props
 * @returns {Object} Grid configuration
 */
export const getGridTheme = () => chartTheme.grid;

/**
 * Get axis theme props
 * @returns {Object} Axis configuration
 */
export const getAxisTheme = () => chartTheme.axis;

/**
 * Get tooltip theme props
 * @returns {Object} Tooltip configuration
 */
export const getTooltipTheme = () => ({
  contentStyle: {
    background: chartTheme.tooltip.background,
    border: chartTheme.tooltip.border,
    borderRadius: chartTheme.tooltip.borderRadius,
    boxShadow: chartTheme.tooltip.boxShadow,
    color: chartTheme.tooltip.color,
    fontSize: chartTheme.tooltip.fontSize,
    fontFamily: chartTheme.tooltip.fontFamily
  },
  cursor: { 
    stroke: 'var(--border-strong)', 
    strokeWidth: 1, 
    strokeDasharray: '4 4' 
  },
  animationDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120
});

/**
 * Create stroke-dashoffset animation for path drawing
 * @param {SVGPathElement} pathElement - SVG path element
 * @param {number} duration - Animation duration in ms
 */
export const animatePathDraw = (pathElement, duration = 600) => {
  if (!pathElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const pathLength = pathElement.getTotalLength();
  
  // Set initial state
  pathElement.style.strokeDasharray = pathLength;
  pathElement.style.strokeDashoffset = pathLength;
  
  // Animate stroke-dashoffset to 0
  pathElement.animate([
    { strokeDashoffset: pathLength },
    { strokeDashoffset: 0 }
  ], {
    duration,
    easing: 'ease-out',
    fill: 'forwards'
  });
};

export default chartTheme;