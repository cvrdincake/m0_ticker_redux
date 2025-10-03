// Widget System Exports
export * from './registry';
export * from './render';
export * from './config';
export * from './dashboard';

// Main widget system entry point
export { WidgetRenderer, createWidgetConfig, validateWidgetConfig, sanitizeWidgetConfig } from './render';
export { WidgetConfigUI, QuickConfigButtons } from './config';
export { getWidgetSpec, listWidgets, type WidgetKind, type WidgetSpec } from './registry';
export { Dashboard } from './dashboard';
export { HealthDashboard } from './health-dashboard';
export { 
  healthMonitor, 
  useWidgetHealth, 
  createGracefulComponent, 
  withAutoRecovery,
  usePerformanceMonitor,
  type WidgetHealthStatus,
  type HealthMonitorConfig 
} from './health';