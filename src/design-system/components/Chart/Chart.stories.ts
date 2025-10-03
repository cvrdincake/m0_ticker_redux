import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from './Chart';

// Sample data for stories
const sampleData = [
  { x: 0, y: 100 },
  { x: 1, y: 120 },
  { x: 2, y: 90 },
  { x: 3, y: 140 },
  { x: 4, y: 110 },
  { x: 5, y: 180 },
  { x: 6, y: 160 },
  { x: 7, y: 200 }
];

const volatileData = [
  { x: 0, y: 100 },
  { x: 1, y: 150 },
  { x: 2, y: 80 },
  { x: 3, y: 220 },
  { x: 4, y: 60 },
  { x: 5, y: 180 },
  { x: 6, y: 90 },
  { x: 7, y: 240 },
  { x: 8, y: 50 },
  { x: 9, y: 190 }
];

const trendingUpData = Array.from({ length: 10 }, (_, i) => ({
  x: i,
  y: 100 + (i * 15) + (Math.random() * 20 - 10) // Upward trend with noise
}));

const meta: Meta<typeof Chart> = {
  title: 'Design System/Components/Chart',
  component: Chart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'MonochromeLineChart component for displaying data trends with animated path drawing and responsive design.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data points with x and y coordinates'
    },
    width: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Chart width in pixels'
    },
    height: {
      control: { type: 'range', min: 100, max: 400, step: 25 },
      description: 'Chart height in pixels'
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 5, step: 0.5 },
      description: 'Line stroke width'
    },
    animated: {
      control: 'boolean',
      description: 'Enable path drawing animation'
    },
    showGrid: {
      control: 'boolean',
      description: 'Show background grid'
    },
    showDots: {
      control: 'boolean',
      description: 'Show data point dots'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic chart stories
export const Default: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 200,
    strokeWidth: 2,
    animated: true,
    showGrid: false,
    showDots: false
  }
};

export const WithGrid: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 200,
    strokeWidth: 2,
    animated: true,
    showGrid: true,
    showDots: false
  }
};

export const WithDataPoints: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 200,
    strokeWidth: 2,
    animated: true,
    showGrid: true,
    showDots: true
  }
};

// Size variations
export const Large: Story = {
  args: {
    data: volatileData,
    width: 600,
    height: 300,
    strokeWidth: 3,
    animated: true,
    showGrid: true,
    showDots: false
  }
};

export const Small: Story = {
  args: {
    data: sampleData,
    width: 200,
    height: 100,
    strokeWidth: 1.5,
    animated: true,
    showGrid: false,
    showDots: false
  }
};

// Data pattern variations
export const VolatileData: Story = {
  args: {
    data: volatileData,
    width: 400,
    height: 200,
    strokeWidth: 2,
    animated: true,
    showGrid: true,
    showDots: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart displaying volatile data with high variance between points.'
      }
    }
  }
};

export const TrendingUp: Story = {
  args: {
    data: trendingUpData,
    width: 400,
    height: 200,
    strokeWidth: 2.5,
    animated: true,
    showGrid: true,
    showDots: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart showing an upward trending dataset with minor variations.'
      }
    }
  }
};

// Motion testing
export const WithoutAnimation: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 200,
    strokeWidth: 2,
    animated: false,
    showGrid: true,
    showDots: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with animation disabled for reduced motion preferences.'
      }
    }
  }
};

export const MotionShowcase: Story = {
  args: {
    data: trendingUpData,
    width: 500,
    height: 250,
    strokeWidth: 3,
    animated: true,
    showGrid: true,
    showDots: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Full animation showcase - reload to see the path drawing effect.'
      }
    }
  }
};

// Density variations
export const Dense: Story = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: 100 + Math.sin(i * 0.5) * 50 + (Math.random() * 20 - 10)
    })),
    width: 400,
    height: 150,
    strokeWidth: 1.5,
    animated: true,
    showGrid: true,
    showDots: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Dense chart with many data points showing smooth curve interpolation.'
      }
    }
  }
};

// Skeleton loading state
export const Skeleton: Story = {
  args: {
    data: [
      { x: 0, y: 100 },
      { x: 1, y: 100 },
      { x: 2, y: 100 },
      { x: 3, y: 100 },
      { x: 4, y: 100 }
    ],
    width: 400,
    height: 200,
    strokeWidth: 8,
    animated: false,
    showGrid: false,
    showDots: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton state showing a flat line as a loading placeholder.'
      }
    }
  }
};