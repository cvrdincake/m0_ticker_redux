import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedList } from './AnimatedList';

// Sample data for stories
const sampleItems = [
  { id: 1, content: 'First item in the list' },
  { id: 2, content: 'Second item with longer content text' },
  { id: 3, content: 'Third item' },
  { id: 4, content: 'Fourth item with even more extended content that wraps to multiple lines' },
  { id: 5, content: 'Fifth item' }
];

const manyItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  content: `Item ${i + 1} - ${i % 3 === 0 ? 'Extended content with more text' : 'Short content'}`
}));

const tickerItems = [
  { id: 'btc', content: 'BTC: $45,234.56 (+2.4%)' },
  { id: 'eth', content: 'ETH: $3,128.90 (-1.2%)' },
  { id: 'ada', content: 'ADA: $0.4521 (+5.7%)' },
  { id: 'dot', content: 'DOT: $6.789 (+0.8%)' },
  { id: 'sol', content: 'SOL: $98.45 (+12.3%)' }
];

const meta: Meta<typeof AnimatedList> = {
  title: 'Design System/Components/List',
  component: AnimatedList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AnimatedList component for displaying items with staggered entrance animations and motion-aware rendering.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of items to display'
    },
    staggerDelay: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Delay between item animations in seconds'
    },
    maxVisible: {
      control: { type: 'range', min: 3, max: 15, step: 1 },
      description: 'Maximum number of items to animate'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    },
    animated: {
      control: 'boolean',
      description: 'Enable stagger animation'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic list stories
export const Default: Story = {
  args: {
    items: sampleItems,
    staggerDelay: 0.04,
    maxVisible: 5,
    animated: true
  }
};

export const TickerStyle: Story = {
  args: {
    items: tickerItems,
    staggerDelay: 0.06,
    maxVisible: 5,
    animated: true,
    className: 'ticker-list'
  },
  parameters: {
    docs: {
      description: {
        story: 'List styled for ticker data display with financial information.'
      }
    }
  }
};

// Animation variations
export const FastAnimation: Story = {
  args: {
    items: sampleItems,
    staggerDelay: 0.02,
    maxVisible: 5,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'List with faster stagger animation for quick reveals.'
      }
    }
  }
};

export const SlowAnimation: Story = {
  args: {
    items: sampleItems,
    staggerDelay: 0.1,
    maxVisible: 5,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'List with slower stagger animation for dramatic effect.'
      }
    }
  }
};

export const WithoutAnimation: Story = {
  args: {
    items: sampleItems,
    staggerDelay: 0.04,
    maxVisible: 5,
    animated: false
  },
  parameters: {
    docs: {
      description: {
        story: 'List with animation disabled for reduced motion preferences.'
      }
    }
  }
};

// Density variations
export const ManyItems: Story = {
  args: {
    items: manyItems,
    staggerDelay: 0.03,
    maxVisible: 8,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'List with many items showing partial animation and instant display for remaining items.'
      }
    }
  }
};

export const LimitedVisible: Story = {
  args: {
    items: manyItems,
    staggerDelay: 0.05,
    maxVisible: 3,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'List with limited animated items - only first 3 items animate, rest appear instantly.'
      }
    }
  }
};

// Content variations
export const EmptyList: Story = {
  args: {
    items: [],
    staggerDelay: 0.04,
    maxVisible: 5,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty list state.'
      }
    }
  }
};

export const SingleItem: Story = {
  args: {
    items: [{ id: 1, content: 'Single item in the list' }],
    staggerDelay: 0.04,
    maxVisible: 5,
    animated: true
  }
};

// Using children instead of items prop
export const WithChildren: Story = {
  render: (args) => (
    <AnimatedList {...args}>
      <li>Custom child item 1</li>
      <li>Custom child item 2</li>
      <li>Custom child item 3</li>
      <li>Custom child item 4</li>
    </AnimatedList>
  ),
  args: {
    staggerDelay: 0.05,
    maxVisible: 4,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'List using children prop instead of items array for custom content structure.'
      }
    }
  }
};

// Skeleton loading state
export const Skeleton: Story = {
  args: {
    items: [
      { id: 1, content: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■' },
      { id: 2, content: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■' },
      { id: 3, content: '■■■■■■■■■■■■■■■■■■■■■■■■' },
      { id: 4, content: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■' },
      { id: 5, content: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■' }
    ],
    staggerDelay: 0.02,
    maxVisible: 5,
    animated: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state using block characters to simulate loading content.'
      }
    }
  }
};