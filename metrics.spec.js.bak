// tests/performance/metrics.spec.js
import { test, expect } from '@playwright/test';

test('Performance budgets', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      lcp: paint.find(p => p.name === 'largest-contentful-paint')?.startTime,
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      domInteractive: perf.domInteractive,
      loadComplete: perf.loadEventEnd
    };
  });
  
  expect(metrics.lcp).toBeLessThan(2500);
  expect(metrics.fcp).toBeLessThan(1800);
  expect(metrics.domInteractive).toBeLessThan(3000);
});

test('Particle canvas FPS', async ({ page }) => {
  await page.goto('/');
  
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      let frameCount = 0;
      const start = performance.now();
      
      function countFrame() {
        frameCount++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(frameCount);
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  });
  
  expect(fps).toBeGreaterThan(55); // Allow for some variance from 60fps
});