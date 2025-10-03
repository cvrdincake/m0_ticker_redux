import { useEffect, useRef } from 'react';
import { getGSAP, shouldUseMotion } from '@/lib/motionGuard';

/**
 * AnimatedPath - SVG path with draw-on animation
 * 
 * Features:
 * - GSAP-powered stroke-dashoffset animation
 * - Respects reduced-motion preferences
 * - SSR-safe with proper DOM guards
 * - Tokenised stroke colours
 * - Production-ready with error handling
 */
export const AnimatedPath = ({ 
  d, 
  stroke = 'var(--ink)', 
  strokeWidth = 2,
  className = '',
  duration = 0.6,
  ease = 'power2.out',
  ...props 
}) => {
  const pathRef = useRef(null);

  useEffect(() => {
    // SSR safety guard
    if (typeof window === 'undefined' || !pathRef.current) return;
    
    const path = pathRef.current;
    
    // Guard against paths without valid d attribute
    if (!d || d.trim() === '') return;
    
    try {
      const length = path.getTotalLength();
      
      // Set up initial dash state for animation
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      
      // Only animate if motion is allowed
      if (shouldUseMotion()) {
        const gsap = getGSAP();
        if (gsap) {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration,
            ease,
          });
        } else {
          // Fallback: show path immediately if GSAP unavailable
          path.style.strokeDashoffset = 0;
        }
      } else {
        // Reduced motion: show path immediately
        path.style.strokeDashoffset = 0;
      }
    } catch (error) {
      // Handle cases where getTotalLength() fails (invalid paths, etc.)
      console.warn('AnimatedPath: Unable to calculate path length', error);
      if (pathRef.current) {
        pathRef.current.style.strokeDasharray = 'none';
        pathRef.current.style.strokeDashoffset = 0;
      }
    }
  }, [d, duration, ease]);

  // Reset animation when path data changes
  useEffect(() => {
    if (!pathRef.current || typeof window === 'undefined') return;
    
    const path = pathRef.current;
    
    // Clear any existing animation state
    path.style.strokeDasharray = '';
    path.style.strokeDashoffset = '';
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      className={className}
      style={{
        // Ensure transform and opacity are available for potential GSAP use
        willChange: shouldUseMotion() ? 'stroke-dashoffset' : 'auto',
      }}
      {...props}
    />
  );
};