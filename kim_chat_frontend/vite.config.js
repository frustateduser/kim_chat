import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@helper': path.resolve(__dirname, './src/helper'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    fs: {
      // Explicitly deny access to sensitive directories
      deny: [
        '/.env', // Deny access to environment files
        '/node_modules', // Deny access to node_modules
        '/.git', // Deny access to Git metadata
        '/etc', // Deny access to system configuration files
        '/usr', // Deny access to system directories
      ],
    },
    allowedHosts: ['frustateduser.ddns.net'],
  },
});
