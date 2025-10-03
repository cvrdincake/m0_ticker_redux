import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardGrid } from '../DashboardGrid';

// Mock dependencies
const mockNudgeWidget = vi.fn();
const mockResizeWidget = vi.fn();
const mockDuplicateWidget = vi.fn();
const mockDeleteWidget = vi.fn();
const mockSelectWidget = vi.fn();
const mockUpdateWidget = vi.fn();

vi.mock('@/store/useDashboard', () => ({
  useDashboardStore: () => ({
    widgets: {
      'widget-1': {
        id: 'widget-1',
        type: 'card',
        title: 'Test Card',
        x: 0,
        y: 0,
        width: 4,
        height: 3,
        z: 0,
        config: { ariaLabel: 'Test card widget' }
      }
    },
    getActiveDashboard: () => ({
      widgets: ['widget-1']
    }),
    selectedWidgetId: 'widget-1',
    nudgeWidget: mockNudgeWidget,
    resizeWidget: mockResizeWidget,
    duplicateWidget: mockDuplicateWidget,
    deleteWidget: mockDeleteWidget,
    selectWidget: mockSelectWidget,
    updateWidget: mockUpdateWidget
  })
}));

vi.mock('./AlignmentGuides', () => ({
  AlignmentGuides: () => <div data-testid="alignment-guides" />,
  snapToGuides: vi.fn(),
  nearestGuides: vi.fn(() => [])
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('DashboardGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders widgets on the grid', () => {
    render(<DashboardGrid />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Test card widget' })).toBeInTheDocument();
  });

  it('handles arrow key movement', async () => {
    const user = userEvent.setup();
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group', { name: 'Test card widget' });
    widget.focus();
    
    await user.keyboard('{ArrowRight}');
    
    expect(mockNudgeWidget).toHaveBeenCalledWith('widget-1', 1, 0);
  });

  it('handles shift+arrow key resizing', async () => {
    const user = userEvent.setup();
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group', { name: 'Test card widget' });
    widget.focus();
    
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    
    expect(mockResizeWidget).toHaveBeenCalledWith('widget-1', 0, 1);
  });

  it('handles ctrl+d duplication', async () => {
    const user = userEvent.setup();
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group', { name: 'Test card widget' });
    widget.focus();
    
    await user.keyboard('{Control>}d{/Control}');
    
    expect(mockDuplicateWidget).toHaveBeenCalledWith('widget-1');
  });

  it('handles delete key', async () => {
    const user = userEvent.setup();
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group', { name: 'Test card widget' });
    widget.focus();
    
    await user.keyboard('{Delete}');
    
    expect(mockDeleteWidget).toHaveBeenCalledWith('widget-1');
  });

  it('positions widgets correctly using CSS', () => {
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group', { name: 'Test card widget' });
    
    expect(widget).toHaveStyle({
      left: '0px', // x: 0 * 60px
      top: '0px',  // y: 0 * 60px
      width: '240px', // width: 4 * 60px
      height: '180px' // height: 3 * 60px
    });
  });

  it('has proper accessibility attributes', () => {
    render(<DashboardGrid />);
    
    const widget = screen.getByRole('group');
    
    expect(widget).toHaveAttribute('role', 'group');
    expect(widget).toHaveAttribute('aria-label', 'Test card widget');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveAttribute('data-widget-id', 'widget-1');
    expect(widget).toHaveAttribute('data-widget-kind', 'card');
  });

  it('shows live region for announcements', () => {
    render(<DashboardGrid />);
    
    const liveRegion = screen.getByRole('status', { hidden: true });
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });
});