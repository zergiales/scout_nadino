/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      static: true,
      content: {
        highlighter: 'shiki',
      },
      prerender: {
        // Cada ruta nueva hay que añadirla aquí o no se prerenderizará.
        routes: [
          '/',
          '/conocenos',
          '/ramas',
          '/preinscripcion',
          '/contacto',
          '/eventos',
          '/eventos/joti-2026',
          '/documentos',
          '/legal/aviso-legal',
          '/legal/privacidad',
          '/legal/cookies',
          '/legal/accesibilidad',
        ],
      },
    }),
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
