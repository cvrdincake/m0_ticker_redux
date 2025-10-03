import { cn } from '@/utils/cn';
import styles from './Text.module.css';

const Text = ({ 
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  children,
  className,
  ...props 
}) => {
  return (
    <Component
      className={cn(
        styles.text,
        styles[size],
        styles[weight],
        styles[color],
        styles[align],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Text };