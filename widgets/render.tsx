// src/widgets/render.tsx
import React, { Suspense, useMemo } from "react";
import { registry, getWidget, WidgetKind } from "@/widgets";
import { useVisibility } from "@/utils/useVisibility";
import styles from "./renderer.module.css";

/** Shape your store items to this minimal contract. */
export type RenderWidget = {
  id: string;
  kind: WidgetKind;
  props?: Record<string, any>;
  /** If set, overrides default overlay visibility */
  overlayVisible?: boolean;
  /** Optional absolute positioning for overlay scenes */
  frame?: { x: number; y: number; w: number; h: number };
};

function HeavyGate({
  isHeavy,
  children,
}: {
  isHeavy?: boolean;
  children: React.ReactNode;
}) {
  const { ref, visible } = useVisibility<HTMLDivElement>("96px");
  if (!isHeavy) return <>{children}</>;
  return (
    <div ref={ref} style={{ minHeight: 24 }}>
      {visible ? children : <div className={styles.skeleton} aria-hidden="true" />}
    </div>
  );
}

/** Overlay item wrapper to apply absolute placement if provided */
function OverlayItem({
  frame,
  children,
}: {
  frame?: { x: number; y: number; w: number; h: number };
  children: React.ReactNode;
}) {
  if (!frame) return <div className={styles.overlayItem}>{children}</div>;
  const { x, y, w, h } = frame;
  return (
    <div
      className={styles.overlayItem}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
      }}
    >
      {children}
    </div>
  );
}

/** ---- Public: renderers ----------------------------------------- */

/** Dashboard renderer: grid-aware parent passes layout itself */
export function DashboardRenderer({
  widgets,
}: {
  widgets: RenderWidget[];
}) {
  return (
    <div className={styles.dashboardWrap}>
      {widgets.map((w) => {
        const def = getWidget(w.kind);
        const Comp = def.component as any;
        return (
          <div key={w.id} className={styles.dashboardItem}>
            <Suspense fallback={<div className={styles.skeleton} />}>
              <HeavyGate isHeavy={def.isHeavy}>
                <Comp {...(def.defaults || {})} {...w.props} />
              </HeavyGate>
            </Suspense>
          </div>
        );
      })}
    </div>
  );
}

/** Overlay renderer: filters visibility and uses absolute frames */
export function OverlayRenderer({
  widgets,
}: {
  widgets: RenderWidget[];
}) {
  const visible = useMemo(
    () =>
      widgets.filter((w) => {
        const def = getWidget(w.kind);
        const defaultVis = def.overlayDefaultVisible ?? false;
        return w.overlayVisible ?? defaultVis;
      }),
    [widgets]
  );

  return (
    <div className={styles.overlayStage} aria-label="Overlay">
      {visible.map((w) => {
        const def = getWidget(w.kind);
        const Comp = def.component as any;
        return (
          <OverlayItem key={w.id} frame={w.frame}>
            <Suspense fallback={<div className={styles.skeleton} />}>
              <HeavyGate isHeavy={def.isHeavy}>
                <Comp {...(def.defaults || {})} {...w.props} />
              </HeavyGate>
            </Suspense>
          </OverlayItem>
        );
      })}
    </div>
  );
}
