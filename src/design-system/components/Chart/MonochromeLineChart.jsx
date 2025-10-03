import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Tokenised monochrome chart theme
 * All colours sourced from design tokens for consistency
 */
const CHART_THEME = {
  grid: { 
    stroke: 'var(--border-soft)', 
    strokeWidth: 1 
  },
  axis: {
    stroke: 'var(--border-strong)',
    tick: { 
      fill: 'var(--ink-subtle)', 
      fontSize: 10, 
      fontFamily: 'var(--font-mono)' 
    },
    axisLine: { stroke: 'var(--border-strong)' }
  },
  tooltip: {
    contentStyle: {
      background: 'var(--surface-strong)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--border-radius)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
      color: 'var(--ink-soft)',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      padding: 'var(--space-2)'
    },
    cursor: { 
      stroke: 'var(--border-strong)', 
      strokeWidth: 1, 
      strokeDasharray: '4 4' 
    }
  }
};

/**
 * Monochrome series styles using design tokens
 * Limited to 5 series with differentiation via dash patterns
 */
const SERIES_STYLES = [
  { 
    stroke: 'var(--ink)', 
    strokeWidth: 2, 
    fill: 'rgba(255, 255, 255, 0.1)', 
    strokeDasharray: '0' 
  },
  { 
    stroke: 'var(--ink-soft)', 
    strokeWidth: 2, 
    fill: 'rgba(163, 163, 163, 0.08)', 
    strokeDasharray: '4 2' 
  },
  { 
    stroke: 'var(--ink-muted)', 
    strokeWidth: 1.5, 
    fill: 'none', 
    strokeDasharray: '8 4' 
  },
  { 
    stroke: 'var(--ink)', 
    strokeWidth: 1, 
    fill: 'none', 
    strokeDasharray: '2 2' 
  },
  { 
    stroke: 'var(--ink-soft)', 
    strokeWidth: 1, 
    fill: 'none', 
    strokeDasharray: '6 3' 
  }
];

/**
 * MonochromeLineChart - Production-ready chart with strict monochrome theming
 * 
 * Features:
 * - Tokenised monochrome colour scheme
 * - Reduced-motion compliance (disables animations)
 * - Performance guards for large datasets (>5000 points)
 * - Max 5 styled series with differentiation via dash patterns
 * - SSR-safe with proper guards
 * - Accessible with ARIA labels and high contrast
 * - Customizable formatters and domains
 */
export const MonochromeLineChart = memo(({
  data = [],
  series = [],
  height = 300,
  yDomain,
  xTickFormatter,
  yTickFormatter,
  tooltipFormatter,
  grid = true,
  'aria-label': ariaLabel = 'Line chart',
  'aria-description': ariaDescription,
  ...props
}) => {
  const reducedMotion = useReducedMotion();
  
  // Performance guard: disable markers and animation for large datasets
  const isLargeDataset = data.length > 5000;
  const animationDuration = reducedMotion || isLargeDataset ? 0 : 600;
  
  // Limit to 5 series maximum for styling consistency
  const limitedSeries = series.slice(0, 5);
  
  // Warn about performance for very large datasets
  if (data.length > 10000) {
    console.warn('MonochromeLineChart: Consider downsampling data for datasets >10k points for optimal performance');
  }

  // Handle empty data gracefully
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--surface-canvas)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--border-radius)',
          color: 'var(--ink-subtle)',
          font: 'var(--text-sm)',
          fontFamily: 'var(--font-mono)'
        }}
        role="img"
        aria-label={ariaLabel}
        aria-description={ariaDescription || 'No data available'}
      >
        No data available
      </div>
    );
  }

  return (
    <div 
      role="img"
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      style={{ width: '100%', height }}
      {...props}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart 
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          {grid && <CartesianGrid {...CHART_THEME.grid} />}
          
          <XAxis 
            dataKey="x"
            tickFormatter={xTickFormatter}
            domain={yDomain}
            {...CHART_THEME.axis}
          />
          
          <YAxis 
            tickFormatter={yTickFormatter}
            domain={yDomain}
            {...CHART_THEME.axis}
          />
          
          <Tooltip 
            formatter={tooltipFormatter}
            labelStyle={{ color: 'var(--ink-soft)' }}
            {...CHART_THEME.tooltip}
          />
          
          {limitedSeries.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              dot={isLargeDataset ? false : undefined}
              activeDot={isLargeDataset ? false : { r: 3, stroke: 'var(--ink)' }}
              {...SERIES_STYLES[i % SERIES_STYLES.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MonochromeLineChart.displayName = 'MonochromeLineChart';