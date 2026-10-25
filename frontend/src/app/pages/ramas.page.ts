import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { SeccionesService } from '../core/services/secciones.service';


export const routeMeta: RouteMeta = {
  title: 'Ramas · Grupo Scout Nadino',
};

/**
 * Las cinco ramas, cada una en un desplegable nativo (`<details>`): se abre
 * con teclado y lo anuncia un lector de pantalla sin una línea de JavaScript.
 * La animación de apertura es la utilidad `desplegable` de `styles.css`.
 *
 * Los textos salen de `src/content/secciones/*.md` a través de
 * `SeccionesService`. Son genéricos del escultismo y están pendientes de que
 * el kraal los revise.
 */
@Component({
  selector: 'app-ramas',
  imports: [RouterLink],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Nuestras ramas
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
        En el grupo cada edad tiene su rama: un equipo de chicos y chicas de
        edades parecidas, con sus propias actividades y sus monitores. Abre
        cada una para ver qué hacen.
      </p>
    </section>


    <ul class="mt-8 flex list-none flex-col gap-4 p-0">
      @for (rama of ramas(); track rama.slug) {
        <!-- id = slug: la portada enlaza a /ramas#castores, etc. El router
             baja hasta aquí y [open] despliega esa rama. -->
        <li class="aparece-al-scroll" [id]="rama.slug" [style.--c]="rama.color">
          <details
            [open]="rama.slug === ancla()"
            class="desplegable group relative overflow-hidden rounded-3xl border border-superficie/80 bg-superficie/60 shadow-sm backdrop-blur-xl transition-shadow duration-500 ease-suave open:shadow-[0_20px_40px_-16px_color-mix(in_srgb,var(--c)_70%,transparent)] hover:shadow-md"
          >
            <div
              aria-hidden="true"
              class="absolute -top-12 -right-12 -z-10 h-40 w-40 rounded-full bg-(--c) opacity-30 blur-3xl transition-opacity duration-500 ease-suave group-open:opacity-60"
            ></div>

            <summary
              class="flex list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden"
            >
              <span
                aria-hidden="true"
                class="block h-4 w-4 shrink-0 rounded-full bg-(--c) ring-4 ring-[color-mix(in_srgb,var(--c)_30%,transparent)]"
              ></span>
              <span class="flex grow flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <span class="text-xl font-bold tracking-tight text-tinta sm:text-2xl">
                  {{ rama.nombre }}
                </span>
                <span class="text-sm text-tinta-suave">{{ rama.edades }} años</span>
              </span>
              <svg
                viewBox="0 0 24 24"
                class="h-6 w-6 shrink-0 fill-none stroke-marca transition-transform duration-500 ease-suave group-open:rotate-180"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>

            <div class="px-5 pb-6 sm:px-6 sm:pl-14">
              <p class="mt-0 text-tinta-suave">{{ rama.resumen }}</p>
              <h2 class="mt-4 mb-2 text-base font-bold text-marca">Qué hacen</h2>
              <ul class="m-0 flex flex-col gap-1 pl-5 text-tinta-suave">
                @for (cosa of rama.queHacen; track cosa) {
                  <li>{{ cosa }}</li>
                }
              </ul>
              <p class="mt-4 mb-0 text-sm text-tinta-suave">
                <strong class="text-tinta">Reuniones:</strong> pendiente de
                confirmar.
              </p>
            </div>
          </details>
        </li>
      }
    </ul>

    <section
      aria-labelledby="titulo-apuntar"
      class="mt-12 rounded-3xl bg-marca-suave px-6 py-10 text-center"
    >
      <h2 id="titulo-apuntar" class="m-0 text-2xl font-extrabold text-marca">
        ¿No sabes qué rama le toca?
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-tinta-suave">
        No hace falta: con el año de nacimiento en la preinscripción ya lo
        sabemos nosotros.
      </p>
      <a
        routerLink="/preinscripcion"
        class="mt-5 inline-block rounded-lg bg-marca px-6 py-3 font-bold text-sobre-marca no-underline shadow-lg shadow-marca/25 transition hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
      >
        Hacer la preinscripción
      </a>
    </section>
  `,
})
export default class RamasPage {
  /** Rama pedida en la URL (#castores…), o null. */
  protected readonly ancla = toSignal(inject(ActivatedRoute).fragment, {
    initialValue: null,
  });

  protected readonly ramas = inject(SeccionesService).todas;
}
