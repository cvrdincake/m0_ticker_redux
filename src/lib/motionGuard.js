import { gsap } from 'gsap';

// SSR safety checks
const isBrowser = typeof window !== 'undefined';
const isVisible = () => isBrowser && !document.hidden;

let globalTimeline = null;
let currentContext = 'dashboard'; // default context
let motionReduced = false;
let visibilityPaused = false;
let motionTokensCache = null;

// Motion preference detection with SSR safety
const getMediaQueryList = () => {
  if (!isBrowser || !window.matchMedia) return null;
  return window.matchMedia('(prefers-reduced-motion: reduce)');
};

// Read motion tokens from CSS and cache them
const readMotionTokens = () => {
  if (!isBrowser || motionTokensCache) return motionTokensCache;
  
  const rootStyle = getComputedStyle(document.documentElement);
  
  motionTokensCache = {
    durations: {
      instant: parseFloat(rootStyle.getPropertyValue('--duration-instant')) || 0,
      fast: parseFloat(rootStyle.getPropertyValue('--duration-fast')) || 100,
      base: parseFloat(rootStyle.getPropertyValue('--duration-base')) || 200,
      slow: parseFloat(rootStyle.getPropertyValue('--duration-slow')) || 300,
      slower: parseFloat(rootStyle.getPropertyValue('--duration-slower')) || 500
    },
    eases: {
      linear: rootStyle.getPropertyValue('--ease-linear').trim() || 'linear',
      in: rootStyle.getPropertyValue('--ease-in').trim() || 'cubic-bezier(0.4, 0, 1, 1)',
      out: rootStyle.getPropertyValue('--ease-out').trim() || 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: rootStyle.getPropertyValue('--ease-in-out').trim() || 'cubic-bezier(0.4, 0, 0.2, 1)',
      back: rootStyle.getPropertyValue('--ease-back').trim() || 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: rootStyle.getPropertyValue('--ease-bounce').trim() || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  };
  
  return motionTokensCache;
};

// Initialize motion system with context
export const initMotion = ({ context = 'dashboard' } = {}) => {
  if (!isBrowser) return { dispose: () => {} };
  
  // Check initial reduced motion preference
  const mql = getMediaQueryList();
  motionReduced = mql ? mql.matches : false;
  
  // Cache motion tokens on init
  readMotionTokens();
  
  // Set up global timeline with context-specific timeScale
  if (!globalTimeline) {
    globalTimeline = gsap.globalTimeline;
    setContext(context);
  }
  
  // Apply initial reduced motion state
  applyReducedMotion(motionReduced);
  
  // Listen for media query changes
  const handleMediaChange = (e) => {
    motionReduced = e.matches;
    applyReducedMotion(motionReduced);
  };
  
  if (mql && mql.addEventListener) {
    mql.addEventListener('change', handleMediaChange);
  }
  
  // Listen for visibility changes
  const handleVisibilityChange = () => {
    const isCurrentlyVisible = isVisible();
    
    if (!isCurrentlyVisible && !visibilityPaused) {
      globalTimeline.pause();
      visibilityPaused = true;
    } else if (isCurrentlyVisible && visibilityPaused && !motionReduced) {
      globalTimeline.resume();
      visibilityPaused = false;
    }
  };
  
  if (isBrowser && document.addEventListener) {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
  
  return {
    dispose: () => {
      if (mql && mql.removeEventListener) {
        mql.removeEventListener('change', handleMediaChange);
      }
      if (isBrowser && document.removeEventListener) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      globalTimeline = null;
      motionTokensCache = null;
    }
  };
};

// Set context and adjust timeline speed
export const setContext = (context) => {
  if (!isBrowser || !globalTimeline) return;
  
  currentContext = context;
  
  // Pause timeline before changing timeScale
  const wasPlaying = !globalTimeline.paused();
  if (wasPlaying) globalTimeline.pause();
  
  // Set timeScale based on context
  switch (context) {
    case 'dashboard':
      globalTimeline.timeScale(1.5);
      break;
    case 'overlay':
      globalTimeline.timeScale(1.0);
      break;
    default:
      globalTimeline.timeScale(1.0);
  }
  
  // Resume if it was playing and motion is allowed
  if (wasPlaying && !motionReduced && isVisible()) {
    globalTimeline.resume();
  }
};

// Apply reduced motion setting - NO timeScale hacks, just kill animations
export const applyReducedMotion = (isReduced) => {
  if (!isBrowser) return;
  
  motionReduced = isReduced;
  
  // Toggle CSS class on documentElement
  if (document.documentElement) {
    document.documentElement.classList.toggle('reduce-motion', isReduced);
  }
  
  if (globalTimeline) {
    if (isReduced) {
      // Kill all running animations immediately and set to end state
      gsap.killTweensOf('*'); // Kill all active tweens
      globalTimeline.pause(); // Pause timeline
      // Note: Components should handle end-states via CSS .reduce-motion class
    } else if (isVisible()) {
      // Resume normal animation behavior
      globalTimeline.resume();
    }
  }
};

// Check if motion is currently reduced
export const isMotionReduced = () => {
  if (!isBrowser) return true; // SSR safe default
  return motionReduced;
};

// Get cached motion tokens
export const getMotionTokens = () => {
  return readMotionTokens() || {
    durations: { instant: 0, fast: 100, base: 200, slow: 300, slower: 500 },
    eases: { 
      linear: 'linear', 
      in: 'cubic-bezier(0.4, 0, 1, 1)', 
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  };
};

// Register motion preference change listener
export const onMotionPreferenceChange = (callback) => {
  if (!isBrowser) return () => {}; // SSR safe no-op
  
  const mql = getMediaQueryList();
  if (!mql) return () => {};
  
  const handler = (e) => callback(e.matches);
  
  if (mql.addEventListener) {
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }
  
  return () => {};
};

// Export GSAP instance
export { gsap };