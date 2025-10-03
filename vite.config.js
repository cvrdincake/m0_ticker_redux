import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/design-system/components'),
      '@/patterns': resolve(__dirname, './src/design-system/patterns'),
      '@/primitives': resolve(__dirname, './src/design-system/primitives'),
      '@/tokens': resolve(__dirname, './src/design-system/tokens'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/store': resolve(__dirname, './src/store'),
      '@/pages': resolve(__dirname, './src/pages')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          charts: ['recharts']
        }
      }
    }
  }
});