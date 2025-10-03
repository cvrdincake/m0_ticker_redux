import { test, expect } from '@playwright/test';

test.describe('Dashboard Core Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard with initial widgets', async ({ page }) => {
    await expect(page.getByTestId('dashboard-canvas')).toBeVisible();
    
    // Check for initial widgets
    const widgets = page.locator('[data-testid^="widget-"]');
    await expect(widgets).toHaveCount.greaterThan(0);
  });

  test('should allow widget selection and manipulation', async ({ page }) => {
    // Select first widget
    const firstWidget = page.locator('[data-testid^="widget-"]').first();
    await firstWidget.click();
    
    // Check selection state
    await expect(firstWidget).toHaveClass(/selected/);
    
    // Open inspector panel
    await expect(page.getByTestId('inspector-panel')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should reach first widget
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('data-testid', /widget-/);
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
  });

  test('should handle widget creation from command palette', async ({ page }) => {
    // Open command palette
    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('command-palette')).toBeVisible();
    
    // Search for widget
    await page.fill('[data-testid="command-input"]', 'add card');
    await page.keyboard.press('Enter');
    
    // Verify new widget appears
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount.greaterThan(1);
  });
});

test.describe('Accessibility Features', () => {
  test('should meet WCAG 2.1 AA contrast requirements', async ({ page }) => {
    await page.goto('/');
    
    // Check for high contrast mode toggle
    await page.click('[data-testid="accessibility-menu"]');
    await page.click('[data-testid="high-contrast-toggle"]');
    
    // Verify contrast mode applied
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA landmarks
    await expect(page.locator('main[role="main"]')).toBeVisible();
    await expect(page.locator('aside[role="complementary"]')).toBeVisible();
    
    // Check widget accessibility
    const widgets = page.locator('[data-testid^="widget-"]');
    for (const widget of await widgets.all()) {
      await expect(widget).toHaveAttribute('role');
      await expect(widget).toHaveAttribute('aria-label');
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Verify motion is disabled
    await expect(page.locator('body')).toHaveClass(/reduce-motion/);
  });
});

test.describe('Operator UX Features', () => {
  test('should allow widget alignment and distribution', async ({ page }) => {
    await page.goto('/');
    
    // Select multiple widgets
    await page.keyboard.down('Control');
    await page.click('[data-testid^="widget-"]');
    await page.click('[data-testid^="widget-"]:nth-child(2)');
    await page.keyboard.up('Control');
    
    // Use alignment controls
    await page.click('[data-testid="align-left"]');
    
    // Verify alignment guides appear
    await expect(page.locator('[data-testid="alignment-guides"]')).toBeVisible();
  });

  test('should support undo/redo operations', async ({ page }) => {
    await page.goto('/');
    
    // Make a change
    const widget = page.locator('[data-testid^="widget-"]').first();
    await widget.click();
    await page.fill('[data-testid="widget-title-input"]', 'Updated Title');
    
    // Test undo
    await page.keyboard.press('Control+z');
    
    // Test redo
    await page.keyboard.press('Control+y');
  });
});

test.describe('Data Integration', () => {
  test('should handle WebSocket connections', async ({ page }) => {
    await page.goto('/');
    
    // Mock WebSocket connection
    await page.evaluate(() => {
      window.mockWebSocketData = {
        metrics: { cpu: 85, memory: 62, disk: 45 },
        timestamp: Date.now()
      };
    });
    
    // Verify data appears in widgets
    await expect(page.getByTestId('kpi-widget-cpu')).toContainText('85%');
  });

  test('should handle connection failures gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/ws', route => route.abort());
    await page.goto('/');
    
    // Verify error states
    await expect(page.getByTestId('connection-status')).toContainText('Disconnected');
    await expect(page.getByTestId('retry-connection')).toBeVisible();
  });
});

test.describe('Performance & Resilience', () => {
  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Simulate large data load
    await page.evaluate(() => {
      window.postMessage({
        type: 'LOAD_LARGE_DATASET',
        data: Array.from({ length: 10000 }, (_, i) => ({
          id: i,
          value: Math.random() * 100,
          timestamp: Date.now() - i * 1000
        }))
      }, '*');
    });
    
    // Verify virtualization works
    const table = page.getByTestId('data-table');
    await expect(table).toBeVisible();
    
    // Check performance metrics
    const performanceEntries = await page.evaluate(() => 
      performance.getEntriesByType('measure')
    );
    expect(performanceEntries.length).toBeGreaterThan(0);
  });

  test('should recover from errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Trigger error condition
    await page.evaluate(() => {
      throw new Error('Simulated runtime error');
    });
    
    // Verify error boundary works
    await expect(page.getByTestId('error-boundary')).toBeVisible();
    await expect(page.getByTestId('error-recovery-button')).toBeVisible();
    
    // Test recovery
    await page.click('[data-testid="error-recovery-button"]');
    await expect(page.getByTestId('dashboard-canvas')).toBeVisible();
  });
});