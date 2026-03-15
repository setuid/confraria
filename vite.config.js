import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Em produção (GitHub Pages), a base é /confraria/
  // Em desenvolvimento local, é /
  base: process.env.NODE_ENV === 'production' ? '/confraria/' : '/',
  server: {
    port: 3000,
  },
})
