import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive button component with multiple variants and states.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
      description: 'Button style variant'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner'
    }
  }
};

export const Default = {
  args: {
    children: 'Button'
  }
};

export const Variants = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Button>Normal</Button>
    <Button disabled>Disabled</Button>
    <Button loading>Loading</Button>
  </div>
);

export const Interactive = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!')
  }
};

// Dark theme variant
export const DarkTheme = {
  args: {
    children: 'Dark Button'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};