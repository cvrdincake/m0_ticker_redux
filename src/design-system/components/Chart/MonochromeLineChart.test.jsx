import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MonochromeLineChart } from './MonochromeLineChart';

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, ...props }) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
  LineChart: ({ children, data, ...props }) => (
    <div data-testid="line-chart" data-length={data?.length} {...props}>
      {children}
    </div>
  ),
  Line: ({ dataKey, animationDuration, ...props }) => (
    <div 
      data-testid={`line-${dataKey}`} 
      data-animation-duration={animationDuration}
      {...props} 
    />
  ),
  XAxis: (props) => <div data-testid="x-axis" {...props} />,
  YAxis: (props) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props) => <div data-testid="tooltip" {...props} />,
}));

// Mock useReducedMotion hook
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '@/hooks/useReducedMotion';

describe('MonochromeLineChart', () => {
  const mockData = [
    { x: 1, series1: 10, series2: 20 },
    { x: 2, series1: 15, series2: 25 },
    { x: 3, series1: 12, series2: 22 },
  ];

  const mockSeries = [
    { key: 'series1' },
    { key: 'series2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with basic props', () => {
    render(
      <MonochromeLineChart 
        data={mockData} 
        series={mockSeries} 
        aria-label="Test chart"
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByLabelText('Test chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders grid by default', () => {
    render(<MonochromeLineChart data={mockData} series={mockSeries} />);
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('hides grid when grid prop is false', () => {
    render(<MonochromeLineChart data={mockData} series={mockSeries} grid={false} />);
    expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
  });

  it('renders all series lines', () => {
    render(<MonochromeLineChart data={mockData} series={mockSeries} />);
    
    expect(screen.getByTestId('line-series1')).toBeInTheDocument();
    expect(screen.getByTestId('line-series2')).toBeInTheDocument();
  });

  it('limits to maximum 5 series', () => {
    const manySeries = Array.from({ length: 7 }, (_, i) => ({ key: `series${i + 1}` }));
    
    render(<MonochromeLineChart data={mockData} series={manySeries} />);
    
    // Should only render first 5 series
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`line-series${i}`)).toBeInTheDocument();
    }
    
    // Should not render 6th and 7th series
    expect(screen.queryByTestId('line-series6')).not.toBeInTheDocument();
    expect(screen.queryByTestId('line-series7')).not.toBeInTheDocument();
  });

  it('respects reduced motion preference', () => {
    useReducedMotion.mockReturnValue(true);
    
    render(<MonochromeLineChart data={mockData} series={mockSeries} />);
    
    const lines = screen.getAllByTestId(/line-series/);
    lines.forEach(line => {
      expect(line).toHaveAttribute('data-animation-duration', '0');
    });
  });

  it('disables animation for large datasets', () => {
    const largeData = Array.from({ length: 6000 }, (_, i) => ({ x: i, value: i }));
    const largeSeries = [{ key: 'value' }];
    
    render(<MonochromeLineChart data={largeData} series={largeSeries} />);
    
    const line = screen.getByTestId('line-value');
    expect(line).toHaveAttribute('data-animation-duration', '0');
  });

  it('handles empty data gracefully', () => {
    render(<MonochromeLineChart data={[]} series={mockSeries} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('aria-description', 'No data available');
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('handles null/undefined data gracefully', () => {
    render(<MonochromeLineChart data={null} series={mockSeries} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
    
    render(<MonochromeLineChart data={undefined} series={mockSeries} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles non-array data gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<MonochromeLineChart data="invalid" series={mockSeries} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
    
    consoleWarnSpy.mockRestore();
  });

  it('applies custom height', () => {
    render(<MonochromeLineChart data={mockData} series={mockSeries} height={500} />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toHaveAttribute('height', '500');
  });

  it('passes custom formatters to axes and tooltip', () => {
    const xFormatter = vi.fn();
    const yFormatter = vi.fn();
    const tooltipFormatter = vi.fn();
    
    render(
      <MonochromeLineChart 
        data={mockData} 
        series={mockSeries}
        xTickFormatter={xFormatter}
        yTickFormatter={yFormatter}
        tooltipFormatter={tooltipFormatter}
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    const yAxis = screen.getByTestId('y-axis');
    const tooltip = screen.getByTestId('tooltip');
    
    expect(xAxis).toHaveProperty('tickFormatter', xFormatter);
    expect(yAxis).toHaveProperty('tickFormatter', yFormatter);
    expect(tooltip).toHaveProperty('formatter', tooltipFormatter);
  });

  it('sets correct ARIA attributes', () => {
    render(
      <MonochromeLineChart 
        data={mockData} 
        series={mockSeries}
        aria-label="Custom chart label"
        aria-description="Custom chart description"
      />
    );
    
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('aria-label', 'Custom chart label');
    expect(chart).toHaveAttribute('aria-description', 'Custom chart description');
  });

  it('uses default ARIA label when not provided', () => {
    render(<MonochromeLineChart data={mockData} series={mockSeries} />);
    
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('aria-label', 'Line chart');
  });

  it('logs performance warning for very large datasets', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const veryLargeData = Array.from({ length: 15000 }, (_, i) => ({ x: i, value: i }));
    
    render(<MonochromeLineChart data={veryLargeData} series={[{ key: 'value' }]} />);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'MonochromeLineChart: Consider downsampling data for datasets >10k points for optimal performance'
    );
    
    consoleWarnSpy.mockRestore();
  });

  it('passes through additional props', () => {
    render(
      <MonochromeLineChart 
        data={mockData} 
        series={mockSeries}
        data-testid="custom-chart"
        className="custom-class"
      />
    );
    
    const chart = screen.getByTestId('custom-chart');
    expect(chart).toHaveClass('custom-class');
  });
});