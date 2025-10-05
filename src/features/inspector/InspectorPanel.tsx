import { useState, useEffect, useMemo } from 'react';
import { Button, Input, Text } from '@/design-system';
import { cn } from '@/lib/utils';
import styles from './InspectorPanel.module.css';

// Widget + dashboard state
import { useDashboardStore } from '@/store/useDashboard';
import useDashboard from '@/store/useDashboard'; // TS store (high contrast / safe mode)

// Debounce util for smooth live updates
import { useDebounce } from '@/hooks/useDebounce';

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
  { value: 'modal', label: 'Modal' },
] as const;

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'relaxed', label: 'Relaxed' },
] as const;

export const InspectorPanel = ({
  isOpen = false,
  onClose,
  className,
  ...props
}: InspectorPanelProps) => {
  const { selectedWidgetId, widgets, updateWidget } = useDashboardStore();
  const selectedWidget = selectedWidgetId ? widgets[selectedWidgetId] : undefined;

  const { highContrast, safeMode, toggleHighContrast, toggleSafeMode } = useDashboard();

  // detect types for conditional sections
  const isTable = selectedWidget?.type === 'table';
  const isLowerThird = selectedWidget?.type === 'lowerThird';
  const isBRB = selectedWidget?.type === 'brb-screen';

  // Resolve table columns as strings
  const tableColumns: string[] = useMemo(() => {
    if (!isTable) return [];
    const raw = (selectedWidget?.config as any)?.columns ?? [];
    return (Array.isArray(raw) ? raw : [])
      .map((c: any) => (typeof c === 'string' ? c : c?.key))
      .filter(Boolean);
  }, [isTable, selectedWidget?.config]);

  const [localConfig, setLocalConfig] = useState(() => ({
    // General
    title: selectedWidget?.title || '',
    dataSource: selectedWidget?.config?.dataSource || '',
    motionPreset: selectedWidget?.config?.motionPreset || 'card',
    density: selectedWidget?.config?.density || 'comfortable',
    ariaLabel: selectedWidget?.config?.ariaLabel || '',

    // Table
    filter: (selectedWidget?.config as any)?.filter || '',
    columnOrder: (selectedWidget?.config as any)?.columnOrder || [],
    columnTypes: (selectedWidget?.config as any)?.columnTypes || {},

    // Lower third
    showTicker: (selectedWidget?.config as any)?.showTicker ?? false,
    tickerText: (selectedWidget?.config as any)?.tickerText || '',
    speed: (selectedWidget?.config as any)?.speed ?? 60,
    direction: (selectedWidget?.config as any)?.direction || 'left',
    pauseOnHover: (selectedWidget?.config as any)?.pauseOnHover ?? true,
    primarySize: (selectedWidget?.config as any)?.primarySize || '',
    secondarySize: (selectedWidget?.config as any)?.secondarySize || '',
    primaryColor: (selectedWidget?.config as any)?.primaryColor || '',
    secondaryColor: (selectedWidget?.config as any)?.secondaryColor || '',

    // BRB screen
    message: (selectedWidget?.config as any)?.message || '',
    subMessage: (selectedWidget?.config as any)?.subMessage || '',
    countdown: (selectedWidget?.config as any)?.countdown ?? undefined,
    image: (selectedWidget?.config as any)?.image || '',
  }));

  const debounced = useDebounce(localConfig, 200);

  // Persist debounced config to store
  useEffect(() => {
    if (!selectedWidget || !selectedWidgetId) return;
    updateWidget(selectedWidgetId, {
      title: debounced.title,
      config: {
        ...selectedWidget.config,

        // General
        dataSource: debounced.dataSource,
        motionPreset: debounced.motionPreset,
        density: debounced.density,
        ariaLabel: debounced.ariaLabel,

        // Table
        filter: debounced.filter,
        columnOrder: debounced.columnOrder,
        columnTypes: debounced.columnTypes,

        // Lower third
        showTicker: debounced.showTicker,
        tickerText: debounced.tickerText,
        speed: debounced.speed,
        direction: debounced.direction,
        pauseOnHover: debounced.pauseOnHover,
        primarySize: debounced.primarySize,
        secondarySize: debounced.secondarySize,
        primaryColor: debounced.primaryColor,
        secondaryColor: debounced.secondaryColor,

        // BRB screen
        message: debounced.message,
        subMessage: debounced.subMessage,
        countdown: debounced.countdown,
        image: debounced.image,
      },
    });
  }, [debounced, selectedWidget, selectedWidgetId, updateWidget]);

  // Reset when selection changes
  useEffect(() => {
    if (!selectedWidget) return;
    setLocalConfig({
      // General
      title: selectedWidget.title || '',
      dataSource: selectedWidget.config?.dataSource || '',
      motionPreset: selectedWidget.config?.motionPreset || 'card',
      density: selectedWidget.config?.density || 'comfortable',
      ariaLabel: selectedWidget.config?.ariaLabel || '',

      // Table
      filter: (selectedWidget.config as any)?.filter || '',
      columnOrder: (selectedWidget.config as any)?.columnOrder || [],
      columnTypes: (selectedWidget.config as any)?.columnTypes || {},

      // Lower third
      showTicker: (selectedWidget.config as any)?.showTicker ?? false,
      tickerText: (selectedWidget.config as any)?.tickerText || '',
      speed: (selectedWidget.config as any)?.speed ?? 60,
      direction: (selectedWidget.config as any)?.direction || 'left',
      pauseOnHover: (selectedWidget.config as any)?.pauseOnHover ?? true,
      primarySize: (selectedWidget.config as any)?.primarySize || '',
      secondarySize: (selectedWidget.config as any)?.secondarySize || '',
      primaryColor: (selectedWidget.config as any)?.primaryColor || '',
      secondaryColor: (selectedWidget.config as any)?.secondaryColor || '',

      // BRB screen
      message: (selectedWidget.config as any)?.message || '',
      subMessage: (selectedWidget.config as any)?.subMessage || '',
      countdown: (selectedWidget.config as any)?.countdown ?? undefined,
      image: (selectedWidget.config as any)?.image || '',
    });
  }, [selectedWidget]);

  const handle = (field: string, value: any) =>
    setLocalConfig((p) => ({ ...p, [field]: value }));

  const handleColumnTypeChange = (key: string, type: 'string' | 'number') =>
    setLocalConfig((p: any) => ({ ...p, columnTypes: { ...(p.columnTypes || {}), [key]: type } }));

  if (!isOpen) return null;

  if (!selectedWidget) {
    return (
      <div className={cn(styles.panel, styles.empty, className)} {...props}>
        <div className={styles.header}>
          <Text as="h2" size="base" weight="medium" id="inspector-title">Inspector</Text>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close inspector">×</Button>
          )}
        </div>
        <div className={styles.content}>
          <Text size="sm" color="muted">Select a widget to configure its properties</Text>
        </div>
      </div>
    );
  }

  const columnOrderString =
    (localConfig.columnOrder && (localConfig.columnOrder as string[]).length > 0)
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
        <Text as="h2" size="base" weight="medium" id="inspector-title">Inspector</Text>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close inspector">×</Button>
        )}
      </div>

      <div className={styles.content}>
        {/* General */}
        <details open>
          <summary className={styles.sectionTitle}>General</summary>
          <div className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="w-title" className={styles.label}><Text size="sm" color="secondary">Title</Text></label>
              <Input id="w-title" size="sm" value={localConfig.title}
                     onChange={(e) => handle('title', e.target.value)} placeholder="Widget title" />
            </div>

            <div className={styles.field}>
              <label htmlFor="w-ds" className={styles.label}><Text size="sm" color="secondary">Data Source</Text></label>
              <Input id="w-ds" size="sm" value={localConfig.dataSource}
                     onChange={(e) => handle('dataSource', e.target.value)} placeholder="API endpoint or data key" />
            </div>

            <div className={styles.field}>
              <label htmlFor="w-motion" className={styles.label}><Text size="sm" color="secondary">Motion Preset</Text></label>
              <select id="w-motion" className={styles.select} value={localConfig.motionPreset}
                      onChange={(e) => handle('motionPreset', e.target.value)}>
                {MOTION_PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="w-density" className={styles.label}><Text size="sm" color="secondary">Density</Text></label>
              <select id="w-density" className={styles.select} value={localConfig.density}
                      onChange={(e) => handle('density', e.target.value)}>
                {DENSITY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="w-aria" className={styles.label}><Text size="sm" color="secondary">ARIA Label</Text></label>
              <Input id="w-aria" size="sm" value={localConfig.ariaLabel}
                     onChange={(e) => handle('ariaLabel', e.target.value)} placeholder="Accessibility description" />
            </div>
          </div>
        </details>

        {/* Table Settings */}
        {isTable && (
          <details>
            <summary className={styles.sectionTitle}>Table Settings</summary>
            <div className={styles.section}>
              <div className={styles.field}>
                <label htmlFor="t-filter" className={styles.label}><Text size="sm" color="secondary">Filter</Text></label>
                <Input id="t-filter" size="sm" value={localConfig.filter || ''}
                       onChange={(e) => handle('filter', e.target.value)}
                       placeholder="Search rows (case-insensitive)" />
              </div>

              <div className={styles.field}>
                <label htmlFor="t-order" className={styles.label}><Text size="sm" color="secondary">Column Order</Text></label>
                <Input id="t-order" size="sm" value={columnOrderString}
                       onChange={(e) => handle('columnOrder',
                         e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                       placeholder="e.g. timestamp, level, message" />
              </div>

              {tableColumns.length > 0 && (
                <div className={styles.field}>
                  <Text size="sm" color="secondary" className={styles.label}>Column Types</Text>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {tableColumns.map((key) => (
                      <div key={key} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <label htmlFor={`col-type-${key}`} style={{ minWidth: 120 }}>
                          <Text size="xs">{key}</Text>
                        </label>
                        <select id={`col-type-${key}`} className={styles.select}
                                value={(localConfig.columnTypes as any)?.[key] || 'string'}
                                onChange={(e) => handleColumnTypeChange(key, e.target.value as 'string' | 'number')}>
                          <option value="string">Alphabetical</option>
                          <option value="number">Numeric</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Lower Third */}
        {isLowerThird && (
          <details>
            <summary className={styles.sectionTitle}>Lower Third</summary>
            <div className={styles.section}>
              <div className={styles.field}>
                <label htmlFor="lt-show" className={styles.label}><Text size="sm" color="secondary">Show Ticker</Text></label>
                <input id="lt-show" type="checkbox" checked={!!localConfig.showTicker}
                       onChange={(e) => handle('showTicker', e.target.checked)} />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-text" className={styles.label}><Text size="sm" color="secondary">Ticker Text</Text></label>
                <Input id="lt-text" size="sm" value={localConfig.tickerText}
                       onChange={(e) => handle('tickerText', e.target.value)} placeholder="Headline or message" />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-speed" className={styles.label}><Text size="sm" color="secondary">Ticker Speed (px/s)</Text></label>
                <Input id="lt-speed" size="sm" type="number" min={10} max={500} step={10}
                       value={Number(localConfig.speed) || 60}
                       onChange={(e) => handle('speed', Number(e.target.value))} />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-dir" className={styles.label}><Text size="sm" color="secondary">Direction</Text></label>
                <select id="lt-dir" className={styles.select} value={localConfig.direction}
                        onChange={(e) => handle('direction', e.target.value)}>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-pause" className={styles.label}><Text size="sm" color="secondary">Pause on Hover</Text></label>
                <input id="lt-pause" type="checkbox" checked={!!localConfig.pauseOnHover}
                       onChange={(e) => handle('pauseOnHover', e.target.checked)} />
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />

              <Text as="h4" size="xs" weight="medium" className={styles.sectionTitle}>
                Typography & Colours (overrides)
              </Text>

              <div className={styles.field}>
                <label htmlFor="lt-primary-size" className={styles.label}><Text size="sm" color="secondary">Primary Size</Text></label>
                <Input id="lt-primary-size" size="sm" value={localConfig.primarySize || ''}
                       onChange={(e) => handle('primarySize', e.target.value)}
                       placeholder="e.g. var(--text-lg) or 20px" />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-secondary-size" className={styles.label}><Text size="sm" color="secondary">Secondary Size</Text></label>
                <Input id="lt-secondary-size" size="sm" value={localConfig.secondarySize || ''}
                       onChange={(e) => handle('secondarySize', e.target.value)}
                       placeholder="e.g. var(--text-sm) or 14px" />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-primary-color" className={styles.label}><Text size="sm" color="secondary">Primary Color</Text></label>
                <Input id="lt-primary-color" size="sm" value={localConfig.primaryColor || ''}
                       onChange={(e) => handle('primaryColor', e.target.value)}
                       placeholder="e.g. var(--ink) or #111111" />
              </div>

              <div className={styles.field}>
                <label htmlFor="lt-secondary-color" className={styles.label}><Text size="sm" color="secondary">Secondary Color</Text></label>
                <Input id="lt-secondary-color" size="sm" value={localConfig.secondaryColor || ''}
                       onChange={(e) => handle('secondaryColor', e.target.value)}
                       placeholder="e.g. var(--ink-muted) or #333333" />
              </div>
            </div>
          </details>
        )}

        {/* BRB Screen */}
        {isBRB && (
          <details>
            <summary className={styles.sectionTitle}>BRB Screen</summary>
            <div className={styles.section}>
              <div className={styles.field}>
                <label htmlFor="brb-msg" className={styles.label}><Text size="sm" color="secondary">Message</Text></label>
                <Input id="brb-msg" size="sm" value={(localConfig as any).message}
                       onChange={(e) => handle('message', e.target.value)}
                       placeholder="Be Right Back" />
              </div>

              <div className={styles.field}>
                <label htmlFor="brb-sub" className={styles.label}><Text size="sm" color="secondary">Sub-message</Text></label>
                <Input id="brb-sub" size="sm" value={(localConfig as any).subMessage}
                       onChange={(e) => handle('subMessage', e.target.value)}
                       placeholder="We will return shortly" />
              </div>

              <div className={styles.field}>
                <label htmlFor="brb-count" className={styles.label}><Text size="sm" color="secondary">Countdown (seconds)</Text></label>
                <Input id="brb-count" size="sm" type="number" min={0}
                       value={typeof (localConfig as any).countdown === 'number' ? (localConfig as any).countdown : ''}
                       onChange={(e) => handle('countdown', e.target.value === '' ? undefined : Number(e.target.value))}
                       placeholder="Optional – leave blank for none" />
              </div>

              <div className={styles.field}>
                <label htmlFor="brb-image" className={styles.label}><Text size="sm" color="secondary">Background Image URL</Text></label>
                <Input id="brb-image" size="sm" value={(localConfig as any).image || ''}
                       onChange={(e) => handle('image', e.target.value)}
                       placeholder="https://… (optional)" />
              </div>
            </div>
          </details>
        )}

        {/* Display preferences */}
        <details>
          <summary className={styles.sectionTitle}>Display Preferences</summary>
          <div className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="toggle-hc" className={styles.label}><Text size="sm" color="secondary">High Contrast</Text></label>
              <input id="toggle-hc" type="checkbox" checked={!!highContrast} onChange={() => toggleHighContrast()} />
            </div>
            <div className={styles.field}>
              <label htmlFor="toggle-safe" className={styles.label}><Text size="sm" color="secondary">Safe Mode (reduce motion)</Text></label>
              <input id="toggle-safe" type="checkbox" checked={!!safeMode} onChange={() => toggleSafeMode()} />
            </div>
          </div>
        </details>

        {/* Widget info */}
        <details>
          <summary className={styles.sectionTitle}>Widget Info</summary>
          <div className={styles.section}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Text size="xs" color="tertiary">Type</Text>
                <Text size="sm" className={styles.infoValue}>{selectedWidget.type}</Text>
              </div>
              <div className={styles.infoItem}>
                <Text size="xs" color="tertiary">Size</Text>
                <Text size="sm" className={styles.infoValue}>{selectedWidget.width}×{selectedWidget.height}</Text>
              </div>
              <div className={styles.infoItem}>
                <Text size="xs" color="tertiary">Position</Text>
                <Text size="sm" className={styles.infoValue}>{selectedWidget.x},{selectedWidget.y}</Text>
              </div>
              <div className={styles.infoItem}>
                <Text size="xs" color="tertiary">ID</Text>
                <Text size="xs" className={styles.infoValue} style={{ fontFamily: 'var(--font-family-mono)' }}>
                  {selectedWidget.id.slice(0, 8)}…
                </Text>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
