import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Grupo Scout Nadino',
};

/**
 * Portada. El texto de abajo es provisional y escrito a mano: la portada real
 * (Bloque A) toma su contenido de `src/content` a través de un servicio de
 * `core/services`, nunca leyéndolo aquí.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca sm:text-4xl">
      Grupo Scout Nadino
    </h1>

    <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
      Escultismo en Azuqueca de Henares: educación en el tiempo libre, en la
      naturaleza y en grupo, para chicos y chicas de 6 a 21 años.
    </p>

    <app-aviso-borrador>
      Los textos y los colores son provisionales. El contenido definitivo entra
      desde <code>src/content</code> y los colores oficiales los confirma el
      kraal.
    </app-aviso-borrador>

    <p class="flex flex-wrap gap-3">
      <a
        routerLink="/preinscripcion"
        class="rounded bg-acento px-5 py-3 font-semibold text-white no-underline hover:underline"
      >
        Quiero apuntar a mi hijo o hija
      </a>
      <a
        routerLink="/conocenos"
        class="rounded border-2 border-marca px-5 py-3 font-semibold text-marca no-underline hover:underline"
      >
        Conócenos
      </a>
    </p>

    <h2 class="mt-12 text-2xl font-bold text-marca">Secciones por edades</h2>
    <p class="mt-2 text-tinta-suave">
      Las edades son orientativas y están pendientes de confirmar con el kraal.
    </p>

    <ul class="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
      @for (seccion of secciones; track seccion.slug) {
        <li class="rounded border border-gray-300 bg-white p-4">
          <span
            class="inline-block rounded px-2 py-1 text-xs font-bold tracking-wide text-white uppercase"
            [style.background-color]="seccion.color"
          >
            {{ seccion.nombre }}
          </span>
          <p class="mt-3 mb-0 text-sm text-tinta-suave">
            {{ seccion.edades }} años
          </p>
        </li>
      }
    </ul>

    <p class="mt-6">
      <a routerLink="/secciones" class="font-semibold text-marca">
        Ver todas las secciones
      </a>
    </p>
  `,
})
export default class HomePage {
  // Datos provisionales. En la tarea 0.4 salen de SeccionesService leyendo
  // src/content/secciones/*.md, y esta lista desaparece.
  protected readonly secciones = [
    { slug: 'castores', nombre: 'Castores', edades: '6 a 8', color: 'var(--color-castores)' },
    { slug: 'lobatos', nombre: 'Lobatos', edades: '8 a 11', color: 'var(--color-lobatos)' },
    { slug: 'scouts', nombre: 'Scouts', edades: '11 a 14', color: 'var(--color-scouts)' },
    { slug: 'pioneros', nombre: 'Pioneros', edades: '14 a 17', color: 'var(--color-pioneros)' },
    { slug: 'rutas', nombre: 'Rutas', edades: '17 a 21', color: 'var(--color-rutas)' },
  ];
}
