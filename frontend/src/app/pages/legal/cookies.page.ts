import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Cookies · Grupo Scout Nadino',
};

@Component({
  selector: 'app-cookies',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Cookies</h1>

    <app-aviso-borrador>
      Hoy la web no usa cookies ni analítica. Si sigue así, esta página lo
      declara y no hace falta banner de consentimiento.
    </app-aviso-borrador>
  `,
})
export default class CookiesPage {}
