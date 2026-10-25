import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { MapaConexiones } from '../shared/ui/mapa-conexiones';

export const routeMeta: RouteMeta = {
  title: 'Grupo Scout Nadino',
};

/**
 * Portada. El texto de abajo es provisional y escrito a mano: la portada real
 * (Bloque A) toma su contenido de `src/content` a través de un servicio de
 * `core/services`, nunca leyéndolo aquí.
 *
 * Orden: portada con foto → inscripciones abiertas → Jota-Joti → secciones →
 * llamada final a la preinscripción.
 *
 * Estilo «cristal»: manchas moradas difuminadas detrás (`blur-3xl`) y tarjetas
 * translúcidas encima (`backdrop-blur`). Las manchas son decorativas y van con
 * `aria-hidden`; el texto siempre queda sobre un fondo casi blanco, así que el
 * contraste no depende de ellas.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, MapaConexiones],
  template: `
    <!-- Portada -->
    <section class="relative isolate pt-4 sm:pt-8">
      <div aria-hidden="true">
        <div
          class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/30 blur-3xl"
        ></div>
        <div
          class="absolute top-40 -right-16 -z-10 h-80 w-80 rounded-full bg-marca-claro/25 blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-marca/20 blur-3xl"
        ></div>
      </div>

      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-6xl">
        Grupo Scout Nadino
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Educación en el tiempo libre, en la naturaleza y en grupo, para chicos y
        chicas de 6 a 21 años.
      </p>

      <p class="mt-8 flex flex-wrap gap-3">
        <a
          routerLink="/preinscripcion"
          class="rounded-lg bg-marca px-5 py-3 font-bold text-sobre-marca no-underline shadow-lg shadow-marca/25 transition hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
        >
          Quiero apuntar a mi hijo o hija
        </a>
        <!-- Al pasar el ratón: el morado rellena el botón de izquierda a
             derecha y entra una flecha. -->
        <a
          routerLink="/conocenos"
          class="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-lg border-2 border-marca bg-superficie/50 px-5 py-3 font-bold text-marca no-underline backdrop-blur-md transition-colors duration-500 ease-suave before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-marca before:transition-transform before:duration-500 before:ease-suave hover:text-sobre-marca hover:before:scale-x-100"
        >
          Conócenos
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 fill-none stroke-current transition-transform duration-500 ease-suave motion-safe:group-hover:translate-x-1"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </p>

      <!--
        Foto del campamento 2026. Todos los que salen tienen firmada la
        autorización de imagen (confirmado por el grupo). Va recortada y a
        1600 px como mucho, sin EXIF: suficiente para la portada, sin la
        resolución original que permitiría ampliar caras. Es la imagen más
        grande de la página, así que carga con prioridad y sin lazy.
        object-position baja el encuadre para que en 21:9 no se corte el grupo.
      -->
      <img
        src="/img/portada/campamento-2026-1600.webp"
        srcset="
          /img/portada/campamento-2026-800.webp   800w,
          /img/portada/campamento-2026-1600.webp 1600w
        "
        sizes="(min-width: 1024px) 1024px, 100vw"
        alt="El grupo al completo, con camisas de colores de cada sección, posando en un claro de pinar del campamento de 2026 bajo un mástil de troncos con banderas."
        width="1600"
        height="914"
        fetchpriority="high"
        class="mt-10 aspect-video w-full rounded-3xl object-cover object-[50%_85%] shadow-xl shadow-marca/10 sm:aspect-[21/9]"
      />
    </section>

    <!-- Inscripciones abiertas -->
    <section aria-labelledby="titulo-inscripciones" class="relative isolate mt-16">
      <div
        aria-hidden="true"
        class="absolute top-1/2 right-0 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-marca/25 blur-3xl"
      ></div>

      <div
        class="grid items-center gap-8 rounded-3xl border border-superficie/70 bg-superficie/50 p-6 shadow-xl ring-1 shadow-marca/10 ring-marca/10 backdrop-blur-xl sm:p-10 md:grid-cols-[1fr_auto]"
      >
        <div>
          <p
            class="m-0 inline-block rounded-full bg-marca px-3 py-1 text-sm font-bold text-sobre-marca"
          >
            Ronda 2026-2027
          </p>
          <h2
            id="titulo-inscripciones"
            class="mt-4 mb-0 text-3xl font-extrabold text-marca sm:text-4xl"
          >
            ¡Abrimos inscripciones!
          </h2>
          <p class="mt-3 max-w-xl text-lg text-tinta-suave">
            Ya puedes hacer la preinscripción para la ronda 2026-2027. Es un
            formulario corto y solo pide los datos imprescindibles.
          </p>
          <ul class="mt-4 mb-0 grid list-none gap-2 p-0 font-semibold text-tinta">
            @for (punto of puntosInscripcion; track punto) {
              <li class="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5 shrink-0 fill-none stroke-marca"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {{ punto }}
              </li>
            }
          </ul>
        </div>

        <a
          routerLink="/preinscripcion"
          class="justify-self-start rounded-lg bg-marca px-6 py-4 text-lg font-bold text-sobre-marca no-underline shadow-lg shadow-marca/25 transition hover:bg-marca-oscuro md:justify-self-end motion-safe:hover:-translate-y-0.5"
        >
          Hacer la preinscripción
        </a>
      </div>
    </section>

    <!-- Jota-Joti: ya celebrado -->
    <section
      aria-labelledby="titulo-joti"
      class="relative isolate mt-16 grid items-center gap-8 md:grid-cols-2"
    >
      <div>
        <p
          class="m-0 inline-block rounded-full bg-marca-suave px-3 py-1 text-sm font-bold text-marca"
        >
          16, 17 y 18 de octubre de 2026
        </p>
        <h2
          id="titulo-joti"
          class="mt-4 mb-0 text-3xl font-extrabold text-marca"
        >
          Así fue el Jota-Joti 2026
        </h2>
        <p class="mt-3 text-lg text-tinta-suave">
          Durante un fin de semana, scouts de todo el mundo se conectaron entre
          ellos por radio y por internet en la actividad scout más grande del
          año.
        </p>
        <!-- Cada tarjeta lleva a la página oficial de su modalidad. -->
        <ul class="mt-4 grid list-none gap-3 p-0">
          @for (modalidad of modalidades; track modalidad.url) {
            <li>
              <a
                [href]="modalidad.url"
                rel="noopener noreferrer"
                class="group flex items-center gap-4 rounded-2xl border border-marca/15 bg-marca-suave p-4 no-underline transition duration-500 ease-suave hover:border-marca hover:bg-superficie hover:shadow-lg hover:shadow-marca/15 motion-safe:hover:-translate-y-0.5"
              >
                <span
                  class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-superficie transition-colors duration-500 ease-suave group-hover:bg-marca"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-5 w-5 fill-none stroke-marca transition-colors duration-500 ease-suave group-hover:stroke-sobre-marca"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    @for (d of modalidad.icono; track $index) {
                      <path [attr.d]="d" />
                    }
                  </svg>
                </span>
                <span class="grow">
                  <span class="block font-bold text-marca">
                    {{ modalidad.titulo }}
                  </span>
                  <span class="block text-sm text-tinta-suave">
                    {{ modalidad.texto }}
                  </span>
                  <span class="mt-1 block text-xs text-tinta-suave">
                    Web oficial, en inglés
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5 shrink-0 fill-none stroke-marca transition-transform duration-500 ease-suave motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </li>
          }
        </ul>
        <p class="mt-6">
          <a routerLink="/eventos/joti-2026" class="font-bold text-marca">
            Todo sobre el Jota-Joti 2026
          </a>
        </p>
      </div>

      <div class="relative">
        <div
          aria-hidden="true"
          class="absolute inset-8 -z-10 rounded-full bg-marca/30 blur-3xl"
        ></div>
        <div
          class="rounded-3xl border border-superficie/70 bg-superficie/50 p-4 shadow-xl shadow-marca/10 backdrop-blur-xl sm:p-6"
        >
          <app-mapa-conexiones />
        </div>
      </div>
    </section>

    <!-- Secciones -->
    <section aria-labelledby="titulo-secciones" class="relative isolate mt-16">
      <div aria-hidden="true">
        <div
          class="absolute top-16 left-0 -z-10 h-56 w-56 rounded-full bg-castores/40 blur-3xl"
        ></div>
        <div
          class="absolute top-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-scouts/50 blur-3xl"
        ></div>
        <div
          class="absolute top-16 right-0 -z-10 h-56 w-56 rounded-full bg-rutas/40 blur-3xl"
        ></div>
      </div>

      <h2 id="titulo-secciones" class="m-0 text-3xl font-extrabold text-marca">
        Nuestras ramas
      </h2>
      <p class="mt-2 text-tinta-suave">
        Cada edad tiene su rama. Las edades son orientativas y están
        pendientes de confirmar con el kraal.
      </p>

      <!--
        Tarjetas de cristal con el color de la rama en un punto y un halo.
        Cada una es un enlace a /ramas#<slug>, que baja hasta esa rama y la
        abre. El <li> aparece al hacer scroll; el hover (elevarse y crecer un
        poco) va en el <a> de dentro, porque la animación de aparición pisa
        cualquier transform del propio <li>.
      -->
      <ul class="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
        @for (seccion of secciones; track seccion.slug) {
          <li class="aparece-al-scroll" [style.--c]="seccion.color">
            <a
              routerLink="/ramas"
              [fragment]="seccion.slug"
              class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-superficie/80 bg-superficie/60 p-5 text-tinta no-underline shadow-sm backdrop-blur-xl transition duration-500 ease-suave hover:bg-superficie/80 hover:shadow-[0_20px_40px_-12px_color-mix(in_srgb,var(--c)_70%,transparent)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02]"
            >
              <div
                aria-hidden="true"
                class="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-(--c) opacity-30 blur-2xl transition-opacity duration-500 ease-suave group-hover:opacity-60"
              ></div>
              <span
                aria-hidden="true"
                class="block h-3 w-3 rounded-full bg-(--c) ring-4 ring-[color-mix(in_srgb,var(--c)_30%,transparent)]"
              ></span>
              <h3 class="mt-6 mb-0 text-xl font-bold tracking-tight">
                {{ seccion.nombre }}
              </h3>
              <p class="mt-1 mb-0 text-sm text-tinta-suave">
                {{ seccion.edades }} años
              </p>
              <span
                aria-hidden="true"
                class="mt-auto pt-4 text-sm font-bold text-marca opacity-0 transition duration-500 ease-suave group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1 motion-safe:group-hover:translate-x-0"
              >
                Ver rama →
              </span>
            </a>
          </li>
        }
      </ul>

      <p class="mt-6">
        <a routerLink="/ramas" class="font-bold text-marca">
          Ver todas las ramas
        </a>
      </p>
    </section>

    <!-- Llamada final -->
    <section aria-labelledby="titulo-unete" class="relative isolate mt-16">
      <div
        aria-hidden="true"
        class="absolute inset-x-1/4 inset-y-4 -z-10 rounded-full bg-marca/30 blur-3xl"
      ></div>
      <div
        class="rounded-3xl border border-superficie/70 bg-superficie/50 px-6 py-12 text-center shadow-xl shadow-marca/10 backdrop-blur-xl"
      >
        <h2 id="titulo-unete" class="m-0 text-3xl font-extrabold text-marca">
          ¿Os unís a la aventura?
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-lg text-tinta-suave">
          Haz la preinscripción de la ronda 2026-2027 y empieza a formar parte
          del grupo.
        </p>
        <a
          routerLink="/preinscripcion"
          class="mt-6 inline-block rounded-lg bg-marca px-8 py-4 text-lg font-bold text-sobre-marca no-underline shadow-lg shadow-marca/30 transition hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
        >
          Hacer la preinscripción
        </a>
      </div>
    </section>
  `,
})
export default class HomePage {
  // Iconos con el trazo de Lucide (ISC).
  protected readonly modalidades = [
    {
      titulo: 'JOTA · por radio',
      texto: 'Jamboree On The Air: contactos por radioafición.',
      url: 'https://www.jotajoti.info/jota',
      icono: [
        'M4.9 16.1C1 12.2 1 5.8 4.9 1.9',
        'M7.8 4.7a6.14 6.14 0 0 0-.8 7.5',
        'M16.2 4.8c2 2 2.26 5.11.8 7.47',
        'M19.1 1.9a9.96 9.96 0 0 1 0 14.1',
        'M9.5 18h5',
        'm8 22 4-11 4 11',
        'M12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
      ],
    },
    {
      titulo: 'JOTI · por internet',
      texto: 'Jamboree On The Internet: chat con grupos de otros países.',
      url: 'https://www.jotajoti.info/joti',
      icono: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01'],
    },
  ];

  protected readonly puntosInscripcion = [
    'Para chicos y chicas de 6 a 21 años',
    'Cinco ramas según la edad',
    'Sin compromiso: es una preinscripción',
  ];

  // Datos provisionales. En la tarea 0.4 salen de SeccionesService leyendo
  // src/content/secciones/*.md, y esta lista desaparece.
  protected readonly secciones = [
    { slug: 'castores', nombre: 'Castores', edades: '6 a 8', color: 'var(--color-castores)' },
    { slug: 'lobatos', nombre: 'Lobatos', edades: '8 a 11', color: 'var(--color-lobatos)' },
    { slug: 'scouts', nombre: 'Exploradores', edades: '11 a 14', color: 'var(--color-scouts)' },
    { slug: 'pioneros', nombre: 'Pioneros', edades: '14 a 17', color: 'var(--color-pioneros)' },
    { slug: 'rutas', nombre: 'Rutas', edades: '17 a 21', color: 'var(--color-rutas)' },
  ];
}
