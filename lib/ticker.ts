/**
 * RAF Ticker System
 * High-performance animation ticker with visibility controls
 */

import { useRef, useEffect, DependencyList } from 'react';

interface TickerCallback {
  (deltaTime: number, timestamp: number): void;
}

interface TickerOptions {
  autoStart?: boolean;
  pauseOnVisibilityChange?: boolean;
}

class RAFTicker {
  private callbacks = new Set<TickerCallback>();
  private isRunning = false;
  private lastTime = 0;
  private rafId: number | null = null;
  private pauseOnVisibilityChange: boolean;
  
  constructor(options: TickerOptions = {}) {
    this.pauseOnVisibilityChange = options.pauseOnVisibilityChange ?? true;
    
    if (this.pauseOnVisibilityChange && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    if (options.autoStart) {
      this.start();
    }
  }
  
  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.pause();
    } else if (this.callbacks.size > 0) {
      this.start();
    }
  };
  
  private tick = (timestamp: number) => {
    if (!this.isRunning) return;
    
    const deltaTime = this.lastTime ? timestamp - this.lastTime : 0;
    this.lastTime = timestamp;
    
    // Execute all callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(deltaTime, timestamp);
      } catch (error) {
        console.error('Ticker callback error:', error);
      }
    });
    
    this.rafId = requestAnimationFrame(this.tick);
  };
  
  add(callback: TickerCallback): () => void {
    this.callbacks.add(callback);
    
    // Auto-start if not running and has callbacks
    if (!this.isRunning && this.callbacks.size === 1) {
      this.start();
    }
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
      
      // Auto-stop if no more callbacks
      if (this.callbacks.size === 0) {
        this.stop();
      }
    };
  }
  
  remove(callback: TickerCallback): void {
    this.callbacks.delete(callback);
    
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }
  
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }
  
  pause(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  stop(): void {
    this.pause();
    this.lastTime = 0;
  }
  
  destroy(): void {
    this.stop();
    this.callbacks.clear();
    
    if (this.pauseOnVisibilityChange && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
  
  get size(): number {
    return this.callbacks.size;
  }
  
  get running(): boolean {
    return this.isRunning;
  }
}

// Global ticker instance
export const ticker = new RAFTicker({ 
  autoStart: false, 
  pauseOnVisibilityChange: true 
});

// Hook for React components
export function useTicker(
  callback: TickerCallback, 
  deps: DependencyList = [],
  enabled: boolean = true
): void {
  const callbackRef = useRef<TickerCallback>(callback);
  
  // Update callback ref when deps change
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);
  
  useEffect(() => {
    if (!enabled) return;
    
    const wrappedCallback: TickerCallback = (deltaTime, timestamp) => {
      callbackRef.current(deltaTime, timestamp);
    };
    
    const unsubscribe = ticker.add(wrappedCallback);
    
    return unsubscribe;
  }, [enabled]);
}

// Utility for text scrolling with reduced motion support
export function createTextScroller(options: {
  speed: number; // pixels per second
  container: HTMLElement;
  content: HTMLElement;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}) {
  const { speed, container, content, direction = 'left', pauseOnHover = true } = options;
  
  let position = 0;
  let isPaused = false;
  let isHovered = false;
  
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // For reduced motion, just show static text
  if (reducedMotion) {
    content.style.transform = 'translateX(0)';
    return {
      start: () => {},
      stop: () => {},
      pause: () => {},
      resume: () => {},
      destroy: () => {},
      setSpeed: () => {},
    };
  }
  
  const containerWidth = container.offsetWidth;
  const contentWidth = content.offsetWidth;
  
  // If content fits in container, no need to scroll
  if (contentWidth <= containerWidth) {
    content.style.transform = 'translateX(0)';
    return {
      start: () => {},
      stop: () => {},
      pause: () => {},
      resume: () => {},
      destroy: () => {},
      setSpeed: () => {},
    };
  }
  
  // Set initial position
  position = direction === 'left' ? containerWidth : -contentWidth;
  
  const updatePosition = (deltaTime: number) => {
    if (isPaused || (pauseOnHover && isHovered)) return;
    
    const pixelsPerMs = speed / 1000;
    const movement = pixelsPerMs * deltaTime;
    
    if (direction === 'left') {
      position -= movement;
      if (position < -contentWidth) {
        position = containerWidth;
      }
    } else {
      position += movement;
      if (position > containerWidth) {
        position = -contentWidth;
      }
    }
    
    content.style.transform = `translateX(${position}px)`;
  };
  
  // Mouse event handlers
  const handleMouseEnter = () => {
    isHovered = true;
  };
  
  const handleMouseLeave = () => {
    isHovered = false;
  };
  
  if (pauseOnHover) {
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
  }
  
  const unsubscribe = ticker.add(updatePosition);
  
  return {
    start: () => {
      isPaused = false;
    },
    
    stop: () => {
      isPaused = true;
      position = direction === 'left' ? containerWidth : -contentWidth;
      content.style.transform = `translateX(${position}px)`;
    },
    
    pause: () => {
      isPaused = true;
    },
    
    resume: () => {
      isPaused = false;
    },
    
    setSpeed: (newSpeed: number) => {
      // Speed is updated via closure, no need to do anything
    },
    
    destroy: () => {
      unsubscribe();
      if (pauseOnHover) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    },
  };
}

export default ticker;