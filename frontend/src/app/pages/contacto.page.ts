import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../shared/ui/aviso-borrador';

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
  imports: [RouterLink, AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Contacto</h1>

    <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
      Escríbenos o pásate por el local un domingo por la tarde. Si lo que
      quieres es apuntar a tu hijo o hija, es más rápido la
      <a routerLink="/preinscripcion" class="text-marca">preinscripción</a>.
    </p>

    <app-aviso-borrador>
      Faltan el correo del grupo, el horario de reuniones y las redes sociales.
      No los pongo inventados.
    </app-aviso-borrador>

    <div class="mt-10 grid gap-10 md:grid-cols-2">
      <div>
        <h2 class="mt-0 text-2xl font-bold text-marca">Dónde estamos</h2>
        <address class="mt-3 not-italic">
          Parroquia de la Santa Cruz<br />
          Av. de la Constitución, 1<br />
          19200 Azuqueca de Henares (Guadalajara)
        </address>

        <h2 class="mt-8 text-2xl font-bold text-marca">Escríbenos</h2>
        <p class="mt-3">
          Correo del grupo: <em>pendiente de confirmar</em>
        </p>

        <h2 class="mt-8 text-2xl font-bold text-marca">Reuniones</h2>
        <p class="mt-3">
          Horario: <em>pendiente de confirmar</em>
        </p>
      </div>

      <div>
        <h2 class="mt-0 text-2xl font-bold text-marca">En el mapa</h2>
        <iframe
          title="Mapa con la ubicación del local del grupo, en la Parroquia de la Santa Cruz de Azuqueca de Henares"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-3.2755%2C40.5607%2C-3.2595%2C40.5687&amp;layer=mapnik&amp;marker=40.564693%2C-3.267574"
          loading="lazy"
          class="mt-3 h-72 w-full rounded border-2 border-gray-400"
        ></iframe>
        <p class="mt-2 text-sm">
          <a
            href="https://www.openstreetmap.org/?mlat=40.564693&amp;mlon=-3.267574#map=17/40.564693/-3.267574"
            rel="noopener noreferrer"
            class="text-marca"
          >
            Ver el mapa más grande
          </a>
        </p>
      </div>
    </div>

    <h2 class="mt-12 text-2xl font-bold text-marca">Según lo que necesites</h2>
    <dl class="mt-4 flex flex-col gap-5">
      <div>
        <dt class="font-semibold">Quiero apuntar a mi hijo o hija</dt>
        <dd class="m-0 text-tinta-suave">
          Rellena la
          <a routerLink="/preinscripcion" class="text-marca">preinscripción</a>
          y te llamamos nosotros.
        </dd>
      </div>
      <div>
        <dt class="font-semibold">Quiero ser monitor o monitora</dt>
        <dd class="m-0 text-tinta-suave">
          Escríbenos contando un poco de ti. No hace falta haber sido scout.
        </dd>
      </div>
      <div>
        <dt class="font-semibold">Soy antiguo miembro del grupo</dt>
        <dd class="m-0 text-tinta-suave">
          Escríbenos: si tienes fotos o recuerdos del grupo, nos interesan.
        </dd>
      </div>
      <div>
        <dt class="font-semibold">
          Quiero avisar de un problema con esta web
        </dt>
        <dd class="m-0 text-tinta-suave">
          Mira la
          <a routerLink="/legal/accesibilidad" class="text-marca">
            declaración de accesibilidad
          </a>
          y cuéntanoslo.
        </dd>
      </div>
    </dl>
  `,
})
export default class ContactoPage {}
