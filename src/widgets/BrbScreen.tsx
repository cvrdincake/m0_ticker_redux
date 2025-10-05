import React, { useEffect, useRef, useState } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { BrbScreenConfig } from '@/widgets/registry';
import { useFocusTrap } from '@/utils/accessibility';

interface BrbScreenProps {
  config: BrbScreenConfig;
  onConfigChange?: (next: BrbScreenConfig) => void;
}

export default function BrbScreen({ config, onConfigChange }: BrbScreenProps) {
  const motion = useWidgetMotion({ role: 'modal', parallaxMax: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [remaining, setRemaining] = useState<number | undefined>(config.countdown);

  useFocusTrap(containerRef, isVisible);

  useEffect(() => {
    if (remaining === undefined || remaining <= 0) return;
    const interval = setInterval(() => setRemaining((prev) => (prev != null ? prev - 1 : undefined)), 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  useEffect(() => {
    if (remaining !== undefined && remaining <= 0) {
      setIsVisible(false);
      onConfigChange?.({ ...config, countdown: 0 });
    }
  }, [remaining]);

  useEffect(() => {
    return () => {
      if (motion && typeof (motion as any).cleanup === 'function') {
        (motion as any).cleanup();
      }
    };
  }, []);

  if (!isVisible) return null;

  const formattedTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="widget-brb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={config.ariaLabel || config.title || 'Be Right Back Screen'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ink)',
        color: 'var(--surface)',
        textAlign: 'center',
        padding: '2rem',
        backgroundImage: config.image ? `url(${config.image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        ref={(el) => {
          containerRef.current = el as HTMLDivElement | null;
          if (el && 'element' in motion) {
            (motion as any).element = el;
            motion.enter();
          }
        }}
        style={{ maxWidth: '600px' }}
      >
        <h1 style={{ marginBottom: '0.5rem', fontSize: 'var(--font-size-2xl)' }}>{config.message}</h1>
        <p style={{ marginBottom: '1.5rem', fontSize: 'var(--font-size-md)' }}>{config.subMessage}</p>

        {remaining !== undefined && remaining > 0 && (
          <p aria-live="polite" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '1.5rem' }}>
            {formattedTime(remaining)}
          </p>
        )}

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-base)',
            background: 'var(--accent)',
            color: 'var(--surface)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'var(--font-weight-medium)',
          }}
          aria-label="Resume broadcast"
        >
          Resume
        </button>
      </div>
    </div>
  );
}
