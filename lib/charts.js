// Monochrome series config - uses CSS custom properties
const chartTheme = {
  series: [
    { stroke: 'var(--surface)', strokeWidth: 2, fill: 'var(--surface-alpha-10)' },
    { stroke: 'var(--ink-muted)', strokeWidth: 2, fill: 'var(--ink-alpha-08)', strokeDasharray: '4 2' },
    { stroke: 'var(--ink-subtle)', strokeWidth: 1.5, fill: 'none', strokeDasharray: '8 4' }
  ],
  grid: {
    stroke: 'var(--border-subtle)',
    strokeWidth: 1
  },
  axis: {
    stroke: 'var(--border)',
    tick: { fill: 'var(--ink-subtle)', fontSize: 10 },
    label: { fill: 'var(--ink-muted)', fontSize: 11, fontWeight: 600 }
  },
  tooltip: {
    background: 'var(--surface-deep)',
    border: '1px solid var(--border)',
    shadow: 'var(--shadow-lg)'
  }
};