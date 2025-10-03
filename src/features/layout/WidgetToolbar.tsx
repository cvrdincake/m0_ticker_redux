import { useDashboardStore } from '@/store/useDashboard';
import { Button } from '@/design-system';
import { cn } from '@/lib/utils';
import styles from './WidgetToolbar.module.css';

interface WidgetToolbarProps {
  widgetId: string;
  className?: string;
}

export const WidgetToolbar = ({ widgetId, className, ...props }: WidgetToolbarProps) => {
  const { 
    bringToFront, 
    sendToBack, 
    raiseWidget, 
    lowerWidget,
    duplicateWidget,
    deleteWidget 
  } = useDashboardStore();
  
  const handleBringToFront = () => {
    bringToFront(widgetId);
  };
  
  const handleSendToBack = () => {
    sendToBack(widgetId);
  };
  
  const handleRaise = () => {
    raiseWidget(widgetId);
  };
  
  const handleLower = () => {
    lowerWidget(widgetId);
  };
  
  const handleDuplicate = () => {
    duplicateWidget(widgetId);
  };
  
  const handleDelete = () => {
    // TODO: Check safe mode and show confirmation
    deleteWidget(widgetId);
  };
  
  return (
    <div 
      className={cn(styles.toolbar, className)}
      role="toolbar"
      aria-label="Widget actions"
      {...props}
    >
      <div className={styles.group}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBringToFront}
          aria-label="Bring to front"
          title="Bring to front"
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRaise}
          aria-label="Raise one level"
          title="Raise one level"
        >
          ▲
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLower}
          aria-label="Lower one level"
          title="Lower one level"
        >
          ▼
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSendToBack}
          aria-label="Send to back"
          title="Send to back"
        >
          ↓
        </Button>
      </div>
      
      <div className={styles.divider} />
      
      <div className={styles.group}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          aria-label="Duplicate widget"
          title="Duplicate (⌘+D)"
        >
          ⧉
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          aria-label="Delete widget"
          title="Delete (Del)"
        >
          ×
        </Button>
      </div>
    </div>
  );
};