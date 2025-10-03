import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap } from '@/lib/motionGuard';
import { useReducedMotion } from '@/hooks';
import styles from './AnimatedList.module.css';

/**
 * AnimatedList component with staggered GSAP animations and reduced motion support
 */
const AnimatedList = forwardRef(({
  children,
  items,
  direction = 'vertical',
  stagger = 0.04,
  animation = 'fade-up',
  visibleLimit = 5,
  className,
  ...props
}, ref) => {
  const listRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!listRef.current || prefersReducedMotion) return;
    
    const listChildren = listRef.current.children;
    const visibleCount = Math.min(listChildren.length, visibleLimit);
    
    // Animation configurations
    const animations = {
      'fade-up': { opacity: 0, y: -8 },
      'fade-down': { opacity: 0, y: 8 },
      'fade-left': { opacity: 0, x: -8 },
      'fade-right': { opacity: 0, x: 8 },
      'scale': { opacity: 0, scale: 0.9 },
      'slide-up': { y: 16 },
      'slide-down': { y: -16 }
    };
    
    const fromAnimation = animations[animation] || animations['fade-up'];
    
    gsap.fromTo(
      Array.from(listChildren).slice(0, visibleCount),
      fromAnimation,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.2,
        stagger: stagger,
        ease: 'power2.out'
      }
    );
    
    // Remaining items appear instantly
    if (listChildren.length > visibleCount) {
      gsap.set(Array.from(listChildren).slice(visibleCount), { 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1 
      });
    }
  }, [items, children, stagger, animation, visibleLimit, prefersReducedMotion]);
  
  const listClasses = [
    styles.animatedList,
    styles[`direction-${direction}`],
    prefersReducedMotion && styles.reducedMotion,
    className
  ].filter(Boolean).join(' ');

  return (
    <ul 
      ref={ref || listRef}
      className={listClasses}
      {...props}
    >
      {items ? (
        items.map((item, i) => (
          <li key={item.id || i} className={styles.listItem}>
            {typeof item === 'object' ? (
              item.content || 
              item.text || 
              item.label || 
              item.name || 
              JSON.stringify(item)
            ) : item}
          </li>
        ))
      ) : (
        React.Children.map(children, (child, i) => (
          <li key={child.key || i} className={styles.listItem}>
            {child}
          </li>
        ))
      )}
    </ul>
  );
});

AnimatedList.displayName = 'AnimatedList';

AnimatedList.propTypes = {
  /** List items to animate (alternative to children) */
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.node
  ])),
  /** List items as children */
  children: PropTypes.node,
  /** Animation direction */
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  /** Stagger delay between items */
  stagger: PropTypes.number,
  /** Animation type */
  animation: PropTypes.oneOf(['fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale', 'slide-up', 'slide-down']),
  /** Maximum number of items to animate (rest appear instantly) */
  visibleLimit: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string
};

export default AnimatedList;