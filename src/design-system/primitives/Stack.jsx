import { forwardRef } from 'react';

/**
 * Stack - Vertical layout primitive with consistent spacing
 * @param {string} as - HTML element to render as
 * @param {string|number} space - Space between children (token or value)
 * @param {string} align - Align items (start, center, end, stretch)
 * @param {string} justify - Justify content (start, center, end, between, around, evenly)
 * @param {boolean} dividers - Show dividers between children
 */
export const Stack = forwardRef(({
  as: Component = 'div',
  space = '4',
  align = 'stretch',
  justify = 'start',
  dividers = false,
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const computedStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: align,
    justifyContent: justify,
    gap: `var(--space-${space}, ${space})`,
    ...style
  };

  const childrenArray = Array.isArray(children) ? children : [children];
  
  return (
    <Component
      ref={ref}
      className={className}
      style={computedStyle}
      {...props}
    >
      {dividers && childrenArray.length > 1
        ? childrenArray.reduce((acc, child, index) => {
            acc.push(child);
            if (index < childrenArray.length - 1) {
              acc.push(
                <div
                  key={`divider-${index}`}
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--border-muted)',
                    width: '100%'
                  }}
                />
              );
            }
            return acc;
          }, [])
        : children
      }
    </Component>
  );
});

Stack.displayName = 'Stack';

export default Stack;