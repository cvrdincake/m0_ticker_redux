import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import styles from './Chart.module.css';

const CHART_THEME = {
  grid: { 
    stroke: 'var(--divider)', 
    strokeWidth: 1 
  },
  axis: {
    stroke: 'var(--border)',
    tick: { 
      fill: 'var(--ink-subtle)', 
      fontSize: 10, 
      fontFamily: 'var(--font-family-mono)' 
    },
    axisLine: { stroke: 'var(--border)' }
  },
  tooltip: {
    contentStyle: {
      background: 'var(--surface-strong)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-base)',
      boxShadow: 'var(--shadow-lg)',
      color: 'var(--ink)',
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-family-mono)'
    },
    cursor: { 
      stroke: 'var(--ink-subtle)', 
      strokeWidth: 1, 
      strokeDasharray: '4 4' 
    }
  }
};

const SERIES_STYLES = [
  { 
    stroke: 'var(--ink)', 
    strokeWidth: 2, 
    fill: 'var(--halo)', 
    strokeDasharray: '0' 
  },
  { 
    stroke: 'var(--ink-muted)', 
    strokeWidth: 2, 
    fill: 'rgba(163,163,163,0.04)', 
    strokeDasharray: '4 2' 
  },
  { 
    stroke: 'var(--ink-subtle)', 
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
    stroke: 'var(--ink-muted)', 
    strokeWidth: 1, 
    fill: 'none', 
    strokeDasharray: '6 3' 
  }
];

const Chart = ({ 
  data, 
  series, 
  height = 300,
  className,
  ...props 
}) => {
  const reducedMotion = useReducedMotion();
  
  return (
    <div className={cn(styles.chartContainer, className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid {...CHART_THEME.grid} />
          <XAxis 
            dataKey="x" 
            {...CHART_THEME.axis}
          />
          <YAxis {...CHART_THEME.axis} />
          <Tooltip {...CHART_THEME.tooltip} />
          
          {series.slice(0, 5).map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              animationDuration={reducedMotion ? 0 : 600}
              animationEasing="ease-out"
              {...SERIES_STYLES[i % SERIES_STYLES.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { Chart };