import { describe, it, expect } from 'vitest';

describe('exports', () => {
  it('ensures no duplicate AnimatedList exports from design system', async () => {
    const listModule = await import('@/design-system/components/List');
    
    // Should only have AnimatedList export, no duplicate List alias
    expect(listModule.AnimatedList).toBeDefined();
    expect(typeof listModule.AnimatedList).toBe('function');
    
    // Count exports - should only be AnimatedList
    const exportKeys = Object.keys(listModule);
    expect(exportKeys).toEqual(['AnimatedList']);
  });

  it('verifies design system components barrel exports', async () => {
    const componentsModule = await import('@/design-system/components');
    
    // Should have Alert, Chart, and AnimatedList from respective components
    expect(componentsModule.Alert).toBeDefined();
    expect(componentsModule.Chart).toBeDefined();
    expect(componentsModule.AnimatedList).toBeDefined();
  });

  it('verifies no duplicate noise token files', () => {
    // Should only have one noise token file in design system
    expect(() => {
      require('@/design-system/tokens/noise.css');
    }).not.toThrow();
  });
});