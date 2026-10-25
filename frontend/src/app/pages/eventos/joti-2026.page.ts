import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { MapaConexiones } from '../../shared/ui/mapa-conexiones';

export const routeMeta: RouteMeta = {
  title: 'Jota-Joti 2026 · Grupo Scout Nadino',
};

/**
 * Página del Jota-Joti 2026, ya celebrado (16-18 de octubre de 2026).
 *
 * Esto es contenido, no código: en cuanto exista la capa de datos (tarea
 * 0.4), este texto se mueve a `src/content/eventos/joti-2026.md` y cada
 * octubre el kraal solo crea el fichero de la edición nueva. Mientras tanto va
 * aquí escrito a mano.
 */
@Component({
  selector: 'app-joti-2026',
  imports: [RouterLink, MapaConexiones],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <p
        class="m-0 inline-block rounded-full bg-marca-suave px-3 py-1 text-sm font-bold text-marca"
      >
        16, 17 y 18 de octubre de 2026
      </p>
      <h1 class="mt-4 mb-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Así fue el Jota-Joti 2026
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Durante un fin de semana, scouts de todo el mundo se conectaron entre
        ellos por radio y por internet. Es la actividad scout más grande del año,
        y participar fue gratis.
      </p>
    </section>

    <div class="mt-10 grid items-start gap-10 md:grid-cols-2">
      <div>
        <h2 class="m-0 text-2xl font-extrabold text-marca">Qué es</h2>
        <p class="mt-3 text-tinta-suave">
          Son dos actividades a la vez: el <strong class="text-tinta">JOTA</strong>
          (Jamboree On The Air), por radioafición, y el
          <strong class="text-tinta">JOTI</strong> (Jamboree On The Internet),
          por chat. La idea es sencilla: hablar con scouts de otros países,
          apuntar cada contacto y descubrir que el mismo juego se juega en
          todas partes.
        </p>
        <p class="text-tinta-suave">
          El tema de esta edición fue
          <strong class="text-tinta">«un mundo pacífico e inclusivo»</strong>.
        </p>

        <h2 class="mt-10 mb-0 text-2xl font-extrabold text-marca">
          Cómo se participó
        </h2>
        <p class="mt-3 text-tinta-suave">
          Se podía participar desde la actividad del grupo o desde casa. Desde
          casa, siempre acompañados de un adulto: se habla con desconocidos de
          todo el mundo, y los menores de 13 años tenían que registrarse a
          través de un adulto.
        </p>
        <p class="text-tinta-suave">
          En cada contacto se apuntaban la ciudad y el país del otro grupo, que
          es lo que cuenta para el recuento final.
        </p>
      </div>

      <div class="relative">
        <div
          aria-hidden="true"
          class="absolute inset-8 -z-10 rounded-full bg-marca/30 blur-3xl"
        ></div>
        <div
          class="rounded-3xl border border-superficie/70 bg-superficie/50 p-4 shadow-xl shadow-marca/10 backdrop-blur-xl sm:p-6"
        >
          <app-mapa-conexiones />
        </div>
      </div>
    </div>

    <section
      aria-labelledby="titulo-siguiente"
      class="mt-16 rounded-3xl bg-marca-suave px-6 py-10 sm:px-10"
    >
      <h2 id="titulo-siguiente" class="m-0 text-2xl font-extrabold text-marca">
        Hasta la próxima edición
      </h2>
      <p class="mt-3 max-w-2xl text-tinta-suave">
        El Jota-Joti se celebra cada año en octubre. Mientras llega el de 2027,
        puedes curiosear en la web oficial o en las salas de chat scouts.
      </p>
      <ul class="mt-4 mb-0 flex list-none flex-col gap-3 p-0 sm:flex-row sm:gap-6">
        <li>
          <a
            href="https://www.jotajoti.info/"
            rel="noopener noreferrer"
            class="font-bold text-marca"
          >
            Web oficial del Jota-Joti
          </a>
        </li>
        <li>
          <a
            href="https://chat.jotajoti.info"
            rel="noopener noreferrer"
            class="font-bold text-marca"
          >
            Chat oficial del Jota-Joti
          </a>
        </li>
      </ul>
      <p class="mt-8 mb-0">
        <a
          routerLink="/preinscripcion"
          class="inline-block rounded-lg bg-marca px-6 py-3 font-bold text-sobre-marca no-underline shadow-lg shadow-marca/25 transition hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
        >
          ¿Quieres vivirlo el año que viene? Haz la preinscripción
        </a>
      </p>
    </section>
  `,
})
export default class Joti2026Page {}
