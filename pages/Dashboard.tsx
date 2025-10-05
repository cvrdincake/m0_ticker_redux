import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import { DashboardGrid } from '@/features/layout/DashboardGrid';
import { InspectorPanel } from '@/features/inspector/InspectorPanel';
import { CommandPalette } from '@/features/palette/CommandPalette';
import { ContextMenu } from '@/features/layout/ContextMenu';
import { useKeyboardShortcuts } from '@/lib/keys';
import { cn } from '@/lib/utils';
import styles from './Dashboard.module.css';

interface DashboardProps {
  className?: string;
}

export const Dashboard = ({ className, ...props }: DashboardProps) => {
  const { selectedWidgetId } = useDashboardStore();
  
  const [showInspector, setShowInspector] = useState(() => {
    return localStorage.getItem('dashboard-inspector-open') === 'true';
  });
  const [showPalette, setShowPalette] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    widgetId?: string;
    position: { x: number; y: number };
    isOpen: boolean;
  }>({
    position: { x: 0, y: 0 },
    isOpen: false
  });
  
  // Persist inspector state
  useEffect(() => {
    localStorage.setItem('dashboard-inspector-open', showInspector.toString());
  }, [showInspector]);
  
  // Global keyboard shortcuts
  useKeyboardShortcuts({
    bindings: [
      {
        key: 'k',
        metaKey: true,
        action: () => setShowPalette(true),
        description: 'Open command palette'
      },
      {
        key: 'k',
        ctrlKey: true,
        action: () => setShowPalette(true),
        description: 'Open command palette (Windows/Linux)'
      },
      {
        key: 'i',
        action: () => setShowInspector(prev => !prev),
        description: 'Toggle inspector panel'
      },
      {
        key: 'I',
        shiftKey: true,
        action: () => {
          setShowInspector(true);
          // Focus inspector if it has focusable elements
          setTimeout(() => {
            const inspector = document.querySelector('[role="form"]') as HTMLElement;
            const firstInput = inspector?.querySelector('input, select') as HTMLElement;
            firstInput?.focus();
          }, 100);
        },
        description: 'Open and focus inspector panel'
      },
      {
        key: 'Escape',
        action: () => {
          if (showPalette) {
            setShowPalette(false);
          } else if (contextMenu.isOpen) {
            setContextMenu(prev => ({ ...prev, isOpen: false }));
          }
        },
        description: 'Close open dialogs'
      }
    ]
  });
  
  const handleContextMenu = (event: React.MouseEvent, widgetId?: string) => {
    event.preventDefault();
    setContextMenu({
      widgetId,
      position: { x: event.clientX, y: event.clientY },
      isOpen: true
    });
  };
  
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <div 
      className={cn(styles.dashboard, className)}
      onContextMenu={(e) => handleContextMenu(e)}
      {...props}
    >
      {/* Main grid area */}
      <div className={styles.gridContainer}>
        <DashboardGrid />
      </div>
      
      {/* Inspector panel */}
      {showInspector && (
        <InspectorPanel
          isOpen={showInspector}
          onClose={() => setShowInspector(false)}
        />
      )}
      
      {/* Command palette */}
      <CommandPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
      />
      
      {/* Context menu */}
      <ContextMenu
        widgetId={contextMenu.widgetId}
        position={contextMenu.position}
        isOpen={contextMenu.isOpen}
        onClose={closeContextMenu}
      />
      
      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusInfo}>
          {selectedWidgetId ? (
            <span>Selected: Widget {selectedWidgetId.slice(0, 8)}</span>
          ) : (
            <span>No widget selected</span>
          )}
        </div>
        
        <div className={styles.statusActions}>
          <span>⌘K for commands</span>
          <span>I for inspector</span>
        </div>
      </div>
    </div>
  );
};