import React, { Suspense, forwardRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getWidgetSpec, type WidgetKind } from './registry';
import { useWidgetHealth as useHealthMonitoring } from './health';
import { Card } from '@/design-system/components';
import { useWidgetMotion } from '@/hooks';
import styles from './render.module.css';

export interface WidgetConfig {
  kind: WidgetKind;
  id: string;
  props: Record<string, any>;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface WidgetRenderProps {
  config: WidgetConfig;
  isPreview?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

// Error fallback component
function WidgetErrorFallback({ 
  error, 
  resetErrorBoundary, 
  config 
}: { 
  error: Error; 
  resetErrorBoundary: () => void; 
  config: WidgetConfig;
}) {
  // Use motion for entrance animation
  useWidgetMotion('card', 'entrance');
  
  return (
    <Card className={styles.errorFallback}>
      <div className={styles.errorContent}>
        <div className={styles.errorTitle}>Widget Error</div>
        <div className={styles.errorMessage}>{config.kind} failed to render</div>
        <div className={styles.errorDetails}>{error.message}</div>
        <button 
          onClick={resetErrorBoundary}
          className={styles.retryButton}
          aria-label="Retry widget"
        >
          Retry
        </button>
      </div>
    </Card>
  );
}

// Loading skeleton component
function WidgetSkeleton({ kind }: { kind: WidgetKind }) {
  const spec = getWidgetSpec(kind);
  
  return (
    <Card className={styles.skeleton}>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonTitle}></div>
        </div>
        <div className={styles.skeletonBody}>
          {spec.kind === 'chart' && (
            <div className={styles.skeletonChart}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={styles.skeletonBar}
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          )}
          {spec.kind === 'table' && (
            <div className={styles.skeletonTable}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className={styles.skeletonCell} />
                  ))}
                </div>
              ))}
            </div>
          )}
          {spec.kind === 'kpi' && (
            <div className={styles.skeletonKpi}>
              <div className={styles.skeletonKpiLabel} />
              <div className={styles.skeletonKpiValue} />
            </div>
          )}
          {!['chart', 'table', 'kpi'].includes(spec.kind) && (
            <>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

// Empty state component
function WidgetEmptyState({ kind }: { kind: WidgetKind }) {
  const spec = getWidgetSpec(kind);
  
  return (
    <Card className={styles.emptyState}>
      <div className={styles.emptyContent}>
        <div className={styles.emptyTitle}>No Data</div>
        <div>{spec.title} has no data to display</div>
      </div>
    </Card>
  );
}

// Health checker hook
function useWidgetHealth(config: WidgetConfig) {
  return useHealthMonitoring(config);
}

// Main widget renderer
export const WidgetRenderer = forwardRef<HTMLDivElement, WidgetRenderProps>(
  ({ config, isPreview = false, onError, className, ...props }, ref) => {
    const { status, reportError, reset, isFailed, isRecovering } = useWidgetHealth(config);
    
    // Get widget specification
    const spec = React.useMemo(() => {
      try {
        return getWidgetSpec(config.kind);
      } catch (error) {
        console.error('Failed to get widget spec:', error);
        return null;
      }
    }, [config.kind]);
    
    // Validate and merge props with defaults
    const validatedProps = React.useMemo((): Record<string, any> => {
      if (!spec) return {};
      
      try {
        const merged = { ...spec.defaults, ...config.props };
        return spec.schema.parse(merged) as Record<string, any>;
      } catch (error) {
        console.error('Widget props validation failed:', error);
        return spec.defaults;
      }
    }, [spec, config.props]);
    
    // Handle failed health state
    if (!spec || isFailed) {
      return (
        <div 
          ref={ref}
          className={`${styles.widgetWrapper} ${className || ''}`}
          {...props}
        >
          <WidgetErrorFallback 
            error={new Error('Widget failed after multiple retries')}
            resetErrorBoundary={reset}
            config={config}
          />
        </div>
      );
    }

    // Handle recovering state
    if (isRecovering) {
      return (
        <div 
          ref={ref}
          className={`${styles.widgetWrapper} ${className || ''}`}
          {...props}
        >
          <WidgetSkeleton kind={config.kind} />
        </div>
      );
    }
    
    // Check for empty state
    const isEmpty = React.useMemo(() => {
      if (spec.kind === 'table') {
        return !validatedProps.rows || validatedProps.rows.length === 0;
      }
      if (spec.kind === 'list') {
        return !validatedProps.items || validatedProps.items.length === 0;
      }
      if (spec.kind === 'chart') {
        return !validatedProps.data || validatedProps.data.length === 0;
      }
      if (spec.kind === 'kpi') {
        return validatedProps.value === null || validatedProps.value === undefined || validatedProps.value === '';
      }
      return false;
    }, [spec.kind, validatedProps]);
    
    if (isEmpty && !isPreview) {
      return (
        <div 
          ref={ref}
          className={`${styles.widgetWrapper} ${className || ''}`}
          {...props}
        >
          <WidgetEmptyState kind={config.kind} />
        </div>
      );
    }
    
    const WidgetComponent = spec.component;
    
    return (
      <div 
        ref={ref}
        className={`${styles.widgetWrapper} ${className || ''}`}
        data-widget-kind={config.kind}
        data-widget-id={config.id}
        {...props}
      >
        <ErrorBoundary
          FallbackComponent={(props) => (
            <WidgetErrorFallback {...props} config={config} />
          )}
          onError={(error, errorInfo) => {
            reportError(error);
            onError?.(error, errorInfo);
          }}
          onReset={reset}
        >
          <Suspense fallback={<WidgetSkeleton kind={config.kind} />}>
            <WidgetComponent {...validatedProps} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }
);

WidgetRenderer.displayName = 'WidgetRenderer';

// Utility to create widget configs with safe defaults
export function createWidgetConfig(
  kind: WidgetKind,
  id: string,
  overrides: Partial<WidgetConfig> = {}
): WidgetConfig {
  const spec = getWidgetSpec(kind);
  
  return {
    kind,
    id,
    props: spec.defaults,
    w: spec.defaultSize.w,
    h: spec.defaultSize.h,
    x: 0,
    y: 0,
    ...overrides,
  };
}

// Health monitoring utilities
export function validateWidgetConfig(config: WidgetConfig): boolean {
  try {
    const spec = getWidgetSpec(config.kind);
    spec.schema.parse({ ...spec.defaults, ...config.props });
    return true;
  } catch {
    return false;
  }
}

export function sanitizeWidgetConfig(config: WidgetConfig): WidgetConfig {
  try {
    const spec = getWidgetSpec(config.kind);
    const validatedProps = spec.schema.parse({ ...spec.defaults, ...config.props }) as Record<string, any>;
    
    return {
      ...config,
      props: validatedProps,
      w: Math.max(config.w || spec.defaultSize.w, spec.minSize.w),
      h: Math.max(config.h || spec.defaultSize.h, spec.minSize.h),
    };
  } catch (error) {
    console.error('Failed to sanitize widget config:', error);
    return createWidgetConfig(config.kind, config.id);
  }
}
