import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motionGuard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import './List.css';

/**
 * AnimatedList Component
 * Displays a list of items with staggered entrance animations
 */
export function AnimatedList({ 
  items, 
  staggerDelay = 0.04, 
  maxVisible = 5,
  className = '',
  children,
  ...props 
}) {
  const listRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!listRef.current || reducedMotion) return;

    const children = listRef.current.children;
    const visibleCount = Math.min(children.length, maxVisible);

    gsap.fromTo(
      Array.from(children).slice(0, visibleCount),
      { opacity: 0, y: -8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: staggerDelay,
        ease: 'power2.out'
      }
    );

    // Remaining items appear instantly  
    if (children.length > visibleCount) {
      gsap.set(Array.from(children).slice(visibleCount), { opacity: 1, y: 0 });
    }
  }, [items, staggerDelay, maxVisible, reducedMotion]);

  const listClasses = `list ${className}`.trim();

  return (
    <ul ref={listRef} className={listClasses} {...props}>
      {children || items?.map((item, i) => (
        <li key={item.id || i} className="list-item">
          {item.content || item}
        </li>
      ))}
    </ul>
  );
}