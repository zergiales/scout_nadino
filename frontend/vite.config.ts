/// <reference types="vitest" />

import { defineConfig, type Plugin } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

/**
 * Solo para `npm run dev`: que el contenido de src/content se vea siempre
 * al día. Sin esto pasaban dos cosas, las dos sin ningún error:
 *
 * 1. Analog arma la lista de ficheros de contenido DENTRO de su módulo
 *    (analogjs-content.mjs), y Vite sirve ese módulo con caché «immutable»
 *    de un año. El navegador se quedaba con la lista vieja: el servidor
 *    pintaba las ramas y las noticias, y al arrancar Angular desaparecían.
 *    Se sirven sin caché.
 * 2. Esa lista se arma al arrancar: un .md nuevo (p. ej. creado desde el
 *    backoffice) no salía hasta reiniciar. Al crear o borrar uno, se
 *    invalidan los módulos de Analog y se recarga la página.
 */
function contenidoSiempreAlDia(): Plugin {
  const esDeAnalog = (ruta: string) => /[\\/]@analogjs[\\/](content|router)[\\/]/.test(ruta);

  return {
    name: 'nadino:contenido-siempre-al-dia',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && esDeAnalog(req.url)) {
          const ponerCabecera = res.setHeader.bind(res);
          res.setHeader = (nombre, valor) =>
            ponerCabecera(nombre, nombre.toLowerCase() === 'cache-control' ? 'no-cache' : valor);
        }
        next();
      });

      const alCrearOBorrar = (fichero: string) => {
        if (!/[\\/]src[\\/]content[\\/].+\.md$/.test(fichero)) return;
        for (const entorno of Object.values(server.environments)) {
          for (const modulo of entorno.moduleGraph.idToModuleMap.values()) {
            if (modulo.id && esDeAnalog(modulo.id)) entorno.moduleGraph.invalidateModule(modulo);
          }
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', alCrearOBorrar);
      server.watcher.on('unlink', alCrearOBorrar);
    },
  };
}

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
          '/acceso',
          '/legal/aviso-legal',
          '/legal/privacidad',
          '/legal/cookies',
          '/legal/accesibilidad',
        ],
      },
    }),
    tailwindcss(),
    contenidoSiempreAlDia(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
