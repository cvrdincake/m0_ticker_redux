// components/Chart/MonochromeLineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_THEME = {
  grid: { stroke: 'var(--border-subtle)', strokeWidth: 1 },
  axis: {
    stroke: 'var(--border)',
    tick: { fill: 'var(--ink-subtle)', fontSize: 10, fontFamily: 'Inter' },
    axisLine: { stroke: 'var(--border)' }
  },
  tooltip: {
    contentStyle: {
      background: 'var(--surface-deep)',
      border: '1px solid var(--border)',
      borderRadius: '2px',
      boxShadow: 'var(--shadow-lg)',
      color: 'var(--ink-muted)',
      fontSize: '11px',
      fontFamily: 'Inter'
    },
    cursor: { stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '4 4' }
  }
};

const SERIES_STYLES = [
  { stroke: 'var(--surface)', strokeWidth: 2, fill: 'var(--surface-alpha-10)', strokeDasharray: '0' },
  { stroke: 'var(--ink-muted)', strokeWidth: 2, fill: 'var(--ink-alpha-08)', strokeDasharray: '4 2' },
  { stroke: 'var(--ink-subtle)', strokeWidth: 1.5, fill: 'none', strokeDasharray: '8 4' },
  { stroke: 'var(--surface)', strokeWidth: 1, fill: 'none', strokeDasharray: '2 2' },
  { stroke: 'var(--ink-muted)', strokeWidth: 1, fill: 'none', strokeDasharray: '6 3' }
];

export function MonochromeLineChart({ data, series, height = 300 }) {
  const reducedMotion = useReducedMotion();
  
  return (
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
  );
}