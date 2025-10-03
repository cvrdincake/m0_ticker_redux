import { useEffect, useRef } from 'react';
import { gsap, getMotionTokens, isMotionReduced } from '@/lib/motionGuard';
import styles from './AnimatedList.module.css';

export function AnimatedList({ 
  items = [], 
  staggerDelay = 0.04, 
  className = '',
  'aria-label': ariaLabel = 'Animated list'
}) {
  const listRef = useRef(null);
  const timelineRef = useRef(null);
  
  useEffect(() => {
    if (!listRef.current || items.length === 0) return;
    
    const children = listRef.current.children;
    const isReduced = isMotionReduced();
    
    // Performance guard: large lists render instantly
    if (items.length > 200) {
      gsap.set(Array.from(children), { opacity: 1, y: 0 });
      return;
    }
    
    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    if (isReduced) {
      // Reduced motion: instant final state
      gsap.set(Array.from(children), { opacity: 1, y: 0 });
      return;
    }
    
    const tokens = getMotionTokens();
    const visibleCount = Math.min(children.length, 5); // Limit to first 5
    const animatedItems = Array.from(children).slice(0, visibleCount);
    const instantItems = Array.from(children).slice(visibleCount);
    
    // Create single timeline for batched GSAP calls
    timelineRef.current = gsap.timeline();
    
    // Set initial state for animated items
    timelineRef.current.set(animatedItems, { opacity: 0, y: -8 });
    
    // Animate first 5 items with stagger
    timelineRef.current.to(animatedItems, {
      opacity: 1,
      y: 0,
      duration: tokens.durations.base / 1000,
      stagger: staggerDelay,
      ease: tokens.eases.out
    });
    
    // Remaining items appear instantly
    if (instantItems.length > 0) {
      timelineRef.current.set(instantItems, { opacity: 1, y: 0 }, 0);
    }
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [items, staggerDelay]);
  
  // SSR safety check
  if (typeof window === 'undefined') {
    return (
      <ul className={`${styles.list} ${className}`} aria-label={ariaLabel}>
        {items.map((item, i) => (
          <li key={item.id || i} className={styles.listItem}>
            {item.content || item}
          </li>
        ))}
      </ul>
    );
  }
  
  return (
    <ul 
      ref={listRef} 
      className={`${styles.list} ${className}`}
      aria-label={ariaLabel}
    >
      {items.map((item, i) => (
        <li key={item.id || i} className={styles.listItem}>
          {item.content || item}
        </li>
      ))}
    </ul>
  );
}