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
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@api', replacement: path.resolve(__dirname, './src/api') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@context', replacement: path.resolve(__dirname, './src/context') },
      { find: '@helper', replacement: path.resolve(__dirname, './src/helper') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
    ],
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
