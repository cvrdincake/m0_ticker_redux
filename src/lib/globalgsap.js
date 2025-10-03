gsap.defaults({
  duration: 0.2,
  ease: 'power2.out'
});
gsap.globalTimeline.timeScale(1.5);  // 50% faster globally

// Scope per container
const dashboardTimeline = gsap.timeline({ timeScale: 1.5 });
const overlayTimeline = gsap.timeline({ timeScale: 1.0 }); // Normal speed for broadcast