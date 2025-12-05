import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // GitHub Pages용 (루트 경로로 변경)
  plugins: [
    react(),
    sitemap({
      hostname: 'https://ikkison.github.io',
    }),
  ],
})
