import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../../shared/ui/aviso-borrador';

export const routeMeta: RouteMeta = {
  title: 'Jota-Joti 2026 · Grupo Scout Nadino',
};

/**
 * Página del Jota-Joti 2026.
 *
 * Esto es contenido, no código: en cuanto exista `SeccionesService` y el resto
 * de la capa de datos (tarea 0.4), este texto se mueve a
 * `src/content/eventos/joti-2026.md` y cada octubre el kraal solo cambia ese
 * fichero. Mientras tanto va aquí escrito a mano para poder verlo ya.
 */
@Component({
  selector: 'app-joti-2026',
  imports: [AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Jota-Joti 2026</h1>

    <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
      El fin de semana del <strong>16 al 18 de octubre de 2026</strong>, scouts
      de todo el mundo se conectan entre ellos por radio y por internet. Es la
      actividad scout más grande del año y participar es gratis.
    </p>

    <app-aviso-borrador>
      Faltan los datos de esta edición: el JID del grupo, si se participa desde
      una acampada y el enlace para registrar los contactos.
    </app-aviso-borrador>

    <h2 class="mt-10 text-2xl font-bold text-marca">¿Qué es?</h2>
    <p>
      Son dos actividades a la vez: el <strong>JOTA</strong> (Jamboree On The
      Air), que se hace por radioafición, y el <strong>JOTI</strong> (Jamboree
      On The Internet), que se hace por chat. La idea es sencilla: hablar con
      scouts de otros países, apuntar cada contacto y descubrir que el mismo
      juego se juega en todas partes. El tema de este año es «un mundo pacífico
      e inclusivo».
    </p>

    <h2 class="mt-10 text-2xl font-bold text-marca">¿Cómo participo?</h2>
    <p>
      Se puede participar desde la actividad del grupo o desde casa. Si tu hijo
      o hija se conecta desde casa, que sea acompañado: va a hablar con
      desconocidos de todo el mundo, y los menores de 13 años tienen que estar
      registrados por un adulto.
    </p>
    <p>
      Cuando habléis con otro grupo, apuntad su ciudad y su país, no solo el
      país: es lo que luego cuenta para el recuento de contactos.
    </p>

    <h2 class="mt-10 text-2xl font-bold text-marca">Enlaces</h2>
    <ul>
      <li>
        <a
          href="https://www.jotajoti.info/"
          rel="noopener noreferrer"
          class="text-marca"
        >
          Web oficial del Jota-Joti
        </a>
        — programa, registro y actividades.
      </li>
      <li>
        <a
          href="https://www.scoutlink.net/"
          rel="noopener noreferrer"
          class="text-marca"
        >
          ScoutLink
        </a>
        — las salas de chat oficiales. La sala en inglés es donde se hacen más
        contactos.
      </li>
    </ul>
  `,
})
export default class Joti2026Page {}
