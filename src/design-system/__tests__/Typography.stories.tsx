import { Meta, Story } from '@storybook/react';

export default {
  title: 'Design System/Typography & Density',
  parameters: {
    docs: {
      description: {
        component: 'Demonstrates the Type Scale and Density Scale system.',
      },
    },
  },
} as Meta;

export const TypeScale: Story = () => (
  <div style={{ padding: '2rem', background: 'var(--surface)', color: 'var(--ink)' }}>
    <h1>Type Scale Showcase</h1>
    
    <section style={{ marginBottom: '3rem' }}>
      <h2>Display Scale (Monospace/Tech)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="display-xl">Display XL - 48px - BRB titles</div>
        <div className="display-lg">Display LG - 24px - Hero numbers</div>
        <div className="display-md">Display MD - 16px - KPI values</div>
        <div className="display-sm">Display SM - 12px - Metrics, timestamps</div>
        <div className="display-xs">Display XS - 10px - Micro data labels</div>
      </div>
    </section>

    <section style={{ marginBottom: '3rem' }}>
      <h2>Body Scale (Geometric Sans)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="body-xl">Body XL - 18px - Section headers</div>
        <div className="body-lg">Body LG - 15px - Emphasis, readable paragraphs</div>
        <div className="body-md">Body MD - 13px - Baseline UI text</div>
        <div className="body-sm">Body SM - 11px - Helper text, captions</div>
        <div className="body-xs caps">Body XS - 9px - UPPERCASE LABELS</div>
      </div>
    </section>

    <section>
      <h2>Semantic Headings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1>Heading 1 - Display XL with monospace</h1>
        <h2>Heading 2 - Display LG with monospace</h2>
        <h3>Heading 3 - Display MD with monospace</h3>
        <h4>Heading 4 - Body XL with sans</h4>
        <h5>Heading 5 - Body LG with sans</h5>
        <h6>Heading 6 - Body SM UPPERCASE</h6>
      </div>
    </section>
  </div>
);

export const DensityScale: Story = () => (
  <div style={{ padding: '2rem', background: 'var(--surface)', color: 'var(--ink)' }}>
    <h1>Density Scale Showcase</h1>
    
    <section style={{ marginBottom: '3rem' }}>
      <h2>Compact Density</h2>
      <div className="density-compact" style={{ border: '1px solid var(--border)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
        <div className="p-xs" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XS (2px)</div>
        <div className="p-sm" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding SM (4px)</div>
        <div className="p-md" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding MD (8px)</div>
        <div className="p-lg" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding LG (12px)</div>
        <div className="p-xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XL (16px)</div>
        <div className="p-2xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding 2XL (24px)</div>
      </div>
    </section>

    <section style={{ marginBottom: '3rem' }}>
      <h2>Comfortable Density (Default)</h2>
      <div className="density-comfortable" style={{ border: '1px solid var(--border)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
        <div className="p-xs" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XS (4px)</div>
        <div className="p-sm" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding SM (8px)</div>
        <div className="p-md" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding MD (16px)</div>
        <div className="p-lg" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding LG (24px)</div>
        <div className="p-xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XL (32px)</div>
        <div className="p-2xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding 2XL (48px)</div>
      </div>
    </section>

    <section>
      <h2>Relaxed Density</h2>
      <div className="density-relaxed" style={{ border: '1px solid var(--border)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
        <div className="p-xs" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XS (8px)</div>
        <div className="p-sm" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding SM (16px)</div>
        <div className="p-md" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding MD (24px)</div>
        <div className="p-lg" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding LG (40px)</div>
        <div className="p-xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding XL (64px)</div>
        <div className="p-2xl" style={{ background: 'var(--surface-lift)', margin: 'var(--spacing-xs)' }}>Padding 2XL (80px)</div>
      </div>
    </section>
  </div>
);

export const ComponentShowcase: Story = () => (
  <div style={{ padding: '2rem', background: 'var(--surface)', color: 'var(--ink)' }}>
    <h1>Components with New Typography & Density</h1>
    
    <section style={{ marginBottom: '3rem' }}>
      <h2>Button Sizes</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="button button--primary button--sm">Small</button>
        <button className="button button--primary button--md">Medium</button>
        <button className="button button--primary button--lg">Large</button>
      </div>
      
      <h3>Density Contexts</h3>
      <div className="density-compact" style={{ marginBottom: '1rem' }}>
        <p className="body-sm">Compact:</p>
        <button className="button button--primary button--sm">Small</button>
      </div>
      
      <div className="density-comfortable" style={{ marginBottom: '1rem' }}>
        <p className="body-sm">Comfortable:</p>
        <button className="button button--primary button--sm">Small</button>
      </div>
      
      <div className="density-relaxed">
        <p className="body-sm">Relaxed:</p>
        <button className="button button--primary button--sm">Small</button>
      </div>
    </section>

    <section>
      <h2>Typography Helpers</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p className="mono">Monospace: Technical data display</p>
        <p className="sans">Sans-serif: Body text reading</p>
        <p className="caps">All caps text with tracking</p>
        <p className="measure-60">
          This paragraph demonstrates the 60-character measure utility class for optimal reading width. 
          The measure ensures comfortable line lengths for sustained reading across various screen sizes.
        </p>
        <div className="truncate-2" style={{ width: '200px' }}>
          This is a long text that will be truncated to exactly two lines using the new truncate-2 utility class. 
          Any additional content beyond these two lines will be hidden with an ellipsis.
        </div>
      </div>
    </section>
  </div>
);