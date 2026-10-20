import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Privacidad · Grupo Scout Nadino',
};

@Component({
  selector: 'app-privacidad',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">
      Política de privacidad
    </h1>

    <app-aviso-borrador>
      Texto pendiente. Es la página más delicada del sitio: hay datos de
      menores, así que la redacta alguien que conozca el tratamiento real que
      hace el grupo.
    </app-aviso-borrador>
  `,
})
export default class PrivacidadPage {}
