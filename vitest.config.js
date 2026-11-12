import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    testTimeout: 15000,
    exclude: ['**/node_modules/**', '**/dist/**', '**/src/_parked/**'],
  },
})
