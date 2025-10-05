// NOTE: This is a representative store with new actions/fields used above.
// If your project already has a Zustand store, merge thoughtfully.

import create from 'zustand';

const initialState = {
  widgets: {},
  selectedWidgetId: null,
  globalData: {},

  // layouts
  layouts: ['Default', 'Interview', 'Desk'],
  activeLayout: 'Default',

  // accessibility toggles
  safeMode: false,
  highContrast: false,
  screenReaderMode: false,

  // transient UI
  toasts: [],       // [{id, message, type, duration}]
  popup: null,      // {message, type, actions}
};

const actions = (set, get) => ({
  updateWidget(id, patch) {
    const w = get().widgets[id];
    if (!w) return;
    set({ widgets: { ...get().widgets, [id]: { ...w, ...patch, config: { ...w.config, ...(patch.config || {}) } } } });
  },

  selectWidget(id) {
    set({ selectedWidgetId: id });
  },

  // data
  setGlobalData(key, rows) {
    set({ globalData: { ...get().globalData, [key]: rows } });
  },

  // layouts
  switchLayout(name) {
    if (!get().layouts.includes(name)) return;
    set({ activeLayout: name });
  },

  // toasts
  triggerToast(cfg) {
    const id = Math.random().toString(36).slice(2, 8);
    const toast = { id, type: cfg.type || 'info', message: cfg.message || '', duration: cfg.duration || 3000 };
    set({ toasts: [...get().toasts, toast] });
    setTimeout(() => {
      const cur = get().toasts || [];
      set({ toasts: cur.filter(t => t.id !== id) });
    }, toast.duration);
  },

  // popup
  triggerPopup(cfg) {
    set({ popup: { ...cfg } });
  },
  dismissPopup() {
    set({ popup: null });
  },

  // accessibility toggles
  toggleSafeMode() {
    const next = !get().safeMode;
    set({ safeMode: next });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('safe-mode', next);
    }
  },
  toggleHighContrast() {
    const next = !get().highContrast;
    set({ highContrast: next });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('hc', next);
    }
  },
  toggleScreenReaderMode() {
    const next = !get().screenReaderMode;
    set({ screenReaderMode: next });
    if (next && !get().safeMode) set({ safeMode: true });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('sr', next);
      document.documentElement.setAttribute('data-sr', String(next));
    }
  },
});

export const useDashboardStore = create((set, get) => ({
  ...initialState,
  ...actions(set, get),
}));

export default useDashboardStore;
