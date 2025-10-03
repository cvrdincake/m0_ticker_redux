import React from 'react';

export interface WidgetConfig {
  kind: string;
  id: string;
  props: Record<string, any>;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface WidgetHealthStatus {
  id: string;
  kind: string;
  status: 'healthy' | 'degraded' | 'failed' | 'recovering';
  lastError?: Error;
  errorCount: number;
  lastHealthCheck: number;
  uptime: number;
  retryCount: number;
  maxRetries: number;
}

export interface HealthMonitorConfig {
  maxRetries: number;
  retryDelay: number;
  healthCheckInterval: number;
  degradationThreshold: number;
  failureThreshold: number;
  autoRecoveryEnabled: boolean;
}

const DEFAULT_HEALTH_CONFIG: HealthMonitorConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  healthCheckInterval: 30000, // 30 seconds
  degradationThreshold: 2,
  failureThreshold: 5,
  autoRecoveryEnabled: true,
};

class WidgetHealthMonitor {
  private statuses = new Map<string, WidgetHealthStatus>();
  private config: HealthMonitorConfig;
  private intervals = new Map<string, NodeJS.Timeout>();
  private listeners = new Set<(status: WidgetHealthStatus) => void>();

  constructor(config: Partial<HealthMonitorConfig> = {}) {
    this.config = { ...DEFAULT_HEALTH_CONFIG, ...config };
  }

  // Register a widget for health monitoring
  register(widgetConfig: WidgetConfig): void {
    const status: WidgetHealthStatus = {
      id: widgetConfig.id,
      kind: widgetConfig.kind,
      status: 'healthy',
      errorCount: 0,
      lastHealthCheck: Date.now(),
      uptime: Date.now(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
    };

    this.statuses.set(widgetConfig.id, status);
    this.startHealthCheck(widgetConfig.id);
  }

  // Unregister a widget
  unregister(widgetId: string): void {
    this.statuses.delete(widgetId);
    const interval = this.intervals.get(widgetId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(widgetId);
    }
  }

  // Report an error for a widget
  reportError(widgetId: string, error: Error): void {
    const status = this.statuses.get(widgetId);
    if (!status) return;

    status.lastError = error;
    status.errorCount++;
    status.lastHealthCheck = Date.now();

    // Determine new status based on error count
    if (status.errorCount >= this.config.failureThreshold) {
      status.status = 'failed';
    } else if (status.errorCount >= this.config.degradationThreshold) {
      status.status = 'degraded';
    }

    this.notifyListeners(status);

    // Attempt auto-recovery if enabled
    if (this.config.autoRecoveryEnabled && status.status !== 'failed') {
      this.attemptRecovery(widgetId);
    }
  }

  // Get health status for a widget
  getStatus(widgetId: string): WidgetHealthStatus | undefined {
    return this.statuses.get(widgetId);
  }

  // Get all widget statuses
  getAllStatuses(): WidgetHealthStatus[] {
    return Array.from(this.statuses.values());
  }

  // Get summary statistics
  getSummary() {
    const statuses = this.getAllStatuses();
    return {
      total: statuses.length,
      healthy: statuses.filter(s => s.status === 'healthy').length,
      degraded: statuses.filter(s => s.status === 'degraded').length,
      failed: statuses.filter(s => s.status === 'failed').length,
      recovering: statuses.filter(s => s.status === 'recovering').length,
      avgUptime: statuses.length ? 
        statuses.reduce((acc, s) => acc + (Date.now() - s.uptime), 0) / statuses.length : 0,
      totalErrors: statuses.reduce((acc, s) => acc + s.errorCount, 0),
    };
  }

  // Manually trigger recovery for a widget
  async recover(widgetId: string): Promise<boolean> {
    const status = this.statuses.get(widgetId);
    if (!status) return false;

    if (status.retryCount >= status.maxRetries) {
      console.warn(`Widget ${widgetId} has exceeded max retries`);
      return false;
    }

    status.status = 'recovering';
    status.retryCount++;
    this.notifyListeners(status);

    // Exponential backoff delay
    const delay = this.config.retryDelay * Math.pow(2, status.retryCount - 1);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Reset error state for retry
    status.errorCount = Math.max(0, status.errorCount - 1);
    status.status = status.errorCount === 0 ? 'healthy' : 'degraded';
    status.lastHealthCheck = Date.now();
    
    this.notifyListeners(status);
    return true;
  }

  // Reset a widget's health status
  reset(widgetId: string): void {
    const status = this.statuses.get(widgetId);
    if (!status) return;

    status.status = 'healthy';
    status.errorCount = 0;
    status.retryCount = 0;
    status.lastError = undefined;
    status.lastHealthCheck = Date.now();
    
    this.notifyListeners(status);
  }

  // Subscribe to health status changes
  subscribe(listener: (status: WidgetHealthStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Clean up all resources
  destroy(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.statuses.clear();
    this.listeners.clear();
  }

  private startHealthCheck(widgetId: string): void {
    if (this.config.healthCheckInterval <= 0) return;

    const interval = setInterval(() => {
      const status = this.statuses.get(widgetId);
      if (!status) {
        clearInterval(interval);
        this.intervals.delete(widgetId);
        return;
      }

      status.lastHealthCheck = Date.now();
      
      // Auto-recovery for degraded widgets
      if (status.status === 'degraded' && this.config.autoRecoveryEnabled) {
        this.attemptRecovery(widgetId);
      }
    }, this.config.healthCheckInterval);

    this.intervals.set(widgetId, interval);
  }

  private async attemptRecovery(widgetId: string): Promise<void> {
    const status = this.statuses.get(widgetId);
    if (!status || status.status === 'recovering' || status.retryCount >= status.maxRetries) {
      return;
    }

    try {
      await this.recover(widgetId);
    } catch (error) {
      console.error(`Auto-recovery failed for widget ${widgetId}:`, error);
      this.reportError(widgetId, error as Error);
    }
  }

  private notifyListeners(status: WidgetHealthStatus): void {
    this.listeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Health monitor listener error:', error);
      }
    });
  }
}

// Global health monitor instance
export const healthMonitor = new WidgetHealthMonitor();

// React hook for health monitoring
export function useWidgetHealth(config: WidgetConfig) {
  const [status, setStatus] = React.useState<WidgetHealthStatus | undefined>();

  React.useEffect(() => {
    // Register widget
    healthMonitor.register(config);
    setStatus(healthMonitor.getStatus(config.id));

    // Subscribe to changes
    const unsubscribe = healthMonitor.subscribe((updatedStatus) => {
      if (updatedStatus.id === config.id) {
        setStatus({ ...updatedStatus });
      }
    });

    return () => {
      unsubscribe();
      healthMonitor.unregister(config.id);
    };
  }, [config.id, config.kind]);

  const reportError = React.useCallback((error: Error) => {
    healthMonitor.reportError(config.id, error);
  }, [config.id]);

  const recover = React.useCallback(() => {
    return healthMonitor.recover(config.id);
  }, [config.id]);

  const reset = React.useCallback(() => {
    healthMonitor.reset(config.id);
  }, [config.id]);

  return {
    status,
    reportError,
    recover,
    reset,
    isHealthy: status?.status === 'healthy',
    isDegraded: status?.status === 'degraded',
    isFailed: status?.status === 'failed',
    isRecovering: status?.status === 'recovering',
  };
}

// Utility functions for graceful degradation
export function createGracefulComponent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback: React.ComponentType<Partial<T>> | React.ReactElement | null = null
): React.ComponentType<T> {
  return function GracefulComponent(props: T) {
    const [hasError, setHasError] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);

    React.useEffect(() => {
      if (hasError && retryCount < 3) {
        const timer = setTimeout(() => {
          setHasError(false);
          setRetryCount(prev => prev + 1);
        }, 1000 * Math.pow(2, retryCount));

        return () => clearTimeout(timer);
      }
    }, [hasError, retryCount]);

    if (hasError) {
      if (React.isValidElement(fallback)) {
        return fallback;
      }
      
      if (fallback) {
        const FallbackComponent = fallback as React.ComponentType<Partial<T>>;
        return <FallbackComponent {...props} />;
      }

      return (
        <div style={{ 
          padding: '16px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          backgroundColor: '#f5f5f5'
        }}>
          Component failed to render
          <button 
            onClick={() => {
              setHasError(false);
              setRetryCount(0);
            }}
            style={{ marginLeft: '8px' }}
          >
            Retry
          </button>
        </div>
      );
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      console.error('Component render error:', error);
      setHasError(true);
      return null;
    }
  };
}

// Auto-recovery utilities
export function withAutoRecovery<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
  } = {}
): React.ComponentType<T> {
  const { maxRetries = 3, retryDelay = 1000, onError } = options;

  return function AutoRecoveryComponent(props: T) {
    const [error, setError] = React.useState<Error | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);
    const [isRecovering, setIsRecovering] = React.useState(false);

    const handleError = React.useCallback((error: Error) => {
      setError(error);
      onError?.(error);
      
      if (retryCount < maxRetries) {
        setIsRecovering(true);
        setTimeout(() => {
          setError(null);
          setRetryCount(prev => prev + 1);
          setIsRecovering(false);
        }, retryDelay * Math.pow(2, retryCount));
      }
    }, [retryCount, maxRetries, retryDelay, onError]);

    const reset = React.useCallback(() => {
      setError(null);
      setRetryCount(0);
      setIsRecovering(false);
    }, []);

    if (error && retryCount >= maxRetries) {
      return (
        <div style={{ 
          padding: '16px', 
          border: '1px solid #ff6b6b', 
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          <div>Component failed after {maxRetries} retries</div>
          <div style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
            {error.message}
          </div>
          <button onClick={reset}>Reset</button>
        </div>
      );
    }

    if (isRecovering) {
      return (
        <div style={{ 
          padding: '16px', 
          border: '1px solid #ffa500', 
          borderRadius: '4px',
          backgroundColor: '#fff3cd'
        }}>
          Recovering... (attempt {retryCount + 1}/{maxRetries})
        </div>
      );
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  };
}

// Performance monitoring utilities
export function usePerformanceMonitor(componentName: string) {
  const startTime = React.useRef<number>();
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current++;
    const endTime = performance.now();
    
    if (startTime.current) {
      const renderTime = endTime - startTime.current;
      
      if (renderTime > 16) { // Longer than one frame
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  React.useLayoutEffect(() => {
    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
    logPerformance: () => {
      console.log(`${componentName} render count: ${renderCount.current}`);
    }
  };
}