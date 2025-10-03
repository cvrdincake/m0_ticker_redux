import { useEffect, useRef } from 'react';
import { gsap, getMotionTokens, isMotionReduced } from '@/lib/motionGuard';

// Export role config for external use
export const ROLE_CONFIG = {
  card: {
    entrance: { y: -8, opacity: 0, duration: 'base', ease: 'out' },
    hover: { y: -2, scale: 1.001, duration: 'fast', ease: 'out' },
    exit: { opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 20,
    reducedMotion: { borderWidth: 2 }
  },
  table: {
    entrance: { opacity: 0, duration: 'base', stagger: 40, ease: 'out' },
    hover: { backgroundColor: 'rgba(255,255,255,0.03)', duration: 'fast', ease: 'out' },
    exit: { opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 0
  },
  chart: {
    entrance: { drawSVG: '0%', duration: 'slower', ease: 'inOut' },
    hover: { opacity: 1, duration: 'fast', ease: 'out' },
    exit: { opacity: 0, duration: 'base', ease: 'in' },
    parallaxMax: 10
  },
  toast: {
    entrance: { x: 100, opacity: 0, duration: 'base', ease: 'back' },
    hover: null,
    exit: { x: 100, opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 0
  },
  modal: {
    entrance: { scale: 0.9, opacity: 0, duration: 'slow', ease: 'back' },
    hover: null,
    exit: { scale: 0.95, opacity: 0, duration: 'base', ease: 'in' },
    parallaxMax: 0
  },
  drawer: {
    entrance: { x: '100%', duration: 'slow', ease: 'out' },
    hover: null,
    exit: { x: '100%', duration: 'base', ease: 'in' },
    parallaxMax: 0
  },
  loader: {
    entrance: { opacity: 0, duration: 'fast', ease: 'out' },
    hover: { rotation: 360, duration: 1200, ease: 'linear', repeat: -1 },
    exit: { opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 0,
    reducedMotion: { opacity: 0.5 }
  },
  skeleton: {
    entrance: { opacity: 0, duration: 'fast', ease: 'out' },
    hover: { opacity: [0.3, 0.7, 0.3], duration: 1500, ease: 'inOut', repeat: -1 },
    exit: { opacity: 0, duration: 'base', ease: 'in' },
    parallaxMax: 0,
    reducedMotion: { opacity: 0.5, backgroundColor: '#333' }
  },
  progress: {
    entrance: { width: '0%', duration: 'slower', ease: 'out' },
    hover: null,
    exit: { opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 0,
    reducedMotion: { width: '100%' }
  },
  input: {
    entrance: null,
    hover: { boxShadow: '0 0 0 4px rgba(255,255,255,0.1)', duration: 'fast', ease: 'out' },
    exit: null,
    parallaxMax: 0
  },
  tabs: {
    entrance: { x: '-100%', duration: 'base', ease: 'out' },
    hover: null,
    exit: null,
    parallaxMax: 0
  },
  accordion: {
    entrance: { height: 0, duration: 'slow', ease: 'out' },
    hover: null,
    exit: { height: 0, duration: 'base', ease: 'in' },
    parallaxMax: 0
  },
  banner: {
    entrance: { y: -100, duration: 'slow', ease: 'back' },
    hover: null,
    exit: { y: -100, duration: 'base', ease: 'in' },
    parallaxMax: 30
  },
  kpi: {
    entrance: { scale: 0.95, opacity: 0, duration: 'fast', ease: 'back' },
    hover: { y: -3, duration: 'fast', ease: 'out' },
    exit: { opacity: 0, duration: 'fast', ease: 'in' },
    parallaxMax: 15
  }
};

// Convert token names to actual values
const resolveAnimationConfig = (config) => {
  if (!config) return null;
  
  const tokens = getMotionTokens();
  const resolved = { ...config };
  
  // Convert duration tokens to milliseconds
  if (typeof resolved.duration === 'string' && tokens.durations[resolved.duration]) {
    resolved.duration = tokens.durations[resolved.duration] / 1000; // GSAP uses seconds
  } else if (typeof resolved.duration === 'number') {
    resolved.duration = resolved.duration / 1000; // Convert ms to seconds
  }
  
  // Convert ease tokens to CSS values
  if (typeof resolved.ease === 'string') {
    if (resolved.ease === 'back') {
      resolved.ease = 'back.out(1.7)';
    } else if (resolved.ease === 'bounce') {
      resolved.ease = tokens.eases.bounce;
    } else if (tokens.eases[resolved.ease]) {
      resolved.ease = tokens.eases[resolved.ease];
    }
  }
  
  return resolved;
};

/**
 * List stagger animation utility with token support
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Animation options
 */
export const animateList = (container, options = {}) => {
  if (!container) return;
  
  const items = container.children;
  const maxItems = Math.min(items.length, 5); // Cap at 5 items animated
  const { stagger = 40, ...animationProps } = options;
  
  if (isMotionReduced()) {
    // Instant appearance for reduced motion
    gsap.set(Array.from(items), { opacity: 1, y: 0 });
    return;
  }
  
  const tokens = getMotionTokens();
  const duration = tokens.durations.base / 1000; // Convert to seconds
  
  // Animate first 5 items with stagger, rest appear instantly
  gsap.fromTo(Array.from(items).slice(0, maxItems), 
    { opacity: 0, y: 8 },
    { 
      opacity: 1, 
      y: 0, 
      duration,
      stagger: stagger / 1000,
      ease: tokens.eases.out,
      ...animationProps 
    }
  );
  
  // Instant appearance for remaining items
  if (items.length > 5) {
    gsap.set(Array.from(items).slice(5), { opacity: 1, y: 0 });
  }
};

/**
 * Hook for widget-specific motion animations with role-based matrix
 * @param {string} role - Animation role from ROLE_CONFIG
 * @param {string} state - Animation state ('entrance', 'hover', 'exit')
 * @param {Object} options - Additional animation options
 * @returns {Object} Animation controls and refs
 */
const useWidgetMotion = (role = 'card', state = 'entrance', options = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  
  const {
    autoPlay = true,
    exitOnUnmount = false,
    respectReducedMotion = true,
    parallax = false,
    ...customProps
  } = options;

  const roleConfig = ROLE_CONFIG[role];
  const stateConfig = resolveAnimationConfig(roleConfig?.[state]);

  useEffect(() => {
    if (!elementRef.current || !stateConfig) return;

    const prefersReducedMotion = respectReducedMotion && isMotionReduced();

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (prefersReducedMotion) {
      // Apply reduced motion states
      const reducedMotionState = roleConfig.reducedMotion || {};
      const finalState = state === 'entrance' ? { opacity: 1, scale: 1, x: 0, y: 0 } : {};
      gsap.set(elementRef.current, { ...finalState, ...reducedMotionState });
      return;
    }

    if (autoPlay) {
      const animationProps = {
        ...stateConfig,
        ...customProps
      };

      if (state === 'entrance') {
        // Set initial state then animate to final
        const fromState = {};
        const toState = { ...animationProps };
        
        Object.keys(animationProps).forEach(key => {
          if (key !== 'duration' && key !== 'ease' && key !== 'stagger') {
            fromState[key] = key === 'opacity' ? 0 : animationProps[key];
            toState[key] = key === 'opacity' ? 1 : 0; // Reset to natural state
          }
        });
        
        gsap.set(elementRef.current, fromState);
        animationRef.current = gsap.to(elementRef.current, toState);
      } else {
        animationRef.current = gsap.to(elementRef.current, animationProps);
      }
    }

    return () => {
      if (animationRef.current && !exitOnUnmount) {
        animationRef.current.kill();
      }
    };
  }, [role, state, autoPlay, exitOnUnmount, respectReducedMotion, stateConfig, roleConfig?.reducedMotion, customProps]);

  // Parallax effect if enabled
  useEffect(() => {
    if (!parallax || !roleConfig?.parallaxMax || !elementRef.current) return;
    
    const handleMouseMove = (e) => {
      if (isMotionReduced()) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * roleConfig.parallaxMax;
      const y = (clientY / innerHeight - 0.5) * roleConfig.parallaxMax;
      
      gsap.to(elementRef.current, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [parallax, roleConfig?.parallaxMax]);

  // Note: Visibility pause is now handled globally by motionGuard.js

  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const reverse = () => animationRef.current?.reverse();
  const restart = () => animationRef.current?.restart();

  return {
    ref: elementRef,
    animation: animationRef.current,
    controls: { play, pause, reverse, restart },
    roleConfig
  };
};

export default useWidgetMotion;