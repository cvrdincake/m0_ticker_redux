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
  chart: {
    type: 'chart',
    title: 'Line Chart',
    width: 6,
    height: 4,
    config: {
      chartType: 'line',
      dataSource: 'metrics',
      series: ['value'],
      timeRange: '24h'
    }
  },
  metric: {
    type: 'metric',
    title: 'Metric Card',
    width: 3,
    height: 2,
    config: {
      value: 0,
      label: 'Metric',
      unit: '',
      trend: 'neutral'
    }
  },
  table: {
    type: 'table',
    title: 'Data Table',
    width: 12,
    height: 6,
    config: {
      dataSource: 'logs',
      columns: ['timestamp', 'level', 'message'],
      pageSize: 10
    }
  },
  alert: {
    type: 'alert',
    title: 'Alert Panel',
    width: 6,
    height: 3,
    config: {
      severity: 'info',
      threshold: 100,
      condition: 'greater_than'
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
          const widget = {
            ...template,
            id: widgetId,
            x: position.x,
            y: position.y,
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
            )
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