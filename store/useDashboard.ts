import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { z } from 'zod';
import type { WidgetKind, WidgetConfig } from '@/widgets/registry';

// Layout and positioning types
export interface LayoutItem {
  id: string;
  kind: WidgetKind;
  config: WidgetConfig;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  selected: boolean;
  locked: boolean;
}

export interface DashboardState {
  // Core state
  widgets: LayoutItem[];
  selectedIds: string[];
  clipboard: LayoutItem[];
  isDragging: boolean;
  isResizing: boolean;
  
  // UI state
  inspectorOpen: boolean;
  paletteOpen: boolean;
  highContrast: boolean;
  safeMode: boolean;
  showGrid: boolean;
  showGuides: boolean;
  
  // Motion preferences
  motionPreset: 'dashboard' | 'overlay';
  parallaxEnabled: boolean;
  
  // Actions
  addWidget: (kind: WidgetKind, position?: { x: number; y: number }) => void;
  removeWidget: (id: string) => void;
  removeSelectedWidgets: () => void;
  updateWidget: (id: string, updates: Partial<LayoutItem>) => void;
  updateWidgetConfig: (id: string, config: WidgetConfig) => void;
  
  // Selection
  selectWidget: (id: string, extend?: boolean) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Layout operations
  moveWidget: (id: string, x: number, y: number) => void;
  resizeWidget: (id: string, width: number, height: number) => void;
  nudgeWidgets: (ids: string[], dx: number, dy: number) => void;
  
  // Z-order
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  raiseWidget: (id: string) => void;
  lowerWidget: (id: string) => void;
  setZOrder: (id: string, z: number) => void;
  
  // Alignment & distribution
  alignWidgets: (ids: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeWidgets: (ids: string[], direction: 'horizontal' | 'vertical') => void;
  
  // Clipboard operations
  copyWidgets: (ids: string[]) => void;
  pasteWidgets: (position?: { x: number; y: number }) => void;
  duplicateWidgets: (ids: string[]) => void;
  
  // Import/Export
  exportDashboard: () => DashboardBundle;
  importDashboard: (bundle: DashboardBundle) => void;
  resetDashboard: () => void;
  
  // UI toggles
  toggleInspector: () => void;
  togglePalette: () => void;
  toggleHighContrast: () => void;
  toggleSafeMode: () => void;
  toggleGrid: () => void;
  toggleGuides: () => void;
  
  // Motion controls
  setMotionPreset: (preset: 'dashboard' | 'overlay') => void;
  toggleParallax: () => void;
  
  // Drag & resize state
  setDragging: (dragging: boolean) => void;
  setResizing: (resizing: boolean) => void;
}

// Dashboard bundle schema for import/export
export const DashboardBundleSchema = z.object({
  version: z.string(),
  timestamp: z.string(),
  widgets: z.array(z.object({
    id: z.string(),
    kind: z.string(),
    config: z.record(z.unknown()),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    z: z.number(),
    selected: z.boolean().default(false),
    locked: z.boolean().default(false),
  })),
  settings: z.object({
    motionPreset: z.enum(['dashboard', 'overlay']).default('dashboard'),
    parallaxEnabled: z.boolean().default(true),
    highContrast: z.boolean().default(false),
    safeMode: z.boolean().default(false),
  }).optional(),
});

export type DashboardBundle = z.infer<typeof DashboardBundleSchema>;

// Utility functions
function generateId(): string {
  return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function findAvailablePosition(existingWidgets: LayoutItem[]): { x: number; y: number } {
  const gridSize = 20;
  const defaultWidth = 200;
  const defaultHeight = 120;
  
  // Try to find a position that doesn't overlap
  for (let y = gridSize; y < 800; y += defaultHeight + gridSize) {
    for (let x = gridSize; x < 1200; x += defaultWidth + gridSize) {
      const overlaps = existingWidgets.some(widget =>
        x < widget.x + widget.width &&
        x + defaultWidth > widget.x &&
        y < widget.y + widget.height &&
        y + defaultHeight > widget.y
      );
      
      if (!overlaps) {
        return { x, y };
      }
    }
  }
  
  // Fallback to stacked position
  return { x: 20, y: 20 + existingWidgets.length * 30 };
}

function getMaxZ(widgets: LayoutItem[]): number {
  return Math.max(0, ...widgets.map(w => w.z));
}

function getMinZ(widgets: LayoutItem[]): number {
  return Math.min(0, ...widgets.map(w => w.z));
}

// Create the dashboard store
export const useDashboard = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    widgets: [],
    selectedIds: [],
    clipboard: [],
    isDragging: false,
    isResizing: false,
    
    inspectorOpen: false,
    paletteOpen: false,
    highContrast: false,
    safeMode: false,
    showGrid: true,
    showGuides: true,
    
    motionPreset: 'dashboard',
    parallaxEnabled: true,
    
    // Core widget operations
    addWidget: (kind, position) => {
      const { widgets } = get();
      const pos = position || findAvailablePosition(widgets);
      const maxZ = getMaxZ(widgets);
      
      const newWidget: LayoutItem = {
        id: generateId(),
        kind,
        config: { id: generateId(), title: `New ${kind}` } as WidgetConfig,
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 120,
        z: maxZ + 1,
        selected: false,
        locked: false,
      };
      
      set(state => ({
        widgets: [...state.widgets, newWidget],
        selectedIds: [newWidget.id], // Auto-select new widget
      }));
    },
    
    removeWidget: (id) => {
      set(state => ({
        widgets: state.widgets.filter(w => w.id !== id),
        selectedIds: state.selectedIds.filter(sid => sid !== id),
      }));
    },
    
    removeSelectedWidgets: () => {
      const { selectedIds } = get();
      set(state => ({
        widgets: state.widgets.filter(w => !selectedIds.includes(w.id)),
        selectedIds: [],
      }));
    },
    
    updateWidget: (id, updates) => {
      set(state => ({
        widgets: state.widgets.map(w =>
          w.id === id ? { ...w, ...updates } : w
        ),
      }));
    },
    
    updateWidgetConfig: (id, config) => {
      set(state => ({
        widgets: state.widgets.map(w =>
          w.id === id ? { ...w, config } : w
        ),
      }));
    },
    
    // Selection operations
    selectWidget: (id, extend = false) => {
      set(state => {
        if (extend) {
          const isSelected = state.selectedIds.includes(id);
          return {
            selectedIds: isSelected
              ? state.selectedIds.filter(sid => sid !== id)
              : [...state.selectedIds, id],
          };
        } else {
          return { selectedIds: [id] };
        }
      });
    },
    
    selectMultiple: (ids) => {
      set({ selectedIds: ids });
    },
    
    clearSelection: () => {
      set({ selectedIds: [] });
    },
    
    selectAll: () => {
      const { widgets } = get();
      set({ selectedIds: widgets.map(w => w.id) });
    },
    
    // Layout operations
    moveWidget: (id, x, y) => {
      get().updateWidget(id, { x, y });
    },
    
    resizeWidget: (id, width, height) => {
      get().updateWidget(id, { width, height });
    },
    
    nudgeWidgets: (ids, dx, dy) => {
      set(state => ({
        widgets: state.widgets.map(w =>
          ids.includes(w.id) ? { ...w, x: w.x + dx, y: w.y + dy } : w
        ),
      }));
    },
    
    // Z-order operations
    bringToFront: (id) => {
      const { widgets } = get();
      const maxZ = getMaxZ(widgets);
      get().setZOrder(id, maxZ + 1);
    },
    
    sendToBack: (id) => {
      const { widgets } = get();
      const minZ = getMinZ(widgets);
      get().setZOrder(id, minZ - 1);
    },
    
    raiseWidget: (id) => {
      const { widgets } = get();
      const widget = widgets.find(w => w.id === id);
      if (!widget) return;
      
      const higherWidgets = widgets.filter(w => w.z > widget.z);
      if (higherWidgets.length > 0) {
        const nextZ = Math.min(...higherWidgets.map(w => w.z));
        get().setZOrder(id, nextZ + 1);
      }
    },
    
    lowerWidget: (id) => {
      const { widgets } = get();
      const widget = widgets.find(w => w.id === id);
      if (!widget) return;
      
      const lowerWidgets = widgets.filter(w => w.z < widget.z);
      if (lowerWidgets.length > 0) {
        const nextZ = Math.max(...lowerWidgets.map(w => w.z));
        get().setZOrder(id, nextZ - 1);
      }
    },
    
    setZOrder: (id, z) => {
      get().updateWidget(id, { z });
    },
    
    // Alignment operations
    alignWidgets: (ids, alignment) => {
      const { widgets } = get();
      const selectedWidgets = widgets.filter(w => ids.includes(w.id));
      
      if (selectedWidgets.length < 2) return;
      
      let anchor: number;
      
      switch (alignment) {
        case 'left':
          anchor = Math.min(...selectedWidgets.map(w => w.x));
          selectedWidgets.forEach(w => get().moveWidget(w.id, anchor, w.y));
          break;
        case 'right':
          anchor = Math.max(...selectedWidgets.map(w => w.x + w.width));
          selectedWidgets.forEach(w => get().moveWidget(w.id, anchor - w.width, w.y));
          break;
        case 'center':
          anchor = selectedWidgets.reduce((sum, w) => sum + w.x + w.width / 2, 0) / selectedWidgets.length;
          selectedWidgets.forEach(w => get().moveWidget(w.id, anchor - w.width / 2, w.y));
          break;
        case 'top':
          anchor = Math.min(...selectedWidgets.map(w => w.y));
          selectedWidgets.forEach(w => get().moveWidget(w.id, w.x, anchor));
          break;
        case 'bottom':
          anchor = Math.max(...selectedWidgets.map(w => w.y + w.height));
          selectedWidgets.forEach(w => get().moveWidget(w.id, w.x, anchor - w.height));
          break;
        case 'middle':
          anchor = selectedWidgets.reduce((sum, w) => sum + w.y + w.height / 2, 0) / selectedWidgets.length;
          selectedWidgets.forEach(w => get().moveWidget(w.id, w.x, anchor - w.height / 2));
          break;
      }
    },
    
    distributeWidgets: (ids, direction) => {
      const { widgets } = get();
      const selectedWidgets = widgets.filter(w => ids.includes(w.id))
        .sort((a, b) => direction === 'horizontal' ? a.x - b.x : a.y - b.y);
      
      if (selectedWidgets.length < 3) return;
      
      const first = selectedWidgets[0];
      const last = selectedWidgets[selectedWidgets.length - 1];
      
      if (direction === 'horizontal') {
        const totalSpace = (last.x + last.width) - first.x;
        const usedSpace = selectedWidgets.reduce((sum, w) => sum + w.width, 0);
        const gap = (totalSpace - usedSpace) / (selectedWidgets.length - 1);
        
        let currentX = first.x + first.width + gap;
        for (let i = 1; i < selectedWidgets.length - 1; i++) {
          get().moveWidget(selectedWidgets[i].id, currentX, selectedWidgets[i].y);
          currentX += selectedWidgets[i].width + gap;
        }
      } else {
        const totalSpace = (last.y + last.height) - first.y;
        const usedSpace = selectedWidgets.reduce((sum, w) => sum + w.height, 0);
        const gap = (totalSpace - usedSpace) / (selectedWidgets.length - 1);
        
        let currentY = first.y + first.height + gap;
        for (let i = 1; i < selectedWidgets.length - 1; i++) {
          get().moveWidget(selectedWidgets[i].id, selectedWidgets[i].x, currentY);
          currentY += selectedWidgets[i].height + gap;
        }
      }
    },
    
    // Clipboard operations
    copyWidgets: (ids) => {
      const { widgets } = get();
      const selectedWidgets = widgets.filter(w => ids.includes(w.id));
      set({ clipboard: selectedWidgets });
    },
    
    pasteWidgets: (position) => {
      const { clipboard } = get();
      if (clipboard.length === 0) return;
      
      const offset = position || { x: 20, y: 20 };
      clipboard.forEach((widget, index) => {
        get().addWidget(widget.kind, {
          x: offset.x + index * 20,
          y: offset.y + index * 20,
        });
      });
    },
    
    duplicateWidgets: (ids) => {
      get().copyWidgets(ids);
      get().pasteWidgets({ x: 20, y: 20 });
    },
    
    // Import/Export
    exportDashboard: () => {
      const { widgets, motionPreset, parallaxEnabled, highContrast, safeMode } = get();
      
      return {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        widgets: widgets.map(w => ({
          id: w.id,
          kind: w.kind as string,
          config: w.config as Record<string, unknown>,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          z: w.z,
          selected: false, // Don't persist selection
          locked: w.locked,
        })),
        settings: {
          motionPreset,
          parallaxEnabled,
          highContrast,
          safeMode,
        },
      };
    },
    
    importDashboard: (bundle) => {
      try {
        const validated = DashboardBundleSchema.parse(bundle);
        
        const widgets: LayoutItem[] = validated.widgets.map(w => ({
          id: w.id,
          kind: w.kind as WidgetKind,
          config: w.config as WidgetConfig,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          z: w.z,
          selected: false,
          locked: w.locked,
        }));
        
        set({
          widgets,
          selectedIds: [],
          motionPreset: validated.settings?.motionPreset || 'dashboard',
          parallaxEnabled: validated.settings?.parallaxEnabled ?? true,
          highContrast: validated.settings?.highContrast ?? false,
          safeMode: validated.settings?.safeMode ?? false,
        });
      } catch (error) {
        console.error('Failed to import dashboard:', error);
        throw new Error('Invalid dashboard bundle format');
      }
    },
    
    resetDashboard: () => {
      set({
        widgets: [],
        selectedIds: [],
        clipboard: [],
        motionPreset: 'dashboard',
        parallaxEnabled: true,
        highContrast: false,
        safeMode: false,
      });
    },
    
    // UI toggles
    toggleInspector: () => set(state => ({ inspectorOpen: !state.inspectorOpen })),
    togglePalette: () => set(state => ({ paletteOpen: !state.paletteOpen })),
    toggleHighContrast: () => {
      set(state => {
        const newHC = !state.highContrast;
        document.documentElement.classList.toggle('hc', newHC);
        return { highContrast: newHC };
      });
    },
    toggleSafeMode: () => set(state => ({ safeMode: !state.safeMode })),
    toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
    toggleGuides: () => set(state => ({ showGuides: !state.showGuides })),
    
    // Motion controls
    setMotionPreset: (preset) => set({ motionPreset: preset }),
    toggleParallax: () => set(state => ({ parallaxEnabled: !state.parallaxEnabled })),
    
    // Drag & resize state
    setDragging: (dragging) => set({ isDragging: dragging }),
    setResizing: (resizing) => set({ isResizing: resizing }),
  }))
);

// Global helper for development/testing
if (typeof window !== 'undefined') {
  (window as any).__CURRENT_BUNDLE__ = () => useDashboard.getState().exportDashboard();
}

export default useDashboard;