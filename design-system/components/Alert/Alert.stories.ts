import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Design System/Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Alert component for displaying contextual feedback messages with support for different variants and motion preferences.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Alert severity level'
    },
    title: {
      control: 'text',
      description: 'Alert title text'
    },
    children: {
      control: 'text',
      description: 'Alert message content'
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed'
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback when alert is dismissed'
    },
    dense: {
      control: 'boolean',
      description: 'Compact alert styling'
    },
    animated: {
      control: 'boolean',
      description: 'Enable entrance animation'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic alert stories
export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'This is an informational alert message.',
    dismissible: false,
    animated: true
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your action was completed successfully.',
    dismissible: false,
    animated: true
  }
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review the following information carefully.',
    dismissible: false,
    animated: true
  }
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'An error occurred while processing your request.',
    dismissible: false,
    animated: true
  }
};

// Interactive stories
export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'Dismissible Alert',
    children: 'This alert can be dismissed by clicking the close button.',
    dismissible: true,
    animated: true
  }
};

export const Dense: Story = {
  args: {
    variant: 'warning',
    title: 'Compact Alert',
    children: 'This is a dense alert with reduced padding.',
    dismissible: true,
    dense: true,
    animated: true
  }
};

// Motion testing stories
export const WithoutAnimation: Story = {
  args: {
    variant: 'success',
    title: 'No Animation',
    children: 'This alert appears without entrance animation.',
    dismissible: false,
    animated: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert with animation disabled, useful for reduced motion preferences.'
      }
    }
  }
};

export const MotionShowcase: Story = {
  args: {
    variant: 'info',
    title: 'Motion Test',
    children: 'This story demonstrates the entrance animation. Reload to see the effect.',
    dismissible: true,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Full animation showcase - reload the story to see the entrance effect.'
      }
    }
  }
};

// Content variations
export const LongContent: Story = {
  args: {
    variant: 'warning',
    title: 'Extended Alert Message',
    children: 'This is a longer alert message that demonstrates how the component handles multiple lines of text content. It should wrap properly and maintain readable spacing.',
    dismissible: true,
    animated: true
  }
};

export const NoTitle: Story = {
  args: {
    variant: 'error',
    children: 'Alert message without a title.',
    dismissible: false,
    animated: true
  }
};

// Skeleton state for loading
export const Skeleton: Story = {
  args: {
    variant: 'info',
    title: 'Loading...',
    children: '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    dismissible: false,
    animated: false,
    dense: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state using block characters to simulate loading content.'
      }
    }
  }
};