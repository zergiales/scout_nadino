import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Pie de página. Aquí van Contacto y los enlaces legales, que no ocupan sitio
 * en la navegación principal (ver `docs/frontend/paginas.md`).
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="mt-12 border-t-4 border-marca bg-marca-suave">
      <div
        class="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3"
      >
        <div>
          <p class="m-0 font-bold text-marca">Grupo Scout Nadino</p>
          <p class="mt-2 mb-0 text-sm text-tinta-suave">
            Scouts de Guadalajara · Movimiento Scout Católico
          </p>
        </div>

        <nav aria-label="Enlaces del pie">
          <h2 class="m-0 text-sm font-bold tracking-wide text-marca uppercase">
            El grupo
          </h2>
          <ul class="mt-3 flex list-none flex-col gap-2 p-0 text-sm">
            <li><a routerLink="/contacto" class="text-marca">Contacto</a></li>
            <li>
              <a routerLink="/preinscripcion" class="text-marca">
                Preinscripción
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Información legal">
          <h2 class="m-0 text-sm font-bold tracking-wide text-marca uppercase">
            Legal
          </h2>
          <ul class="mt-3 flex list-none flex-col gap-2 p-0 text-sm">
            <li>
              <a routerLink="/legal/aviso-legal" class="text-marca">
                Aviso legal
              </a>
            </li>
            <li>
              <a routerLink="/legal/privacidad" class="text-marca">
                Privacidad
              </a>
            </li>
            <li>
              <a routerLink="/legal/cookies" class="text-marca">Cookies</a>
            </li>
            <li>
              <a routerLink="/legal/accesibilidad" class="text-marca">
                Accesibilidad
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  `,
})
export class Footer {}
