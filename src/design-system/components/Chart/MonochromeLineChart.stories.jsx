import { MonochromeLineChart } from './MonochromeLineChart';

export default {
  title: 'Components/Chart/MonochromeLineChart',
  component: MonochromeLineChart,
  decorators: [
    (Story) => (
      <div style={{ 
        width: '800px', 
        height: '400px', 
        padding: '1rem',
        background: 'var(--surface-canvas)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius)'
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Monochrome line chart with tokenised theming, reduced-motion support, and performance guards for large datasets.',
      },
    },
  },
};

// Sample data generators
const generateTimeSeriesData = (points = 20, series = 2) => {
  const baseTime = Date.now() - (points * 24 * 60 * 60 * 1000);
  return Array.from({ length: points }, (_, i) => {
    const point = { x: baseTime + (i * 24 * 60 * 60 * 1000) };
    for (let s = 0; s < series; s++) {
      point[`series${s + 1}`] = Math.random() * 100 + (s * 20);
    }
    return point;
  });
};

const generateDenseData = (points = 1000) => {
  return Array.from({ length: points }, (_, i) => ({
    x: i,
    value: Math.sin(i * 0.1) * 50 + 50 + (Math.random() - 0.5) * 10,
    trend: i * 0.05 + Math.random() * 5,
  }));
};

const basicSeries = [
  { key: 'series1' },
  { key: 'series2' }
];

const manySeries = [
  { key: 'primary' },
  { key: 'secondary' },
  { key: 'tertiary' },
  { key: 'quaternary' },
  { key: 'quinary' },
  { key: 'excess1' }, // Should be ignored (>5)
  { key: 'excess2' }  // Should be ignored (>5)
];

const denseSeries = [
  { key: 'value' },
  { key: 'trend' }
];

export const Default = {
  args: {
    data: generateTimeSeriesData(20, 2),
    series: basicSeries,
    height: 300,
    'aria-label': 'Default time series chart',
  },
};

export const ManySeries = {
  args: {
    data: generateTimeSeriesData(30, 7), // Generate 7 series but only 5 will show
    series: manySeries,
    height: 300,
    'aria-label': 'Multi-series chart with 5 series maximum',
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with 7 series provided but limited to 5 styled series. Excess series are ignored.',
      },
    },
  },
};

export const DenseData = {
  args: {
    data: generateDenseData(1000),
    series: denseSeries,
    height: 300,
    'aria-label': 'Dense dataset with 1000 data points',
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 1000 data points. Animations disabled and dots removed for performance.',
      },
    },
  },
};

export const VeryLargeDataset = {
  args: {
    data: generateDenseData(10000),
    series: denseSeries,
    height: 300,
    'aria-label': 'Very large dataset with 10000 data points',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stress test with 10,000 points. Performance guards active, warning logged.',
      },
    },
  },
};

export const CustomFormatters = {
  args: {
    data: generateTimeSeriesData(15, 2),
    series: basicSeries,
    height: 300,
    xTickFormatter: (value) => new Date(value).toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    }),
    yTickFormatter: (value) => `£${value.toFixed(0)}`,
    tooltipFormatter: (value, name) => [`£${value.toFixed(2)}`, name.toUpperCase()],
    'aria-label': 'Chart with custom formatters for currency data',
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with custom formatters for dates, currency values, and tooltip content.',
      },
    },
  },
};

export const NoGrid = {
  args: {
    data: generateTimeSeriesData(20, 2),
    series: basicSeries,
    height: 300,
    grid: false,
    'aria-label': 'Chart without grid lines',
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with grid lines disabled for cleaner appearance.',
      },
    },
  },
};

export const EmptyData = {
  args: {
    data: [],
    series: basicSeries,
    height: 300,
    'aria-label': 'Chart with no data',
  },
  parameters: {
    docs: {
      description: {
        story: 'Graceful handling of empty dataset with appropriate fallback UI.',
      },
    },
  },
};

// Reduced motion story
export const ReducedMotion = {
  args: {
    data: generateTimeSeriesData(20, 2),
    series: basicSeries,
    height: 300,
    'aria-label': 'Chart with reduced motion enabled',
  },
  decorators: [
    (Story) => (
      <div 
        className="reduce-motion" 
        style={{ 
          width: '800px', 
          height: '400px', 
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
          Reduced motion enabled - animations disabled
        </p>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Chart with reduced motion class applied. All animations are disabled.',
      },
    },
  },
};