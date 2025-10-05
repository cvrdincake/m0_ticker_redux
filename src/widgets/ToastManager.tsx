import { useEffect } from 'react';
import { useDashboardStore, type ToastItem } from '@/store/useDashboard';
import type { ToastConfig } from '@/widgets/registry';

interface ToastManagerProps {
  config: ToastConfig;
}

const TOAST_ICONS: Record<ToastItem['type'], string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '⛔️',
};

export default function ToastManager({ config }: ToastManagerProps) {
  const toasts = useDashboardStore(state => state.toasts);
  const triggerToast = useDashboardStore(state => state.triggerToast);
  const dismissToast = useDashboardStore(state => state.dismissToast);

  useEffect(() => {
    if (!config.message) return;
    triggerToast({ message: config.message, type: config.type, duration: config.duration });
  }, [config.duration, config.message, config.type, triggerToast]);

  if (toasts.length === 0) {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          minWidth: 280,
          padding: '0.75rem 1rem',
          borderRadius: 12,
          background: 'rgba(15, 18, 26, 0.85)',
          color: 'var(--ink, #f5f5f6)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div style={{ opacity: 0.6 }}>No active notifications</div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: 'grid',
        gap: '0.75rem',
        minWidth: 280,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
            padding: '0.85rem 1rem',
            borderRadius: 14,
            background: 'rgba(15, 18, 26, 0.92)',
            color: 'var(--ink, #f5f5f6)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.45)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
            {TOAST_ICONS[toast.type]}
          </span>
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{toast.message}</div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
