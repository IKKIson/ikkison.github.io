import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // GitHub Pages용 (루트 경로로 변경)
  plugins: [react()],
})
