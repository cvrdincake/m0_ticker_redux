import { create, type StateCreator } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  widgetRegistry,
  type WidgetConfig,
  type WidgetKind,
} from '@/widgets/registry';

export interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  overlayVisible?: boolean;
  frame?: { x: number; y: number; w: number; h: number };
  config: WidgetConfig;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: string[];
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
}

export interface PopupState {
  title?: string;
  message: string;
  actions?: { id: string; label: string }[];
}

export interface DashboardConfig {
  autoRefresh: boolean;
  refreshInterval: number;
  showGrid: boolean;
  gridSize: number;
  enableAnimations: boolean;
  animationSpeed: number;
  enableParallax: boolean;
  defaultChartHeight: number;
  showDataPoints: boolean;
  lineWidth: number;
}

export interface DashboardSlice {
  widgets: Record<string, WidgetInstance>;
  dashboards: Record<string, DashboardLayout>;
  layouts: string[];
  activeDashboardId: string;
  selectedWidgetId: string | null;
  globalData: Record<string, any[]>;
  toasts: ToastItem[];
  popup: PopupState | null;
  safeMode: boolean;
  highContrast: boolean;
  screenReaderMode: boolean;
  config: DashboardConfig;
  addWidget: (dashboardId: string, kind: WidgetKind) => void;
  updateWidget: (id: string, patch: Partial<WidgetInstance>) => void;
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  selectWidget: (id: string | null) => void;
  getSelectedWidget: () => WidgetInstance | undefined;
  getActiveDashboard: () => DashboardLayout | undefined;
  addWidgetToActive: (kind: WidgetKind) => void;
  nudgeWidget: (id: string, dx: number, dy: number) => void;
  resizeWidget: (id: string, dw: number, dh: number) => void;
  duplicateWidget: (id: string) => void;
  deleteWidget: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  raiseWidget: (id: string) => void;
  lowerWidget: (id: string) => void;
  alignWidgets: (ids: string[], alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => void;
  distributeWidgets: (ids: string[], direction: 'horizontal' | 'vertical') => void;
  switchLayout: (id: string) => void;
  exportDashboard: (id?: string) => DashboardExport | null;
  importDashboard: (bundle: DashboardExport) => void;
  setGlobalData: (key: string, rows: any[]) => void;
  triggerToast: (toast: Partial<ToastItem> & { message: string }) => void;
  dismissToast: (id: string) => void;
  triggerPopup: (popup: PopupState) => void;
  dismissPopup: () => void;
  toggleSafeMode: () => void;
  toggleHighContrast: () => void;
  toggleScreenReaderMode: () => void;
  updateConfig: (patch: Partial<DashboardConfig>) => void;
  resetConfig: () => void;
}

export interface AppearanceSlice {
  accentH: number;
  accentS: number;
  accentL: number;
  setAccent: (h: number, s: number, l: number) => void;
}

export type DashboardStore = DashboardSlice & AppearanceSlice;

export interface DashboardExport {
  id: string;
  name: string;
  widgets: WidgetInstance[];
}

const DEFAULT_CONFIG: DashboardConfig = {
  autoRefresh: false,
  refreshInterval: 10000,
  showGrid: true,
  gridSize: 12,
  enableAnimations: true,
  animationSpeed: 1,
  enableParallax: false,
  defaultChartHeight: 320,
  showDataPoints: true,
  lineWidth: 2,
};

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const createWidgetInstance = (kind: WidgetKind, overrides: Partial<WidgetInstance> = {}): WidgetInstance => {
  const registryEntry = widgetRegistry[kind];
  const id = overrides.id ?? createId('widget');
  return {
    id,
    kind,
    title: registryEntry?.defaults?.title ?? registryEntry?.name ?? kind,
    x: 0,
    y: 0,
    width: 4,
    height: 3,
    zIndex: 1,
    config: { ...(registryEntry?.defaults ?? {}) },
    ...overrides,
  } as WidgetInstance;
};

const initialWidgetA = createWidgetInstance('card', {
  id: 'widget-overview',
  title: 'Stream Overview',
  x: 0,
  y: 0,
  width: 4,
  height: 3,
});

const initialWidgetB = createWidgetInstance('kpi', {
  id: 'widget-kpi',
  title: 'Live Viewers',
  x: 4,
  y: 0,
  width: 3,
  height: 3,
  config: {
    ...createWidgetInstance('kpi').config,
    value: '128',
    trend: 'up',
  },
});

const initialWidgetOverlay = createWidgetInstance('lower-third', {
  id: 'widget-lower-third',
  title: 'Show Lower Third',
  overlayVisible: true,
  frame: { x: 40, y: 540, w: 960, h: 160 },
  zIndex: 5,
});

const initialDashboard: DashboardLayout = {
  id: 'default',
  name: 'Default Program',
  widgets: [initialWidgetA.id, initialWidgetB.id, initialWidgetOverlay.id],
};

const initialWidgets: Record<string, WidgetInstance> = {
  [initialWidgetA.id]: initialWidgetA,
  [initialWidgetB.id]: initialWidgetB,
  [initialWidgetOverlay.id]: initialWidgetOverlay,
};

const createAppearanceSlice: StateCreator<DashboardStore, [['zustand/subscribeWithSelector', never]], [], AppearanceSlice> = (set) => ({
  accentH: 212,
  accentS: 86,
  accentL: 54,
  setAccent: (h, s, l) => set({ accentH: h, accentS: s, accentL: l }),
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createDashboardSlice: StateCreator<DashboardStore, [['zustand/subscribeWithSelector', never]], [], DashboardSlice> = (set, get) => ({
  widgets: initialWidgets,
  dashboards: { [initialDashboard.id]: initialDashboard },
  layouts: [initialDashboard.id],
  activeDashboardId: initialDashboard.id,
  selectedWidgetId: null,
  globalData: {},
  toasts: [],
  popup: null,
  safeMode: false,
  highContrast: false,
  screenReaderMode: false,
  config: { ...DEFAULT_CONFIG },

  addWidget: (dashboardId, kind) => {
    const dashboard = get().dashboards[dashboardId];
    if (!dashboard) return;
    const widget = createWidgetInstance(kind, {
      x: dashboard.widgets.length % 4,
      y: Math.floor(dashboard.widgets.length / 4),
      zIndex: dashboard.widgets.length + 1,
    });

    set(state => ({
      widgets: { ...state.widgets, [widget.id]: widget },
      dashboards: {
        ...state.dashboards,
        [dashboardId]: {
          ...dashboard,
          widgets: [...dashboard.widgets, widget.id],
        },
      },
      selectedWidgetId: widget.id,
    }));
  },

  addWidgetToActive: (kind) => {
    const active = get().activeDashboardId;
    get().addWidget(active, kind);
  },

  updateWidget: (id, patch) => {
    const widget = get().widgets[id];
    if (!widget) return;
    set(state => ({
      widgets: {
        ...state.widgets,
        [id]: { ...widget, ...patch, config: patch.config ? { ...widget.config, ...patch.config } : widget.config },
      },
    }));
  },

  updateWidgetConfig: (id, configPatch) => {
    const widget = get().widgets[id];
    if (!widget) return;
    set(state => ({
      widgets: {
        ...state.widgets,
        [id]: { ...widget, config: { ...widget.config, ...configPatch } },
      },
    }));
  },

  selectWidget: (id) => set({ selectedWidgetId: id }),

  getSelectedWidget: () => {
    const { selectedWidgetId, widgets } = get();
    return selectedWidgetId ? widgets[selectedWidgetId] : undefined;
  },

  getActiveDashboard: () => {
    const { dashboards, activeDashboardId } = get();
    return dashboards[activeDashboardId];
  },

  nudgeWidget: (id, dx, dy) => {
    const widget = get().widgets[id];
    if (!widget) return;
    get().updateWidget(id, { x: widget.x + dx, y: widget.y + dy });
  },

  resizeWidget: (id, dw, dh) => {
    const widget = get().widgets[id];
    if (!widget) return;
    get().updateWidget(id, {
      width: clamp(widget.width + dw, 1, 12),
      height: clamp(widget.height + dh, 1, 12),
    });
  },

  duplicateWidget: (id) => {
    const widget = get().widgets[id];
    const dashboard = get().getActiveDashboard();
    if (!widget || !dashboard) return;
    const clone = createWidgetInstance(widget.kind, {
      ...widget,
      id: createId('widget'),
      title: `${widget.title} Copy`,
      x: widget.x + 1,
      y: widget.y + 1,
      zIndex: widget.zIndex + 1,
      config: { ...widget.config },
    });

    set(state => ({
      widgets: { ...state.widgets, [clone.id]: clone },
      dashboards: {
        ...state.dashboards,
        [dashboard.id]: {
          ...dashboard,
          widgets: [...dashboard.widgets, clone.id],
        },
      },
      selectedWidgetId: clone.id,
    }));
  },

  deleteWidget: (id) => {
    const { dashboards, widgets, activeDashboardId, safeMode } = get();
    if (!widgets[id]) return;

    if (safeMode && typeof window !== 'undefined') {
      const confirmDelete = window.confirm('Remove widget from dashboard?');
      if (!confirmDelete) return;
    }

    const { [id]: _, ...rest } = widgets;
    const dashboard = dashboards[activeDashboardId];
    if (!dashboard) return;

    set(state => ({
      widgets: rest,
      dashboards: {
        ...state.dashboards,
        [dashboard.id]: {
          ...dashboard,
          widgets: dashboard.widgets.filter(wid => wid !== id),
        },
      },
      selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
    }));
  },

  bringToFront: (id) => {
    const widgets = get().widgets;
    const widget = widgets[id];
    if (!widget) return;
    const max = Math.max(...Object.values(widgets).map(w => w.zIndex));
    get().updateWidget(id, { zIndex: max + 1 });
  },

  sendToBack: (id) => {
    const widgets = get().widgets;
    const widget = widgets[id];
    if (!widget) return;
    const min = Math.min(...Object.values(widgets).map(w => w.zIndex));
    get().updateWidget(id, { zIndex: min - 1 });
  },

  raiseWidget: (id) => {
    const widgets = Object.values(get().widgets);
    const current = widgets.find(w => w.id === id);
    if (!current) return;
    const higher = widgets.filter(w => w.zIndex > current.zIndex).sort((a, b) => a.zIndex - b.zIndex);
    if (higher.length === 0) return;
    get().updateWidget(id, { zIndex: higher[0].zIndex + 1 });
  },

  lowerWidget: (id) => {
    const widgets = Object.values(get().widgets);
    const current = widgets.find(w => w.id === id);
    if (!current) return;
    const lower = widgets.filter(w => w.zIndex < current.zIndex).sort((a, b) => b.zIndex - a.zIndex);
    if (lower.length === 0) return;
    get().updateWidget(id, { zIndex: lower[0].zIndex - 1 });
  },

  alignWidgets: (ids, alignment) => {
    const widgets = ids.map(id => get().widgets[id]).filter(Boolean) as WidgetInstance[];
    if (widgets.length === 0) return;

    switch (alignment) {
      case 'left': {
        const minX = Math.min(...widgets.map(w => w.x));
        widgets.forEach(w => get().updateWidget(w.id, { x: minX }));
        break;
      }
      case 'right': {
        const maxRight = Math.max(...widgets.map(w => w.x + w.width));
        widgets.forEach(w => get().updateWidget(w.id, { x: maxRight - w.width }));
        break;
      }
      case 'top': {
        const minY = Math.min(...widgets.map(w => w.y));
        widgets.forEach(w => get().updateWidget(w.id, { y: minY }));
        break;
      }
      case 'bottom': {
        const maxBottom = Math.max(...widgets.map(w => w.y + w.height));
        widgets.forEach(w => get().updateWidget(w.id, { y: maxBottom - w.height }));
        break;
      }
      case 'center-h': {
        const center = widgets.reduce((acc, w) => acc + w.x + w.width / 2, 0) / widgets.length;
        widgets.forEach(w => get().updateWidget(w.id, { x: center - w.width / 2 }));
        break;
      }
      case 'center-v': {
        const center = widgets.reduce((acc, w) => acc + w.y + w.height / 2, 0) / widgets.length;
        widgets.forEach(w => get().updateWidget(w.id, { y: center - w.height / 2 }));
        break;
      }
    }
  },

  distributeWidgets: (ids, direction) => {
    const widgets = ids.map(id => get().widgets[id]).filter(Boolean) as WidgetInstance[];
    if (widgets.length < 3) return;

    if (direction === 'horizontal') {
      const sorted = [...widgets].sort((a, b) => a.x - b.x);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const space = last.x - first.x;
      const gaps = space / (sorted.length - 1);
      sorted.forEach((widget, index) => {
        get().updateWidget(widget.id, { x: first.x + gaps * index });
      });
    } else {
      const sorted = [...widgets].sort((a, b) => a.y - b.y);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const space = last.y - first.y;
      const gaps = space / (sorted.length - 1);
      sorted.forEach((widget, index) => {
        get().updateWidget(widget.id, { y: first.y + gaps * index });
      });
    }
  },

  switchLayout: (id) => {
    if (!get().dashboards[id]) return;
    set({ activeDashboardId: id, selectedWidgetId: null });
  },

  exportDashboard: (id) => {
    const dashboard = get().dashboards[id ?? get().activeDashboardId];
    if (!dashboard) return null;
    return {
      id: dashboard.id,
      name: dashboard.name,
      widgets: dashboard.widgets.map(wid => ({ ...get().widgets[wid] })).filter(Boolean) as WidgetInstance[],
    };
  },

  importDashboard: (bundle) => {
    const { id, name, widgets } = bundle;
    const widgetMap = widgets.reduce<Record<string, WidgetInstance>>((acc, widget) => {
      acc[widget.id] = { ...widget };
      return acc;
    }, {});

    set(state => ({
      widgets: { ...state.widgets, ...widgetMap },
      dashboards: {
        ...state.dashboards,
        [id]: { id, name, widgets: widgets.map(w => w.id) },
      },
      layouts: state.layouts.includes(id) ? state.layouts : [...state.layouts, id],
      activeDashboardId: id,
      selectedWidgetId: widgets[0]?.id ?? null,
    }));
  },

  setGlobalData: (key, rows) => {
    set(state => ({ globalData: { ...state.globalData, [key]: rows } }));
  },

  triggerToast: ({ message, type = 'info', duration = 3000 }) => {
    const id = createId('toast');
    const toast: ToastItem = { id, message, type, duration };
    set(state => ({ toasts: [...state.toasts, toast] }));

    if (typeof window !== 'undefined') {
      window.setTimeout(() => get().dismissToast(id), duration);
    }
  },

  dismissToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) }));
  },

  triggerPopup: (popup) => set({ popup }),

  dismissPopup: () => set({ popup: null }),

  toggleSafeMode: () => set(state => {
    const next = !state.safeMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('safe-mode', next);
    }
    return { safeMode: next };
  }),

  toggleHighContrast: () => set(state => {
    const next = !state.highContrast;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('hc', next);
    }
    return { highContrast: next };
  }),

  toggleScreenReaderMode: () => set(state => {
    const next = !state.screenReaderMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('sr', next);
      document.documentElement.setAttribute('data-sr', String(next));
    }
    return { screenReaderMode: next, safeMode: next ? true : state.safeMode };
  }),

  updateConfig: (patch) => set(state => ({ config: { ...state.config, ...patch } })),

  resetConfig: () => set({ config: { ...DEFAULT_CONFIG } }),
});

export const useDashboardStore = create<DashboardStore>()(
  subscribeWithSelector((...args) => ({
    ...createAppearanceSlice(...args),
    ...createDashboardSlice(...args),
  }))
);

export default useDashboardStore;
