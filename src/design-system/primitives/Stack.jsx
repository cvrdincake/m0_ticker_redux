import styles from './Stack.module.css';
import { cn } from '@/lib/utils';

export function Stack({ 
  children, 
  className,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'flex-start',
  as: Component = 'div',
  ...props 
}) {
  return (
    <Component 
      className={cn(
        styles.stack, 
        styles[`direction-${direction}`],
        styles[`gap-${gap}`],
        styles[`align-${align}`],
        styles[`justify-${justify}`],
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}