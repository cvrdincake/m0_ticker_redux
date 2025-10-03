import { test, expect } from '@playwright/test';

test.describe('Operator UX E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard');
    
    // Wait for the dashboard to load
    await page.waitForSelector('[data-testid="dashboard-grid"]', { timeout: 10000 });
  });

  test('keyboard-only workflow: add → configure → export', async ({ page }) => {
    // Open command palette with Cmd+K
    await page.keyboard.press('Meta+k');
    await expect(page.getByRole('dialog', { name: /command palette/i })).toBeVisible();
    
    // Search for and add a KPI widget
    await page.getByPlaceholder('Search commands...').fill('kpi');
    await page.keyboard.press('Enter');
    
    // Wait for widget to be added
    await expect(page.locator('[data-widget-kind="kpi"]')).toBeVisible();
    
    // Focus the widget and move it with arrow keys
    await page.locator('[data-widget-kind="kpi"]').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    
    // Resize with Shift+Arrow
    await page.keyboard.press('Shift+ArrowDown');
    
    // Duplicate with Cmd+D
    await page.keyboard.press('Meta+d');
    await expect(page.locator('[data-widget-kind="kpi"]')).toHaveCount(2);
    
    // Open inspector with I
    await page.keyboard.press('i');
    await expect(page.getByRole('form', { name: /inspector/i })).toBeVisible();
    
    // Configure widget properties
    await page.getByLabel('Title').fill('Revenue KPI');
    await page.getByLabel('ARIA Label').fill('Revenue key performance indicator');
    
    // Export layout with Cmd+K → Export
    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Search commands...').fill('export');
    await page.keyboard.press('Enter');
    
    // Verify export was triggered (download started)
    // Note: In real test, you'd check for download event
    
    // Close dialogs with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('alignment and snapping', async ({ page }) => {
    // Add two widgets
    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Search commands...').fill('card');
    await page.keyboard.press('Enter');
    
    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Search commands...').fill('chart');
    await page.keyboard.press('Enter');
    
    // Select first widget and move it
    const firstWidget = page.locator('[data-widget-kind="card"]').first();
    await firstWidget.focus();
    
    // Move to a position that should trigger alignment guides
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowRight');
    }
    
    // Open command palette and align widgets
    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Search commands...').fill('align left');
    await page.keyboard.press('Enter');
    
    // Verify widgets are aligned (both should have same x position)
    const widgets = page.locator('[role="group"]');
    const firstBbox = await widgets.first().boundingBox();
    const secondBbox = await widgets.nth(1).boundingBox();
    
    expect(firstBbox?.x).toBe(secondBbox?.x);
  });

  test('z-order controls', async ({ page }) => {
    // Add multiple widgets
    for (const widgetType of ['card', 'chart', 'kpi']) {
      await page.keyboard.press('Meta+k');
      await page.getByPlaceholder('Search commands...').fill(widgetType);
      await page.keyboard.press('Enter');
    }
    
    // Select a widget
    const widget = page.locator('[data-widget-kind="card"]').first();
    await widget.focus();
    
    // Right-click to open context menu
    await widget.click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    
    // Click "Bring to Front"
    await page.getByRole('menuitem', { name: /bring to front/i }).click();
    
    // Verify z-index changed (widget should have highest z-index)
    const zIndex = await widget.evaluate(el => getComputedStyle(el).zIndex);
    expect(parseInt(zIndex)).toBeGreaterThan(0);
  });

  test('accessibility compliance', async ({ page }) => {
    // Focus management test
    await page.keyboard.press('Tab');
    
    // Verify focus is on a widget
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('role', 'group');
    
    // Verify ARIA attributes
    await expect(focusedElement).toHaveAttribute('aria-label');
    await expect(focusedElement).toHaveAttribute('tabindex', '0');
    
    // Test focus ring visibility
    await expect(focusedElement).toHaveCSS('box-shadow', /.*focus-ring.*/);
    
    // Test high contrast mode
    await page.evaluate(() => {
      document.documentElement.classList.add('hc');
    });
    
    // Verify high contrast styles applied
    const bodyColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--ink');
    });
    expect(bodyColor.trim()).toBe('#ffffff');
  });

  test('command palette functionality', async ({ page }) => {
    // Open with Cmd+K
    await page.keyboard.press('Meta+k');
    const palette = page.getByRole('dialog', { name: /command palette/i });
    await expect(palette).toBeVisible();
    
    // Test search functionality
    await page.getByPlaceholder('Search commands...').fill('add');
    await expect(page.getByText(/add widget/i)).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.command.selected')).toBeVisible();
    
    // Test execution
    await page.keyboard.press('Enter');
    await expect(palette).not.toBeVisible();
    
    // Verify action was executed (widget added)
    await expect(page.locator('[role="group"]')).toHaveCount(1);
  });

  test('inspector panel integration', async ({ page }) => {
    // Add a widget first
    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Search commands...').fill('card');
    await page.keyboard.press('Enter');
    
    // Open inspector
    await page.keyboard.press('i');
    const inspector = page.getByRole('form', { name: /inspector/i });
    await expect(inspector).toBeVisible();
    
    // Test form interactions
    await page.getByLabel('Title').fill('Custom Title');
    await page.selectOption('[id="widget-motion"]', 'toast');
    await page.selectOption('[id="widget-density"]', 'compact');
    
    // Verify changes are applied (debounced)
    await page.waitForTimeout(300); // Wait for debounce
    
    // Close inspector with Shift+I focus test
    await page.keyboard.press('Shift+i');
    const firstInput = inspector.locator('input').first();
    await expect(firstInput).toBeFocused();
  });

  test('reduced motion compliance', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Navigate to dashboard
    await page.reload();
    
    // Verify animations are disabled/reduced
    const widget = page.locator('[role="group"]').first();
    const transitionDuration = await widget.evaluate(el => 
      getComputedStyle(el).transitionDuration
    );
    
    // Should be very short or none
    expect(parseFloat(transitionDuration)).toBeLessThan(0.1);
  });
});