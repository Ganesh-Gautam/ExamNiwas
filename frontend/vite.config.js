import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve : {
    alias : {
      '@' : path.resolve(rootDir, './src'),
      'lucide-react': path.resolve(rootDir, "./src/lib/lucide-react.jsx")
    },

  },
  server : {
    port : 5173,
    proxy : {
      '/api' : {
        target : 'https://exam-niwas.vercel.app/',
        changeOrigin : true,
      }
    }
  }
})
