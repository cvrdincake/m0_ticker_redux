import { useState, useRef, useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import { cn } from '@/lib/utils';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  widgetId?: string;
  position: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
  shortcut?: string;
}

export const ContextMenu = ({ 
  widgetId,
  position,
  isOpen,
  onClose,
  className,
  ...props 
}: ContextMenuProps) => {
  const {
    bringToFront,
    sendToBack,
    raiseWidget,
    lowerWidget,
    duplicateWidget,
    deleteWidget,
    alignWidgets
  } = useDashboardStore();
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  const menuItems: MenuItem[] = widgetId ? [
    {
      id: 'bring-front',
      label: 'Bring to Front',
      action: () => bringToFront(widgetId),
      shortcut: '⌘+]'
    },
    {
      id: 'raise',
      label: 'Bring Forward',
      action: () => raiseWidget(widgetId)
    },
    {
      id: 'lower',
      label: 'Send Backward', 
      action: () => lowerWidget(widgetId)
    },
    {
      id: 'send-back',
      label: 'Send to Back',
      action: () => sendToBack(widgetId),
      shortcut: '⌘+['
    },
    {
      id: 'divider-1',
      label: '',
      action: () => {},
      divider: true
    },
    {
      id: 'align-left',
      label: 'Align Left',
      action: () => alignWidgets([widgetId], 'left')
    },
    {
      id: 'align-center-h',
      label: 'Centre Horizontally',
      action: () => alignWidgets([widgetId], 'center-h')
    },
    {
      id: 'align-right',
      label: 'Align Right',
      action: () => alignWidgets([widgetId], 'right')
    },
    {
      id: 'align-top',
      label: 'Align Top',
      action: () => alignWidgets([widgetId], 'top')
    },
    {
      id: 'align-center-v',
      label: 'Centre Vertically',
      action: () => alignWidgets([widgetId], 'center-v')
    },
    {
      id: 'align-bottom',
      label: 'Align Bottom',
      action: () => alignWidgets([widgetId], 'bottom')
    },
    {
      id: 'divider-2',
      label: '',
      action: () => {},
      divider: true
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      action: () => duplicateWidget(widgetId),
      shortcut: '⌘+D'
    },
    {
      id: 'delete',
      label: 'Delete',
      action: () => deleteWidget(widgetId),
      shortcut: 'Del'
    }
  ] : [];
  
  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && !item.divider) {
      item.action();
      onClose();
    }
  };
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={menuRef}
      className={cn(styles.menu, className)}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      role="menu"
      aria-label="Widget context menu"
      {...props}
    >
      {menuItems.map(item => (
        item.divider ? (
          <div key={item.id} className={styles.divider} role="separator" />
        ) : (
          <button
            key={item.id}
            className={cn(styles.item, item.disabled && styles.disabled)}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            role="menuitem"
          >
            <span className={styles.label}>{item.label}</span>
            {item.shortcut && (
              <span className={styles.shortcut}>{item.shortcut}</span>
            )}
          </button>
        )
      ))}
    </div>
  );
};