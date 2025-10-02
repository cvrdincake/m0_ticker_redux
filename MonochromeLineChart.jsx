// components/Chart/MonochromeLineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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