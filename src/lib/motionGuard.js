import { gsap } from 'gsap';

// Export gsap for test mocking
export { gsap };

// Motion guard functionality - simplified for now
const motionGuard = {
  gsap,
  init() {
    // Pause on tab hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
        // stopParticles(); // TODO: Import particles system
      } else {
        gsap.globalTimeline.play();
        // startParticles(); // TODO: Import particles system
      }
    });

    // Reduced-motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // disableParallax(); // TODO: Import parallax system
      // setParticleOpacity(0.2); // TODO: Import particles system
      const grain = document.querySelector('.grain');
      if (grain) {
        grain.style.opacity = '0.04';
      }
    }
  }
};

export default motionGuard;