import { AnimatedList } from './AnimatedList';

export default {
  title: 'Components/List/AnimatedList',
  component: AnimatedList,
  parameters: {
    docs: {
      description: {
        component: 'Staggered list animation with performance limits and reduced-motion support.'
      }
    }
  },
  argTypes: {
    staggerDelay: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Delay between item animations in seconds'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--surface-canvas)' }}>
        <Story />
      </div>
    )
  ]
};

const sampleItems = [
  { id: 1, content: 'First item with some content' },
  { id: 2, content: 'Second item' },
  { id: 3, content: 'Third item with longer text content that spans multiple words' },
  { id: 4, content: 'Fourth item' },
  { id: 5, content: 'Fifth item (last animated)' }
];

const longList = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  content: `Item ${i + 1} - ${i < 5 ? 'Animated' : 'Instant appearance'}`
}));

export const Default = {
  args: {
    items: sampleItems,
    staggerDelay: 0.04
  }
};

export const LongList = {
  args: {
    items: longList,
    staggerDelay: 0.04
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows performance limiting: only first 5 items animate, rest appear instantly.'
      }
    }
  }
};

export const FastStagger = {
  args: {
    items: sampleItems,
    staggerDelay: 0.02
  }
};

export const SlowStagger = {
  args: {
    items: sampleItems,
    staggerDelay: 0.08
  }
};

export const SingleItem = {
  args: {
    items: [{ id: 1, content: 'Single item' }]
  }
};

export const EmptyList = {
  args: {
    items: []
  }
};

// Reduced motion decorator
export const ReducedMotion = {
  args: {
    items: sampleItems,
    staggerDelay: 0.04
  },
  decorators: [
    (Story) => {
      // Mock reduced motion preference
      const originalMatches = window.matchMedia;
      window.matchMedia = (query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
      });
      
      // Add reduce-motion class
      document.documentElement.classList.add('reduce-motion');
      
      return (
        <div style={{ padding: '2rem', background: 'var(--surface-canvas)' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--ink-subtle)', fontSize: '0.875rem' }}>
            ⚡ Reduced motion: Items appear instantly without animation
          </p>
          <Story />
        </div>
      );
    }
  ],
  play: async ({ canvasElement }) => {
    // Cleanup after story
    return () => {
      document.documentElement.classList.remove('reduce-motion');
      // Restore original matchMedia if needed
    };
  }
};