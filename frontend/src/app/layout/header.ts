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
 * `docs/frontend/paginas.md` (máximo 6). El Jota-Joti salió al entrar
 * Calendario y ahora se llega a él desde allí; Contacto salió al entrar
 * Documentos y sigue en el pie. Para meter Noticias habrá que sacar otro.
 *
 * «Acceso al blog» no cuenta como enlace del menú: va aparte, como botón
 * con icono, y lleva a la pantalla de login del blog.
 *
 * El menú móvil es un toggle propio en vez del CDK: no hace falta overlay ni
 * foco atrapado para una lista de cuatro enlaces, y así no se añade una
 * dependencia más.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  host: {
    // El sticky va en el host y no en <header>: un elemento sticky solo se
    // mueve dentro de su padre, y el host mide lo mismo que la cabecera.
    class: 'sticky top-0 z-40 block',
    '(document:keydown.escape)': 'cerrar()',
  },
  template: `
    <header
      class="border-b-2 border-marca bg-white/75 backdrop-blur-md"
    >
      <div
        class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <a
          routerLink="/"
          class="flex items-center gap-3 text-lg font-bold text-marca no-underline hover:underline"
        >
          <!-- alt vacío: el texto del enlace ya lo nombra -->
          <img
            src="/img/logo-nadino.jpeg"
            alt=""
            width="56"
            height="56"
            class="h-14 w-14 rounded-md"
          />
          Grupo Scout Nadino
        </a>

        <!-- Acceso y botón de menú. En escritorio va al final, a la derecha
             del menú; en móvil, junto al botón para que siempre se vea. -->
        <div class="flex items-center gap-2 md:order-last">
          <a
            routerLink="/acceso"
            routerLinkActive="bg-marca text-white"
            ariaCurrentWhenActive="page"
            class="inline-flex items-center gap-2 rounded-full border-2 border-marca px-3 py-2 text-sm font-semibold text-marca no-underline transition-colors duration-300 hover:bg-marca hover:text-white"
            (click)="cerrar()"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5 fill-none stroke-current"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <path d="M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8" />
            </svg>
            <span class="max-lg:sr-only">Acceso</span>
            <span class="sr-only">al blog</span>
          </a>

          <button
            type="button"
            class="rounded border-2 border-marca px-3 py-2 text-sm font-semibold text-marca transition-colors hover:bg-marca hover:text-white md:hidden"
            [attr.aria-expanded]="abierto()"
            aria-controls="menu-principal"
            (click)="alternar()"
          >
            {{ abierto() ? 'Cerrar' : 'Menú' }}
          </button>
        </div>

        <nav
          id="menu-principal"
          aria-label="Navegación principal"
          class="w-full max-md:motion-safe:animate-menu-entra md:block md:w-auto"
          [class.hidden]="!abierto()"
        >
          <ul
            class="m-0 flex list-none flex-col gap-1 p-0 md:flex-row md:items-center md:gap-2"
          >
            @for (enlace of enlaces; track enlace.ruta) {
              <li>
                <a
                  [routerLink]="enlace.ruta"
                  routerLinkActive="bg-marca-suave font-bold after:scale-x-100"
                  [routerLinkActiveOptions]="{ exact: !!enlace.exacta }"
                  ariaCurrentWhenActive="page"
                  class="relative block rounded px-3 py-2 text-marca no-underline transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-marca after:transition-transform after:duration-300 hover:bg-marca-suave hover:after:scale-x-100"
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
                class="block rounded bg-marca px-3 py-2 font-semibold text-white no-underline shadow-sm transition duration-200 hover:bg-marca-oscuro hover:shadow-md motion-safe:hover:-translate-y-0.5"
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
    { ruta: '/ramas', texto: 'Ramas' },
    { ruta: '/eventos', texto: 'Calendario' },
    { ruta: '/documentos', texto: 'Documentos' },
  ];

  protected alternar(): void {
    this.abierto.update((v) => !v);
  }

  protected cerrar(): void {
    this.abierto.set(false);
  }
}
