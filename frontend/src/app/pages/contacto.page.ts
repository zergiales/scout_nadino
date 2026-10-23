import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';


export const routeMeta: RouteMeta = {
  title: 'Contacto · Grupo Scout Nadino',
};

/**
 * Contacto. En la fase 1 no hay formulario: un formulario necesita servidor y
 * la web pública no depende de ninguno.
 *
 * El mapa es de OpenStreetMap a propósito, no de Google Maps: el iframe de
 * Google instala cookies y obligaría a poner un banner de consentimiento en
 * todo el sitio. La dirección está también en texto, porque un mapa
 * incrustado no lo lee un lector de pantalla.
 */
@Component({
  selector: 'app-contacto',
  imports: [RouterLink],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Contacto
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Escríbenos o pásate por el local un domingo por la tarde. Si lo que
        quieres es apuntar a tu
        hijo o hija, es más rápida la
        <a routerLink="/preinscripcion" class="font-bold text-marca">preinscripción</a>.
      </p>
    </section>


    <div class="relative isolate mt-10 grid gap-6 md:grid-cols-5">
      <div
        aria-hidden="true"
        class="absolute top-1/2 right-0 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-marca/20 blur-3xl"
      ></div>

      <!-- Datos -->
      <div class="flex flex-col gap-4 md:col-span-2">
        @for (dato of datos; track dato.titulo) {
          <section
            [attr.aria-labelledby]="'dato-' + dato.id"
            class="flex gap-4 rounded-3xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl"
          >
            <span
              class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-marca-suave"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-5 w-5 fill-none stroke-marca"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                @for (d of dato.icono; track $index) {
                  <path [attr.d]="d" />
                }
              </svg>
            </span>
            <div>
              <h2 [id]="'dato-' + dato.id" class="m-0 text-base font-bold text-marca">
                {{ dato.titulo }}
              </h2>
              @if (dato.id === 'direccion') {
                <address class="mt-1 text-tinta not-italic">
                  Parroquia de la Santa Cruz<br />
                  Av. de la Constitución, 1<br />
                  19200 Azuqueca de Henares (Guadalajara)
                </address>
              } @else {
                <p class="mt-1 mb-0 text-tinta-suave">
                  <em>Pendiente de confirmar</em>
                </p>
              }
            </div>
          </section>
        }
      </div>

      <!-- Mapa -->
      <section
        aria-labelledby="titulo-mapa"
        class="flex flex-col rounded-3xl border border-white/80 bg-white/60 p-3 shadow-sm backdrop-blur-xl md:col-span-3"
      >
        <h2 id="titulo-mapa" class="sr-only">En el mapa</h2>
        <iframe
          title="Mapa con la ubicación del local del grupo, en la Parroquia de la Santa Cruz de Azuqueca de Henares"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-3.2755%2C40.5607%2C-3.2595%2C40.5687&amp;layer=mapnik&amp;marker=40.564693%2C-3.267574"
          loading="lazy"
          class="h-80 w-full grow rounded-2xl border border-borde md:h-auto md:min-h-80"
        ></iframe>
        <p class="mt-2 mb-1 px-2 text-sm">
          <a
            href="https://www.openstreetmap.org/?mlat=40.564693&amp;mlon=-3.267574#map=17/40.564693/-3.267574"
            rel="noopener noreferrer"
            class="font-bold text-marca"
          >
            Ver el mapa más grande
          </a>
        </p>
      </section>
    </div>

    <!-- Según lo que necesites -->
    <section aria-labelledby="titulo-necesidades" class="mt-16">
      <h2 id="titulo-necesidades" class="m-0 text-3xl font-extrabold text-marca">
        Según lo que necesites
      </h2>
      <dl class="mt-6 grid gap-4 sm:grid-cols-2">
        <div
          class="aparece-al-scroll rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-lg font-bold text-tinta">
            Quiero apuntar a mi hijo o hija
          </dt>
          <dd class="mt-1 mb-0 text-tinta-suave">
            Rellena la
            <a routerLink="/preinscripcion" class="font-bold text-marca">preinscripción</a>
            y te llamamos nosotros.
          </dd>
        </div>
        <div
          class="aparece-al-scroll rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-lg font-bold text-tinta">
            Quiero ser monitor o monitora
          </dt>
          <dd class="mt-1 mb-0 text-tinta-suave">
            Escríbenos contando un poco de ti. No hace falta haber sido scout.
          </dd>
        </div>
        <div
          class="aparece-al-scroll rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-lg font-bold text-tinta">
            Soy antiguo miembro del grupo
          </dt>
          <dd class="mt-1 mb-0 text-tinta-suave">
            Escríbenos: si tienes fotos o recuerdos del grupo, nos interesan.
          </dd>
        </div>
        <div
          class="aparece-al-scroll rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-lg font-bold text-tinta">
            Quiero avisar de un problema con esta web
          </dt>
          <dd class="mt-1 mb-0 text-tinta-suave">
            Mira la
            <a routerLink="/legal/accesibilidad" class="font-bold text-marca">
              declaración de accesibilidad
            </a>
            y cuéntanoslo.
          </dd>
        </div>
      </dl>
    </section>
  `,
})
export default class ContactoPage {
  // Iconos con el trazo de Lucide (ISC).
  protected readonly datos = [
    {
      id: 'direccion',
      titulo: 'Dónde estamos',
      icono: [
        'M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0',
        'M12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
      ],
    },
    {
      id: 'correo',
      titulo: 'Escríbenos',
      icono: [
        'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
        'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
      ],
    },
    {
      id: 'reuniones',
      titulo: 'Reuniones',
      icono: ['M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20', 'M12 6v6l4 2'],
    },
  ];
}
