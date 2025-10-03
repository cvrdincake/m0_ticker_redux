import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.story.@(js|jsx|ts|tsx)'
  ],
  
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport'
  ],
  
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation'
  },
  
  viteFinal: async (config) => {
    // Merge with our Vite config
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('../src', import.meta.url).pathname,
      '@/components': new URL('../src/components', import.meta.url).pathname,
      '@/design-system': new URL('../src/design-system', import.meta.url).pathname,
      '@/utils': new URL('../src/utils', import.meta.url).pathname,
      '@/hooks': new URL('../src/hooks', import.meta.url).pathname,
      '@/store': new URL('../src/store', import.meta.url).pathname
    };
    
    return config;
  }
};

export default config;