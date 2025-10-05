import React, { useEffect, useRef } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import { createTextScroller } from '@/lib/ticker';
import type { LowerThirdConfig } from '@/widgets/registry';

interface LowerThirdProps {
  config: LowerThirdConfig;
  onConfigChange?: (config: LowerThirdConfig) => void;
}

export default function LowerThird({ config, onConfigChange }: LowerThirdProps) {
  const motion = useWidgetMotion({
    role: 'banner',
    parallaxMax: 0, // No parallax for overlay components
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerContainerRef = useRef<HTMLDivElement>(null);
  const tickerContentRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<ReturnType<typeof createTextScroller> | null>(null);
  
  useEffect(() => {
    if ('element' in motion && containerRef.current) {
      (motion as any).element = containerRef.current;
    }
    motion.enter();
    
    return () => {
      motion.cleanup();
    };
  }, []);
  
  // Set up ticker animation
  useEffect(() => {
    if (
      config.showTicker && 
      config.tickerText &&
      tickerContainerRef.current && 
      tickerContentRef.current
    ) {
      scrollerRef.current = createTextScroller({
        speed: config.speed,
        container: tickerContainerRef.current,
        content: tickerContentRef.current,
        direction: 'left',
        pauseOnHover: true,
      });
      
      scrollerRef.current.start();
      
      return () => {
        scrollerRef.current?.destroy();
        scrollerRef.current = null;
      };
    }
  }, [config.showTicker, config.tickerText, config.speed]);
  
  return (
    <div
      ref={containerRef}
      className="widget-lower-third"
      role="banner"
      aria-label={config.ariaLabel || `${config.primaryText} - ${config.secondaryText}`}
      data-testid="widget-lower-third"
    >
      {/* Main content area */}
      <div className="lower-third-content">
        <div className="content-main">
          <h2 className="primary-text">{config.primaryText}</h2>
          <p className="secondary-text">{config.secondaryText}</p>
        </div>
        
        <div className="content-accent" aria-hidden="true" />
      </div>
      
      {/* Ticker area */}
      {config.showTicker && config.tickerText && (
        <div 
          className="lower-third-ticker"
          role="marquee"
          aria-label={`Ticker: ${config.tickerText}`}
        >
          <div 
            ref={tickerContainerRef}
            className="ticker-container"
          >
            <div 
              ref={tickerContentRef}
              className="ticker-content"
            >
              {config.tickerText}
            </div>
          </div>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="lower-third-gradient" aria-hidden="true" />
      
      {/* Background pattern */}
      <div className="lower-third-pattern" aria-hidden="true" />
    </div>
  );
}

// Lower Third styles
const styles = `
.widget-lower-third {
  position: relative;
  background: linear-gradient(
    90deg,
    var(--ink) 0%,
    rgba(var(--ink-rgb, 26, 26, 26), 0.95) 70%,
    rgba(var(--ink-rgb, 26, 26, 26), 0.8) 100%
  );
  color: var(--surface);
  font-family: var(--font-family-sans);
  min-height: var(--lower-third-height, 120px);
  overflow: hidden;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
}

.lower-third-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  position: relative;
  z-index: 2;
}

.content-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.primary-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin: 0;
  color: var(--surface);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.secondary-text {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  margin: 0;
  color: var(--surface);
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.content-accent {
  width: 4px;
  height: 60px;
  background: var(--surface);
  border-radius: var(--radius-full);
  margin-left: var(--space-lg);
  opacity: 0.8;
}

.lower-third-ticker {
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  border-top: var(--border-width-thin) solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
}

.ticker-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}

.ticker-content {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--surface);
  white-space: nowrap;
  font-family: var(--font-family-mono);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  padding: 0 var(--space-md);
}

.lower-third-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}

.lower-third-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.02) 2px,
      rgba(255, 255, 255, 0.02) 4px
    );
  pointer-events: none;
  z-index: 0;
}

/* Hover effects */
.widget-lower-third:hover .ticker-content {
  animation-play-state: paused;
}

/* Focus management */
.widget-lower-third:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus);
  outline-offset: var(--focus-ring-offset);
}

/* High contrast mode */
html.hc .widget-lower-third {
  background: var(--ink);
  border: var(--border-width-medium) solid var(--surface);
}

html.hc .lower-third-ticker {
  background: rgba(0, 0, 0, 0.8);
  border-top-width: var(--border-width-medium);
}

html.hc .lower-third-gradient,
html.hc .lower-third-pattern {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lower-third-content {
    padding: var(--space-md);
  }
  
  .primary-text {
    font-size: var(--font-size-lg);
  }
  
  .secondary-text {
    font-size: var(--font-size-sm);
  }
  
  .content-accent {
    width: 3px;
    height: 40px;
    margin-left: var(--space-md);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ticker-content {
    animation: none;
    transform: translateX(0) !important;
    position: static;
  }
  
  .lower-third-gradient,
  .lower-third-pattern {
    display: none;
  }
}

/* Broadcast safe colors - ensure no pure white/black */
.widget-lower-third {
  background: linear-gradient(
    90deg,
    hsl(0, 0%, 8%) 0%,
    hsla(0, 0%, 8%, 0.95) 70%,
    hsla(0, 0%, 8%, 0.8) 100%
  );
}

.primary-text,
.secondary-text,
.ticker-content {
  color: hsl(0, 0%, 95%);
}

.content-accent {
  background: hsl(0, 0%, 95%);
}
 return (
     <div
       ref={containerRef}
       className="widget-lower-third"
       role="banner"
       aria-label={config.ariaLabel || `${config.primaryText} - ${config.secondaryText}`}
     >
       <div className="lower-third-content">
-        <span className="primary-text">{config.primaryText}</span>
-        <span className="secondary-text">{config.secondaryText}</span>
+        <span
+          className="primary-text"
+          style={{
+            ...(config.primarySize ? { fontSize: config.primarySize } : null),
+            ...(config.primaryColor ? { color: config.primaryColor } : null),
+          }}
+        >
+          {config.primaryText}
+        </span>
+        <span
+          className="secondary-text"
+          style={{
+            ...(config.secondarySize ? { fontSize: config.secondarySize } : null),
+            ...(config.secondaryColor ? { color: config.secondaryColor } : null),
+          }}
+        >
+          {config.secondaryText}
+        </span>
       </div>

       {config.showTicker && config.tickerText && (
         <div
           ref={tickerContainerRef}
           className="lower-third-ticker"
         >
           <div ref={tickerContentRef} className="lower-third-ticker__content">
             {config.tickerText}
           </div>
         </div>
       )}
     </div>
   );
 }
