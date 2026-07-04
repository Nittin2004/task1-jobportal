import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Shows ESLint errors (missing semicolons, undefined vars, etc.) 
    // directly in the browser overlay — not just in the terminal
    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: ['node_modules'],
      failOnError: false,   // Don't crash build, just show overlay
      failOnWarning: false,
    }),
  ],
  server: {
    hmr: {
      overlay: true, // Ensure Vite's error overlay is always shown
    },
  },
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
})
