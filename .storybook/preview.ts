import type { Preview } from '@storybook/react';
import '@/design-system/tokens/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    docs: {
      theme: {
        colorPrimary: '#ffffff',
        colorSecondary: '#a3a3a3',
        appBg: '#0a0a0a',
        appContentBg: '#1a1a1a',
        textColor: '#ffffff',
      },
    },
  },
};

export default preview;