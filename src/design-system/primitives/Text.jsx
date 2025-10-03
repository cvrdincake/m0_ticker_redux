import { forwardRef } from 'react';

/**
 * Text - Typography primitive with semantic rendering
 * @param {string} as - HTML element (p, span, h1-h6, etc.)
 * @param {string} size - Typography size token (xs, sm, base, lg, xl, 2xl, etc.)
 * @param {string} weight - Font weight (light, normal, medium, bold)
 * @param {string} color - Colour token
 * @param {string} align - Text alignment (left, center, right, justify)
 * @param {boolean} truncate - Enable text truncation
 */
export const Text = forwardRef(({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'text-primary',
  align,
  truncate = false,
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const computedStyle = {
    ...style,
    fontSize: `var(--text-${size})`,
    fontWeight: `var(--font-${weight})`,
    color: `var(--${color})`,
    ...(align && { textAlign: align }),
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    })
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={computedStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export default Text;