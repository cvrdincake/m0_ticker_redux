import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/design-system/components'),
      '@/patterns': path.resolve(__dirname, './src/design-system/patterns'),
      '@/primitives': path.resolve(__dirname, './src/design-system/primitives'),
      '@/tokens': path.resolve(__dirname, './src/design-system/tokens'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks')
    }
  }
})