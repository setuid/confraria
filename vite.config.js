import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Em produção (GitHub Pages), a base é /confraria/
  // Em desenvolvimento local, é /
  base: mode === 'production' ? '/confraria/' : '/',
  server: {
    port: 3000,
  },
}))
