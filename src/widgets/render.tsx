import { Suspense } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import { getWidget, validateWidgetConfig, type WidgetConfig, type WidgetKind } from '@/widgets/registry';
import styles from './renderer.module.css';

interface WidgetHostProps {
  kind: WidgetKind;
  config: WidgetConfig;
  id?: string;
  className?: string;
}

export function WidgetHost({ kind, config, id, className }: WidgetHostProps) {
  const spec = getWidget(kind);

  if (!spec) {
    return (
      <div role="alert" className={className}>
        Unknown widget kind: {kind}
      </div>
    );
  }

  const validated = validateWidgetConfig(kind, config);
  const resolvedConfig = validated.success ? (validated.data as WidgetConfig) : spec.defaults;
  const Component = spec.component;

  return (
    <Suspense
      fallback={
        <div className={className}>
          <div className={styles.skeleton} aria-hidden="true" />
        </div>
      }
    >
      <Component config={resolvedConfig} id={id} />
    </Suspense>
  );
}

export interface RenderWidget {
  id: string;
  kind: WidgetKind;
  config: WidgetConfig;
  className?: string;
  frame?: { x: number; y: number; w: number; h: number };
}

export function DashboardRenderer({ widgets }: { widgets: RenderWidget[] }) {
  return (
    <div className={styles.dashboardWrap}>
      {widgets.map(widget => (
        <div key={widget.id} className={styles.dashboardItem}>
          <WidgetHost {...widget} />
        </div>
      ))}
    </div>
  );
}

export function OverlayRenderer({ widgets }: { widgets: RenderWidget[] }) {
  return (
    <div className={styles.overlayStage} aria-label="Overlay">
      {widgets.map(widget => (
        <div
          key={widget.id}
          className={styles.overlayItem}
          style={widget.frame ? {
            position: 'absolute',
            left: widget.frame.x,
            top: widget.frame.y,
            width: widget.frame.w,
            height: widget.frame.h,
          } : undefined}
        >
          <WidgetHost {...widget} />
        </div>
      ))}
    </div>
  );
}

export function OverlayStage() {
  const overlayWidgets = useDashboardStore(state => {
    const dashboard = state.getActiveDashboard();
    if (!dashboard) return [] as RenderWidget[];
    return dashboard.widgets
      .map(id => state.widgets[id])
      .filter(widget => widget && widget.overlayVisible)
      .map(widget => ({
        id: widget.id,
        kind: widget.kind,
        config: widget.config,
        frame: widget.frame,
      })) as RenderWidget[];
  });

  return <OverlayRenderer widgets={overlayWidgets} />;
}

export function renderOverlay() {
  return <OverlayStage />;
}
