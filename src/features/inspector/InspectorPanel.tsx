import { useDashboardStore } from '@/store/useDashboard';
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
  const { 
    selectedWidgetId,
    getSelectedWidget,
    updateWidget
  } = useDashboardStore();
  
  const selectedWidget = getSelectedWidget();
  const [localConfig, setLocalConfig] = useState({
    title: selectedWidget?.title || '',
    dataSource: selectedWidget?.config?.dataSource || '',
    motionPreset: selectedWidget?.config?.motionPreset || 'card',
    density: selectedWidget?.config?.density || 'comfortable',
    ariaLabel: selectedWidget?.config?.ariaLabel || ''
  });
  
  // Debounced updates for live preview (200ms as specified)
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
        ariaLabel: debouncedConfig.ariaLabel
      }
    });
  }, [debouncedConfig, selectedWidget, selectedWidgetId, updateWidget]);
  
  // Update local state when selected widget changes
  useEffect(() => {
    if (selectedWidget) {
      setLocalConfig({
        title: selectedWidget.title || '',
        dataSource: selectedWidget.config?.dataSource || '',
        motionPreset: selectedWidget.config?.motionPreset || 'card',
        density: selectedWidget.config?.density || 'comfortable',
        ariaLabel: selectedWidget.config?.ariaLabel || ''
      });
    }
  }, [selectedWidget]);
  
  const handleConfigChange = (field: string, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
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
      </div>
    </div>
  );
};