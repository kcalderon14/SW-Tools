import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import redirectTestPlugin from './server/vitePlugin.js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    redirectTestPlugin(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
