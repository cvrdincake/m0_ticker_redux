// Monochrome series config
const chartTheme = {
  series: [
    { stroke: '#ffffff', strokeWidth: 2, fill: 'rgba(255,255,255,0.1)' },
    { stroke: '#a3a3a3', strokeWidth: 2, fill: 'rgba(163,163,163,0.08)', strokeDasharray: '4 2' },
    { stroke: '#737373', strokeWidth: 1.5, fill: 'none', strokeDasharray: '8 4' }
  ],
  grid: {
    stroke: '#1a1a1a',
    strokeWidth: 1
  },
  axis: {
    stroke: '#2e2e2e',
    tick: { fill: '#737373', fontSize: 10 },
    label: { fill: '#a3a3a3', fontSize: 11, fontWeight: 600 }
  },
  tooltip: {
    background: '#000',
    border: '1px solid #242424',
    shadow: '0 4px 16px rgba(0,0,0,0.4)'
  }
};