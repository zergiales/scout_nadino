import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Secciones · Grupo Scout Nadino',
};

@Component({
  selector: 'app-secciones',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Secciones</h1>

    <app-aviso-borrador>
      El listado real se genera a partir de
      <code>src/content/secciones/*.md</code>, con una tarjeta por sección y su
      página de detalle en <code>/secciones/:slug</code>.
    </app-aviso-borrador>

    <p>
      Cada sección tendrá su página con las actividades que hace, las edades, el
      horario de reuniones y fotos.
    </p>
  `,
})
export default class SeccionesPage {}
