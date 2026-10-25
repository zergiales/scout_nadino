import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';


export const routeMeta: RouteMeta = {
  title: 'Ramas · Grupo Scout Nadino',
};

interface Rama {
  slug: string;
  nombre: string;
  edades: string;
  color: string;
  resumen: string;
  queHacen: string[];
}

/**
 * Las cinco ramas, cada una en un desplegable nativo (`<details>`): se abre
 * con teclado y lo anuncia un lector de pantalla sin una línea de JavaScript.
 * La animación de apertura es la utilidad `desplegable` de `styles.css`.
 *
 * Los textos son genéricos del escultismo y están pendientes de que el kraal
 * los revise; en la tarea 0.4 salen de `src/content/secciones/*.md` a través
 * de `SeccionesService`, y la lista de abajo desaparece.
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
      @for (rama of ramas; track rama.slug) {
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

  protected readonly ramas: Rama[] = [
    {
      slug: 'castores',
      nombre: 'Castores',
      edades: '6 a 8',
      color: 'var(--color-castores)',
      resumen:
        'Los más pequeños del grupo. Descubren el escultismo jugando, en equipo y al aire libre.',
      queHacen: [
        'Juegos y talleres para aprender a compartir y a convivir',
        'Salidas cortas a la naturaleza',
        'Sus primeras noches fuera de casa con el grupo',
      ],
    },
    {
      slug: 'lobatos',
      nombre: 'Lobatos',
      edades: '8 a 11',
      color: 'var(--color-lobatos)',
      resumen:
        'Viven su aventura ambientada en «El libro de la selva» y aprenden a valerse por sí mismos.',
      queHacen: [
        'Juegos, canciones y actividades en la naturaleza',
        'Retos para aprender cosas nuevas cada ronda',
        'Excursiones y campamentos',
      ],
    },
    {
      slug: 'scouts',
      nombre: 'Exploradores',
      edades: '11 a 14',
      color: 'var(--color-scouts)',
      resumen:
        'Se organizan en patrullas: pequeños equipos que preparan y viven sus propias actividades.',
      queHacen: [
        'Técnicas de campismo, orientación y vida al aire libre',
        'Acampadas y campamentos por patrullas',
        'Responsabilidades dentro de su patrulla',
      ],
    },
    {
      slug: 'pioneros',
      nombre: 'Pioneros',
      edades: '14 a 17',
      color: 'var(--color-pioneros)',
      resumen:
        'Con más autonomía, sacan adelante sus propios proyectos y miran a lo que pasa a su alrededor.',
      queHacen: [
        'Proyectos que deciden y organizan entre ellos',
        'Actividades de servicio en su entorno',
        'Rutas y campamentos más exigentes',
      ],
    },
    {
      slug: 'rutas',
      nombre: 'Rutas',
      edades: '17 a 21',
      color: 'var(--color-rutas)',
      resumen:
        'La última etapa: el servicio a los demás y preparar su propio camino como personas adultas.',
      queHacen: [
        'Proyectos de servicio y voluntariado',
        'Rutas y viajes',
        'Primeros pasos para ser monitores',
      ],
    },
  ];
}
