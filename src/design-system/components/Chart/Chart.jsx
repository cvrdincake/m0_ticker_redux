import { forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReducedMotion } from '@/hooks';
import styles from './Chart.module.css';

const CHART_THEME = {
  grid: { stroke: '#1a1a1a', strokeWidth: 1 },
  axis: {
    stroke: '#2e2e2e',
    tick: { fill: '#737373', fontSize: 10, fontFamily: 'Inter' },
    axisLine: { stroke: '#2e2e2e' }
  },
  tooltip: {
    contentStyle: {
      background: '#000',
      border: '1px solid #242424',
      borderRadius: '2px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      color: '#d4d4d4',
      fontSize: '11px',
      fontFamily: 'Inter'
    },
    cursor: { stroke: '#404040', strokeWidth: 1, strokeDasharray: '4 4' }
  }
};

const SERIES_STYLES = [
  { stroke: '#ffffff', strokeWidth: 2, fill: 'rgba(255,255,255,0.1)', strokeDasharray: '0' },
  { stroke: '#a3a3a3', strokeWidth: 2, fill: 'rgba(163,163,163,0.08)', strokeDasharray: '4 2' },
  { stroke: '#737373', strokeWidth: 1.5, fill: 'none', strokeDasharray: '8 4' },
  { stroke: '#ffffff', strokeWidth: 1, fill: 'none', strokeDasharray: '2 2' },
  { stroke: '#a3a3a3', strokeWidth: 1, fill: 'none', strokeDasharray: '6 3' }
];

/**
 * Chart - Monochrome data visualization component
 * @param {Array} data - Chart data array
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message
 * @param {string} dataKey - Key for x-axis data
 * @param {string} valueKey - Key for y-axis data
 */
export const Chart = forwardRef(({
  data = [],
  title,
  height = 300,
  loading = false,
  error,
  dataKey = 'name',
  valueKey = 'value',
  className = '',
  style = {},
  ...props
}, ref) => {
  const reducedMotion = useReducedMotion();

  const chartStyle = {
    ...style,
    ...(height && { height: `${height}px` })
  };

  if (loading) {
    return (
      <div ref={ref} className={`${styles.chart} ${className}`} style={chartStyle} {...props}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <div className={styles.chartContainer}>
          <div className={styles.chartLoading}>Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={ref} className={`${styles.chart} ${className}`} style={chartStyle} {...props}>
        {title && <div className={styles.chartTitle}>{title}</div>}
        <div className={styles.chartContainer}>
          <div className={styles.chartError}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`${styles.chart} ${className}`} style={chartStyle} {...props}>
      {title && <div className={styles.chartTitle}>{title}</div>}
      <div className={styles.chartContainer} data-testid="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid {...CHART_THEME.grid} />
            <XAxis 
              dataKey={dataKey}
              {...CHART_THEME.axis}
            />
            <YAxis {...CHART_THEME.axis} />
            <Tooltip {...CHART_THEME.tooltip} />
            
            <Line
              type="monotone"
              dataKey={valueKey}
              animationDuration={reducedMotion ? 0 : 600}
              animationEasing="ease-out"
              {...SERIES_STYLES[0]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

Chart.displayName = 'Chart';

export default Chart;