import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('recharts')) return 'recharts'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
          if (id.includes('bootstrap')) return 'bootstrap-vendor'
          return undefined
        },
      },
    },
  },
})
