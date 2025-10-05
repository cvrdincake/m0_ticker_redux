import React, { useEffect, useRef, useState } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { PopupAlertConfig } from '@/widgets/registry';
import { useFocusTrap } from '@/utils/accessibility';

interface PopupAlertProps {
  config: PopupAlertConfig;
  onConfigChange?: (next: PopupAlertConfig) => void;
}

export default function PopupAlert({ config, onConfigChange }: PopupAlertProps) {
  const motion = useWidgetMotion({ role: 'modal', parallaxMax: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef, isVisible);

  useEffect(() => {
    return () => {
      if (motion && typeof (motion as any).cleanup === 'function') {
        (motion as any).cleanup();
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={config.ariaLabel || config.title || 'Alert'}
      style={{
        position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
        background: 'rgba(0,0,0,.5)', zIndex: 10000
      }}
    >
      <div
        className="widget-popup-alert"
        ref={(el) => {
          containerRef.current = el as HTMLDivElement | null;
          if (el && 'element' in motion) {
            (motion as any).element = el;
            motion.enter();
          }
        }}
        style={{
          background: 'var(--ink)',
          color: 'var(--surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          minWidth: '320px',
          maxWidth: 'min(90vw,600px)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
            {config.title || 'Alert'}
          </h2>
        </div>

        <p style={{ marginBottom: '1rem' }}>{config.message}</p>

        <div aria-live="polite" aria-atomic="true" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(config.actions || []).map((a, i) => (
            <button
              key={`${a.label}-${i}`}
              type="button"
              onClick={() => {
                if (a.action === 'dismiss') {
                  setIsVisible(false);
                }
                if (a.action === 'confirm') {
                  setIsVisible(false);
                }
                // custom events could be dispatched here
              }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface)',
                background: 'transparent',
                color: 'var(--surface)',
                cursor: 'pointer'
              }}
              aria-label={`Action: ${a.label}`}
            >
              {a.label}
            </button>
          ))}
          {(!config.actions || config.actions.length === 0) && (
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss alert"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
