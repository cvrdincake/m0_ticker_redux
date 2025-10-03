import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Hook for widget-specific motion animations with reduced motion support
 * @param {boolean} isActive - Whether the widget should be animated
 * @param {Object} options - Animation options
 * @returns {Object} Animation controls and refs
 */
export const useWidgetMotion = (isActive = false, options = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  
  const {
    duration = 0.3,
    ease = 'power2.out',
    stagger = 0.1,
    autoPlay = true,
    respectReducedMotion = true
  } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = respectReducedMotion && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Apply immediate styles without animation
      gsap.set(elementRef.current, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95
      });
      return;
    }

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (autoPlay) {
      animationRef.current = gsap.to(elementRef.current, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 20,
        duration: prefersReducedMotion ? 0 : duration,
        ease: prefersReducedMotion ? 'none' : ease,
        stagger: prefersReducedMotion ? 0 : stagger
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isActive, duration, ease, stagger, autoPlay, respectReducedMotion]);

  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const reverse = () => animationRef.current?.reverse();
  const restart = () => animationRef.current?.restart();

  return {
    ref: elementRef,
    animation: animationRef.current,
    controls: { play, pause, reverse, restart }
  };
};

export default useWidgetMotion;