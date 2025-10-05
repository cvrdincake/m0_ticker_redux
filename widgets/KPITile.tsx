import React, { useEffect, useState } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { KPIConfig } from '@/widgets/registry';

interface KPITileProps {
  config: KPIConfig;
  onConfigChange?: (config: KPIConfig) => void;
}

export default function KPITile({ config, onConfigChange }: KPITileProps) {
  const motion = useWidgetMotion({
    role: 'kpi',
    parallaxMax: 25,
  });
  
  const tileRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if ('element' in motion && tileRef.current) {
      (motion as any).element = tileRef.current;
    }
    motion.enter();
    
    return () => {
      motion.cleanup();
    };
  }, []);
  
  const formatValue = (value: string, format: KPIConfig['format']) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(numValue);
      case 'percentage':
        return `${numValue}%`;
      default:
        return new Intl.NumberFormat('en-GB').format(numValue);
    }
  };
  
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'neutral':
        return '→';
      default:
        return null;
    }
  };
  
  const getTrendClass = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      case 'neutral':
        return 'trend-neutral';
      default:
        return '';
    }
  };
  
  return (
    <div
      ref={tileRef}
      className="widget-kpi"
      role="group"
      aria-label={config.ariaLabel || `${config.label}: ${formatValue(config.value, config.format)}`}
      data-testid="widget-kpi"
    >
      <div className="kpi-header">
        <h3 className="kpi-label">{config.label}</h3>
      </div>
      
      <div className="kpi-value-container">
        <span className="kpi-value" aria-label={`Value: ${formatValue(config.value, config.format)}`}>
          {formatValue(config.value, config.format)}
        </span>
        
        {config.trend && (
          <div className={`kpi-trend ${getTrendClass(config.trend)}`}>
            <span className="trend-icon" aria-hidden="true">
              {getTrendIcon(config.trend)}
            </span>
            {config.trendValue && (
              <span className="trend-value" aria-label={`Trend: ${config.trendValue}`}>
                {config.trendValue}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="kpi-background-pattern" aria-hidden="true" />
    </div>
  );
}

// KPI Tile styles
const styles = `
.widget-kpi {
  background: var(--surface);
  border: var(--border-width-thin) solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  min-height: var(--widget-min-height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-family-sans);
}

.kpi-header {
  margin-bottom: var(--space-md);
}

.kpi-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  margin: 0;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value-container {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--ink);
  font-family: var(--font-family-mono);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.kpi-trend.trend-up {
  color: var(--success);
}

.kpi-trend.trend-down {
  color: var(--error);
}

.kpi-trend.trend-neutral {
  color: var(--muted);
}

.trend-icon {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.trend-value {
  font-family: var(--font-family-mono);
}

.kpi-background-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(135deg, transparent 40%, var(--accent) 100%);
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

/* All content above background pattern */
.kpi-header,
.kpi-value-container {
  position: relative;
  z-index: 1;
}

/* Hover effects */
.widget-kpi:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

/* Focus management */
.widget-kpi:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus);
  outline-offset: var(--focus-ring-offset);
}

/* High contrast mode */
html.hc .widget-kpi {
  border-width: var(--border-width-medium);
  background: var(--surface);
}

html.hc .kpi-background-pattern {
  opacity: 0.1;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .kpi-value-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  
  .kpi-value {
    font-size: var(--font-size-2xl);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .widget-kpi {
    transition: none;
  }
}
`;