/**
 * M0 Ticker Redux - GSAP Animation Helpers
 * Centralized animation utilities with reduced motion support
 */

import { gsap } from 'gsap';

// Configure GSAP defaults for monochrome aesthetic
gsap.defaults({
  ease: "power2.out",
  duration: 0.25
});

/**
 * Check for reduced motion preference
 */
function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animation registry for cleanup and performance monitoring
 */
class AnimationRegistry {
  constructor() {
    this.animations = new WeakMap();
    this.activeCount = 0;
  }
  
  register(element, timeline) {
    this.animations.set(element, timeline);
    this.activeCount++;
    
    timeline.eventCallback('onComplete', () => {
      this.activeCount--;
    });
  }
  
  kill(element) {
    const timeline = this.animations.get(element);
    if (timeline) {
      timeline.kill();
      this.animations.delete(element);
      this.activeCount--;
    }
  }
  
  killAll() {
    gsap.killTweensOf('*');
    this.activeCount = 0;
  }
  
  getStats() {
    return {
      activeAnimations: this.activeCount,
      totalRegistered: this.animations.size
    };
  }
}

export const animationRegistry = new AnimationRegistry();

/**
 * Core animation functions
 */
export const animate = {
  /**
   * Fade in animation with reduced motion support
   */
  fadeIn: (element, options = {}) => {
    const {
      duration = shouldReduceMotion() ? 0.01 : 0.3,
      delay = 0,
      ease = "power2.out",
      y = 20,
      onComplete
    } = options;
    
    const tl = gsap.timeline();
    
    gsap.set(element, { 
      opacity: 0, 
      y: shouldReduceMotion() ? 0 : y 
    });
    
    tl.to(element, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  },
  
  /**
   * Fade out animation
   */
  fadeOut: (element, options = {}) => {
    const {
      duration = shouldReduceMotion() ? 0.01 : 0.25,
      delay = 0,
      ease = "power2.in",
      y = -10,
      onComplete
    } = options;
    
    const tl = gsap.timeline();
    
    tl.to(element, {
      opacity: 0,
      y: shouldReduceMotion() ? 0 : y,
      duration,
      delay,
      ease,
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  },
  
  /**
   * Scale animation (for buttons, cards)
   */
  scale: (element, options = {}) => {
    const {
      scale = 1.05,
      duration = shouldReduceMotion() ? 0.01 : 0.15,
      ease = "power2.out",
      onComplete
    } = options;
    
    const tl = gsap.timeline();
    
    tl.to(element, {
      scale: shouldReduceMotion() ? 1 : scale,
      duration,
      ease,
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  },
  
  /**
   * Slide in animation (for modals, sidebars)
   */
  slideIn: (element, options = {}) => {
    const {
      direction = 'up', // 'up', 'down', 'left', 'right'
      distance = 50,
      duration = shouldReduceMotion() ? 0.01 : 0.4,
      ease = "power2.out",
      onComplete
    } = options;
    
    const tl = gsap.timeline();
    
    const props = { opacity: 0 };
    
    if (!shouldReduceMotion()) {
      switch (direction) {
        case 'up':
          props.y = distance;
          break;
        case 'down':
          props.y = -distance;
          break;
        case 'left':
          props.x = distance;
          break;
        case 'right':
          props.x = -distance;
          break;
      }
    }
    
    gsap.set(element, props);
    
    tl.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      ease,
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  },
  
  /**
   * Stagger animation for lists
   */
  stagger: (elements, options = {}) => {
    const {
      delay = 0.1,
      duration = shouldReduceMotion() ? 0.01 : 0.3,
      ease = "power2.out",
      y = 20,
      onComplete
    } = options;
    
    const tl = gsap.timeline();
    
    gsap.set(elements, { 
      opacity: 0, 
      y: shouldReduceMotion() ? 0 : y 
    });
    
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger: shouldReduceMotion() ? 0 : delay,
      onComplete
    });
    
    elements.forEach(el => animationRegistry.register(el, tl));
    return tl;
  },
  
  /**
   * Pulse animation for attention
   */
  pulse: (element, options = {}) => {
    const {
      scale = 1.1,
      duration = shouldReduceMotion() ? 0.01 : 0.6,
      repeat = -1,
      ease = "power2.inOut",
      onComplete
    } = options;
    
    if (shouldReduceMotion()) {
      return gsap.timeline();
    }
    
    const tl = gsap.timeline({ repeat, yoyo: true });
    
    tl.to(element, {
      scale,
      duration: duration / 2,
      ease,
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  },
  
  /**
   * Counter animation for numbers
   */
  counter: (element, options = {}) => {
    const {
      from = 0,
      to = 100,
      duration = shouldReduceMotion() ? 0.01 : 1,
      ease = "power2.out",
      onUpdate,
      onComplete
    } = options;
    
    const obj = { value: from };
    
    const tl = gsap.timeline();
    
    tl.to(obj, {
      value: to,
      duration,
      ease,
      onUpdate: () => {
        const value = Math.round(obj.value);
        element.textContent = value.toLocaleString();
        onUpdate?.(value);
      },
      onComplete
    });
    
    animationRegistry.register(element, tl);
    return tl;
  }
};

/**
 * Parallax effects manager
 */
export class ParallaxManager {
  constructor() {
    this.elements = [];
    this.isActive = false;
    this.ticking = false;
  }
  
  /**
   * Add element for parallax effect
   */
  add(element, options = {}) {
    const {
      speed = 0.5,
      direction = 'vertical', // 'vertical' | 'horizontal'
      offset = 0
    } = options;
    
    if (shouldReduceMotion()) {
      return () => {}; // No-op for reduced motion
    }
    
    const entry = {
      element,
      speed,
      direction,
      offset,
      initialPosition: this.getElementPosition(element)
    };
    
    this.elements.push(entry);
    
    if (!this.isActive) {
      this.start();
    }
    
    return () => this.remove(entry);
  }
  
  /**
   * Remove element from parallax
   */
  remove(entry) {
    const index = this.elements.indexOf(entry);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
    
    if (this.elements.length === 0) {
      this.stop();
    }
  }
  
  /**
   * Start parallax system
   */
  start() {
    this.isActive = true;
    this.handleScroll();
    window.addEventListener('scroll', this.requestTick.bind(this), { passive: true });
  }
  
  /**
   * Stop parallax system
   */
  stop() {
    this.isActive = false;
    window.removeEventListener('scroll', this.requestTick.bind(this));
  }
  
  /**
   * Request animation frame for smooth scrolling
   */
  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  /**
   * Handle scroll event
   */
  handleScroll() {
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    for (const entry of this.elements) {
      const { element, speed, direction, offset, initialPosition } = entry;
      
      let transform;
      
      if (direction === 'vertical') {
        const movement = (scrollY - initialPosition.top) * speed + offset;
        transform = `translateY(${movement}px)`;
      } else {
        const movement = (scrollX - initialPosition.left) * speed + offset;
        transform = `translateX(${movement}px)`;
      }
      
      gsap.set(element, { transform });
    }
  }
  
  /**
   * Get element position
   */
  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  }
  
  /**
   * Destroy parallax manager
   */
  destroy() {
    this.elements = [];
    this.stop();
  }
}

export const parallax = new ParallaxManager();

/**
 * Performance monitoring
 */
export const AnimationStats = {
  getGSAPStats: () => ({
    totalTweens: gsap.getTweensOf('*').length,
    registryStats: animationRegistry.getStats()
  }),
  
  logPerformance: () => {
    const stats = AnimationStats.getGSAPStats();
    console.log('Animation Performance:', stats);
  }
};