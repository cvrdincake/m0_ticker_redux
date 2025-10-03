import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { gsap, getMotionTokens, isMotionReduced } from '@/lib/motionGuard';
import styles from './ToastManager.module.css';

export const ToastContext = createContext();

const MAX_TOASTS = 4; // Queue cap to avoid pile-ups

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const visibilityRef = useRef(true);
  
  // Track visibility for pause/resume
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleVisibilityChange = () => {
      visibilityRef.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  const addToast = useCallback((message, duration = 4000) => {
    const id = Date.now() + Math.random(); // More unique ID
    
    setToasts(prev => {
      const newToasts = [...prev, { id, message, duration }];
      // Cap at MAX_TOASTS, drop oldest
      return newToasts.slice(-MAX_TOASTS);
    });
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ addToast, visibilityRef }}>
      {children}
      <div 
        className={styles.toastContainer}
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ id, message, duration, onDismiss }) {
  const ref = useRef(null);
  const timeoutRef = useRef(null);
  const timelineRef = useRef(null);
  const isPausedRef = useRef(false);
  const { visibilityRef } = useContext(ToastContext);
  
  const handleDismiss = useCallback(() => {
    if (!ref.current) return;
    
    const isReduced = isMotionReduced();
    const tokens = getMotionTokens();
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (isReduced) {
      // Reduced motion: fade only
      gsap.to(ref.current, {
        opacity: 0,
        duration: tokens.durations.fast / 1000,
        onComplete: () => onDismiss(id)
      });
    } else {
      // Full motion: slide out to right
      gsap.to(ref.current, {
        x: 100,
        opacity: 0,
        duration: tokens.durations.fast / 1000,
        ease: tokens.eases.in,
        onComplete: () => onDismiss(id)
      });
    }
  }, [id, onDismiss]);

  const startDismissTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleDismiss();
    }, duration);
  }, [duration, handleDismiss]);
  
  const pauseDismissTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      isPausedRef.current = true;
    }
  }, []);
  
  const resumeDismissTimer = useCallback(() => {
    if (isPausedRef.current && visibilityRef.current) {
      isPausedRef.current = false;
      startDismissTimer();
    }
  }, [startDismissTimer, visibilityRef]);
  
  // Handle visibility pause/resume
  useEffect(() => {
    const checkVisibility = () => {
      if (visibilityRef.current) {
        resumeDismissTimer();
      } else {
        pauseDismissTimer();
      }
    };
    
    checkVisibility();
  }, [pauseDismissTimer, resumeDismissTimer, visibilityRef]);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const isReduced = isMotionReduced();
    const tokens = getMotionTokens();
    
    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    if (isReduced) {
      // Reduced motion: fade only, no slide
      gsap.fromTo(ref.current,
        { opacity: 0 },
        { opacity: 1, duration: tokens.durations.fast / 1000 }
      );
    } else {
      // Full motion: slide in from right
      timelineRef.current = gsap.fromTo(ref.current,
        { x: 100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: tokens.durations.base / 1000, 
          ease: tokens.eases.out 
        }
      );
    }
    
    // Start auto-dismiss timer
    startDismissTimer();
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startDismissTimer]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDismiss();
    }
  };
  
  // SSR safety
  if (typeof window === 'undefined') {
    return (
      <div className={styles.toast}>
        <span className={styles.toastMessage}>{message}</span>
        <button className={styles.toastClose} aria-label="Dismiss">×</button>
      </div>
    );
  }
  
  return (
    <div 
      ref={ref} 
      className={styles.toast}
      role="button"
      tabIndex={0}
      onMouseEnter={pauseDismissTimer}
      onMouseLeave={resumeDismissTimer}
      onFocus={pauseDismissTimer}
      onBlur={resumeDismissTimer}
      onKeyDown={handleKeyDown}
      onClick={handleDismiss}
    >
      <span className={styles.toastMessage}>{message}</span>
      <button 
        className={styles.toastClose} 
        aria-label="Dismiss"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
      >
        ×
      </button>
    </div>
  );
}

export { Toast };