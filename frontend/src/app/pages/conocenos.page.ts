import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Conócenos · Grupo Scout Nadino',
};

@Component({
  selector: 'app-conocenos',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Conócenos</h1>

    <app-aviso-borrador>
      Página vacía a propósito. Su contenido vendrá de
      <code>src/content/paginas/conocenos.md</code> a través de un servicio.
    </app-aviso-borrador>

    <p>Cuando esté escrita, esta página contará:</p>
    <ul>
      <li>La historia del grupo.</li>
      <li>Qué es el método scout y cómo se trabaja aquí.</li>
      <li>Quién forma el kraal.</li>
      <li>A qué asociación pertenece el grupo.</li>
      <li>Dónde está el local.</li>
    </ul>
  `,
})
export default class ConocenosPage {}
