import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chart from './Chart';

// Mock recharts to avoid canvas issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}));

const mockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 }
];

describe('Chart', () => {
  it('renders with default props', () => {
    render(<Chart data={mockData} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Chart data={mockData} title="Test Chart" />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Chart loading />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Failed to load data';
    render(<Chart error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<Chart data={[]} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<Chart data={mockData} height={400} />);
    
    const chartContainer = container.querySelector('[data-testid="chart-container"]');
    expect(chartContainer).toHaveStyle({ height: '400px' });
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Chart ref={ref} data={mockData} />);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});