import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Accesibilidad · Grupo Scout Nadino',
};

@Component({
  selector: 'app-accesibilidad',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">
      Declaración de accesibilidad
    </h1>

    <app-aviso-borrador>
      Texto pendiente. Se escribe al final, cuando las auditorías de axe y
      Lighthouse de la tarea 0.7 digan el nivel real de conformidad.
    </app-aviso-borrador>
  `,
})
export default class AccesibilidadPage {}
