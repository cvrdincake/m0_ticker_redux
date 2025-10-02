import { forwardRef } from 'react';
import styles from './Box.module.css';

/**
 * Box - Fundamental layout primitive with polymorphic rendering
 * @param {string} as - HTML element or component to render as
 * @param {string} display - CSS display value (flex, grid, block, inline, etc.)
 * @param {string|number} p - Padding (token key or value)
 * @param {string|number} m - Margin (token key or value)
 * @param {string} bg - Background colour token
 * @param {string} className - Additional CSS classes
 */
export const Box = forwardRef(({
  as: Component = 'div',
  display,
  p,
  m,
  bg,
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const computedStyle = {
    ...style,
    ...(display && { display }),
    ...(p && { padding: `var(--space-${p}, ${p})` }),
    ...(m && { margin: `var(--space-${m}, ${m})` }),
    ...(bg && { backgroundColor: `var(--${bg})` })
  };

  return (
    <Component 
      ref={ref}
      className={`${styles.box} ${className}`}
      style={computedStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

Box.displayName = 'Box';