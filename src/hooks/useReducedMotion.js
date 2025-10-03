import { useState, useEffect } from 'react';

/**
 * Hook to detect and respond to user's reduced motion preference
 * @returns {boolean} Whether user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to create motion-safe CSS transitions
 * @param {string} defaultTransition - Default transition for motion-enabled users
 * @param {string} reducedTransition - Simplified transition for reduced motion users
 * @returns {string} Appropriate transition string
 */
export const useMotionSafeTransition = (
  defaultTransition = 'all 0.3s ease',
  reducedTransition = 'none'
) => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedTransition : defaultTransition;
};

/**
 * Hook to create conditional animation configurations
 * @param {Object} defaultConfig - Animation config for motion-enabled users
 * @param {Object} reducedConfig - Simplified config for reduced motion users
 * @returns {Object} Appropriate animation configuration
 */
export const useMotionSafeAnimation = (defaultConfig, reducedConfig = {}) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return {
      ...defaultConfig,
      ...reducedConfig,
      duration: 0,
      delay: 0,
      ease: 'none'
    };
  }
  
  return defaultConfig;
};

export default useReducedMotion;