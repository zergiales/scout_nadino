import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Aviso legal · Grupo Scout Nadino',
};

@Component({
  selector: 'app-aviso-legal',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Aviso legal</h1>

    <app-aviso-borrador>
      Texto pendiente. Necesita los datos de titularidad reales de la
      asociación; no es algo que se pueda redactar a ojo.
    </app-aviso-borrador>
  `,
})
export default class AvisoLegalPage {}
