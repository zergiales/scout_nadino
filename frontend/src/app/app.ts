import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './layout/header';
import { Footer } from './layout/footer';

/**
 * Shell de la web: skip link, cabecera, contenido y pie. Cada página pone su
 * propio `<h1>` dentro del `<main>`; aquí no hay ninguno.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  // Sin bloque `styles:` a propósito: los estilos en línea de un componente se
  // compilan como módulo virtual y vitest no sabe resolverlos, así que el
  // layout va con utilidades de Tailwind como el resto del proyecto.
  template: `
    <!-- overflow-x-clip: los fondos difuminados de las páginas no deben
         provocar scroll horizontal. clip, no hidden, para no romper el
         sticky de la cabecera. -->
    <div class="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#contenido"
        class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-marca focus:px-4 focus:py-2 focus:font-semibold focus:text-sobre-marca"
      >
        Saltar al contenido principal
      </a>

      <app-header />

      <main
        id="contenido"
        tabindex="-1"
        class="mx-auto w-full max-w-5xl grow px-4 py-8"
      >
        <router-outlet />
      </main>

      <app-footer />
    </div>
  `,
})
export class App {}
