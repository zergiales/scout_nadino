import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { CategoriaDocumento, Documento } from '../core/models/documento';
import { AlbumesService } from '../core/services/albumes.service';
import { DocumentosService } from '../core/services/documentos.service';

export const routeMeta: RouteMeta = {
  title: 'Documentos · Grupo Scout Nadino',
};

/**
 * Documentos para descargar, agrupados por categoría.
 *
 * Para añadir uno: copia el PDF a `public/documentos/` (nombre en minúsculas
 * y con guiones, sin espacios ni tildes) y crea su ficha en
 * `src/content/documentos/`. La lista sale de `DocumentosService`.
 *
 * Ojo con los datos de menores: aquí solo van plantillas en blanco, nunca un
 * documento ya relleno.
 *
 * Al final, «Fotos»: álbumes de actividades (`AlbumesService`). Las fotos no
 * se suben a la web; cada álbum es un enlace a su carpeta de Google Drive.
 */
@Component({
  selector: 'app-documentos',
  imports: [RouterLink],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Documentos
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Las fichas, autorizaciones y listas que os vamos pidiendo a lo largo de
        la ronda. Descárgalos, rellénalos y entrégalos al monitor de la rama.
      </p>
    </section>

    @for (categoria of categorias; track categoria.id) {
      <section [attr.aria-labelledby]="'cat-' + categoria.id" class="mt-12">
        <h2
          [id]="'cat-' + categoria.id"
          class="m-0 text-2xl font-extrabold text-marca"
        >
          {{ categoria.titulo }}
        </h2>
        <p class="mt-1 text-tinta-suave">{{ categoria.texto }}</p>

        @if (deCategoria(categoria.id).length > 0) {
          <ul class="mt-5 grid list-none gap-4 p-0 md:grid-cols-2">
            @for (doc of deCategoria(categoria.id); track doc.fichero) {
              <li class="aparece-al-scroll">
                <article
                  class="flex h-full gap-4 rounded-3xl border border-superficie/80 bg-superficie/60 p-5 shadow-sm backdrop-blur-xl transition duration-500 ease-suave hover:shadow-lg"
                >
                  <span
                    class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-marca-suave"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="h-6 w-6 fill-none stroke-marca"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                      />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                  </span>
                  <div class="flex min-w-0 grow flex-col">
                    <h3 class="m-0 text-lg font-bold text-tinta">
                      {{ doc.titulo }}
                    </h3>
                    <p class="mt-1 mb-0 text-sm text-tinta-suave">
                      {{ doc.descripcion }}
                    </p>
                    <p class="mt-auto mb-0 flex flex-wrap items-center gap-3 pt-4">
                      <a
                        [href]="doc.fichero"
                        download
                        class="group inline-flex items-center gap-2 rounded-lg bg-marca px-4 py-2 font-bold text-sobre-marca no-underline shadow-md shadow-marca/20 transition duration-300 ease-suave hover:bg-marca-oscuro"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          class="h-4 w-4 fill-none stroke-current transition-transform duration-300 ease-suave motion-safe:group-hover:translate-y-0.5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M12 15V3" />
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <path d="m7 10 5 5 5-5" />
                        </svg>
                        Descargar
                        <span class="sr-only">
                          {{ doc.titulo }} ({{ doc.formato }}, {{ doc.tamano }})
                        </span>
                      </a>
                      <span class="text-xs text-tinta-suave" aria-hidden="true">
                        {{ doc.formato }} · {{ doc.tamano }}
                      </span>
                    </p>
                  </div>
                </article>
              </li>
            }
          </ul>
        } @else {
          <p
            class="mt-5 mb-0 rounded-3xl border border-dashed border-marca/40 bg-superficie/40 px-6 py-6 text-tinta-suave"
          >
            Todavía no hay documentos en este apartado.
          </p>
        }
      </section>
    }

    <!-- Fotos: solo sale si hay algún álbum -->
    @if (albumes().length > 0) {
      <section aria-labelledby="titulo-fotos" class="mt-12">
        <h2 id="titulo-fotos" class="m-0 text-2xl font-extrabold text-marca">Fotos</h2>
        <p class="mt-1 text-tinta-suave">
          Los álbumes de las actividades, en las carpetas de Google Drive del
          grupo.
        </p>

        <ul class="mt-5 grid list-none gap-4 p-0 md:grid-cols-2">
          @for (album of albumes(); track album.slug) {
            <li class="aparece-al-scroll">
              <article
                class="flex h-full gap-4 rounded-3xl border border-superficie/80 bg-superficie/60 p-5 shadow-sm backdrop-blur-xl transition duration-500 ease-suave hover:shadow-lg"
              >
                <!-- Logotipo de Google Drive en una tinta (simple-icons,
                     CC0), en el color de marca como el resto de iconos. -->
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-marca-suave"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-6 w-6 fill-marca"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path [attr.d]="iconoDrive" />
                  </svg>
                </span>
                <div class="flex min-w-0 grow flex-col">
                  <h3 class="m-0 text-lg font-bold text-tinta">{{ album.titulo }}</h3>
                  <p class="mt-1 mb-0 text-sm text-tinta-suave">{{ album.descripcion }}</p>
                  <p class="mt-auto mb-0 pt-4">
                    <a
                      [href]="album.enlace"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group inline-flex items-center gap-2 rounded-lg bg-marca px-4 py-2 font-bold text-sobre-marca no-underline shadow-md shadow-marca/20 transition duration-300 ease-suave hover:bg-marca-oscuro"
                    >
                      Ver fotos en Google Drive
                      <span class="sr-only">
                        de {{ album.titulo }} (se abre en una pestaña nueva)
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        class="h-4 w-4 fill-none stroke-current transition-transform duration-300 ease-suave motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </a>
                  </p>
                </div>
              </article>
            </li>
          }
        </ul>
      </section>
    }

    <section
      aria-labelledby="titulo-ayuda"
      class="mt-16 rounded-3xl bg-marca-suave px-6 py-10 text-center"
    >
      <h2 id="titulo-ayuda" class="m-0 text-2xl font-extrabold text-marca">
        ¿No encuentras lo que buscas?
      </h2>
      <p class="mx-auto mt-3 mb-0 max-w-xl text-tinta-suave">
        Pídeselo al monitor de la rama o
        <a routerLink="/contacto" class="font-bold text-marca">escríbenos</a>
        y te lo enviamos.
      </p>
    </section>
  `,
})
export default class DocumentosPage {
  protected readonly albumes = inject(AlbumesService).todos;

  /** Logotipo de Google Drive (simple-icons 15.0.0, licencia CC0). */
  protected readonly iconoDrive =
    'M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z';

  protected readonly categorias = [
    {
      id: 'inscripcion',
      titulo: 'Inscripción',
      texto: 'Lo que hace falta para formalizar la inscripción en el grupo.',
    },
    {
      id: 'autorizaciones',
      titulo: 'Autorizaciones',
      texto: 'Permisos para salidas, acampadas y uso de imagen.',
    },
    {
      id: 'actividades',
      titulo: 'Acampadas y material',
      texto: 'Listas de material, circulares y avisos de cada actividad.',
    },
  ] as const;

  private readonly documentos = inject(DocumentosService).todos;

  protected deCategoria(id: CategoriaDocumento): Documento[] {
    return this.documentos().filter((doc) => doc.categoria === id);
  }
}
