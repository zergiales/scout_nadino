import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Accesibilidad · Grupo Scout Nadino',
};

@Component({
  selector: 'app-accesibilidad',
  imports: [RouterLink],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">
      Declaración de accesibilidad
    </h1>

    <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
      Estamos preparando este texto. Si mientras tanto tienes cualquier duda,
      <a routerLink="/contacto" class="font-bold text-marca">escríbenos</a>.
    </p>
  `,
})
export default class AccesibilidadPage {}
