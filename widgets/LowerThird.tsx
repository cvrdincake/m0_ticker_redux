import React, { useEffect, useRef } from 'react';
import type { LowerThirdConfig } from '@/widgets/registry';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';

interface LowerThirdProps {
  config: LowerThirdConfig;
  onConfigChange?: (next: LowerThirdConfig) => void;
}

/**
 * Lower Third overlay with optional ticker marquee.
 * Uses token-aware overrides for typography/colours when provided in config.
 */
export default function LowerThird({ config }: LowerThirdProps) {
  const motion = useWidgetMotion({ role: 'banner', parallaxMax: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerContainerRef = useRef<HTMLDivElement>(null);
  const tickerContentRef = useRef<HTMLDivElement>(null);

  // Inject CSS if not already present
  useEffect(() => {
    const id = 'lower-third-inline-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .widget-lower-third {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        padding: var(--space-3) var(--space-4);
        color: var(--surface);
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.7) 60%, rgba(0,0,0,.9) 100%);
        pointer-events: none;
      }
      .lower-third-content {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        pointer-events: auto;
      }
      .lower-third-ticker {
        position: relative;
        overflow: hidden;
        border-top: 1px solid var(--surface-ghost, rgba(255,255,255,.2));
        margin-top: .25rem;
      }
      .lower-third-ticker__content {
        display: inline-block;
        white-space: nowrap;
        will-change: transform;
      }
      .ticker-paused {
        opacity: .65;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Ticker animation (CSS-driven)
  useEffect(() => {
    if (!config.showTicker || !config.tickerText) return;

    const container = tickerContainerRef.current;
    const content = tickerContentRef.current;
    if (!container || !content) return;

    const reset = () => {
      // reset to start position based on direction
      const startX = config.direction === 'right' ? -content.offsetWidth : container.offsetWidth;
      content.style.transform = `translateX(${startX}px)`;
    };

    reset();

    let raf = 0;
    const speed = Math.max(10, Math.min(500, config.speed || 60)); // px/s
    const dir = config.direction === 'right' ? 1 : -1;
    let last = performance.now();

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const cur = new WebKitCSSMatrix(getComputedStyle(content).transform).m41;
      const next = cur + dir * speed * dt;

      if (dir < 0 && next <= -content.offsetWidth) {
        // loop from right edge
        content.style.transform = `translateX(${container.offsetWidth}px)`;
      } else if (dir > 0 && next >= container.offsetWidth) {
        // loop from left edge
        content.style.transform = `translateX(${-content.offsetWidth}px)`;
      } else {
        content.style.transform = `translateX(${next}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const onEnter = () => {
      if (config.pauseOnHover) {
        cancelAnimationFrame(raf);
        content.classList.add('ticker-paused');
      }
    };
    const onLeave = () => {
      if (config.pauseOnHover) {
        last = performance.now();
        content.classList.remove('ticker-paused');
        raf = requestAnimationFrame(step);
      }
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    const ro = new ResizeObserver(() => reset());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  }, [config.showTicker, config.tickerText, config.speed, config.direction, config.pauseOnHover]);

  useEffect(() => {
    return () => {
      if (motion && typeof (motion as any).cleanup === 'function') {
        (motion as any).cleanup();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="widget-lower-third"
      role="banner"
      aria-label={config.ariaLabel || `${config.primaryText} - ${config.secondaryText}`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="lower-third-content" style={{ pointerEvents: 'auto' }}>
        <span
          className="primary-text"
          style={{
            fontWeight: 700,
            ...(config.primarySize ? { fontSize: config.primarySize } : null),
            ...(config.primaryColor ? { color: config.primaryColor } : null),
          }}
        >
          {config.primaryText}
        </span>
        <span
          className="secondary-text"
          style={{
            opacity: .9,
            ...(config.secondarySize ? { fontSize: config.secondarySize } : null),
            ...(config.secondaryColor ? { color: config.secondaryColor } : null),
          }}
        >
          {config.secondaryText}
        </span>
      </div>

      {config.showTicker && config.tickerText && (
        <div
          ref={tickerContainerRef}
          className="lower-third-ticker"
          aria-label="Ticker"
          style={{ pointerEvents: 'auto' }}
        >
          <div ref={tickerContentRef} className="lower-third-ticker__content">
            {config.tickerText}
          </div>
        </div>
      )}
    </div>
  );
}
