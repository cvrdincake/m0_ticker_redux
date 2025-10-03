import React, { Suspense, useState, useEffect } from 'react';
import { WidgetConfig, WidgetKind, getWidget, validateWidgetConfig } from '@/widgets/registry';

interface WidgetHostProps {
  kind: WidgetKind;
  config: WidgetConfig;
  onConfigChange?: (config: WidgetConfig) => void;
  className?: string;
  id?: string;
}

interface WidgetState {
  status: 'loading' | 'ready' | 'error';
  error?: string;
}

export function WidgetHost({ kind, config, onConfigChange, className, id }: WidgetHostProps) {
  const [state, setState] = useState<WidgetState>({ status: 'loading' });
  const [validatedConfig, setValidatedConfig] = useState<WidgetConfig | null>(null);
  
  const spec = getWidget(kind);
  
  useEffect(() => {
    if (!spec) {
      setState({ status: 'error', error: `Unknown widget kind: ${kind}` });
      return;
    }
    
    // Validate configuration
    const validation = validateWidgetConfig(kind, config);
    if (!validation.success) {
      console.warn(`Widget ${kind} configuration invalid, using defaults:`, validation.error);
      setValidatedConfig(spec.defaults);
    } else {
      setValidatedConfig(validation.data);
    }
    
    setState({ status: 'ready' });
  }, [kind, config, spec]);
  
  const handleConfigChange = (newConfig: WidgetConfig) => {
    const validation = validateWidgetConfig(kind, newConfig);
    if (validation.success) {
      setValidatedConfig(validation.data);
      onConfigChange?.(validation.data);
    } else {
      console.error(`Invalid configuration for ${kind}:`, validation.error);
    }
  };
  
  if (!spec) {
    return (
      <div 
        className={`widget-error ${className || ''}`}
        role="alert"
        aria-label={`Error: Unknown widget type ${kind}`}
      >
        <div className="error-content">
          <h3>Widget Error</h3>
          <p>Unknown widget type: {kind}</p>
        </div>
      </div>
    );
  }
  
  if (state.status === 'error') {
    return (
      <div 
        className={`widget-error ${className || ''}`}
        role="alert"
        aria-label={`Error loading ${spec.name}`}
      >
        <div className="error-content">
          <h3>Widget Error</h3>
          <p>{state.error}</p>
        </div>
      </div>
    );
  }
  
  if (state.status === 'loading' || !validatedConfig) {
    return (
      <div 
        className={`widget-skeleton ${className || ''}`}
        role="group"
        aria-label={`Loading ${spec.name}`}
      >
        <div className="skeleton-content">
          <div className="skeleton-header" />
          <div className="skeleton-body">
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </div>
    );
  }
  
  const WidgetComponent = spec.component;
  
  return (
    <div 
      className={`widget-host ${className || ''}`}
      role="group"
      aria-label={validatedConfig.ariaLabel || validatedConfig.title || spec.name}
      id={id}
      data-widget-kind={kind}
      data-motion-role={spec.role}
      data-parallax-max={spec.parallaxMax}
      data-overlay-supported={spec.overlaySupported}
    >
      <Suspense 
        fallback={
          <div className="widget-skeleton">
            <div className="skeleton-content">
              <div className="skeleton-header" />
              <div className="skeleton-body">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          </div>
        }
      >
        <WidgetComponent 
          config={validatedConfig} 
          onConfigChange={handleConfigChange}
        />
      </Suspense>
    </div>
  );
}

export default WidgetHost;