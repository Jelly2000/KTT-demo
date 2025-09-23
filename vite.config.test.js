import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    // Fix for CI environment compatibility
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Handle environment variables properly
    env: {
      NODE_ENV: 'test'
    }
  },
});