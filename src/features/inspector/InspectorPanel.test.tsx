import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorPanel } from '../InspectorPanel';

// Mock the dashboard store
const mockUpdateWidget = vi.fn();
const mockGetSelectedWidget = vi.fn();

vi.mock('@/store/useDashboard', () => ({
  useDashboardStore: () => ({
    selectedWidgetId: 'test-widget-id',
    getSelectedWidget: mockGetSelectedWidget,
    updateWidget: mockUpdateWidget
  })
}));

vi.mock('@/design-system', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: (props: any) => <input {...props} />,
  Text: ({ children, as = 'span', ...props }: any) => {
    const Component = as;
    return <Component {...props}>{children}</Component>;
  }
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value // Return value immediately for tests
}));

describe('InspectorPanel', () => {
  const mockWidget = {
    id: 'test-widget-id',
    kind: 'card',
    title: 'Test Widget',
    width: 4,
    height: 3,
    x: 0,
    y: 0,
    zIndex: 0,
    config: {
      dataSource: 'api/data',
      motionPreset: 'card',
      density: 'comfortable',
      ariaLabel: 'Test widget'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSelectedWidget.mockReturnValue(mockWidget);
  });

  it('renders inspector panel when open with selected widget', () => {
    render(<InspectorPanel isOpen={true} />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByText('Inspector')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Widget')).toBeInTheDocument();
  });

  it('shows empty state when no widget selected', () => {
    mockGetSelectedWidget.mockReturnValue(null);
    
    render(<InspectorPanel isOpen={true} />);
    
    expect(screen.getByText('Select a widget to configure its properties')).toBeInTheDocument();
  });

  it('updates widget title when input changes', async () => {
    const user = userEvent.setup();
    render(<InspectorPanel isOpen={true} />);
    
    const titleInput = screen.getByDisplayValue('Test Widget');
    
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    
    expect(mockUpdateWidget).toHaveBeenCalledWith('test-widget-id', {
      title: 'New Title',
      config: expect.objectContaining({
        dataSource: 'api/data',
        motionPreset: 'card',
        density: 'comfortable',
        ariaLabel: 'Test widget'
      })
    });
  });

  it('updates motion preset when select changes', async () => {
    const user = userEvent.setup();
    render(<InspectorPanel isOpen={true} />);
    
    const motionSelect = screen.getByDisplayValue('Card');
    
    await user.selectOptions(motionSelect, 'chart');
    
    expect(mockUpdateWidget).toHaveBeenCalledWith('test-widget-id', {
      title: 'Test Widget',
      config: expect.objectContaining({
        motionPreset: 'chart'
      })
    });
  });

  it('displays widget info correctly', () => {
    render(<InspectorPanel isOpen={true} />);
    
    expect(screen.getByText('card')).toBeInTheDocument();
    expect(screen.getByText('4×3')).toBeInTheDocument();
    expect(screen.getByText('0,0')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const mockOnClose = vi.fn();
    const user = userEvent.setup();
    
    render(<InspectorPanel isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close inspector');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<InspectorPanel isOpen={false} />);
    
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});