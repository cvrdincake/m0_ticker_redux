import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { animateList } from '@/hooks/useWidgetMotion';
import styles from './Grid.module.css';

/**
 * Grid primitive component with responsive grid system
 * @param {string} columns - Grid column configuration ('responsive', '1', '2', '3', etc.)
 * @param {string} gap - Gap size ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 * @param {string} align - Align items ('start', 'center', 'end', 'stretch')
 * @param {string} justify - Justify items ('start', 'center', 'end', 'stretch')
 * @param {boolean} animate - Whether to animate children with stagger
 * @param {boolean} masonry - Use masonry layout
 */
export const Grid = forwardRef(({
  as: Component = 'div',
  columns = 'responsive',
  gap = 'lg',
  align,
  justify,
  flow,
  animate = false,
  masonry = false,
  className = '',
  style = {},
  children,
  ...props
}, ref) => {
  const gridRef = useRef(null);

  const gridClasses = [
    styles.grid,
    styles[`grid--${columns}`],
    gap && styles[`grid--gap-${gap}`],
    align && styles[`grid--align-${align}`],
    justify && styles[`grid--justify-${justify}`],
    flow && styles[`grid--flow-${flow}`],
    masonry && styles['grid--masonry'],
    animate && styles['list-grid'],
    className
  ].filter(Boolean).join(' ');

  // Animate children with stagger if enabled
  useEffect(() => {
    if (animate && gridRef.current) {
      const container = gridRef.current;
      container.classList.add('animate');
      
      // Use the animateList utility from useWidgetMotion
      animateList(container, {
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }, [animate, children]);

  return (
    <Component
      ref={ref || gridRef}
      className={gridClasses}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';

/**
 * Grid.Item - Grid item with spanning utilities
 */
export const GridItem = forwardRef(({
  as: Component = 'div',
  span,
  rowSpan,
  mdSpan,
  lgSpan,
  className = '',
  children,
  ...props
}, ref) => {
  const itemClasses = [
    styles['grid-item'],
    span && styles[`grid-item--span-${span}`],
    rowSpan && styles[`grid-item--row-span-${rowSpan}`],
    mdSpan && styles[`grid-item--md-span-${mdSpan}`],
    lgSpan && styles[`grid-item--lg-span-${lgSpan}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      ref={ref}
      className={itemClasses}
      {...props}
    >
      {children}
    </Component>
  );
});

GridItem.displayName = 'GridItem';

/**
 * CardGrid - Specialized grid for card layouts
 */
export const CardGrid = forwardRef(({
  as: Component = 'div',
  animate = false,
  className = '',
  children,
  ...props
}, ref) => {
  const cardGridRef = useRef(null);

  const cardGridClasses = [
    styles['card-grid'],
    animate && 'animate',
    className
  ].filter(Boolean).join(' ');

  // Animate cards with stagger if enabled
  useEffect(() => {
    if (animate && cardGridRef.current) {
      animateList(cardGridRef.current, {
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }, [animate, children]);

  return (
    <Component
      ref={ref || cardGridRef}
      className={cardGridClasses}
      {...props}
    >
      {children}
    </Component>
  );
});

CardGrid.displayName = 'CardGrid';

Grid.Item = GridItem;
Grid.Cards = CardGrid;

Grid.propTypes = {
  /** HTML element to render as */
  as: PropTypes.elementType,
  /** Grid column configuration */
  columns: PropTypes.oneOf([
    'responsive', 'auto-fill', 'auto-fit', 'dense', 'compact', 'masonry',
    '1', '2', '3', '4', '5', '6'
  ]),
  /** Gap size between grid items */
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Align items */
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /** Justify items */
  justify: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /** Grid auto flow */
  flow: PropTypes.oneOf(['row', 'column', 'dense']),
  /** Animate children with stagger */
  animate: PropTypes.bool,
  /** Use masonry layout */
  masonry: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Inline styles */
  style: PropTypes.object,
  /** Grid content */
  children: PropTypes.node
};

GridItem.propTypes = {
  /** HTML element to render as */
  as: PropTypes.elementType,
  /** Column span */
  span: PropTypes.oneOf([2, 3, 4, 'full']),
  /** Row span */
  rowSpan: PropTypes.oneOf([2, 3]),
  /** Medium breakpoint span */
  mdSpan: PropTypes.oneOf([2, 3, 4]),
  /** Large breakpoint span */
  lgSpan: PropTypes.oneOf([2, 3, 4]),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Item content */
  children: PropTypes.node
};

CardGrid.propTypes = {
  /** HTML element to render as */
  as: PropTypes.elementType,
  /** Animate cards with stagger */
  animate: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Card content */
  children: PropTypes.node
};

export default Grid;