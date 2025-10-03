import React, { useEffect } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { ButtonConfig } from '@/widgets/registry';

interface ButtonProps {
  config: ButtonConfig;
  onConfigChange?: (config: ButtonConfig) => void;
}

export default function Button({ config, onConfigChange }: ButtonProps) {
  const motion = useWidgetMotion({
    role: 'card',
    parallaxMax: 10,
  });
  
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if ('element' in motion && buttonRef.current) {
      (motion as any).element = buttonRef.current;
    }
    motion.enter();
    
    return () => {
      motion.cleanup();
    };
  }, []);
  
  const handleClick = () => {
    // Button click handler - could emit events or call actions
    console.log(`Button "${config.label}" clicked`);
  };
  
  return (
    <button
      ref={buttonRef}
      className={`widget-button variant-${config.variant} size-${config.size}`}
      disabled={config.disabled}
      onClick={handleClick}
      aria-label={config.ariaLabel || config.label}
      data-testid="widget-button"
      type="button"
    >
      <span className="button-label">{config.label}</span>
    </button>
  );
}

// Button styles
const styles = `
.widget-button {
  background: var(--accent);
  color: var(--surface);
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  text-decoration: none;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.widget-button:hover:not(:disabled) {
  background: var(--ink);
  transform: translateY(-1px);
}

.widget-button:active:not(:disabled) {
  transform: translateY(0);
}

.widget-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--muted);
  color: var(--surface);
}

/* Variants */
.widget-button.variant-primary {
  background: var(--ink);
  color: var(--surface);
}

.widget-button.variant-secondary {
  background: transparent;
  color: var(--ink);
  border-color: var(--border);
}

.widget-button.variant-secondary:hover:not(:disabled) {
  background: var(--ink);
  color: var(--surface);
  border-color: var(--ink);
}

.widget-button.variant-ghost {
  background: transparent;
  color: var(--accent);
  border: none;
}

.widget-button.variant-ghost:hover:not(:disabled) {
  background: var(--accent);
  color: var(--surface);
}

/* Sizes */
.widget-button.size-sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  min-height: 32px;
}

.widget-button.size-md {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-md);
  min-height: 40px;
}

.widget-button.size-lg {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-lg);
  min-height: 48px;
}

.button-label {
  position: relative;
  z-index: 1;
}

/* Focus management */
.widget-button:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus);
  outline-offset: var(--focus-ring-offset);
}

/* High contrast mode */
html.hc .widget-button {
  border-width: var(--border-width-medium);
}

html.hc .widget-button.variant-ghost {
  border: var(--border-width-medium) solid var(--border);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .widget-button {
    transition: none;
  }
  
  .widget-button:hover:not(:disabled) {
    transform: none;
  }
  
  .widget-button:active:not(:disabled) {
    transform: none;
  }
}
`;