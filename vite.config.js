import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  publicDir: 'public', // Explicitly define the public directory
  plugins: [
    laravel({
      input: ['resources/js/src/main.tsx'],
      refresh: true,
    }),
    react(),
  ],
});
