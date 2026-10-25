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
              <a routerLink="/documentos" class="text-marca">Documentos</a>
            </li>
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

      <!-- Asociaciones a las que pertenece el grupo, centradas. El título solo
           lo oye un lector de pantalla; el alt de cada logo nombra a dónde
           lleva el enlace. -->
      <div class="mx-auto max-w-5xl border-t border-marca/20 px-4 py-6">
        <p id="titulo-asociaciones" class="sr-only">Formamos parte de</p>
        <ul
          aria-labelledby="titulo-asociaciones"
          class="m-0 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6 p-0"
        >
          @for (asociacion of asociaciones; track asociacion.url) {
            <li>
              <a
                [href]="asociacion.url"
                rel="noopener noreferrer"
                class="block rounded-lg transition duration-300 ease-suave hover:opacity-80 motion-safe:hover:-translate-y-0.5 oscuro:bg-white oscuro:p-2"
              >
                <img
                  [src]="asociacion.logo"
                  [alt]="asociacion.nombre"
                  [width]="asociacion.ancho"
                  [height]="asociacion.alto"
                  [class]="asociacion.clase"
                  loading="lazy"
                />
              </a>
            </li>
          }
        </ul>
      </div>
    </footer>
  `,
})
export class Footer {
  // Logos descargados de la web de cada asociación (public/img/asociaciones).
  // Tienen letras oscuras sobre fondo transparente: en el tema oscuro van
  // sobre una placa blanca (oscuro:bg-white) para que se lean.
  protected readonly asociaciones = [
    {
      nombre: 'Scouts MSC, Movimiento Scout Católico',
      url: 'https://scouts.es/',
      logo: '/img/asociaciones/msc.png',
      ancho: 724,
      alto: 134,
      clase: 'h-9 w-auto',
    },
    {
      nombre: 'Federación de Scouts Católicos de Castilla-La Mancha',
      url: 'https://www.fsc-clm.org/',
      logo: '/img/asociaciones/fsc-clm.png',
      ancho: 270,
      alto: 270,
      clase: 'h-16 w-auto',
    },
    {
      nombre: 'Scouts de Guadalajara',
      url: 'https://www.scoutsdeguadalajara.es/',
      logo: '/img/asociaciones/scouts-guadalajara.png',
      ancho: 600,
      alto: 183,
      clase: 'h-11 w-auto',
    },
  ];
}
