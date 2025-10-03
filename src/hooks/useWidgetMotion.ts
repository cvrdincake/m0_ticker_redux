import { useEffect, useRef } from 'react';
import { gsap, getCurrentContext } from '@/lib/motionGuard';
import type { MotionRole } from '@/widgets/registry';

interface UseWidgetMotionOptions {
  role: MotionRole;
  parallaxMax?: number;
  disabled?: boolean;
  onComplete?: () => void;
}

interface MotionControls {
  enter: () => void;
  exit: () => void;
  parallax: (progress: number) => void;
  cleanup: () => void;
}

// Role-based motion configurations
const MOTION_CONFIGS: Record<MotionRole, {
  enter: { duration: number; ease: string; props: Record<string, any> };
  exit?: { duration: number; ease: string; props: Record<string, any> };
  transform: string[];
}> = {
  card: {
    enter: { duration: 0.3, ease: 'power2.out', props: { y: 20, opacity: 0 } },
    exit: { duration: 0.2, ease: 'power2.in', props: { y: -10, opacity: 0 } },
    transform: ['translateY', 'opacity'],
  },
  table: {
    enter: { duration: 0.4, ease: 'power2.out', props: { y: 30, opacity: 0 } },
    exit: { duration: 0.25, ease: 'power2.in', props: { y: -15, opacity: 0 } },
    transform: ['translateY', 'opacity'],
  },
  chart: {
    enter: { duration: 0.5, ease: 'power2.out', props: { scale: 0.95, opacity: 0 } },
    exit: { duration: 0.3, ease: 'power2.in', props: { scale: 1.05, opacity: 0 } },
    transform: ['scale', 'opacity'],
  },
  toast: {
    enter: { duration: 0.25, ease: 'back.out(1.7)', props: { x: 100, opacity: 0 } },
    exit: { duration: 0.2, ease: 'power2.in', props: { x: 100, opacity: 0 } },
    transform: ['translateX', 'opacity'],
  },
  modal: {
    enter: { duration: 0.3, ease: 'power2.out', props: { scale: 0.9, opacity: 0 } },
    exit: { duration: 0.2, ease: 'power2.in', props: { scale: 0.95, opacity: 0 } },
    transform: ['scale', 'opacity'],
  },
  drawer: {
    enter: { duration: 0.35, ease: 'power2.out', props: { x: -100, opacity: 0 } },
    exit: { duration: 0.25, ease: 'power2.in', props: { x: -100, opacity: 0 } },
    transform: ['translateX', 'opacity'],
  },
  loader: {
    enter: { duration: 0.2, ease: 'power2.out', props: { opacity: 0 } },
    transform: ['opacity'],
  },
  skeleton: {
    enter: { duration: 0.2, ease: 'power2.out', props: { opacity: 0 } },
    transform: ['opacity'],
  },
  progress: {
    enter: { duration: 0.3, ease: 'power2.out', props: { scaleX: 0, opacity: 0 } },
    transform: ['scaleX', 'opacity'],
  },
  tabs: {
    enter: { duration: 0.25, ease: 'power2.out', props: { y: 10, opacity: 0 } },
    transform: ['translateY', 'opacity'],
  },
  accordion: {
    enter: { duration: 0.3, ease: 'power2.out', props: { y: 15, opacity: 0 } },
    transform: ['translateY', 'opacity'],
  },
  banner: {
    enter: { duration: 0.4, ease: 'power2.out', props: { y: -50, opacity: 0 } },
    exit: { duration: 0.3, ease: 'power2.in', props: { y: -50, opacity: 0 } },
    transform: ['translateY', 'opacity'],
  },
  kpi: {
    enter: { duration: 0.35, ease: 'back.out(1.2)', props: { scale: 0.8, opacity: 0 } },
    transform: ['scale', 'opacity'],
  },
};

export function useWidgetMotion(
  options: UseWidgetMotionOptions
): MotionControls {
  const elementRef = useRef<HTMLElement | null>(null);
  const timelinesRef = useRef<{ enter?: gsap.core.Timeline; exit?: gsap.core.Timeline }>({});
  const { role, parallaxMax = 0, disabled = false, onComplete } = options;
  
  const config = MOTION_CONFIGS[role];
  const context = getCurrentContext();
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timelinesRef.current.enter) {
        timelinesRef.current.enter.kill();
      }
      if (timelinesRef.current.exit) {
        timelinesRef.current.exit.kill();
      }
    };
  }, []);
  
  const enter = () => {
    if (disabled || !elementRef.current || !config.enter) return;
    
    const element = elementRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Clear any existing timelines
    if (timelinesRef.current.enter) {
      timelinesRef.current.enter.kill();
    }
    
    if (reducedMotion) {
      // Instant end state for reduced motion
      gsap.set(element, { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1,
        scaleX: 1,
        clearProps: 'transform'
      });
      onComplete?.();
      return;
    }
    
    // Set initial state
    gsap.set(element, config.enter.props);
    
    // Create entrance timeline
    timelinesRef.current.enter = gsap.timeline({
      onComplete,
    });
    
    timelinesRef.current.enter.to(element, {
      duration: config.enter.duration,
      ease: config.enter.ease,
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
    });
  };
  
  const exit = () => {
    if (disabled || !elementRef.current || !config.exit) return;
    
    const element = elementRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Clear any existing timelines
    if (timelinesRef.current.exit) {
      timelinesRef.current.exit.kill();
    }
    
    if (reducedMotion) {
      // Instant end state for reduced motion
      gsap.set(element, config.exit.props);
      return;
    }
    
    // Create exit timeline
    timelinesRef.current.exit = gsap.timeline();
    
    timelinesRef.current.exit.to(element, {
      duration: config.exit.duration,
      ease: config.exit.ease,
      ...config.exit.props,
    });
  };
  
  const parallax = (progress: number) => {
    if (disabled || !elementRef.current || parallaxMax === 0) return;
    if (context === 'overlay') return; // No parallax in overlay context
    
    const element = elementRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) return;
    
    // Apply subtle parallax based on role and max value
    const translateY = progress * parallaxMax;
    gsap.set(element, { 
      y: translateY,
      force3D: true, // Hardware acceleration
    });
  };
  
  const cleanup = () => {
    if (timelinesRef.current.enter) {
      timelinesRef.current.enter.kill();
      timelinesRef.current.enter = undefined;
    }
    if (timelinesRef.current.exit) {
      timelinesRef.current.exit.kill();
      timelinesRef.current.exit = undefined;
    }
    
    if (elementRef.current) {
      gsap.set(elementRef.current, { clearProps: 'all' });
    }
  };
  
  // Return controls with element ref assignment
  return {
    enter,
    exit,
    parallax,
    cleanup,
    // Expose ref for component assignment
    get element() { return elementRef.current; },
    set element(el: HTMLElement | null) { elementRef.current = el; },
  } as MotionControls & { element: HTMLElement | null };
}

// Utility hook for list stagger animations
export function useListStagger(maxItems: number = 5) {
  const listRef = useRef<HTMLElement | null>(null);
  
  const staggerIn = (delay: number = 50) => {
    if (!listRef.current) return;
    
    const items = Array.from(listRef.current.children) as HTMLElement[];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      // Instant appearance for reduced motion
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    
    // Limit stagger to max items for performance
    const staggerItems = items.slice(0, maxItems);
    
    gsap.set(staggerItems, { opacity: 0, y: 20 });
    
    gsap.to(staggerItems, {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      stagger: delay / 1000, // Convert ms to seconds
    });
  };
  
  const staggerOut = (delay: number = 30) => {
    if (!listRef.current) return;
    
    const items = Array.from(listRef.current.children) as HTMLElement[];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      gsap.set(items, { opacity: 0 });
      return;
    }
    
    const staggerItems = items.slice(0, maxItems);
    
    gsap.to(staggerItems, {
      duration: 0.2,
      opacity: 0,
      y: -10,
      ease: 'power2.in',
      stagger: delay / 1000,
    });
  };
  
  return {
    listRef,
    staggerIn,
    staggerOut,
  };
}

export default useWidgetMotion;