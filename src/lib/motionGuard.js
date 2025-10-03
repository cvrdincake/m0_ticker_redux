/**
 * Motion Guard - Manages global GSAP timeline with proper lifecycle and visibility handling
 * Provides centralised animation control with performance optimisations
 */

import { gsap as _gsap } from 'gsap';

// Debug flag for production builds
const DEBUG_MOTION = import.meta.env?.VITE_DEBUG_MOTION === 'true';

// Export GSAP instance
export const gsap = _gsap;

// Global state
let context = 'dashboard';
let isInitialized = false;
let visibilityHandler = null;
let prefersReducedMotionHandler = null;
let beforeUnloadHandler = null;

const isBrowser = typeof window !== 'undefined';
const mql = isBrowser && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

/**
 * Set the current animation context
 * @param {'dashboard' | 'overlay'} next - The animation context
 */
export function setContext(next = 'dashboard') {
  context = next;
  if (!isBrowser) return;
  
  // Apply context-specific timeline speeds
  gsap.globalTimeline.timeScale(context === 'dashboard' ? 1.5 : 1.0);
  DEBUG_MOTION && DEBUG_MOTION && console.log(`[MotionGuard] Context set to: ${context}`);
}

/**
 * Apply reduced motion preferences
 * @param {boolean} reduced - Whether to reduce motion
 */
export function applyReducedMotion(reduced) {
  if (!isBrowser) return;
  
  document.documentElement.classList.toggle('reduce-motion', !!reduced);
  
  if (reduced) {
    gsap.globalTimeline.pause(0, true);
    gsap.ticker.sleep();
    DEBUG_MOTION && console.log('[MotionGuard] Reduced motion enabled - animations paused');
  } else {
    gsap.ticker.wake();
    gsap.globalTimeline.play();
    setContext(context);
    DEBUG_MOTION && console.log('[MotionGuard] Reduced motion disabled - animations resumed');
  }
}

/**
 * Initialize the motion guard system
 * @param {Object} options - Initialization options
 * @param {'dashboard' | 'overlay'} options.context - Initial context
 * @returns {Object} Disposal function
 */
export function initMotion({ context: ctx = 'dashboard' } = {}) {
  if (!isBrowser) return { dispose() {} };
  
  // Set initial context
  setContext(ctx);
  
  // Set GSAP defaults
  gsap.defaults({
    duration: 0.2,
    ease: 'power2.out'
  });
  
  // Apply initial reduced motion state
  if (mql) {
    applyReducedMotion(mql.matches);
  }
  
  // Visibility change handler for ticker management
  visibilityHandler = () => {
    if (document.hidden) {
      gsap.ticker.sleep();
      gsap.globalTimeline.pause();
      DEBUG_MOTION && console.log('[MotionGuard] Page hidden - ticker sleeping, timeline paused');
    } else {
      gsap.ticker.wake();
      gsap.globalTimeline.play();
      DEBUG_MOTION && console.log('[MotionGuard] Page visible - ticker awake, timeline resumed');
    }
  };
  
  // Reduced motion preference handler
  prefersReducedMotionHandler = (e) => {
    applyReducedMotion(e.matches);
  };
  
  // Page unload cleanup handler
  beforeUnloadHandler = () => {
    cleanup();
  };
  
  // Add event listeners
  document.addEventListener('visibilitychange', visibilityHandler);
  if (mql) {
    mql.addEventListener('change', prefersReducedMotionHandler);
  }
  window.addEventListener('beforeunload', beforeUnloadHandler);
  
  isInitialized = true;
  DEBUG_MOTION && console.log(`[MotionGuard] Initialized with context: ${context}`);
  
  // Return disposal function
  return {
    dispose() {
      if (visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler);
        visibilityHandler = null;
      }
      
      if (prefersReducedMotionHandler && mql) {
        mql.removeEventListener('change', prefersReducedMotionHandler);
        prefersReducedMotionHandler = null;
      }
      
      if (beforeUnloadHandler) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        beforeUnloadHandler = null;
      }
      
      DEBUG_MOTION && console.log('[MotionGuard] Disposed');
    }
  };
}

/**
 * Clean up all listeners and reset state
 */
function cleanup() {
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }
  
  if (prefersReducedMotionHandler && mql) {
    mql.removeEventListener('change', prefersReducedMotionHandler);
    prefersReducedMotionHandler = null;
  }
  
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
  
  // Wake ticker if it was sleeping
  if (isBrowser) {
    gsap.ticker.wake();
    gsap.globalTimeline.play();
  }
  
  isInitialized = false;
  DEBUG_MOTION && console.log('[MotionGuard] Cleaned up');
}

/**
 * Get the current context
 * @returns {string} Current animation context
 */
export function getCurrentContext() {
  return context;
}

/**
 * Check if motion guard is initialized
 * @returns {boolean} Whether motion guard is initialized
 */
export function isMotionGuardInitialized() {
  return isInitialized;
}

// Default export for convenience
export default {
  get gsap() { return gsap; },
  initMotion,
  setContext,
  applyReducedMotion,
  getCurrentContext,
  isMotionGuardInitialized,
  get context() { return context; }
};