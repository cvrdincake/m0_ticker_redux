import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/components': path.resolve(__dirname, '../src/design-system/components'),
        '@/patterns': path.resolve(__dirname, '../src/design-system/patterns'),
        '@/primitives': path.resolve(__dirname, '../src/design-system/primitives'),
        '@/tokens': path.resolve(__dirname, '../src/design-system/tokens'),
        '@/lib': path.resolve(__dirname, '../src/lib'),
        '@/hooks': path.resolve(__dirname, '../src/hooks')
      };
    }
    return config;
  },
};

export default config;