import { useDashboardStore } from '@/store/useDashboard';
import { cn } from '@/lib/utils';
import styles from './AlignmentGuides.module.css';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Guide {
  type: 'vertical' | 'horizontal';
  position: number;
  start: number;
  end: number;
}

interface AlignmentGuidesProps {
  draggedWidgetId?: string | null;
  dragPosition?: { x: number; y: number };
  isResizing?: boolean;
  tolerance?: number;
  className?: string;
}

/**
 * Calculate potential alignment guides based on other widgets
 */
export function nearestGuides(
  subject: Rect, 
  peers: Rect[], 
  tolerance: number = 6
): Guide[] {
  const guides: Guide[] = [];
  
  peers.forEach(peer => {
    const subjectCenterX = subject.x + subject.width / 2;
    const subjectCenterY = subject.y + subject.height / 2;
    const peerCenterX = peer.x + peer.width / 2;
    const peerCenterY = peer.y + peer.height / 2;
    
    // Vertical guides (left, right, center)
    const leftDelta = Math.abs(subject.x - peer.x);
    const rightDelta = Math.abs(subject.x + subject.width - (peer.x + peer.width));
    const centerXDelta = Math.abs(subjectCenterX - peerCenterX);
    
    if (leftDelta <= tolerance) {
      guides.push({
        type: 'vertical',
        position: peer.x,
        start: Math.min(subject.y, peer.y),
        end: Math.max(subject.y + subject.height, peer.y + peer.height)
      });
    }
    
    if (rightDelta <= tolerance) {
      guides.push({
        type: 'vertical',
        position: peer.x + peer.width,
        start: Math.min(subject.y, peer.y),
        end: Math.max(subject.y + subject.height, peer.y + peer.height)
      });
    }
    
    if (centerXDelta <= tolerance) {
      guides.push({
        type: 'vertical',
        position: peerCenterX,
        start: Math.min(subject.y, peer.y),
        end: Math.max(subject.y + subject.height, peer.y + peer.height)
      });
    }
    
    // Horizontal guides (top, bottom, center)
    const topDelta = Math.abs(subject.y - peer.y);
    const bottomDelta = Math.abs(subject.y + subject.height - (peer.y + peer.height));
    const centerYDelta = Math.abs(subjectCenterY - peerCenterY);
    
    if (topDelta <= tolerance) {
      guides.push({
        type: 'horizontal',
        position: peer.y,
        start: Math.min(subject.x, peer.x),
        end: Math.max(subject.x + subject.width, peer.x + peer.width)
      });
    }
    
    if (bottomDelta <= tolerance) {
      guides.push({
        type: 'horizontal',
        position: peer.y + peer.height,
        start: Math.min(subject.x, peer.x),
        end: Math.max(subject.x + subject.width, peer.x + peer.width)
      });
    }
    
    if (centerYDelta <= tolerance) {
      guides.push({
        type: 'horizontal',
        position: peerCenterY,
        start: Math.min(subject.x, peer.x),
        end: Math.max(subject.x + subject.width, peer.x + peer.width)
      });
    }
  });
  
  return guides;
}

/**
 * Snap position to nearest guide within tolerance
 */
export function snapToGuides(
  position: { x: number; y: number },
  size: { width: number; height: number },
  guides: Guide[],
  tolerance: number = 6
): { x: number; y: number } {
  let snappedX = position.x;
  let snappedY = position.y;
  
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;
  
  guides.forEach(guide => {
    if (guide.type === 'vertical') {
      // Snap to left edge
      if (Math.abs(position.x - guide.position) <= tolerance) {
        snappedX = guide.position;
      }
      // Snap to right edge
      else if (Math.abs(position.x + size.width - guide.position) <= tolerance) {
        snappedX = guide.position - size.width;
      }
      // Snap to center
      else if (Math.abs(centerX - guide.position) <= tolerance) {
        snappedX = guide.position - size.width / 2;
      }
    } else {
      // Snap to top edge
      if (Math.abs(position.y - guide.position) <= tolerance) {
        snappedY = guide.position;
      }
      // Snap to bottom edge
      else if (Math.abs(position.y + size.height - guide.position) <= tolerance) {
        snappedY = guide.position - size.height;
      }
      // Snap to center
      else if (Math.abs(centerY - guide.position) <= tolerance) {
        snappedY = guide.position - size.height / 2;
      }
    }
  });
  
  return { x: snappedX, y: snappedY };
}

export const AlignmentGuides = ({ 
  draggedWidgetId,
  dragPosition,
  isResizing = false,
  tolerance = 6,
  className,
  ...props 
}: AlignmentGuidesProps) => {
  const { widgets, getActiveDashboard } = useDashboardStore();
  
  if (!draggedWidgetId || !dragPosition) {
    return null;
  }
  
  const draggedWidget = widgets[draggedWidgetId];
  if (!draggedWidget) return null;
  
  // Get all other widgets as potential snap targets
  const dashboard = getActiveDashboard();
  const otherWidgets = dashboard?.widgets
    .filter(id => id !== draggedWidgetId)
    .map(id => widgets[id])
    .filter(Boolean) || [];
  
  // Calculate subject rectangle (current dragged widget)
  const subject: Rect = {
    x: dragPosition.x,
    y: dragPosition.y,
    width: draggedWidget.width,
    height: draggedWidget.height
  };
  
  // Calculate guides
  const guides = nearestGuides(subject, otherWidgets, tolerance);
  
  if (guides.length === 0) return null;
  
  return (
    <div className={cn(styles.guides, className)} {...props}>
      {guides.map((guide, index) => (
        <div
          key={`${guide.type}-${guide.position}-${index}`}
          className={cn(
            styles.guide,
            guide.type === 'vertical' ? styles.vertical : styles.horizontal
          )}
          style={{
            [guide.type === 'vertical' ? 'left' : 'top']: `${guide.position}px`,
            [guide.type === 'vertical' ? 'top' : 'left']: `${guide.start}px`,
            [guide.type === 'vertical' ? 'height' : 'width']: `${guide.end - guide.start}px`,
          }}
        />
      ))}
    </div>
  );
};