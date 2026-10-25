import { Component, afterNextRender, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Calendario · Grupo Scout Nadino',
};

interface Evento {
  slug: string;
  titulo: string;
  /** Fechas en formato AAAA-MM-DD. */
  inicio: string;
  fin?: string;
  lugar?: string;
  /** Slugs de las ramas que van; vacío = todo el grupo. */
  ramas: string[];
  descripcion: string;
  /** Página propia del evento, si la tiene. */
  enlace?: string;
}

const RAMAS: Record<string, { nombre: string; color: string }> = {
  castores: { nombre: 'Castores', color: 'var(--color-castores)' },
  lobatos: { nombre: 'Lobatos', color: 'var(--color-lobatos)' },
  scouts: { nombre: 'Exploradores', color: 'var(--color-scouts)' },
  pioneros: { nombre: 'Pioneros', color: 'var(--color-pioneros)' },
  rutas: { nombre: 'Rutas', color: 'var(--color-rutas)' },
};

/**
 * Calendario del grupo, en lista y no en rejilla de mes: se lee mejor con
 * lector de pantalla y en el móvil (ver `docs/frontend/paginas.md`).
 *
 * Los eventos van escritos a mano hasta que exista `EventosService` (tarea
 * 0.4), que los leerá de `src/content/eventos/*.md`. Para añadir uno ahora,
 * basta con meterlo en la lista de abajo: el orden y el reparto entre
 * próximos y pasados se calculan solos.
 *
 * El reparto depende de la fecha de hoy. La página se prerenderiza con la
 * fecha del build y, ya en el navegador, se recalcula con la fecha real
 * (`afterNextRender`), así que no se queda desfasada aunque nadie recompile.
 */
@Component({
  selector: 'app-eventos',
  imports: [NgTemplateOutlet, RouterLink],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Calendario
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Las actividades, salidas y campamentos del grupo. Aquí iremos poniendo
        las fechas de la ronda en cuanto estén cerradas.
      </p>
    </section>

    <!-- Próximas -->
    <section aria-labelledby="titulo-proximas" class="mt-12">
      <h2 id="titulo-proximas" class="m-0 text-3xl font-extrabold text-marca">
        Próximas fechas
      </h2>

      @if (proximos().length > 0) {
        <ol class="mt-6 flex list-none flex-col gap-4 p-0">
          @for (evento of proximos(); track evento.slug) {
            <li class="aparece-al-scroll">
              <ng-container
                *ngTemplateOutlet="tarjeta; context: { $implicit: evento }"
              />
            </li>
          }
        </ol>
      } @else {
        <div
          class="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-marca/40 bg-white/50 px-6 py-12 text-center backdrop-blur-xl"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-10 w-10 fill-none stroke-marca"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <path d="M3 10h18" />
            <path
              d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            />
          </svg>
          <p class="m-0 text-lg font-bold text-tinta">
            Todavía no hay fechas publicadas
          </p>
          <p class="m-0 max-w-md text-tinta-suave">
            El kraal está preparando el calendario de la ronda 2026-2027. Si
            tienes prisa por saber algo,
            <a routerLink="/contacto" class="font-bold text-marca">escríbenos</a>.
          </p>
        </div>
      }
    </section>

    <!-- Pasadas -->
    @if (pasados().length > 0) {
      <section aria-labelledby="titulo-pasadas" class="mt-16">
        <h2 id="titulo-pasadas" class="m-0 text-3xl font-extrabold text-marca">
          Ya celebrado
        </h2>
        <ol class="mt-6 flex list-none flex-col gap-4 p-0">
          @for (evento of pasados(); track evento.slug) {
            <li class="aparece-al-scroll">
              <ng-container
                *ngTemplateOutlet="tarjeta; context: { $implicit: evento, pasado: true }"
              />
            </li>
          }
        </ol>
      </section>
    }

    <ng-template #tarjeta let-evento let-pasado="pasado">
      <article
        class="flex gap-5 rounded-3xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition duration-500 ease-suave hover:shadow-lg sm:p-6"
      >
        <!-- Hoja de calendario con el día y el mes -->
        <div
          aria-hidden="true"
          class="flex w-16 shrink-0 flex-col self-start overflow-hidden rounded-2xl text-center shadow-sm ring-1 ring-tinta/10 sm:w-20"
        >
          <span
            class="py-1 text-xs font-bold tracking-wide text-white uppercase"
            [class]="pasado ? 'bg-tinta-suave' : 'bg-marca'"
          >
            {{ mesCorto(evento.inicio) }}
          </span>
          <span class="bg-white py-2 text-2xl font-extrabold text-tinta sm:text-3xl">
            {{ dia(evento.inicio) }}
          </span>
        </div>

        <div class="min-w-0 grow">
          <h3 class="m-0 text-xl font-bold text-tinta">{{ evento.titulo }}</h3>
          <p class="mt-1 mb-0 text-sm font-semibold text-marca">
            <time [attr.datetime]="evento.inicio">{{ fechas(evento) }}</time>
            @if (evento.lugar) {
              · {{ evento.lugar }}
            }
          </p>
          <p class="mt-2 mb-0 text-tinta-suave">{{ evento.descripcion }}</p>

          <ul class="mt-3 mb-0 flex list-none flex-wrap gap-2 p-0">
            @if (evento.ramas.length === 0) {
              <li
                class="rounded-full bg-marca-suave px-3 py-0.5 text-xs font-bold text-marca"
              >
                Todo el grupo
              </li>
            }
            @for (slug of evento.ramas; track slug) {
              <li
                class="flex items-center gap-1.5 rounded-full bg-white px-3 py-0.5 text-xs font-bold text-tinta ring-1 ring-tinta/10"
              >
                <span
                  aria-hidden="true"
                  class="h-2 w-2 rounded-full"
                  [style.background-color]="ramas[slug].color"
                ></span>
                {{ ramas[slug].nombre }}
              </li>
            }
          </ul>

          @if (evento.enlace) {
            <p class="mt-4 mb-0">
              <a [routerLink]="evento.enlace" class="font-bold text-marca">
                {{ pasado ? 'Así fue' : 'Más información' }}
                <span class="sr-only">: {{ evento.titulo }}</span>
              </a>
            </p>
          }
        </div>
      </article>
    </ng-template>
  `,
})
export default class EventosPage {
  protected readonly ramas = RAMAS;

  // Datos provisionales. En la tarea 0.4 salen de EventosService.
  private readonly eventos: Evento[] = [
    {
      slug: 'joti-2026',
      titulo: 'Jota-Joti 2026',
      inicio: '2026-10-16',
      fin: '2026-10-18',
      ramas: [],
      descripcion:
        'Scouts de todo el mundo conectados por radio y por internet durante un fin de semana.',
      enlace: '/eventos/joti-2026',
    },
  ];

  /** Fecha de hoy (AAAA-MM-DD). La del build al prerenderizar; la real en el navegador. */
  private readonly hoy = signal(this.aIso(new Date()));

  protected readonly proximos = computed(() =>
    this.eventos
      .filter((e) => (e.fin ?? e.inicio) >= this.hoy())
      .sort((a, b) => a.inicio.localeCompare(b.inicio)),
  );

  protected readonly pasados = computed(() =>
    this.eventos
      .filter((e) => (e.fin ?? e.inicio) < this.hoy())
      .sort((a, b) => b.inicio.localeCompare(a.inicio)),
  );

  constructor() {
    afterNextRender(() => this.hoy.set(this.aIso(new Date())));
  }

  protected dia(iso: string): number {
    return this.fecha(iso).getDate();
  }

  protected mesCorto(iso: string): string {
    return this.fecha(iso)
      .toLocaleDateString('es-ES', { month: 'short' })
      .replace('.', '');
  }

  /** «16 de octubre de 2026» o «16 al 18 de octubre de 2026». */
  protected fechas(evento: Evento): string {
    const largo = (iso: string) =>
      this.fecha(iso).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    if (!evento.fin || evento.fin === evento.inicio) return largo(evento.inicio);

    const inicio = this.fecha(evento.inicio);
    const fin = this.fecha(evento.fin);
    if (inicio.getMonth() === fin.getMonth() && inicio.getFullYear() === fin.getFullYear()) {
      return `${inicio.getDate()} al ${largo(evento.fin)}`;
    }
    return `${largo(evento.inicio)} al ${largo(evento.fin)}`;
  }

  /** Mediodía local para que ninguna zona horaria cambie el día. */
  private fecha(iso: string): Date {
    return new Date(`${iso}T12:00:00`);
  }

  private aIso(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
