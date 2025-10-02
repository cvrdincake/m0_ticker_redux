// Normalised pointer position
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

window.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to +1
  targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Lerp update (60fps)
function updateParallax() {
  mouseX += (targetX - mouseX) * 0.06;  // Lerp factor 0.06 for smooth lag
  mouseY += (targetY - mouseY) * 0.06;
  
  // Apply per-layer offsets
  layers.forEach((layer, i) => {
    const depth = (i + 1) * 10;  // 10px, 20px, 30px max offset
    layer.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
  });
  
  requestAnimationFrame(updateParallax);
}