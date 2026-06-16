import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Split CSS per chunk so each page only loads the styles it needs
    cssCodeSplit: true,

    // Target modern browsers — generates smaller output
    target: 'es2020',

    // Warn only for chunks > 500 KB (reasonable threshold for a Recharts app)
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         *  - vendor-react  : react + react-dom (small, stable, cached long-term)
         *  - vendor-charts : recharts + its deps (large but infrequently updated)
         *  - Everything else lands in the default app chunk.
         */
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
            return 'vendor-charts'
          }
        },
      },
    },
  },

  // Optimise dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})
