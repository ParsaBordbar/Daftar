import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.VITE_BASE ?? '/daftar/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webp,webmanifest}'],

        globIgnores: ['brand/**', 'og-image.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'daftar-fonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 60, maxAgeSeconds: 365 * 24 * 3600 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://cdn.jsdelivr.net' && url.pathname.startsWith('/gh/ganjoor/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'daftar-ganjoor',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 24 * 3600 },
            },
          },
        ],
      },
    }),
  ],
})
