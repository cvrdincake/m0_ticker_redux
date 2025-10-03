import styles from './Grid.module.css';
import { cn } from '@/lib/utils';

export function Grid({ 
  children, 
  className,
  columns = 1,
  gap = 'md',
  as: Component = 'div',
  ...props 
}) {
  return (
    <Component 
      className={cn(
        styles.grid, 
        styles[`columns-${columns}`],
        styles[`gap-${gap}`],
        className
      )}
      style={{
        '--grid-columns': typeof columns === 'number' ? columns : 'auto'
      }}
      {...props}
    >
      {children}
    </Component>
  );
}