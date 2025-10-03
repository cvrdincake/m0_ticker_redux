import { useState, useRef, useCallback, useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import { AlignmentGuides, snapToGuides, nearestGuides } from './AlignmentGuides';
import { cn } from '@/lib/utils';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  className?: string;
}

interface DragState {
  widgetId: string;
  startPosition: { x: number; y: number };
  offset: { x: number; y: number };
  isDragging: boolean;
  isResizing: boolean;
}

export const DashboardGrid = ({ className, ...props }: DashboardGridProps) => {
  const { 
    widgets, 
    getActiveDashboard, 
    updateWidget, 
    selectWidget, 
    selectedWidgetId,
    nudgeWidget,
    resizeWidget,
    duplicateWidget,
    deleteWidget
  } = useDashboardStore();
  
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [announcements, setAnnouncements] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);
  
  const dashboard = getActiveDashboard();
  const dashboardWidgets = dashboard?.widgets.map(id => widgets[id]).filter(Boolean) || [];
  
  const announce = useCallback((message: string) => {
    setAnnouncements(message);
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setAnnouncements(''), 1000);
  }, []);
  
  const handleWidgetKeyDown = useCallback((e: React.KeyboardEvent, widgetId: string) => {
    const widget = widgets[widgetId];
    if (!widget) return;
    
    // Don't interfere if user is typing in an input
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable) {
      return;
    }
    
    const key = e.key.toLowerCase();
    const mod = e.metaKey || e.ctrlKey;
    const shift = e.shiftKey;
    
    switch (key) {
      case 'arrowup':
        e.preventDefault();
        if (shift) {
          resizeWidget(widgetId, 0, -1);
          announce('Resized shorter');
        } else {
          nudgeWidget(widgetId, 0, -1);
          announce('Moved up');
        }
        break;
        
      case 'arrowdown':
        e.preventDefault();
        if (shift) {
          resizeWidget(widgetId, 0, 1);
          announce('Resized taller');
        } else {
          nudgeWidget(widgetId, 0, 1);
          announce('Moved down');
        }
        break;
        
      case 'arrowleft':
        e.preventDefault();
        if (shift) {
          resizeWidget(widgetId, -1, 0);
          announce('Resized narrower');
        } else {
          nudgeWidget(widgetId, -1, 0);
          announce('Moved left');
        }
        break;
        
      case 'arrowright':
        e.preventDefault();
        if (shift) {
          resizeWidget(widgetId, 1, 0);
          announce('Resized wider');
        } else {
          nudgeWidget(widgetId, 1, 0);
          announce('Moved right');
        }
        break;
        
      case 'd':
        if (mod) {
          e.preventDefault();
          duplicateWidget(widgetId);
          announce('Widget duplicated');
        }
        break;
        
      case 'delete':
      case 'backspace':
        e.preventDefault();
        // TODO: Check safe mode setting and show confirmation if needed
        deleteWidget(widgetId);
        announce('Widget deleted');
        break;
        
      case 'enter':
      case ' ':
        e.preventDefault();
        selectWidget(widgetId);
        announce(`Selected ${widget.title || widget.type} widget`);
        break;
    }
  }, [widgets, nudgeWidget, resizeWidget, duplicateWidget, deleteWidget, selectWidget, announce]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent, widgetId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const widget = widgets[widgetId];
    if (!widget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const isResizeHandle = (e.target as HTMLElement).classList.contains(styles.resizeHandle);
    
    setDragState({
      widgetId,
      startPosition: { x: widget.x, y: widget.y },
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      },
      isDragging: true,
      isResizing: isResizeHandle
    });
    
    selectWidget(widgetId);
    e.preventDefault();
  }, [widgets, selectWidget]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState?.isDragging) return;
    
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return;
    
    const widget = widgets[dragState.widgetId];
    if (!widget) return;
    
    if (dragState.isResizing) {
      // Handle resize
      const newWidth = Math.max(1, Math.round((e.clientX - gridRect.left - widget.x) / 60));
      const newHeight = Math.max(1, Math.round((e.clientY - gridRect.top - widget.y) / 60));
      
      updateWidget(dragState.widgetId, {
        width: newWidth,
        height: newHeight
      });
    } else {
      // Handle drag
      const newX = Math.max(0, Math.round((e.clientX - gridRect.left - dragState.offset.x) / 60));
      const newY = Math.max(0, Math.round((e.clientY - gridRect.top - dragState.offset.y) / 60));
      
      updateWidget(dragState.widgetId, { x: newX, y: newY });
    }
  }, [dragState, widgets, updateWidget]);
  
  const handleMouseUp = useCallback(() => {
    if (!dragState?.isDragging) return;
    
    const widget = widgets[dragState.widgetId];
    if (!widget) return;
    
    // Snap to guides on release
    if (!dragState.isResizing) {
      const otherWidgets = dashboardWidgets.filter(w => w.id !== dragState.widgetId);
      const guides = nearestGuides(widget, otherWidgets, 6);
      
      if (guides.length > 0) {
        const snapped = snapToGuides(
          { x: widget.x, y: widget.y },
          { width: widget.width, height: widget.height },
          guides,
          6
        );
        
        if (snapped.x !== widget.x || snapped.y !== widget.y) {
          updateWidget(dragState.widgetId, snapped);
          announce('Snapped to alignment guide');
        }
      }
    }
    
    setDragState(null);
  }, [dragState, widgets, dashboardWidgets, updateWidget, announce]);
  
  // Add global mouse event listeners
  useEffect(() => {
    if (dragState?.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState?.isDragging, handleMouseMove, handleMouseUp]);
  
  return (
    <div 
      ref={gridRef}
      className={cn(styles.grid, className)} 
      {...props}
    >
      {/* Live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className={styles.srOnly}
      >
        {announcements}
      </div>
      
      {/* Grid background */}
      <div className={styles.gridBackground} />
      
      {/* Widgets */}
      {dashboardWidgets.map(widget => (
        <div
          key={widget.id}
          role="group"
          aria-label={widget.config?.ariaLabel || widget.title || widget.type}
          tabIndex={0}
          data-widget-id={widget.id}
          data-widget-kind={widget.type}
          className={cn(
            styles.widget,
            selectedWidgetId === widget.id && styles.selected,
            dragState?.widgetId === widget.id && styles.dragging
          )}
          style={{
            left: `${widget.x * 60}px`,
            top: `${widget.y * 60}px`,
            width: `${widget.width * 60}px`,
            height: `${widget.height * 60}px`,
            zIndex: widget.z || 0
          }}
          onMouseDown={(e) => handleMouseDown(e, widget.id)}
          onKeyDown={(e) => handleWidgetKeyDown(e, widget.id)}
        >
          <div className={styles.widgetContent}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetTitle}>
                {widget.title || widget.type}
              </span>
              <span className={styles.widgetType}>
                {widget.type}
              </span>
            </div>
            
            <div className={styles.widgetBody}>
              {/* Widget content would be rendered here based on type */}
              <div className={styles.placeholder}>
                {widget.type} widget content
              </div>
            </div>
          </div>
          
          {/* Resize handle */}
          {selectedWidgetId === widget.id && (
            <div className={styles.resizeHandle} />
          )}
        </div>
      ))}
      
      {/* Alignment guides */}
      <AlignmentGuides
        draggedWidgetId={dragState?.widgetId}
        dragPosition={dragState?.widgetId ? {
          x: widgets[dragState.widgetId]?.x || 0,
          y: widgets[dragState.widgetId]?.y || 0
        } : undefined}
        isResizing={dragState?.isResizing}
      />
    </div>
  );
};