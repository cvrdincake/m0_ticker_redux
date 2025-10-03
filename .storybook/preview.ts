import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Import design tokens
import '../src/design-system/tokens/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    
    docs: {
      theme: {
        base: 'dark',
        colorPrimary: '#ffffff',
        colorSecondary: '#a3a3a3',
        appBg: '#0a0a0a',
        appContentBg: '#0a0a0a',
        appBorderColor: '#1a1a1a',
        textColor: '#ffffff',
        textInverseColor: '#0a0a0a',
        barTextColor: '#a3a3a3',
        barSelectedColor: '#ffffff',
        barBg: '#000000',
        inputBg: '#1a1a1a',
        inputBorder: '#242424',
        inputTextColor: '#ffffff',
        inputBorderRadius: 4,
      }
    },
    
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'surface',
          value: '#1a1a1a',
        },
        {
          name: 'black',
          value: '#000000',
        }
      ],
    },
    
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        dashboard: {
          name: 'Dashboard',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        ultrawide: {
          name: 'Ultrawide',
          styles: {
            width: '2560px',
            height: '1080px',
          },
        },
      },
    },
    
    // Accessibility testing
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            options: {
              noScroll: true,
            },
          },
        ],
      },
    },
  },
  
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'monochrome',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'monochrome', title: 'Monochrome' }
        ],
        dynamicTitle: true,
      },
    },
    
    motion: {
      description: 'Animation preferences',
      defaultValue: 'normal',
      toolbar: {
        title: 'Motion',
        icon: 'play',
        items: [
          { value: 'normal', title: 'Normal' },
          { value: 'reduced', title: 'Reduced' }
        ],
        dynamicTitle: true,
      },
    },
  },
  
  decorators: [
    (Story, context) => {
      const { motion } = context.globals;
      
      // Apply reduced motion class if needed
      if (motion === 'reduced') {
        document.documentElement.style.setProperty('--duration-instant', '0ms');
        document.documentElement.style.setProperty('--duration-fast', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
        document.documentElement.style.setProperty('--duration-slow', '0ms');
        document.documentElement.style.setProperty('--duration-slower', '0ms');
      } else {
        document.documentElement.style.removeProperty('--duration-instant');
        document.documentElement.style.removeProperty('--duration-fast');
        document.documentElement.style.removeProperty('--duration-normal');
        document.documentElement.style.removeProperty('--duration-slow');
        document.documentElement.style.removeProperty('--duration-slower');
      }
      
      return Story();
    },
  ],
};

export default preview;