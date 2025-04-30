import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    fs: {
        // Explicitly deny access to sensitive directories
        deny: [
            '/.env',          // Deny access to environment files
            '/node_modules',  // Deny access to node_modules
            '/.git',          // Deny access to Git metadata
            '/etc',           // Deny access to system configuration files
            '/usr',           // Deny access to system directories
        ],
    },
},
})
