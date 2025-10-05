// Use the JavaScript dashboard store for widget state
import { useDashboardStore } from '@/store/useDashboard';
// Import the TypeScript dashboard store to access highContrast and Safe Mode toggles
import useDashboard from '@/store/useDashboard';
import { Button, Input, Text } from '@/design-system';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './InspectorPanel.module.css';

interface InspectorPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const MOTION_PRESETS = [
  { value: 'card', label: 'Card' },
  { value: 'kpi', label: 'KPI' },
  { value: 'chart', label: 'Chart' },
  { value: 'table', label: 'Table' },
  { value: 'toast', label: 'Toast' },
  { value: 'modal', label: 'Modal' }
] as const;

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'relaxed', label: 'Relaxed' }
] as const;

export const InspectorPanel = ({ 
  isOpen = false, 
  onClose,
  className,
  ...props 
}: InspectorPanelProps) => {
  // Pull state and actions from the dashboard store. The JS store keeps widgets in an object keyed by id.
  const { selectedWidgetId, widgets, updateWidget } = useDashboardStore();
  
  // Resolve the currently selected widget from the store. If none is selected, this will be undefined.
  const selectedWidget = selectedWidgetId ? widgets[selectedWidgetId] : undefined;

  // Pull global accessibility settings and toggles from the TypeScript store.
  const { highContrast, safeMode, toggleHighContrast, toggleSafeMode } = useDashboard();

  // Local state mirrors the selected widget's config for editing in the inspector.
  const [localConfig, setLocalConfig] = useState(() => ({
    title: selectedWidget?.title || '',
    dataSource: selectedWidget?.config?.dataSource || '',
    motionPreset: selectedWidget?.config?.motionPreset || 'card',
    density: selectedWidget?.config?.density || 'comfortable',
    ariaLabel: selectedWidget?.config?.ariaLabel || '',
    // LowerThird specific defaults
    showTicker: (selectedWidget?.config as any)?.showTicker ?? false,
    tickerText: (selectedWidget?.config as any)?.tickerText || '',
    speed: (selectedWidget?.config as any)?.speed ?? 60,
    direction: (selectedWidget?.config as any)?.direction || 'left',
    pauseOnHover: (selectedWidget?.config as any)?.pauseOnHover ?? true,
    // Table specific
    filter: (selectedWidget?.config as any)?.filter || '',
    columnOrder: (selectedWidget?.config as any)?.columnOrder || [],
    columnTypes: (selectedWidget?.config as any)?.columnTypes || {},
  }));
  
  // Debounced updates for live preview (200ms)
  const debouncedConfig = useDebounce(localConfig, 200);
  
  // Apply debounced changes to store
  useEffect(() => {
    if (!selectedWidget || !selectedWidgetId) return;
    
    updateWidget(selectedWidgetId, {
      title: debouncedConfig.title,
      config: {
        ...selectedWidget.config,
        dataSource: debouncedConfig.dataSource,
        motionPreset: debouncedConfig.motionPreset,
        density: debouncedConfig.density,
        ariaLabel: debouncedConfig.ariaLabel,
        // LowerThird
        showTicker: debouncedConfig.showTicker,
        tickerText: debouncedConfig.tickerText,
        speed: debouncedConfig.speed,
        direction: debouncedConfig.direction,
        pauseOnHover: debouncedConfig.pauseOnHover,
        // Table
        filter: debouncedConfig.filter,
        columnOrder: debouncedConfig.columnOrder,
        columnTypes: debouncedConfig.columnTypes
      }
    });
  }, [debouncedConfig, selectedWidget, selectedWidgetId, updateWidget]);
  
  // Reset local state when selection changes
  useEffect(() => {
    if (selectedWidget) {
      setLocalConfig({
        title: selectedWidget.title || '',
        dataSource: selectedWidget.config?.dataSource || '',
        motionPreset: selectedWidget.config?.motionPreset || 'card',
        density: selectedWidget.config?.density || 'comfortable',
        ariaLabel: selectedWidget.config?.ariaLabel || '',
        showTicker: (selectedWidget.config as any)?.showTicker ?? false,
        tickerText: (selectedWidget.config as any)?.tickerText || '',
        speed: (selectedWidget.config as any)?.speed ?? 60,
        direction: (selectedWidget.config as any)?.direction || 'left',
        pauseOnHover: (selectedWidget.config as any)?.pauseOnHover ?? true,
        filter: (selectedWidget.config as any)?.filter || '',
        columnOrder: (selectedWidget.config as any)?.columnOrder || [],
        columnTypes: (selectedWidget.config as any)?.columnTypes || {},
      });
    }
  }, [selectedWidget]);
  
  const handleConfigChange = (field: string, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Specialised handler for updating a table column type
  const handleColumnTypeChange = (key: string, type: 'string' | 'number') => {
    setLocalConfig((prev) => ({
      ...prev,
      columnTypes: {
        ...(prev as any).columnTypes,
        [key]: type
      }
    }));
  };
  
  if (!isOpen) return null;

  if (!selectedWidget) {
    return (
      <div className={cn(styles.panel, styles.empty, className)} {...props}>
        <div className={styles.header}>
          <Text as="h2" size="base" weight="medium" id="inspector-title">
            Inspector
          </Text>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close inspector">
              ×
            </Button>
          )}
        </div>
        <div className={styles.content}>
          <Text size="sm" color="muted">
            Select a widget to configure its properties
          </Text>
        </div>
      </div>
    );
  }
  
  // Helper to detect table widget
  const isTable = selectedWidget?.type === 'table';

  // Get columns as strings for UI display
  const tableColumns: string[] = isTable
    ? ((Array.isArray((selectedWidget.config as any)?.columns)
      ? (selectedWidget.config as any).columns
      : []) as any[]).map((c: any) => (typeof c === 'string' ? c : c?.key).trim()).filter(Boolean)
    : [];

  // Current column order string for input
  const columnOrderString =
    (localConfig.columnOrder && Array.isArray(localConfig.columnOrder) && localConfig.columnOrder.length > 0)
      ? (localConfig.columnOrder as string[]).join(', ')
      : tableColumns.join(', ');

  return (
    <div 
      className={cn(styles.panel, className)} 
      role="form" 
      aria-labelledby="inspector-title"
      {...props}
    >
      <div className={styles.header}>
        <Text as="h2" size="base" weight="medium" id="inspector-title">
          Inspector
        </Text>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close inspector">
            ×
          </Button>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <Text as="h3" size="sm" weight="medium" className={styles.sectionTitle}>
            Widget Properties
          </Text>
          
          <div className={styles.field}>
            <label htmlFor="widget-title" className={styles.label}>
              <Text size="sm" color="secondary">Title</Text>
            </label>
            <Input
              id="widget-title"
              type="text"
              value={localConfig.title}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              placeholder="Widget title"
              size="sm"
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="widget-datasource" className={styles.label}>
              <Text size="sm" color="secondary">Data Source</Text>
            </label>
            <Input
              id="widget-datasource"
              type="text"
              value={localConfig.dataSource}
              onChange={(e) => handleConfigChange('dataSource', e.target.value)}
              placeholder="API endpoint or data key"
              size="sm"
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="widget-motion" className={styles.label}>
              <Text size="sm" color="secondary">Motion Preset</Text>
            </label>
            <select
              id="widget-motion"
              value={localConfig.motionPreset}
              onChange={(e) => handleConfigChange('motionPreset', e.target.value)}
              className={styles.select}
            >
              {MOTION_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.field}>
            <label htmlFor="widget-density" className={styles.label}>
              <Text size="sm" color="secondary">Density</Text>
            </label>
            <select
              id="widget-density"
              value={localConfig.density}
              onChange={(e) => handleConfigChange('density', e.target.value)}
              className={styles.select}
            >
              {DENSITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.field}>
            <label htmlFor="widget-aria" className={styles.label}>
              <Text size="sm" color="secondary">ARIA Label</Text>
            </label>
            <Input
              id="widget-aria"
              type="text"
              value={localConfig.ariaLabel}
              onChange={(e) => handleConfigChange('ariaLabel', e.target.value)}
              placeholder="Accessibility description"
              size="sm"
            />
          </div>

          {/* Table settings */}
          {isTable && (
            <>
              <div className={styles.field}>
                <Text as="h4" size="xs" weight="medium" className={styles.sectionTitle}>
                  Table Settings
                </Text>
              </div>

              <div className={styles.field}>
                <label htmlFor="table-filter" className={styles.label}>
                  <Text size="sm" color="secondary">Filter (search)</Text>
                </label>
                <Input
                  id="table-filter"
                  type="text"
                  value={localConfig.filter || ''}
                  onChange={(e) => handleConfigChange('filter', e.target.value)}
                  placeholder="Filter rows"
                  size="sm"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="table-column-order" className={styles.label}>
                  <Text size="sm" color="secondary">Column Order (comma separated)</Text>
                </label>
                <Input
                  id="table-column-order"
                  type="text"
                  value={columnOrderString}
                  onChange={(e) => {
                    const parts = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    handleConfigChange('columnOrder', parts);
                  }}
                  placeholder="e.g. timestamp, level, message"
                  size="sm"
                />
              </div>

              {/* Per-column type selectors */}
              {tableColumns.length > 0 && (
                <div className={styles.field}>
                  <Text size="sm" color="secondary" className={styles.label}>
                    Column Types
                  </Text>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {tableColumns.map((key) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor={`col-type-${key}`} style={{ minWidth: 120 }}>
                          <Text size="xs">{key}</Text>
                        </label>
                        <select
                          id={`col-type-${key}`}
                          value={(localConfig.columnTypes as any)[key] || 'string'}
                          onChange={(e) => handleColumnTypeChange(key, e.target.value as 'string' | 'number')}
                          className={styles.select}
                        >
                          <option value="string">Alphabetical</option>
                          <option value="number">Numeric</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Ticker configuration fields for LowerThird widgets */}
          {selectedWidget?.type === 'lowerThird' && (
            <>
              <div className={styles.field}>
                <Text as="h4" size="xs" weight="medium" className={styles.sectionTitle}>
                  Ticker Settings
                </Text>
              </div>
              <div className={styles.field}>
                <label htmlFor="ticker-enabled" className={styles.label}>
                  <Text size="sm" color="secondary">Show Ticker</Text>
                </label>
                <input
                  id="ticker-enabled"
                  type="checkbox"
                  checked={localConfig.showTicker}
                  onChange={(e) => handleConfigChange('showTicker', e.target.checked)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="ticker-text" className={styles.label}>
                  <Text size="sm" color="secondary">Ticker Text</Text>
                </label>
                <Input
                  id="ticker-text"
                  type="text"
                  value={localConfig.tickerText}
                  onChange={(e) => handleConfigChange('tickerText', e.target.value)}
                  placeholder="Headline or message"
                  size="sm"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="ticker-speed" className={styles.label}>
                  <Text size="sm" color="secondary">Ticker Speed (px/s)</Text>
                </label>
                <Input
                  id="ticker-speed"
                  type="number"
                  value={localConfig.speed}
                  min={10}
                  max={500}
                  step={10}
                  onChange={(e) => handleConfigChange('speed', Number(e.target.value))}
                  size="sm"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="ticker-direction" className={styles.label}>
                  <Text size="sm" color="secondary">Direction</Text>
                </label>
                <select
                  id="ticker-direction"
                  value={localConfig.direction}
                  onChange={(e) => handleConfigChange('direction', e.target.value)}
                  className={styles.select}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="ticker-pause" className={styles.label}>
                  <Text size="sm" color="secondary">Pause on Hover</Text>
                </label>
                <input
                  id="ticker-pause"
                  type="checkbox"
                  checked={localConfig.pauseOnHover}
                  onChange={(e) => handleConfigChange('pauseOnHover', e.target.checked)}
                />
              </div>
            </>
          )}
        </div>
        
        <div className={styles.section}>
          <Text as="h3" size="sm" weight="medium" className={styles.sectionTitle}>
            Widget Info
          </Text>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Text size="xs" color="tertiary">Type</Text>
              <Text size="sm" className={styles.infoValue}>{selectedWidget.type}</Text>
            </div>
            <div className={styles.infoItem}>
              <Text size="xs" color="tertiary">Size</Text>
              <Text size="sm" className={styles.infoValue}>
                {selectedWidget.width}×{selectedWidget.height}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text size="xs" color="tertiary">Position</Text>
              <Text size="sm" className={styles.infoValue}>
                {selectedWidget.x},{selectedWidget.y}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text size="xs" color="tertiary">ID</Text>
              <Text size="xs" className={styles.infoValue} style={{ fontFamily: 'var(--font-family-mono)' }}>
                {selectedWidget.id.slice(0, 8)}...
              </Text>
            </div>
          </div>
        </div>

        {/* Display preferences section */}
        <div className={styles.section}>
          <Text as="h3" size="sm" weight="medium" className={styles.sectionTitle}>
            Display Preferences
          </Text>
          <div className={styles.field}>
            <label htmlFor="toggle-high-contrast" className={styles.label}>
              <Text size="sm" color="secondary">High Contrast Mode</Text>
            </label>
            <input
              id="toggle-high-contrast"
              type="checkbox"
              checked={highContrast}
              onChange={() => toggleHighContrast()}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="toggle-safe-mode" className={styles.label}>
              <Text size="sm" color="secondary">Safe Mode (reduce motion)</Text>
            </label>
            <input
              id="toggle-safe-mode"
              type="checkbox"
              checked={safeMode}
              onChange={() => toggleSafeMode()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
