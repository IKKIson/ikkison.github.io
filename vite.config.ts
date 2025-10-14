import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/ikkison.github.io/', // GitHub Pages용
  plugins: [react()],
})
