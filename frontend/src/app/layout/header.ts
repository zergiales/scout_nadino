import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface EnlaceNav {
  ruta: string;
  texto: string;
  /** Solo para «Inicio»: si no, `/` quedaría activo en todas las rutas. */
  exacta?: boolean;
}

/**
 * Cabecera con la navegación principal. La lista de enlaces es la de
 * `docs/frontend/paginas.md` (máximo 6); Noticias y Eventos se añaden cuando
 * existan esas páginas (son P1).
 *
 * El menú móvil es un toggle propio en vez del CDK: no hace falta overlay ni
 * foco atrapado para una lista de cuatro enlaces, y así no se añade una
 * dependencia más.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  host: {
    '(document:keydown.escape)': 'cerrar()',
  },
  template: `
    <header class="border-b-4 border-marca bg-white">
      <div
        class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <a
          routerLink="/"
          class="text-lg font-bold text-marca no-underline hover:underline"
        >
          Grupo Scout Nadino
        </a>

        <button
          type="button"
          class="rounded border-2 border-marca px-3 py-2 text-sm font-semibold text-marca md:hidden"
          [attr.aria-expanded]="abierto()"
          aria-controls="menu-principal"
          (click)="alternar()"
        >
          {{ abierto() ? 'Cerrar' : 'Menú' }}
        </button>

        <nav
          id="menu-principal"
          aria-label="Navegación principal"
          class="w-full md:block md:w-auto"
          [class.hidden]="!abierto()"
        >
          <ul
            class="m-0 flex list-none flex-col gap-1 p-0 md:flex-row md:items-center md:gap-2"
          >
            @for (enlace of enlaces; track enlace.ruta) {
              <li>
                <a
                  [routerLink]="enlace.ruta"
                  routerLinkActive="bg-marca-suave font-bold"
                  [routerLinkActiveOptions]="{ exact: !!enlace.exacta }"
                  ariaCurrentWhenActive="page"
                  class="block rounded px-3 py-2 text-marca no-underline hover:bg-marca-suave hover:underline"
                  (click)="cerrar()"
                >
                  {{ enlace.texto }}
                </a>
              </li>
            }
            <li>
              <a
                routerLink="/preinscripcion"
                routerLinkActive="underline"
                ariaCurrentWhenActive="page"
                class="block rounded bg-acento px-3 py-2 font-semibold text-white no-underline hover:underline"
                (click)="cerrar()"
              >
                Preinscripción
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly abierto = signal(false);

  protected readonly enlaces: EnlaceNav[] = [
    { ruta: '/', texto: 'Inicio', exacta: true },
    { ruta: '/conocenos', texto: 'Conócenos' },
    { ruta: '/secciones', texto: 'Secciones' },
    { ruta: '/eventos/joti-2026', texto: 'Jota-Joti' },
    { ruta: '/contacto', texto: 'Contacto' },
  ];

  protected alternar(): void {
    this.abierto.update((v) => !v);
  }

  protected cerrar(): void {
    this.abierto.set(false);
  }
}
