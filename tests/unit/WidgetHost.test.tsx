import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WidgetHost } from '../widgets/render';
import { useWidgetRegistry } from '../widgets/registry';

// Mock the registry hook
vi.mock('../widgets/registry', () => ({
  useWidgetRegistry: vi.fn()
}));

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      set: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      kill: vi.fn()
    }))
  }
}));

describe('WidgetHost Component', () => {
  const mockWidget = {
    id: 'test-widget',
    type: 'card',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 150 },
    props: { title: 'Test Card', content: 'Test content' },
    zIndex: 1
  };

  const mockRegistry = {
    getComponent: vi.fn(() => ({ 
      component: ({ title, content }: any) => (
        <div data-testid="mock-component">{title}: {content}</div>
      ),
      schema: {}
    })),
    getWidgetSpec: vi.fn(() => ({
      type: 'card',
      displayName: 'Card',
      schema: {},
      defaultProps: {}
    }))
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useWidgetRegistry as any).mockReturnValue(mockRegistry);
  });

  it('renders widget component correctly', () => {
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    expect(screen.getByTestId('mock-component')).toBeInTheDocument();
    expect(screen.getByText('Test Card: Test content')).toBeInTheDocument();
  });

  it('applies correct positioning styles', () => {
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    expect(container).toHaveStyle({
      transform: 'translate3d(100px, 100px, 0)',
      width: '200px',
      height: '150px',
      zIndex: '1'
    });
  });

  it('handles selection state correctly', () => {
    const onSelect = vi.fn();
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={true}
        isPreviewMode={false}
        onSelect={onSelect}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    expect(container).toHaveClass('selected');
  });

  it('handles mouse interactions for selection', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={onSelect}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    await user.click(container);
    
    expect(onSelect).toHaveBeenCalledWith(mockWidget.id);
  });

  it('handles keyboard navigation', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={onSelect}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    container.focus();
    await user.keyboard('{Enter}');
    
    expect(onSelect).toHaveBeenCalledWith(mockWidget.id);
  });

  it('handles drag operations', async () => {
    const onMove = vi.fn();
    
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={true}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={onMove}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    
    fireEvent.mouseDown(container, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(onMove).toHaveBeenCalledWith(
        mockWidget.id,
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number)
        })
      );
    });
  });

  it('handles resize operations', async () => {
    const onResize = vi.fn();
    
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={true}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={onResize}
      />
    );

    const resizeHandle = screen.getByTestId('resize-handle-se');
    
    fireEvent.mouseDown(resizeHandle, { clientX: 300, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 350, clientY: 300 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(onResize).toHaveBeenCalledWith(
        mockWidget.id,
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number)
        })
      );
    });
  });

  it('shows error boundary for invalid widgets', () => {
    mockRegistry.getComponent.mockReturnValue(null);

    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    expect(screen.getByTestId('widget-error')).toBeInTheDocument();
    expect(screen.getByText(/Widget type "card" not found/)).toBeInTheDocument();
  });

  it('applies accessibility attributes correctly', () => {
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={false}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    expect(container).toHaveAttribute('role', 'application');
    expect(container).toHaveAttribute('aria-label', 'Card widget: Test Card');
    expect(container).toHaveAttribute('tabindex', '0');
  });

  it('handles preview mode correctly', () => {
    render(
      <WidgetHost 
        widget={mockWidget}
        isSelected={false}
        isPreviewMode={true}
        onSelect={vi.fn()}
        onMove={vi.fn()}
        onResize={vi.fn()}
      />
    );

    const container = screen.getByTestId(`widget-${mockWidget.id}`);
    expect(container).toHaveClass('preview-mode');
    expect(container).toHaveAttribute('tabindex', '-1');
  });
});