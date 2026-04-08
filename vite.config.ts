import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    VitePWA({
      manifest: {
        name: "Cook'UP",          // Nom complet sous l'icône
        short_name: "Cook'UP",    // Nom court si l'espace est limité
        icons: [
          {
            src: 'logo_app.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Très important pour Android (icônes adaptatives)
          }
        ]
      }
    })
  ],
})
