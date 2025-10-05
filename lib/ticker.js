/**
 * M0 Ticker Redux - Animation Ticker System
 * Centralized requestAnimationFrame manager with performance monitoring
 */

class TickerSystem {
  constructor() {
    this.callbacks = new Set();
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateInterval = 1000; // Update FPS every second
    this.lastFpsUpdate = 0;
    
    // Performance monitoring
    this.maxFrameTime = 16.67; // 60fps target
    this.performanceWarnings = 0;
    
    this.tick = this.tick.bind(this);
  }
  
  /**
   * Add animation callback
   * @param {Function} callback - Function to call each frame (deltaTime, fps) => void
   * @param {number} priority - Higher numbers run first (default: 0)
   */
  add(callback, priority = 0) {
    const entry = { callback, priority };
    this.callbacks.add(entry);
    
    if (!this.isRunning) {
      this.start();
    }
    
    return () => this.remove(entry);
  }
  
  /**
   * Remove animation callback
   */
  remove(entry) {
    this.callbacks.delete(entry);
    
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }
  
  /**
   * Start the ticker
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.lastFpsUpdate = this.lastTime;
    
    requestAnimationFrame(this.tick);
  }
  
  /**
   * Stop the ticker
   */
  stop() {
    this.isRunning = false;
  }
  
  /**
   * Main tick function
   */
  tick(currentTime) {
    if (!this.isRunning) return;
    
    // Calculate deltaTime in seconds
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
    
    // Performance monitoring
    const frameTime = this.deltaTime * 1000;
    if (frameTime > this.maxFrameTime) {
      this.performanceWarnings++;
      if (this.performanceWarnings % 60 === 0) {
        console.warn(`Ticker: Frame time ${frameTime.toFixed(2)}ms exceeds 16.67ms target`);
      }
    }
    
    // Sort callbacks by priority (higher first)
    const sortedCallbacks = Array.from(this.callbacks).sort((a, b) => b.priority - a.priority);
    
    // Execute callbacks
    for (const { callback } of sortedCallbacks) {
      try {
        callback(this.deltaTime, this.fps);
      } catch (error) {
        console.error('Ticker callback error:', error);
        this.callbacks.delete({ callback });
      }
    }
    
    requestAnimationFrame(this.tick);
  }
  
  /**
   * Get current performance stats
   */
  getStats() {
    return {
      fps: this.fps,
      deltaTime: this.deltaTime,
      activeCallbacks: this.callbacks.size,
      performanceWarnings: this.performanceWarnings,
      isRunning: this.isRunning
    };
  }
  
  /**
   * Clear all callbacks and stop
   */
  destroy() {
    this.callbacks.clear();
    this.stop();
  }
}

// Global ticker instance
export const ticker = new TickerSystem();

/**
 * React hook for using the ticker system
 * Import React hooks at the top of your component file to use this
 */
export function createTickerHook() {
  return function useTicker(callback, dependencies = [], priority = 0) {
    const { useEffect, useRef } = require('react');
    
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    
    useEffect(() => {
      const wrappedCallback = (deltaTime, fps) => {
        callbackRef.current(deltaTime, fps);
      };
      
      const unsubscribe = ticker.add(wrappedCallback, priority);
      
      return unsubscribe;
    }, dependencies);
  };
}

/**
 * Animation utilities
 */
export const AnimationUtils = {
  /**
   * Linear interpolation
   */
  lerp: (start, end, factor) => start + (end - start) * factor,
  
  /**
   * Smooth step (ease in/out)
   */
  smoothstep: (t) => t * t * (3 - 2 * t),
  
  /**
   * Ease out cubic
   */
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  
  /**
   * Ease in out cubic
   */
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  /**
   * Convert degrees to radians
   */
  toRadians: (degrees) => degrees * (Math.PI / 180),
  
  /**
   * Convert radians to degrees
   */
  toDegrees: (radians) => radians * (180 / Math.PI),
  
  /**
   * Clamp value between min and max
   */
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  
  /**
   * Map value from one range to another
   */
  map: (value, inMin, inMax, outMin, outMax) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
};