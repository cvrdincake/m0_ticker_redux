import styles from './Box.module.css';
import { cn } from '@/lib/utils';

export function Box({ 
  children, 
  className,
  as: Component = 'div',
  ...props 
}) {
  return (
    <Component 
      className={cn(styles.box, className)} 
      {...props}
    >
      {children}
    </Component>
  );
}