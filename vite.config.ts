import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must match the GitHub Pages repo name, e.g. '/daftar/'.
// Override at build time:  VITE_BASE=/my-repo/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/daftar/',
  plugins: [react(), tailwindcss()],
})
