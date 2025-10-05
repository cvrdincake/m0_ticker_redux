// components/Chart/AnimatedPath.jsx
import { useEffect, useRef } from 'react';
import { gsap } from './src/lib/motionGuard';

export function AnimatedPath({ d, stroke = 'var(--surface)', strokeWidth = 2 }) {
  const pathRef = useRef(null);
  
  useEffect(() => {
    if (!pathRef.current) return;
    
    const path = pathRef.current;
    const length = path.getTotalLength();
    
    // Set up dash array
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    // Animate
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  }, [d]);
  
  return (
    <path
      ref={pathRef}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
}