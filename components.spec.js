// tests/visual/components.spec.js
import { test, expect } from '@playwright/test';

test.describe('Monochrome Components', () => {
  test('Card hover state', async ({ page }) => {
    await page.goto('/components/card');
    
    // Initial state
    await expect(page.locator('.card').first()).toHaveScreenshot('card-idle.png');
    
    // Hover state
    await page.locator('.card').first().hover();
    await page.waitForTimeout(200); // Wait for animation
    await expect(page.locator('.card').first()).toHaveScreenshot('card-hover.png');
  });
  
  test('Modal entrance animation', async ({ page }) => {
    await page.goto('/components/modal');
    await page.click('button:has-text("Open Modal")');
    await page.waitForTimeout(300); // Wait for full animation
    await expect(page).toHaveScreenshot('modal-open.png');
  });
  
  test('Reduced motion compliance', async ({ page, context }) => {
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/components/card');
    await page.locator('.card').first().hover();
    await expect(page.locator('.card').first()).toHaveScreenshot('card-reduced-motion.png');
  });
});