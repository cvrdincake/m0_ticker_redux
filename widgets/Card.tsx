import React, { useEffect } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { CardConfig } from '@/widgets/registry';

interface CardProps {
  config: CardConfig;
  onConfigChange?: (config: CardConfig) => void;
}

export default function Card({ config, onConfigChange }: CardProps) {
  const motion = useWidgetMotion({
    role: 'card',
    parallaxMax: 20,
    onComplete: () => {
      // Optional: Add entrance completion logic
    },
  });
  
  useEffect(() => {
    if ('element' in motion) {
      motion.element = cardRef.current;
    }
    motion.enter();
    
    return () => {
      motion.cleanup();
    };
  }, []);
  
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Apply element ref to motion controls
  React.useEffect(() => {
    if ('element' in motion && cardRef.current) {
      (motion as any).element = cardRef.current;
    }
  }, [motion]);
  
  return (
    <div
      ref={cardRef}
      className={`widget-card variant-${config.variant}`}
      role="group"
      aria-label={config.ariaLabel || config.title}
      data-testid="widget-card"
    >
      <div className="card-header">
        <h3 className="card-title">{config.title}</h3>
      </div>
      
      <div className="card-content">
        <p>{config.content}</p>
      </div>
      
      {config.variant === 'elevated' && (
        <div className="card-shadow" aria-hidden="true" />
      )}
    </div>
  );
}

// CSS Module styles would be applied via className
const styles = `
.widget-card {
  background: var(--surface);
  border: var(--border-width-thin) solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  min-height: var(--widget-min-height);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  position: relative;
  color: var(--ink);
  font-family: var(--font-family-sans);
}

.widget-card.variant-outlined {
  border-width: var(--border-width-medium);
  background: transparent;
}

.widget-card.variant-elevated {
  box-shadow: var(--shadow-md);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin: 0;
  color: var(--ink);
}

.card-content {
  flex: 1;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--muted);
}

.card-content p {
  margin: 0;
}

.card-shadow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent 0%, var(--accent) 100%);
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}

/* High contrast mode */
html.hc .widget-card {
  border-width: var(--border-width-medium);
  background: var(--surface);
}

html.hc .widget-card.variant-elevated {
  border: var(--border-width-medium) solid var(--border);
}

/* Focus management */
.widget-card:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus);
  outline-offset: var(--focus-ring-offset);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .widget-card {
    transition: none;
  }
}
`;