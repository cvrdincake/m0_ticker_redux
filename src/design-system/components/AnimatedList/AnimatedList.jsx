// components/List/AnimatedList.jsx
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motionGuard';

export function AnimatedList({ items, staggerDelay = 0.04 }) {
  const listRef = useRef(null);
  
  useEffect(() => {
    if (!listRef.current) return;
    
    const children = listRef.current.children;
    const visibleCount = Math.min(children.length, 5); // Limit to first 5
    
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
  }, [items, staggerDelay]);
  
  return (
    <ul ref={listRef} className="list">
      {items.map((item, i) => (
        <li key={item.id} className="list-item">
          {item.content}
        </li>
      ))}
    </ul>
  );
}