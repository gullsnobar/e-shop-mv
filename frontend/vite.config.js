import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@material-ui/core': path.resolve(__dirname, './src/shims/material-ui-core.jsx'),
      '@material-ui/data-grid': path.resolve(__dirname, './src/shims/material-ui-data-grid.jsx'),
    }
  },
  server: {
    port: 5173,
    open: true
  },
})