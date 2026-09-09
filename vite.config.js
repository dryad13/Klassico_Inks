import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imagetools()],
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Keep the WebGL stack in one chunk so the lazy hero pulls a single
          // request, and so it never lands in the entry bundle.
          if (/node_modules\/(three|@react-three|postprocessing)/.test(id)) return 'webgl'
          if (id.includes('framer-motion')) return 'motion'
          if (/node_modules\/(react|react-dom|react-router|react-helmet-async|scheduler)\//.test(id))
            return 'react'
        },
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/.tmp/**', '**/design-system/**'],
    },
  },
})
