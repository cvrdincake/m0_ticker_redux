import React, { useEffect, useRef, useState } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { BrbScreenConfig } from '@/widgets/registry';
import { useFocusTrap } from '@/utils/accessibility';

/**
 * BRB Screen widget.
 *
 * This overlay covers the entire viewport and displays a message
 * indicating that the broadcast will return shortly.  If a countdown
 * duration is provided in seconds, the component displays a timer
 * counting down to zero.  When the timer completes, the overlay
 * automatically hides itself.
 */
export default function BrbScreen({ config, onConfigChange }: BrbScreenProps) {
  const motion = useWidgetMotion({ role: 'modal', parallaxMax: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [remaining, setRemaining] = useState<number | undefined>(config.countdown);

  // Activate focus trap when visible
  useFocusTrap(containerRef, isVisible);

  // Countdown effect
  useEffect(() => {
    if (remaining === undefined || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => (prev != null ? prev - 1 : undefined));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  // When countdown reaches zero, hide the overlay
  useEffect(() => {
    if (remaining !== undefined && remaining <= 0) {
      setIsVisible(false);
      onConfigChange?.({ ...config, countdown: 0 });
    }
  }, [remaining]);

  // Clean up motion timelines on unmount
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: '1.5rem',
            }}
            aria-live="polite"
          >
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
        >
          Resume
        </button>
      </div>
    </div>
  );
}
