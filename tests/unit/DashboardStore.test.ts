import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../store/useDashboard';

describe('Dashboard Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useDashboard());
    act(() => {
      result.current.clearLayout();
    });
  });

  it('initializes with empty layout', () => {
    const { result } = renderHook(() => useDashboard());
    
    expect(result.current.widgets).toEqual([]);
    expect(result.current.selectedWidgets).toEqual([]);
    expect(result.current.history.past).toEqual([]);
    expect(result.current.history.future).toEqual([]);
  });

  it('adds widgets correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    const newWidget = {
      type: 'card',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      props: { title: 'Test Card' }
    };

    act(() => {
      result.current.addWidget(newWidget);
    });

    expect(result.current.widgets).toHaveLength(1);
    expect(result.current.widgets[0]).toMatchObject({
      type: 'card',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      props: { title: 'Test Card' }
    });
    expect(result.current.widgets[0].id).toBeDefined();
  });

  it('removes widgets correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Test Card' }
      });
    });

    const widgetId = result.current.widgets[0].id;

    act(() => {
      result.current.removeWidget(widgetId);
    });

    expect(result.current.widgets).toHaveLength(0);
  });

  it('updates widget properties correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Original Title' }
      });
    });

    const widgetId = result.current.widgets[0].id;

    act(() => {
      result.current.updateWidget(widgetId, {
        props: { title: 'Updated Title' }
      });
    });

    expect(result.current.widgets[0].props.title).toBe('Updated Title');
  });

  it('handles widget selection correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Test Card' }
      });
    });

    const widgetId = result.current.widgets[0].id;

    act(() => {
      result.current.selectWidget(widgetId);
    });

    expect(result.current.selectedWidgets).toContain(widgetId);

    act(() => {
      result.current.deselectWidget(widgetId);
    });

    expect(result.current.selectedWidgets).not.toContain(widgetId);
  });

  it('handles multi-selection correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 1' }
      });
      result.current.addWidget({
        type: 'card',
        position: { x: 300, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 2' }
      });
    });

    const [widget1Id, widget2Id] = result.current.widgets.map(w => w.id);

    act(() => {
      result.current.selectWidget(widget1Id, true); // multi-select
      result.current.selectWidget(widget2Id, true); // multi-select
    });

    expect(result.current.selectedWidgets).toContain(widget1Id);
    expect(result.current.selectedWidgets).toContain(widget2Id);
    expect(result.current.selectedWidgets).toHaveLength(2);
  });

  it('aligns widgets correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 1' }
      });
      result.current.addWidget({
        type: 'card',
        position: { x: 300, y: 200 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 2' }
      });
    });

    const [widget1Id, widget2Id] = result.current.widgets.map(w => w.id);

    act(() => {
      result.current.selectWidget(widget1Id, true);
      result.current.selectWidget(widget2Id, true);
      result.current.alignWidgets('left');
    });

    // Both widgets should have the same x position (aligned to leftmost)
    const widgets = result.current.widgets;
    expect(widgets[0].position.x).toBe(widgets[1].position.x);
    expect(widgets[0].position.x).toBe(100); // Leftmost position
  });

  it('distributes widgets correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 1' }
      });
      result.current.addWidget({
        type: 'card',
        position: { x: 200, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 2' }
      });
      result.current.addWidget({
        type: 'card',
        position: { x: 500, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 3' }
      });
    });

    const widgetIds = result.current.widgets.map(w => w.id);

    act(() => {
      widgetIds.forEach(id => result.current.selectWidget(id, true));
      result.current.distributeWidgets('horizontal');
    });

    // Widgets should be evenly distributed horizontally
    const widgets = result.current.widgets.sort((a, b) => a.position.x - b.position.x);
    const spacing1 = widgets[1].position.x - widgets[0].position.x;
    const spacing2 = widgets[2].position.x - widgets[1].position.x;
    expect(Math.abs(spacing1 - spacing2)).toBeLessThan(1); // Allow for rounding
  });

  it('handles undo/redo correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Test Card' }
      });
    });

    expect(result.current.widgets).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);

    const widgetId = result.current.widgets[0].id;

    act(() => {
      result.current.undo();
    });

    expect(result.current.widgets).toHaveLength(0);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });

    expect(result.current.widgets).toHaveLength(1);
  });

  it('manages z-order correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.addWidget({
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 1' }
      });
      result.current.addWidget({
        type: 'card',
        position: { x: 200, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Card 2' }
      });
    });

    const [widget1Id, widget2Id] = result.current.widgets.map(w => w.id);
    const initialZ1 = result.current.widgets.find(w => w.id === widget1Id)?.zIndex;
    const initialZ2 = result.current.widgets.find(w => w.id === widget2Id)?.zIndex;

    act(() => {
      result.current.bringToFront(widget1Id);
    });

    const finalZ1 = result.current.widgets.find(w => w.id === widget1Id)?.zIndex;
    const finalZ2 = result.current.widgets.find(w => w.id === widget2Id)?.zIndex;

    expect(finalZ1).toBeGreaterThan(initialZ1!);
    expect(finalZ1).toBeGreaterThan(finalZ2!);
  });

  it('persists and loads layout correctly', () => {
    const { result } = renderHook(() => useDashboard());
    
    const testLayout = {
      widgets: [{
        id: 'test-widget',
        type: 'card',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        props: { title: 'Persisted Card' },
        zIndex: 1
      }],
      selectedWidgets: [],
      history: { past: [], future: [] }
    };

    act(() => {
      result.current.loadLayout(testLayout);
    });

    expect(result.current.widgets).toHaveLength(1);
    expect(result.current.widgets[0].props.title).toBe('Persisted Card');

    const savedLayout = result.current.saveLayout();
    expect(savedLayout.widgets).toEqual(testLayout.widgets);
  });
});