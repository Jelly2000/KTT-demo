import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          utils: ['react-router-dom', 'react-i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  // Optimize asset handling
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.webp'],
  server: {
    // Enable HTTP/2 for better concurrent loading
    https: false,
  }
})
