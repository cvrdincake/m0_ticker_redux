import React, { useEffect, useState } from 'react';
import { useWidgetMotion, useListStagger } from '@/hooks/useWidgetMotion';
import type { AnimatedListConfig } from '@/widgets/registry';

interface AnimatedListProps {
  config: AnimatedListConfig;
  onConfigChange?: (config: AnimatedListConfig) => void;
}

export default function AnimatedList({ config, onConfigChange }: AnimatedListProps) {
  const motion = useWidgetMotion({
    role: 'card',
    parallaxMax: 30,
  });
  
  const { listRef, staggerIn, staggerOut } = useListStagger(config.maxStagger);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if ('element' in motion && containerRef.current) {
      (motion as any).element = containerRef.current;
    }
    motion.enter();
    
    return () => {
      motion.cleanup();
    };
  }, []);
  
  useEffect(() => {
    // Trigger stagger animation when items change
    if (config.items.length > 0) {
      const timer = setTimeout(() => {
        staggerIn(config.staggerDelay);
      }, 100); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [config.items, config.staggerDelay, staggerIn]);
  
  const handleItemClick = (item: string, index: number) => {
    console.log(`List item clicked: ${item} (index: ${index})`);
  };
  
  return (
    <div
      ref={containerRef}
      className="widget-animated-list"
      role="group"
      aria-label={config.ariaLabel || config.title}
      data-testid="widget-animated-list"
    >
      <div className="list-header">
        <h3 className="list-title">{config.title}</h3>
        <span className="list-count" aria-label={`${config.items.length} items`}>
          {config.items.length}
        </span>
      </div>
      
      {config.items.length === 0 ? (
        <div className="list-empty" role="status" aria-live="polite">
          <span className="empty-icon" aria-hidden="true">📝</span>
          <p className="empty-message">No items to display</p>
        </div>
      ) : (
        <ul
          ref={listRef}
          className="list-items"
          role="list"
          aria-label={`List with ${config.items.length} items`}
        >
          {config.items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="list-item"
              role="listitem"
              onClick={() => handleItemClick(item, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item, index);
                }
              }}
              tabIndex={0}
              aria-label={`Item ${index + 1}: ${item}`}
            >
              <span className="item-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="item-content">{item}</span>
              <span className="item-indicator" aria-hidden="true">→</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="list-background-grid" aria-hidden="true" />
    </div>
  );
}

// Animated List styles
const styles = `
.widget-animated-list {
  background: var(--surface);
  border: var(--border-width-thin) solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  min-height: var(--widget-min-height);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  position: relative;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-family-sans);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.list-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin: 0;
  color: var(--ink);
}

.list-count {
  background: var(--accent);
  color: var(--surface);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-mono);
  min-width: 24px;
  text-align: center;
}

.list-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border: var(--border-width-thin) solid transparent;
  position: relative;
  z-index: 1;
}

.list-item:hover {
  background: var(--accent);
  color: var(--surface);
  border-color: var(--accent);
}

.list-item:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus);
  outline-offset: var(--focus-ring-offset);
}

.item-index {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--muted);
  min-width: 24px;
  text-align: center;
  background: var(--surface);
  border: var(--border-width-thin) solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2px 4px;
}

.list-item:hover .item-index {
  background: var(--surface);
  color: var(--accent);
  border-color: var(--surface);
}

.item-content {
  flex: 1;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

.item-indicator {
  font-size: var(--font-size-sm);
  color: var(--muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--duration-fast) var(--ease-out);
}

.list-item:hover .item-indicator {
  opacity: 1;
  transform: translateX(0);
  color: var(--surface);
}

.list-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  text-align: center;
  color: var(--muted);
}

.empty-icon {
  font-size: var(--font-size-2xl);
  opacity: 0.5;
}

.empty-message {
  margin: 0;
  font-size: var(--font-size-md);
  font-style: italic;
}

.list-background-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.02;
  pointer-events: none;
  z-index: 0;
}

/* High contrast mode */
html.hc .widget-animated-list {
  border-width: var(--border-width-medium);
}

html.hc .list-item {
  border-width: var(--border-width-thin);
}

html.hc .list-item:hover {
  border-width: var(--border-width-medium);
}

html.hc .list-background-grid {
  opacity: 0.1;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .list-item {
    transition: none;
  }
  
  .item-indicator {
    transition: none;
    opacity: 1;
    transform: none;
  }
  
  .list-item:hover .item-indicator {
    transform: none;
  }
}
`;