// src/widgets/index.ts
import { lazy, ComponentType } from "react";

/** ----- Types ---------------------------------------------------- */
export type WidgetKind =
  | "ticker"
  | "lowerThird"
  | "kpi"
  | "brbScreen"
  | "popupAlert";

export type WidgetProps = Record<string, any>;

export interface WidgetDefinition<P extends WidgetProps = WidgetProps> {
  kind: WidgetKind;
  /** Human label shown in UIs (inspector, palette) */
  label: string;
  /** Lazy component for code-splitting */
  component: ComponentType<P> | React.LazyExoticComponent<ComponentType<P>>;
  /** Is this widget typically used on /overlay */
  overlayDefaultVisible?: boolean;
  /** Hint to defer mounting behind IntersectionObserver */
  isHeavy?: boolean;
  /** Default props used by “Add widget” & presets */
  defaults?: Partial<P>;
  /** Suggested min size for grid/overlay planners */
  minSize?: { w: number; h: number };
}

export type WidgetRegistry = Record<WidgetKind, WidgetDefinition>;

/** ----- Registry -------------------------------------------------- */
/** NOTE: Adjust import paths to your concrete widget file locations. */
export const registry: WidgetRegistry = {
  ticker: {
    kind: "ticker",
    label: "Ticker",
    component: lazy(() => import("@/widgets/Ticker/TickerWidget")),
    overlayDefaultVisible: true,
    isHeavy: false,
    defaults: {
      speedPxPerSec: 80,
      text: "Welcome to the stream • Follow, Like & Subscribe • New videos weekly",
      gapPx: 48,
    },
    minSize: { w: 8, h: 2 },
  },
  lowerThird: {
    kind: "lowerThird",
    label: "Lower Third",
    component: lazy(() => import("@/widgets/LowerThird/LowerThird")),
    overlayDefaultVisible: true,
    isHeavy: false,
    defaults: {
      title: "Henry “Moose” Wildman",
      subtitle: "Live • M0 Studio",
      align: "left",
    },
    minSize: { w: 6, h: 2 },
  },
  kpi: {
    kind: "kpi",
    label: "KPI",
    component: lazy(() => import("@/widgets/KPI/KPIWidget")),
    overlayDefaultVisible: false,
    isHeavy: true, // usually chart/metrics heavy
    defaults: { label: "Viewers", value: 0 },
    minSize: { w: 3, h: 2 },
  },
  brbScreen: {
    kind: "brbScreen",
    label: "BRB Screen",
    component: lazy(() => import("@/widgets/BrbScreen/BrbScreen")),
    overlayDefaultVisible: true,
    isHeavy: false,
    defaults: { message: "Be Right Back" },
    minSize: { w: 12, h: 8 },
  },
  popupAlert: {
    kind: "popupAlert",
    label: "Popup Alert",
    component: lazy(() => import("@/widgets/PopupAlert/PopupAlert")),
    overlayDefaultVisible: true,
    isHeavy: false,
    defaults: { title: "New Follower", message: "Thanks for the support!" },
    minSize: { w: 4, h: 3 },
  },
};

/** ----- Helpers --------------------------------------------------- */
export function getWidget(kind: WidgetKind): WidgetDefinition {
  const def = registry[kind];
  if (!def) throw new Error(`Unknown widget kind: ${kind}`);
  return def;
}

export function listWidgets(): WidgetDefinition[] {
  return Object.values(registry);
}
