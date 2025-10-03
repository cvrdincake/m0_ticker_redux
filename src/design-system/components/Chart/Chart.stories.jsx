import Chart from './Chart';

export default {
  title: 'Components/Chart',
  component: Chart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Monochrome data visualization component for metrics and analytics.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Chart title'
    },
    height: {
      control: { type: 'number', min: 200, max: 600 },
      description: 'Chart height in pixels'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    },
    error: {
      control: 'text',
      description: 'Error message'
    }
  }
};

const sampleData = [
  { name: 'Jan', value: 400, target: 450 },
  { name: 'Feb', value: 300, target: 350 },
  { name: 'Mar', value: 600, target: 550 },
  { name: 'Apr', value: 800, target: 750 },
  { name: 'May', value: 700, target: 720 },
  { name: 'Jun', value: 900, target: 850 }
];

const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
  name: `${i}:00`,
  value: Math.floor(Math.random() * 100) + 50
}));

export const Default = {
  args: {
    data: sampleData,
    title: 'Monthly Performance'
  }
};

export const TimeSeries = {
  args: {
    data: timeSeriesData,
    title: '24-Hour Activity',
    height: 250
  }
};

export const Loading = {
  args: {
    loading: true,
    title: 'Loading Chart'
  }
};

export const Error = {
  args: {
    error: 'Failed to load chart data',
    title: 'Error State'
  }
};

export const CustomHeight = {
  args: {
    data: sampleData,
    title: 'Custom Height Chart',
    height: 400
  }
};

export const MinimalData = {
  args: {
    data: [
      { name: 'A', value: 100 },
      { name: 'B', value: 200 }
    ],
    title: 'Minimal Dataset'
  }
};

export const EmptyData = {
  args: {
    data: [],
    title: 'No Data Available'
  }
};

// Dark theme variant
export const DarkTheme = {
  args: {
    data: sampleData,
    title: 'Dark Theme Chart'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};