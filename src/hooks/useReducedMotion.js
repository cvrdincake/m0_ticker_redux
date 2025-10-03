import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Respects prefers-reduced-motion: reduce setting
 */
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setShouldReduceMotion(mediaQuery.matches);
    
    const handleChange = (event) => {
      setShouldReduceMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return shouldReduceMotion;
}