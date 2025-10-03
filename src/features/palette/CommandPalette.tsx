import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import { Button, Input, Text } from '@/design-system';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette = ({ 
  isOpen = false, 
  onClose,
  className,
  ...props 
}: CommandPaletteProps) => {
  const { 
    addWidget, 
    activeDashboardId, 
    selectedWidgetId,
    alignWidgets,
    distributeWidgets,
    exportDashboard,
    importDashboard,
    config,
    updateConfig
  } = useDashboardStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [safeMode, setSafeMode] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Trap focus within the dialog
  useFocusTrap(dialogRef, isOpen);
  
  // Generate commands based on current state
  const commands: Command[] = [
    // Add Widget Commands
    {
      id: 'add-card',
      label: 'Add Card Widget',
      description: 'Add a new information card',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'card'),
      shortcut: '⌘+1'
    },
    {
      id: 'add-kpi',
      label: 'Add KPI Widget',
      description: 'Add a key performance indicator',
      category: 'Add Widget', 
      action: () => activeDashboardId && addWidget(activeDashboardId, 'kpi'),
      shortcut: '⌘+2'
    },
    {
      id: 'add-chart',
      label: 'Add Chart Widget',
      description: 'Add a line chart visualization',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'chart'),
      shortcut: '⌘+3'
    },
    {
      id: 'add-table',
      label: 'Add Table Widget',
      description: 'Add a data table',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'table'),
      shortcut: '⌘+4'
    },
    {
      id: 'add-animated-list',
      label: 'Add Animated List',
      description: 'Add an animated list component',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'animatedList'),
      shortcut: '⌘+5'
    },
    {
      id: 'add-lower-third',
      label: 'Add Lower Third',
      description: 'Add a broadcast lower third',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'lowerThird'),
      shortcut: '⌘+6'
    },
    {
      id: 'add-popup-alert',
      label: 'Add Popup Alert',
      description: 'Add a popup alert notification',
      category: 'Add Widget',
      action: () => activeDashboardId && addWidget(activeDashboardId, 'popupAlert'),
      shortcut: '⌘+7'
    },
    
    // Alignment Commands
    {
      id: 'align-left',
      label: 'Align Left',
      description: 'Align selected widgets to the left',
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'left')
    },
    {
      id: 'align-right', 
      label: 'Align Right',
      description: 'Align selected widgets to the right',
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'right')
    },
    {
      id: 'align-top',
      label: 'Align Top',
      description: 'Align selected widgets to the top',
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'top')
    },
    {
      id: 'align-bottom',
      label: 'Align Bottom', 
      description: 'Align selected widgets to the bottom',
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'bottom')
    },
    {
      id: 'align-center-h',
      label: 'Centre Horizontally',
      description: 'Centre selected widgets horizontally',
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'center-h')
    },
    {
      id: 'align-center-v',
      label: 'Centre Vertically',
      description: 'Centre selected widgets vertically', 
      category: 'Align',
      action: () => selectedWidgetId && alignWidgets([selectedWidgetId], 'center-v')
    },
    
    // Distribution Commands
    {
      id: 'distribute-horizontal',
      label: 'Distribute Horizontally',
      description: 'Distribute selected widgets horizontally',
      category: 'Distribute',
      action: () => selectedWidgetId && distributeWidgets([selectedWidgetId], 'horizontal')
    },
    {
      id: 'distribute-vertical',
      label: 'Distribute Vertically',
      description: 'Distribute selected widgets vertically',
      category: 'Distribute', 
      action: () => selectedWidgetId && distributeWidgets([selectedWidgetId], 'vertical')
    },
    
    // Layout Commands
    {
      id: 'export-layout',
      label: 'Export Layout',
      description: 'Export current dashboard layout',
      category: 'Layout',
      action: () => {
        if (activeDashboardId) {
          const exported = exportDashboard(activeDashboardId);
          if (exported) {
            const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }
      },
      shortcut: '⌘+E'
    },
    {
      id: 'import-layout',
      label: 'Import Layout',
      description: 'Import a dashboard layout',
      category: 'Layout',
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = JSON.parse(e.target?.result as string);
                importDashboard(data);
              } catch (error) {
                console.error('Failed to import layout:', error);
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      },
      shortcut: '⌘+I'
    },
    
    // Mode Commands
    {
      id: 'toggle-safe-mode',
      label: `${safeMode ? 'Disable' : 'Enable'} Safe Mode`,
      description: 'Toggle confirmation dialogs for destructive actions',
      category: 'Mode',
      action: () => setSafeMode(!safeMode)
    },
    {
      id: 'toggle-inspector',
      label: `${showInspector ? 'Hide' : 'Show'} Inspector`,
      description: 'Toggle the property inspector panel',
      category: 'Mode',
      action: () => setShowInspector(!showInspector),
      shortcut: 'I'
    },
    {
      id: 'toggle-high-contrast',
      label: 'Toggle High Contrast',
      description: 'Switch to high contrast mode',
      category: 'Mode',
      action: () => {
        document.documentElement.classList.toggle('hc');
      },
      shortcut: '⌘+⇧+H'
    }
  ];
  
  // Filter commands based on search query
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group commands by category
  const groupedCommands = filteredCommands.reduce((groups, cmd) => {
    const category = cmd.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(cmd);
    return groups;
  }, {} as Record<string, Command[]>);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedCommand = filteredCommands[selectedIndex];
          if (selectedCommand) {
            selectedCommand.action();
            onClose?.();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);
  
  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
  
  // Update selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={dialogRef}
        className={cn(styles.palette, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-title"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className={styles.header}>
          <Text as="h2" size="base" weight="medium" id="palette-title">
            Command Palette
          </Text>
          <Text size="sm" color="muted">
            ⌘K to open, ↑↓ to navigate, ↵ to execute
          </Text>
        </div>
        
        <div className={styles.search}>
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
            size="sm"
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.commands} role="listbox">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className={styles.category}>
              <Text size="xs" weight="medium" color="muted" className={styles.categoryTitle}>
                {category}
              </Text>
              {commands.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                return (
                  <button
                    key={cmd.id}
                    className={cn(
                      styles.command, 
                      globalIndex === selectedIndex && styles.selected
                    )}
                    onClick={() => {
                      cmd.action();
                      onClose?.();
                    }}
                    role="option"
                    aria-selected={globalIndex === selectedIndex}
                  >
                    <div className={styles.commandContent}>
                      <Text size="sm" weight="medium" className={styles.commandLabel}>
                        {cmd.label}
                      </Text>
                      {cmd.description && (
                        <Text size="xs" color="muted" className={styles.commandDescription}>
                          {cmd.description}
                        </Text>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <Text size="xs" color="tertiary" className={styles.shortcut}>
                        {cmd.shortcut}
                      </Text>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className={styles.empty}>
              <Text size="sm" color="muted">
                No commands found for "{searchQuery}"
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};