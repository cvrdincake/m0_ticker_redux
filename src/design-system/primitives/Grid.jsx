import { forwardRef } from 'react';

/**
 * Grid - CSS Grid layout primitive
 * @param {string} as - HTML element to render as
 * @param {string|number} cols - Number of columns or template
 * @param {string|number} rows - Number of rows or template
 * @param {string|number} gap - Gap between grid items
 * @param {string|number} colGap - Column gap
 * @param {string|number} rowGap - Row gap
 * @param {string} justify - Justify items (start, center, end, stretch)
 * @param {string} align - Align items (start, center, end, stretch)
 */
export const Grid = forwardRef(({
  as: Component = 'div',
  cols,
  rows,
  gap,
  colGap,
  rowGap,
  justify = 'stretch',
  align = 'stretch',
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const computedStyle = {
    display: 'grid',
    justifyItems: justify,
    alignItems: align,
    ...style
  };

  // Handle grid template columns
  if (cols) {
    if (typeof cols === 'number') {
      computedStyle.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    } else {
      computedStyle.gridTemplateColumns = cols;
    }
  }

  // Handle grid template rows
  if (rows) {
    if (typeof rows === 'number') {
      computedStyle.gridTemplateRows = `repeat(${rows}, 1fr)`;
    } else {
      computedStyle.gridTemplateRows = rows;
    }
  }

  // Handle gaps
  if (gap) {
    computedStyle.gap = `var(--space-${gap}, ${gap})`;
  } else {
    if (colGap) {
      computedStyle.columnGap = `var(--space-${colGap}, ${colGap})`;
    }
    if (rowGap) {
      computedStyle.rowGap = `var(--space-${rowGap}, ${rowGap})`;
    }
  }

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

Grid.displayName = 'Grid';

export default Grid;