import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // @ts-expect-error vite-plugin-compression types mismatch
    viteCompression({ algorithm: 'brotliCompress' }),
    // @ts-expect-error vite-plugin-compression types mismatch
    viteCompression({ algorithm: 'gzip' }),
    visualizer({ open: false })
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            return 'vendor-others';
          }
        }
      }
    }
  }
})
