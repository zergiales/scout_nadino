import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Página no encontrada · Grupo Scout Nadino',
};

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">
      No encontramos esa página
    </h1>

    <p class="mt-4">
      Puede que el enlace esté antiguo o que la hayamos movido. Prueba por aquí:
    </p>

    <ul>
      <li><a routerLink="/" class="text-marca">Inicio</a></li>
      <li><a routerLink="/conocenos" class="text-marca">Conócenos</a></li>
      <li><a routerLink="/secciones" class="text-marca">Secciones</a></li>
      <li>
        <a routerLink="/preinscripcion" class="text-marca">Preinscripción</a>
      </li>
      <li><a routerLink="/contacto" class="text-marca">Contacto</a></li>
    </ul>
  `,
})
export default class NotFoundPage {}
