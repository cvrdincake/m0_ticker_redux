import { useDashboardStore } from '@/store/useDashboard';
import { Button, Input, Text } from '@/design-system';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './ConfigPanel.module.css';

const ConfigPanel = ({ 
  isOpen, 
  onClose,
  className,
  ...props 
}) => {
  const { 
    config, 
    updateConfig, 
    resetConfig,
    selectedWidgetId,
    getSelectedWidget,
    updateWidget
  } = useDashboardStore();
  
  const selectedWidget = getSelectedWidget();
  const [localConfig, setLocalConfig] = useState(config);
  const [localWidgetConfig, setLocalWidgetConfig] = useState(selectedWidget?.config || {});
  
  // Debounced updates for live preview
  const debouncedConfig = useDebounce(localConfig, 300);
  const debouncedWidgetConfig = useDebounce(localWidgetConfig, 300);
  
  // Apply debounced global config changes
  useEffect(() => {
    if (debouncedConfig !== config) {
      updateConfig(debouncedConfig);
    }
  }, [debouncedConfig, config, updateConfig]);
  
  // Apply debounced widget config changes
  useEffect(() => {
    if (selectedWidgetId && debouncedWidgetConfig !== selectedWidget?.config) {
      updateWidget(selectedWidgetId, { config: debouncedWidgetConfig });
    }
  }, [debouncedWidgetConfig, selectedWidgetId, selectedWidget?.config, updateWidget]);
  
  // Sync local state when external changes occur
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  
  useEffect(() => {
    setLocalWidgetConfig(selectedWidget?.config || {});
  }, [selectedWidget?.config]);
  
  const handleConfigChange = (key, value) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleWidgetConfigChange = (key, value) => {
    setLocalWidgetConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleReset = () => {
    resetConfig();
    setLocalConfig(config);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={cn(styles.panel, className)} {...props}>
      <div className={styles.header}>
        <Text as="h2" size="lg" weight="medium">
          Configuration
        </Text>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </Button>
      </div>
      
      <div className={styles.content}>
        {/* Global Settings */}
        <section className={styles.section}>
          <Text as="h3" size="base" weight="medium" className={styles.sectionTitle}>
            Global Settings
          </Text>
          
          <div className={styles.field}>
            <label className={styles.label}>
              <Text size="sm" color="secondary">Auto Refresh</Text>
              <input
                type="checkbox"
                checked={localConfig.autoRefresh}
                onChange={(e) => handleConfigChange('autoRefresh', e.target.checked)}
                className={styles.checkbox}
              />
            </label>
          </div>
          
          <div className={styles.field}>
            <Text size="sm" color="secondary" className={styles.label}>
              Refresh Interval (ms)
            </Text>
            <Input
              type="number"
              value={localConfig.refreshInterval}
              onChange={(e) => handleConfigChange('refreshInterval', parseInt(e.target.value))}
              min="1000"
              max="60000"
              step="1000"
              disabled={!localConfig.autoRefresh}
              size="sm"
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>
              <Text size="sm" color="secondary">Show Grid</Text>
              <input
                type="checkbox"
                checked={localConfig.showGrid}
                onChange={(e) => handleConfigChange('showGrid', e.target.checked)}
                className={styles.checkbox}
              />
            </label>
          </div>
          
          <div className={styles.field}>
            <Text size="sm" color="secondary" className={styles.label}>
              Grid Size
            </Text>
            <Input
              type="range"
              value={localConfig.gridSize}
              onChange={(e) => handleConfigChange('gridSize', parseInt(e.target.value))}
              min="8"
              max="24"
              step="2"
              size="sm"
              className={styles.slider}
            />
            <Text size="xs" color="tertiary">{localConfig.gridSize}px</Text>
          </div>
        </section>
        
        {/* Animation Settings */}
        <section className={styles.section}>
          <Text as="h3" size="base" weight="medium" className={styles.sectionTitle}>
            Animations
          </Text>
          
          <div className={styles.field}>
            <label className={styles.label}>
              <Text size="sm" color="secondary">Enable Animations</Text>
              <input
                type="checkbox"
                checked={localConfig.enableAnimations}
                onChange={(e) => handleConfigChange('enableAnimations', e.target.checked)}
                className={styles.checkbox}
              />
            </label>
          </div>
          
          <div className={styles.field}>
            <Text size="sm" color="secondary" className={styles.label}>
              Animation Speed
            </Text>
            <Input
              type="range"
              value={localConfig.animationSpeed}
              onChange={(e) => handleConfigChange('animationSpeed', parseFloat(e.target.value))}
              min="0.1"
              max="2"
              step="0.1"
              disabled={!localConfig.enableAnimations}
              size="sm"
              className={styles.slider}
            />
            <Text size="xs" color="tertiary">{localConfig.animationSpeed}x</Text>
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>
              <Text size="sm" color="secondary">Enable Parallax</Text>
              <input
                type="checkbox"
                checked={localConfig.enableParallax}
                onChange={(e) => handleConfigChange('enableParallax', e.target.checked)}
                disabled={!localConfig.enableAnimations}
                className={styles.checkbox}
              />
            </label>
          </div>
        </section>
        
        {/* Chart Settings */}
        <section className={styles.section}>
          <Text as="h3" size="base" weight="medium" className={styles.sectionTitle}>
            Charts
          </Text>
          
          <div className={styles.field}>
            <Text size="sm" color="secondary" className={styles.label}>
              Default Height (px)
            </Text>
            <Input
              type="number"
              value={localConfig.defaultChartHeight}
              onChange={(e) => handleConfigChange('defaultChartHeight', parseInt(e.target.value))}
              min="200"
              max="800"
              step="50"
              size="sm"
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>
              <Text size="sm" color="secondary">Show Data Points</Text>
              <input
                type="checkbox"
                checked={localConfig.showDataPoints}
                onChange={(e) => handleConfigChange('showDataPoints', e.target.checked)}
                className={styles.checkbox}
              />
            </label>
          </div>
          
          <div className={styles.field}>
            <Text size="sm" color="secondary" className={styles.label}>
              Line Width
            </Text>
            <Input
              type="range"
              value={localConfig.lineWidth}
              onChange={(e) => handleConfigChange('lineWidth', parseInt(e.target.value))}
              min="1"
              max="5"
              step="1"
              size="sm"
              className={styles.slider}
            />
            <Text size="xs" color="tertiary">{localConfig.lineWidth}px</Text>
          </div>
        </section>
        
        {/* Widget-specific settings */}
        {selectedWidget && (
          <section className={styles.section}>
            <Text as="h3" size="base" weight="medium" className={styles.sectionTitle}>
              Widget: {selectedWidget.title}
            </Text>
            
            <div className={styles.field}>
              <Text size="sm" color="secondary" className={styles.label}>
                Title
              </Text>
              <Input
                value={selectedWidget.title}
                onChange={(e) => updateWidget(selectedWidgetId, { title: e.target.value })}
                size="sm"
              />
            </div>
            
            <div className={styles.field}>
              <Text size="sm" color="secondary" className={styles.label}>
                Width (grid units)
              </Text>
              <Input
                type="number"
                value={selectedWidget.width}
                onChange={(e) => updateWidget(selectedWidgetId, { width: parseInt(e.target.value) })}
                min="1"
                max="12"
                size="sm"
              />
            </div>
            
            <div className={styles.field}>
              <Text size="sm" color="secondary" className={styles.label}>
                Height (grid units)
              </Text>
              <Input
                type="number"
                value={selectedWidget.height}
                onChange={(e) => updateWidget(selectedWidgetId, { height: parseInt(e.target.value) })}
                min="1"
                max="12"
                size="sm"
              />
            </div>
            
            {/* Chart widget specific config */}
            {selectedWidget.type === 'chart' && (
              <>
                <div className={styles.field}>
                  <Text size="sm" color="secondary" className={styles.label}>
                    Chart Type
                  </Text>
                  <select
                    value={localWidgetConfig.chartType || 'line'}
                    onChange={(e) => handleWidgetConfigChange('chartType', e.target.value)}
                    className={styles.select}
                  >
                    <option value="line">Line</option>
                    <option value="area">Area</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
                
                <div className={styles.field}>
                  <Text size="sm" color="secondary" className={styles.label}>
                    Time Range
                  </Text>
                  <select
                    value={localWidgetConfig.timeRange || '24h'}
                    onChange={(e) => handleWidgetConfigChange('timeRange', e.target.value)}
                    className={styles.select}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="6h">6 Hours</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                  </select>
                </div>
              </>
            )}
          </section>
        )}
      </div>
      
      <div className={styles.footer}>
        <Button variant="secondary" size="sm" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

export { ConfigPanel };