import { useState, useCallback, useMemo, useRef } from 'react';
import { WidgetRenderer, sanitizeWidgetConfig } from './render';
import { WidgetConfigUI, QuickConfigButtons } from './config';
import { Button } from '@/design-system/components';
import { Modal } from '@/design-system/patterns';
import { type WidgetKind } from './registry';
import styles from './dashboard.module.css';

interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  props: Record<string, any>;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetInstance[];
  breakpoints: Record<string, number>;
  cols: Record<string, number>;
  created: Date;
  modified: Date;
}

interface DashboardProps {
  initialLayout?: DashboardLayout;
  onLayoutChange?: (layout: DashboardLayout) => void;
  readOnly?: boolean;
  className?: string;
}

export function Dashboard({ 
  initialLayout, 
  onLayoutChange, 
  readOnly = false,
  className 
}: DashboardProps) {
  const [widgets, setWidgets] = useState<WidgetInstance[]>(
    initialLayout?.widgets || []
  );
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetInstance | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const breakpoints = useMemo(() => 
    initialLayout?.breakpoints || { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    [initialLayout?.breakpoints]
  );
  
  const cols = useMemo(() => 
    initialLayout?.cols || { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    [initialLayout?.cols]
  );
  
  // Simple grid layout (responsive CSS Grid)
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    padding: '16px',
    height: '100%',
    overflow: 'auto'
  }), []);
  
  // Add new widget
  const handleAddWidget = useCallback((config: any) => {
    const newWidget: WidgetInstance = {
      id: config.id,
      kind: config.kind,
      props: config.props,
      x: config.x || 0,
      y: config.y || 0,
      w: config.w,
      h: config.h,
    };
    
    setWidgets(prev => [...prev, newWidget]);
    setConfigModalOpen(false);
  }, []);
  
  // Edit existing widget
  const handleEditWidget = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setEditingWidget(widget);
      setConfigModalOpen(true);
    }
  }, [widgets]);
  
  // Update widget configuration
  const handleUpdateWidget = useCallback((config: any) => {
    if (editingWidget) {
      setWidgets(prev => prev.map(widget => 
        widget.id === editingWidget.id 
          ? { ...widget, ...config }
          : widget
      ));
      setEditingWidget(null);
      setConfigModalOpen(false);
    }
  }, [editingWidget]);
  
  // Remove widget
  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);
  
  // Export layout
  const handleExport = useCallback(() => {
    const layout: DashboardLayout = {
      id: initialLayout?.id || 'dashboard',
      name: initialLayout?.name || 'Dashboard',
      widgets,
      breakpoints,
      cols,
      created: initialLayout?.created || new Date(),
      modified: new Date(),
    };
    
    const dataStr = JSON.stringify(layout, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-${layout.id}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setExportModalOpen(false);
  }, [widgets, breakpoints, cols, initialLayout]);
  
  // Import layout
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const layout: DashboardLayout = JSON.parse(e.target?.result as string);
        
        // Validate and sanitize imported widgets
        const validatedWidgets = layout.widgets
          .map(widget => sanitizeWidgetConfig(widget))
          .filter(widget => widget !== null)
          .map(widget => ({
            id: widget.id,
            kind: widget.kind,
            props: widget.props,
            x: widget.x || 0,
            y: widget.y || 0,
            w: widget.w || 2,
            h: widget.h || 2,
          }));
        
        setWidgets(validatedWidgets);
        setImportModalOpen(false);
        
        if (onLayoutChange) {
          onLayoutChange({
            ...layout,
            widgets: validatedWidgets,
            modified: new Date(),
          });
        }
      } catch (error) {
        console.error('Failed to import layout:', error);
        alert('Failed to import layout. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onLayoutChange]);
  
  // Clear all widgets
  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to remove all widgets?')) {
      setWidgets([]);
    }
  }, []);
  
  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      
      {/* Dashboard Controls */}
      {!readOnly && (
        <div className={styles.controls}>
          <div className={styles.controlsSection}>
            <Button 
              variant="primary" 
              onClick={() => {
                setEditingWidget(null);
                setConfigModalOpen(true);
              }}
            >
              Add Widget
            </Button>
            
            <QuickConfigButtons onAddWidget={handleAddWidget} />
          </div>
          
          <div className={styles.controlsSection}>
            <Button 
              variant="secondary" 
              onClick={() => setExportModalOpen(true)}
            >
              Export Layout
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setImportModalOpen(true)}
            >
              Import Layout
            </Button>
            <Button 
              variant="danger" 
              onClick={handleClearAll}
              disabled={widgets.length === 0}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
      
      {/* Grid Layout */}
      <div className={styles.gridContainer}>
        {widgets.length === 0 && !readOnly ? (
          <div className={styles.emptyState}>
            <h3>No widgets configured</h3>
            <p>Add your first widget to get started</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setEditingWidget(null);
                setConfigModalOpen(true);
              }}
            >
              Add Widget
            </Button>
          </div>
        ) : (
          <div className={styles.simpleGrid} style={gridStyle}>
            {widgets.map(widget => (
              <div 
                key={widget.id} 
                className={styles.gridItem}
                style={{
                  minHeight: `${widget.h * 80}px`
                }}
              >
                <div className={styles.widgetContainer}>
                  
                  {/* Widget Controls */}
                  {!readOnly && (
                    <div className={styles.widgetControls}>
                      <button
                        className={styles.controlButton}
                        onClick={() => handleEditWidget(widget.id)}
                        title="Edit widget"
                      >
                        ⚙️
                      </button>
                      <button
                        className={styles.controlButton}
                        onClick={() => handleRemoveWidget(widget.id)}
                        title="Remove widget"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  
                  {/* Widget Content */}
                  <WidgetRenderer 
                    config={widget}
                    className={styles.widget}
                  />
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Configuration Modal */}
      <WidgetConfigUI 
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          setEditingWidget(null);
        }}
        onSave={editingWidget ? handleUpdateWidget : handleAddWidget}
        initialConfig={editingWidget}
      />
      
      {/* Export Modal */}
      <Modal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)}
        title="Export Dashboard Layout"
      >
        <div className={styles.modalContent}>
          <p>Export your current dashboard layout as a JSON file.</p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport}>
              Download JSON
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Import Modal */}
      <Modal 
        isOpen={importModalOpen} 
        onClose={() => setImportModalOpen(false)}
        title="Import Dashboard Layout"
      >
        <div className={styles.modalContent}>
          <p>Import a previously exported dashboard layout JSON file.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className={styles.fileInput}
          />
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      
    </div>
  );
}

export default Dashboard;