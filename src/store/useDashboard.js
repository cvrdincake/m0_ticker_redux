import { create } from 'zustand';
import { subscribeWithSelector, persist, devtools } from 'zustand/middleware';

/**
 * M0 Ticker Redux - Dashboard Store
 * Reactive state management with persistence and real-time updates
 */

// Default dashboard configuration
const DEFAULT_CONFIG = {
  theme: 'monochrome',
  autoRefresh: true,
  refreshInterval: 5000,
  showGrid: true,
  gridSize: 12,
  snapToGrid: true,
  showDebugInfo: false,
  
  // Animation preferences
  enableAnimations: true,
  animationSpeed: 1,
  enableParallax: true,
  
  // Chart preferences
  defaultChartHeight: 300,
  showDataPoints: false,
  enableTooltips: true,
  lineWidth: 2,
  
  // Layout preferences
  compactMode: false,
  sidebarCollapsed: false,
  showMinimap: false
};

// Widget template definitions
const WIDGET_TEMPLATES = {
  card: {
    type: 'card',
    title: 'Information Card',
    width: 4,
    height: 3,
    z: 0,
    config: {
      content: 'Card content',
      variant: 'default',
      motionPreset: 'card',
      density: 'comfortable',
      ariaLabel: ''
    }
  },
  chart: {
    type: 'chart',
    title: 'Line Chart',
    width: 6,
    height: 4,
    z: 0,
    config: {
      chartType: 'line',
      dataSource: 'metrics',
      series: ['value'],
      timeRange: '24h',
      motionPreset: 'chart',
      density: 'comfortable',
      ariaLabel: ''
    }
  },
  kpi: {
    type: 'kpi',
    title: 'KPI Metric',
    width: 3,
    height: 2,
    z: 0,
    config: {
      value: 0,
      label: 'Metric',
      unit: '',
      trend: 'neutral',
      motionPreset: 'kpi',
      density: 'comfortable',
      ariaLabel: ''
    }
  },
  table: {
    type: 'table',
    title: 'Data Table',
    width: 12,
    height: 6,
    z: 0,
    config: {
      dataSource: 'logs',
      columns: ['timestamp', 'level', 'message'],
      pageSize: 10,
      motionPreset: 'table',
      density: 'comfortable',
      ariaLabel: ''
    }
  },
  animatedList: {
    type: 'animatedList',
    title: 'Animated List',
    width: 4,
    height: 6,
    z: 0,
    config: {
      items: [],
      animation: 'fade',
      motionPreset: 'card',
      density: 'comfortable',
      ariaLabel: ''
    }
  },
  lowerThird: {
    type: 'lowerThird',
    title: 'Lower Third',
    width: 8,
    height: 2,
    z: 0,
    config: {
      message: 'Breaking news',
      duration: 5000,
      motionPreset: 'toast',
      density: 'compact',
      ariaLabel: ''
    }
  },
  popupAlert: {
    type: 'popupAlert',
    title: 'Popup Alert',
    width: 6,
    height: 3,
    z: 0,
    config: {
      severity: 'info',
      message: 'Alert message',
      threshold: 100,
      condition: 'greater_than',
      motionPreset: 'modal',
      density: 'comfortable',
      ariaLabel: ''
    }
  }
};

export const useDashboardStore = create(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        // Configuration state
        config: DEFAULT_CONFIG,
        
        // Dashboard layout
        dashboards: [],
        activeDashboardId: null,
        
        // Widget state
        widgets: {},
        selectedWidgetId: null,
        draggedWidget: null,
        
        // Data state
        data: {},
        isLoading: false,
        lastUpdate: null,
        errors: {},
        
        // UI state
        showAddWidgetModal: false,
        showConfigPanel: false,
        isEditMode: false,
        zoom: 1,
        
        // Real-time connections
        connections: new Map(),
        
        /**
         * Configuration actions
         */
        updateConfig: (updates) => set((state) => ({
          config: { ...state.config, ...updates }
        })),
        
        resetConfig: () => set({ config: DEFAULT_CONFIG }),
        
        /**
         * Dashboard actions
         */
        createDashboard: (dashboard) => {
          const id = crypto.randomUUID();
          const newDashboard = {
            id,
            name: 'New Dashboard',
            widgets: [],
            layout: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...dashboard
          };
          
          set((state) => ({
            dashboards: [...state.dashboards, newDashboard],
            activeDashboardId: id
          }));
          
          return id;
        },
        
        updateDashboard: (id, updates) => set((state) => ({
          dashboards: state.dashboards.map(dashboard =>
            dashboard.id === id
              ? { ...dashboard, ...updates, updatedAt: new Date().toISOString() }
              : dashboard
          )
        })),
        
        deleteDashboard: (id) => set((state) => {
          const newDashboards = state.dashboards.filter(d => d.id !== id);
          const newActiveDashboardId = state.activeDashboardId === id
            ? newDashboards[0]?.id || null
            : state.activeDashboardId;
          
          return {
            dashboards: newDashboards,
            activeDashboardId: newActiveDashboardId
          };
        }),
        
        setActiveDashboard: (id) => set({ activeDashboardId: id }),
        
        duplicateDashboard: (id) => {
          const state = get();
          const original = state.dashboards.find(d => d.id === id);
          if (!original) return null;
          
          const newId = crypto.randomUUID();
          const duplicate = {
            ...original,
            id: newId,
            name: `${original.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set((state) => ({
            dashboards: [...state.dashboards, duplicate]
          }));
          
          return newId;
        },
        
        /**
         * Widget actions
         */
        addWidget: (dashboardId, widgetType, position = { x: 0, y: 0 }) => {
          const template = WIDGET_TEMPLATES[widgetType];
          if (!template) return null;
          
          const widgetId = crypto.randomUUID();
          const state = get();
          const maxZ = Object.values(state.widgets).length > 0 
            ? Math.max(...Object.values(state.widgets).map(w => w.z || 0))
            : 0;
          
          const widget = {
            ...template,
            id: widgetId,
            x: position.x,
            y: position.y,
            z: maxZ + 1,
            createdAt: new Date().toISOString()
          };
          
          set((state) => ({
            widgets: { ...state.widgets, [widgetId]: widget },
            dashboards: state.dashboards.map(dashboard =>
              dashboard.id === dashboardId
                ? {
                    ...dashboard,
                    widgets: [...dashboard.widgets, widgetId],
                    updatedAt: new Date().toISOString()
                  }
                : dashboard
            ),
            selectedWidgetId: widgetId
          }));
          
          return widgetId;
        },
        
        updateWidget: (id, updates) => set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { ...state.widgets[id], ...updates }
          }
        })),
        
        deleteWidget: (widgetId) => set((state) => {
          const newWidgets = { ...state.widgets };
          delete newWidgets[widgetId];
          
          return {
            widgets: newWidgets,
            dashboards: state.dashboards.map(dashboard => ({
              ...dashboard,
              widgets: dashboard.widgets.filter(id => id !== widgetId)
            })),
            selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId
          };
        }),
        
        duplicateWidget: (id) => {
          const state = get();
          const original = state.widgets[id];
          if (!original) return null;
          
          const newId = crypto.randomUUID();
          const duplicate = {
            ...original,
            id: newId,
            title: `${original.title} (Copy)`,
            x: original.x + 1,
            y: original.y + 1,
            z: Math.max(...Object.values(state.widgets).map(w => w.z || 0)) + 1
          };
          
          set((state) => ({
            widgets: { ...state.widgets, [newId]: duplicate },
            dashboards: state.dashboards.map(dashboard =>
              dashboard.id === state.activeDashboardId
                ? { ...dashboard, widgets: [...dashboard.widgets, newId] }
                : dashboard
            ),
            selectedWidgetId: newId
          }));
          
          return newId;
        },
        
        nudgeWidget: (id, dx, dy) => set((state) => {
          const widget = state.widgets[id];
          if (!widget) return state;
          
          return {
            widgets: {
              ...state.widgets,
              [id]: {
                ...widget,
                x: Math.max(0, widget.x + dx),
                y: Math.max(0, widget.y + dy)
              }
            }
          };
        }),
        
        resizeWidget: (id, dw, dh) => set((state) => {
          const widget = state.widgets[id];
          if (!widget) return state;
          
          return {
            widgets: {
              ...state.widgets,
              [id]: {
                ...widget,
                width: Math.max(1, widget.width + dw),
                height: Math.max(1, widget.height + dh)
              }
            }
          };
        }),
        
        alignWidgets: (ids, alignment) => set((state) => {
          if (!ids.length) return state;
          
          const widgets = ids.map(id => state.widgets[id]).filter(Boolean);
          if (widgets.length < 2) return state;
          
          let updates = {};
          
          switch (alignment) {
            case 'left':
              const leftmost = Math.min(...widgets.map(w => w.x));
              widgets.forEach(w => {
                updates[w.id] = { ...w, x: leftmost };
              });
              break;
              
            case 'right':
              const rightmost = Math.max(...widgets.map(w => w.x + w.width));
              widgets.forEach(w => {
                updates[w.id] = { ...w, x: rightmost - w.width };
              });
              break;
              
            case 'top':
              const topmost = Math.min(...widgets.map(w => w.y));
              widgets.forEach(w => {
                updates[w.id] = { ...w, y: topmost };
              });
              break;
              
            case 'bottom':
              const bottommost = Math.max(...widgets.map(w => w.y + w.height));
              widgets.forEach(w => {
                updates[w.id] = { ...w, y: bottommost - w.height };
              });
              break;
              
            case 'center-h':
              const centerX = (Math.min(...widgets.map(w => w.x)) + Math.max(...widgets.map(w => w.x + w.width))) / 2;
              widgets.forEach(w => {
                updates[w.id] = { ...w, x: centerX - w.width / 2 };
              });
              break;
              
            case 'center-v':
              const centerY = (Math.min(...widgets.map(w => w.y)) + Math.max(...widgets.map(w => w.y + w.height))) / 2;
              widgets.forEach(w => {
                updates[w.id] = { ...w, y: centerY - w.height / 2 };
              });
              break;
          }
          
          return {
            widgets: { ...state.widgets, ...updates }
          };
        }),
        
        distributeWidgets: (ids, axis) => set((state) => {
          if (ids.length < 3) return state;
          
          const widgets = ids.map(id => state.widgets[id]).filter(Boolean);
          if (widgets.length < 3) return state;
          
          let updates = {};
          
          if (axis === 'horizontal') {
            const sorted = widgets.sort((a, b) => a.x - b.x);
            const totalWidth = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width - sorted[0].x;
            const widgetWidths = sorted.reduce((sum, w) => sum + w.width, 0);
            const spacing = (totalWidth - widgetWidths) / (sorted.length - 1);
            
            let currentX = sorted[0].x;
            sorted.forEach(w => {
              updates[w.id] = { ...w, x: currentX };
              currentX += w.width + spacing;
            });
          } else {
            const sorted = widgets.sort((a, b) => a.y - b.y);
            const totalHeight = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height - sorted[0].y;
            const widgetHeights = sorted.reduce((sum, w) => sum + w.height, 0);
            const spacing = (totalHeight - widgetHeights) / (sorted.length - 1);
            
            let currentY = sorted[0].y;
            sorted.forEach(w => {
              updates[w.id] = { ...w, y: currentY };
              currentY += w.height + spacing;
            });
          }
          
          return {
            widgets: { ...state.widgets, ...updates }
          };
        }),
        
        setWidgetZ: (id, z) => set((state) => {
          const widget = state.widgets[id];
          if (!widget) return state;
          
          return {
            widgets: {
              ...state.widgets,
              [id]: { ...widget, z }
            }
          };
        }),
        
        bringToFront: (id) => set((state) => {
          const maxZ = Math.max(...Object.values(state.widgets).map(w => w.z || 0));
          return get().setWidgetZ(id, maxZ + 1);
        }),
        
        sendToBack: (id) => set((state) => {
          const minZ = Math.min(...Object.values(state.widgets).map(w => w.z || 0));
          return get().setWidgetZ(id, minZ - 1);
        }),
        
        raiseWidget: (id) => set((state) => {
          const widget = state.widgets[id];
          if (!widget) return state;
          return get().setWidgetZ(id, (widget.z || 0) + 1);
        }),
        
        lowerWidget: (id) => set((state) => {
          const widget = state.widgets[id];
          if (!widget) return state;
          return get().setWidgetZ(id, (widget.z || 0) - 1);
        }),
        
        selectWidget: (id) => set({ selectedWidgetId: id }),
        
        setDraggedWidget: (widget) => set({ draggedWidget: widget }),
        
        /**
         * Data actions
         */
        setData: (key, data) => set((state) => ({
          data: { ...state.data, [key]: data },
          lastUpdate: new Date().toISOString()
        })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (key, error) => set((state) => ({
          errors: { ...state.errors, [key]: error }
        })),
        
        clearError: (key) => set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[key];
          return { errors: newErrors };
        }),
        
        clearAllErrors: () => set({ errors: {} }),
        
        /**
         * UI actions
         */
        setShowAddWidgetModal: (show) => set({ showAddWidgetModal: show }),
        
        setShowConfigPanel: (show) => set({ showConfigPanel: show }),
        
        setEditMode: (enabled) => set({ isEditMode: enabled }),
        
        setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
        
        /**
         * Real-time connection management
         */
        addConnection: (id, connection) => {
          const state = get();
          state.connections.set(id, connection);
          set({ connections: new Map(state.connections) });
        },
        
        removeConnection: (id) => {
          const state = get();
          const connection = state.connections.get(id);
          if (connection?.close) {
            connection.close();
          }
          state.connections.delete(id);
          set({ connections: new Map(state.connections) });
        },
        
        clearAllConnections: () => {
          const state = get();
          state.connections.forEach(connection => {
            if (connection?.close) {
              connection.close();
            }
          });
          set({ connections: new Map() });
        },
        
        /**
         * Import/Export
         */
        exportDashboard: (id) => {
          const state = get();
          const dashboard = state.dashboards.find(d => d.id === id);
          if (!dashboard) return null;
          
          const widgets = dashboard.widgets.map(widgetId => state.widgets[widgetId]);
          
          return {
            dashboard: { ...dashboard, widgets: undefined },
            widgets,
            exportedAt: new Date().toISOString(),
            version: '1.0'
          };
        },
        
        importDashboard: (importData) => {
          const { dashboard, widgets } = importData;
          const newDashboardId = crypto.randomUUID();
          
          // Import widgets with new IDs
          const widgetIdMap = {};
          const newWidgets = {};
          
          widgets.forEach(widget => {
            const newWidgetId = crypto.randomUUID();
            widgetIdMap[widget.id] = newWidgetId;
            newWidgets[newWidgetId] = {
              ...widget,
              id: newWidgetId
            };
          });
          
          // Import dashboard with new widget IDs
          const newDashboard = {
            ...dashboard,
            id: newDashboardId,
            widgets: Object.keys(widgetIdMap),
            name: `${dashboard.name} (Imported)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set((state) => ({
            dashboards: [...state.dashboards, newDashboard],
            widgets: { ...state.widgets, ...newWidgets },
            activeDashboardId: newDashboardId
          }));
          
          return newDashboardId;
        },
        
        /**
         * Computed getters
         */
        getActiveDashboard: () => {
          const state = get();
          return state.dashboards.find(d => d.id === state.activeDashboardId);
        },
        
        getWidget: (id) => {
          return get().widgets[id];
        },
        
        getDashboardWidgets: (dashboardId) => {
          const state = get();
          const dashboard = state.dashboards.find(d => d.id === dashboardId);
          if (!dashboard) return [];
          
          return dashboard.widgets.map(id => state.widgets[id]).filter(Boolean);
        },
        
        getSelectedWidget: () => {
          const state = get();
          return state.selectedWidgetId ? state.widgets[state.selectedWidgetId] : null;
        }
      })),
      {
        name: 'm0-ticker-dashboard',
        partialize: (state) => ({
          config: state.config,
          dashboards: state.dashboards,
          widgets: state.widgets,
          activeDashboardId: state.activeDashboardId
        }),
        version: 1
      }
    ),
    { name: 'M0 Ticker Dashboard' }
  )
);

// Subscribe to configuration changes for real-time updates
useDashboardStore.subscribe(
  (state) => state.config.autoRefresh,
  (autoRefresh) => {
    if (autoRefresh) {
      console.log('Auto-refresh enabled');
    } else {
      console.log('Auto-refresh disabled');
    }
  }
);

export { WIDGET_TEMPLATES, DEFAULT_CONFIG };