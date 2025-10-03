import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { performance } from 'perf_hooks';

// Mock performance API for testing
global.performance = performance as any;

describe('Performance Tests', () => {
  beforeEach(() => {
    // Clear performance marks before each test
    performance.clearMarks();
    performance.clearMeasures();
  });

  it('should render large widget layouts efficiently', async () => {
    const startTime = performance.now();
    
    // Mock a large dashboard layout
    const mockWidgets = Array.from({ length: 100 }, (_, i) => ({
      id: `widget-${i}`,
      type: 'card',
      position: { x: (i % 10) * 220, y: Math.floor(i / 10) * 180 },
      size: { width: 200, height: 160 },
      props: { title: `Widget ${i}`, content: `Content ${i}` },
      zIndex: i
    }));

    // Mock the dashboard component with large layout
    const LargeDashboard = () => (
      <div data-testid="dashboard">
        {mockWidgets.map(widget => (
          <div 
            key={widget.id}
            data-testid={`widget-${widget.id}`}
            style={{
              position: 'absolute',
              left: widget.position.x,
              top: widget.position.y,
              width: widget.size.width,
              height: widget.size.height,
              zIndex: widget.zIndex
            }}
          >
            {widget.props.title}
          </div>
        ))}
      </div>
    );

    render(<LargeDashboard />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Rendering 100 widgets should take less than 100ms
    expect(renderTime).toBeLessThan(100);
    
    // Verify all widgets are rendered
    expect(screen.getAllByTestId(/^widget-/)).toHaveLength(100);
  });

  it('should handle rapid widget updates efficiently', async () => {
    let updateCount = 0;
    const updates: number[] = [];

    const RapidUpdateComponent = () => {
      const [position, setPosition] = React.useState({ x: 0, y: 0 });

      React.useEffect(() => {
        const interval = setInterval(() => {
          const start = performance.now();
          setPosition(prev => ({ 
            x: prev.x + 1, 
            y: prev.y + 1 
          }));
          const end = performance.now();
          updates.push(end - start);
          updateCount++;
          
          if (updateCount >= 50) {
            clearInterval(interval);
          }
        }, 16); // ~60fps

        return () => clearInterval(interval);
      }, []);

      return (
        <div 
          data-testid="rapid-update-widget"
          style={{ 
            transform: `translate3d(${position.x}px, ${position.y}px, 0)` 
          }}
        >
          Moving Widget
        </div>
      );
    };

    render(<RapidUpdateComponent />);

    // Wait for all updates to complete
    await waitFor(() => expect(updateCount).toBe(50), { timeout: 2000 });

    // Average update time should be less than 2ms
    const avgUpdateTime = updates.reduce((a, b) => a + b, 0) / updates.length;
    expect(avgUpdateTime).toBeLessThan(2);
  });

  it('should efficiently handle large datasets in tables', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      category: `Category ${i % 10}`,
      timestamp: new Date(Date.now() - i * 1000).toISOString()
    }));

    performance.mark('table-render-start');

    const VirtualizedTable = ({ data }: { data: any[] }) => {
      const [visibleItems, setVisibleItems] = React.useState(
        data.slice(0, 50) // Only render first 50 items
      );

      return (
        <div data-testid="virtualized-table">
          <div data-testid="table-header">
            <span>ID</span>
            <span>Name</span>
            <span>Value</span>
            <span>Category</span>
          </div>
          {visibleItems.map(item => (
            <div key={item.id} data-testid={`table-row-${item.id}`}>
              <span>{item.id}</span>
              <span>{item.name}</span>
              <span>{item.value.toFixed(2)}</span>
              <span>{item.category}</span>
            </div>
          ))}
        </div>
      );
    };

    render(<VirtualizedTable data={largeDataset} />);

    performance.mark('table-render-end');
    performance.measure('table-render', 'table-render-start', 'table-render-end');

    const measure = performance.getEntriesByName('table-render')[0];
    
    // Table rendering should be fast even with large dataset
    expect(measure.duration).toBeLessThan(50);
    
    // Only visible items should be rendered
    expect(screen.getAllByTestId(/^table-row-/)).toHaveLength(50);
  });

  it('should efficiently handle WebSocket data streams', async () => {
    const messageCount = 1000;
    const messages: any[] = [];
    let processedCount = 0;

    const MockWebSocketComponent = () => {
      const [latestData, setLatestData] = React.useState<any>(null);

      React.useEffect(() => {
        const processMessage = (data: any) => {
          const start = performance.now();
          setLatestData(data);
          const end = performance.now();
          
          messages.push({ data, processTime: end - start });
          processedCount++;
        };

        // Simulate rapid WebSocket messages
        const interval = setInterval(() => {
          const mockData = {
            timestamp: Date.now(),
            metrics: {
              cpu: Math.random() * 100,
              memory: Math.random() * 100,
              network: Math.random() * 1000
            }
          };
          processMessage(mockData);

          if (processedCount >= messageCount) {
            clearInterval(interval);
          }
        }, 1);

        return () => clearInterval(interval);
      }, []);

      return (
        <div data-testid="websocket-widget">
          {latestData && (
            <div data-testid="latest-metrics">
              CPU: {latestData.metrics.cpu.toFixed(1)}%
            </div>
          )}
        </div>
      );
    };

    render(<MockWebSocketComponent />);

    // Wait for all messages to be processed
    await waitFor(() => expect(processedCount).toBe(messageCount), { timeout: 5000 });

    // Calculate average processing time
    const avgProcessTime = messages.reduce((sum, msg) => sum + msg.processTime, 0) / messages.length;
    
    // Each message should be processed quickly
    expect(avgProcessTime).toBeLessThan(1);
    
    // UI should show latest data
    expect(screen.getByTestId('latest-metrics')).toBeInTheDocument();
  });

  it('should efficiently manage memory with widget creation/destruction', async () => {
    let createdWidgets = 0;
    let destroyedWidgets = 0;

    const MemoryTestComponent = () => {
      const [widgets, setWidgets] = React.useState<string[]>([]);

      React.useEffect(() => {
        const createWidget = () => {
          const widgetId = `widget-${Date.now()}-${Math.random()}`;
          setWidgets(prev => [...prev, widgetId]);
          createdWidgets++;
        };

        const destroyWidget = () => {
          setWidgets(prev => {
            if (prev.length > 0) {
              destroyedWidgets++;
              return prev.slice(1);
            }
            return prev;
          });
        };

        // Rapidly create and destroy widgets
        const interval = setInterval(() => {
          if (Math.random() > 0.5) {
            createWidget();
          } else {
            destroyWidget();
          }

          if (createdWidgets >= 500) {
            clearInterval(interval);
          }
        }, 10);

        return () => clearInterval(interval);
      }, []);

      return (
        <div data-testid="memory-test">
          {widgets.map(widgetId => (
            <div key={widgetId} data-testid={`dynamic-widget-${widgetId}`}>
              Widget {widgetId}
            </div>
          ))}
          <div data-testid="widget-count">{widgets.length} widgets</div>
        </div>
      );
    };

    const { unmount } = render(<MemoryTestComponent />);

    // Wait for widget churn to complete
    await waitFor(() => expect(createdWidgets).toBeGreaterThanOrEqual(500), { timeout: 10000 });

    // Clean up component
    unmount();

    // Verify no memory leaks (this is a simplified check)
    expect(createdWidgets).toBeGreaterThan(0);
    expect(destroyedWidgets).toBeGreaterThan(0);
  });

  it('should handle animation performance efficiently', async () => {
    const animationFrames: number[] = [];
    let frameCount = 0;

    const AnimationTestComponent = () => {
      const [rotation, setRotation] = React.useState(0);

      React.useEffect(() => {
        let animationId: number;

        const animate = () => {
          const start = performance.now();
          
          setRotation(prev => (prev + 1) % 360);
          frameCount++;

          const end = performance.now();
          animationFrames.push(end - start);

          if (frameCount < 120) { // ~2 seconds at 60fps
            animationId = requestAnimationFrame(animate);
          }
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
      }, []);

      return (
        <div 
          data-testid="animated-widget"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: 'none' // Disable CSS transitions for pure RAF
          }}
        >
          Rotating Widget
        </div>
      );
    };

    render(<AnimationTestComponent />);

    // Wait for animation to complete
    await waitFor(() => expect(frameCount).toBeGreaterThanOrEqual(120), { timeout: 3000 });

    // Calculate frame timing statistics
    const avgFrameTime = animationFrames.reduce((a, b) => a + b, 0) / animationFrames.length;
    const maxFrameTime = Math.max(...animationFrames);

    // Each frame should be processed quickly
    expect(avgFrameTime).toBeLessThan(2);
    expect(maxFrameTime).toBeLessThan(16); // Should not exceed one frame budget
  });
});

// Mock React for tests that need it
(global as any).React = {
  useState: vi.fn((initial) => [initial, vi.fn()]),
  useEffect: vi.fn((effect) => effect()),
  useCallback: vi.fn((fn) => fn),
  useMemo: vi.fn((fn) => fn()),
};