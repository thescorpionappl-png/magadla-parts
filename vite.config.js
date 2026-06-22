import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/magadla-parts/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
