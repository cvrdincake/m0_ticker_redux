// Pause on tab hide
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
    stopParticles();
  } else {
    gsap.globalTimeline.play();
    startParticles();
  }
});

// Degrade to 30fps if CPU >80%
if (performance.now() - lastFrame > 50) {
  createjs.Ticker.framerate = 30;
}

// Reduced-motion: static particles, no parallax
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  disableParallax();
  setParticleOpacity(0.2);  // Static field at low alpha
  document.querySelector('.grain').style.opacity = '0.04';
}