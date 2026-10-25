import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';


export const routeMeta: RouteMeta = {
  title: 'Conócenos · Grupo Scout Nadino',
};

/**
 * Conócenos. Solo lleva lo que ya se sabe (asociación, local, método scout,
 * que es común a todos los grupos); la historia y el kraal esperan al texto
 * del grupo. El contenido definitivo viene de
 * `src/content/paginas/conocenos.md` a través de un servicio (tarea 0.4).
 */
@Component({
  selector: 'app-conocenos',
  imports: [RouterLink],
  template: `
    <section class="relative isolate">
      <div aria-hidden="true">
        <div
          class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
        ></div>
        <div
          class="absolute top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-marca-claro/20 blur-3xl"
        ></div>
      </div>
      <h1 class="m-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Conócenos
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Somos un grupo scout de Azuqueca de Henares. Chicos y chicas de 6 a 21
        años que aprenden jugando, en equipo y en la naturaleza, acompañados
        por un equipo de monitores voluntarios.
      </p>
    </section>


    <!-- Método scout -->
    <section aria-labelledby="titulo-metodo" class="mt-12">
      <h2 id="titulo-metodo" class="m-0 text-3xl font-extrabold text-marca">
        Qué es el escultismo
      </h2>
      <p class="mt-2 max-w-2xl text-tinta-suave">
        Un movimiento educativo presente en casi todos los países del mundo. Su
        forma de educar se resume en cuatro ideas:
      </p>

      <ul class="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
        @for (idea of metodo; track idea.titulo) {
          <li class="aparece-al-scroll">
            <div
              class="flex h-full gap-4 rounded-3xl border border-superficie/80 bg-superficie/60 p-6 shadow-sm backdrop-blur-xl transition duration-500 ease-suave hover:shadow-lg motion-safe:hover:-translate-y-1"
            >
              <span
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-marca-suave"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-none stroke-marca"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  @for (d of idea.icono; track $index) {
                    <path [attr.d]="d" />
                  }
                </svg>
              </span>
              <div>
                <h3 class="m-0 text-lg font-bold text-tinta">
                  {{ idea.titulo }}
                </h3>
                <p class="mt-1 mb-0 text-tinta-suave">{{ idea.texto }}</p>
              </div>
            </div>
          </li>
        }
      </ul>
    </section>

    <!-- El grupo -->
    <section aria-labelledby="titulo-grupo" class="relative isolate mt-16">
      <div
        aria-hidden="true"
        class="absolute top-1/3 right-0 -z-10 h-72 w-72 rounded-full bg-marca/20 blur-3xl"
      ></div>
      <h2 id="titulo-grupo" class="m-0 text-3xl font-extrabold text-marca">
        El grupo
      </h2>

      <dl class="mt-6 grid gap-4 md:grid-cols-2">
        <div
          class="rounded-3xl border border-superficie/80 bg-superficie/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-sm font-bold tracking-wide text-marca uppercase">
            A qué pertenecemos
          </dt>
          <dd class="mt-2 mb-0 text-lg text-tinta">
            Scouts de Guadalajara, dentro del Movimiento Scout Católico (MSC).
          </dd>
        </div>
        <div
          class="rounded-3xl border border-superficie/80 bg-superficie/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <dt class="text-sm font-bold tracking-wide text-marca uppercase">
            Dónde nos reunimos
          </dt>
          <dd class="mt-2 mb-0 text-lg text-tinta">
            En la Parroquia de la Santa Cruz, en Azuqueca de Henares.
            <a routerLink="/contacto" class="mt-1 block text-base font-bold text-marca">
              Cómo llegar
            </a>
          </dd>
        </div>
        <div
          class="rounded-3xl border border-dashed border-marca/40 bg-superficie/40 p-6 backdrop-blur-xl"
        >
          <dt class="text-sm font-bold tracking-wide text-marca uppercase">
            Nuestra historia
          </dt>
          <dd class="mt-2 mb-0 text-tinta-suave">Pendiente del kraal.</dd>
        </div>
        <div
          class="rounded-3xl border border-dashed border-marca/40 bg-superficie/40 p-6 backdrop-blur-xl"
        >
          <dt class="text-sm font-bold tracking-wide text-marca uppercase">
            El kraal
          </dt>
          <dd class="mt-2 mb-0 text-tinta-suave">
            El equipo de monitores voluntarios que lleva el grupo. Su
            presentación está pendiente.
          </dd>
        </div>
      </dl>
    </section>

    <!-- Siguiente paso -->
    <section
      aria-labelledby="titulo-siguiente"
      class="mt-16 grid gap-4 sm:grid-cols-2"
    >
      <h2 id="titulo-siguiente" class="sr-only">Siguiente paso</h2>
      <a
        routerLink="/ramas"
        class="group rounded-3xl bg-marca-suave p-6 no-underline transition duration-500 ease-suave hover:shadow-lg motion-safe:hover:-translate-y-1"
      >
        <span class="block text-xl font-bold text-marca">Ver las ramas</span>
        <span class="mt-1 block text-tinta-suave">
          Qué hace cada edad, de los 6 a los 21 años.
        </span>
      </a>
      <a
        routerLink="/preinscripcion"
        class="group rounded-3xl bg-marca p-6 no-underline shadow-lg shadow-marca/25 transition duration-500 ease-suave hover:bg-marca-oscuro motion-safe:hover:-translate-y-1"
      >
        <span class="block text-xl font-bold text-sobre-marca">Hacer la preinscripción</span>
        <span class="mt-1 block text-sobre-marca/90">
          Un formulario corto y sin compromiso.
        </span>
      </a>
    </section>
  `,
})
export default class ConocenosPage {
  // Iconos con el trazo de Lucide (ISC).
  protected readonly metodo = [
    {
      titulo: 'Aprender haciendo',
      texto: 'Se aprende viviendo las cosas, no escuchando cómo se hacen.',
      icono: [
        'M18 11V6a2 2 0 0 0-4 0v5',
        'M14 10V4a2 2 0 0 0-4 0v2',
        'M10 10.5V6a2 2 0 0 0-4 0v8',
        'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
      ],
    },
    {
      titulo: 'En pequeños equipos',
      texto: 'Cada uno tiene su papel y el equipo decide y responde en conjunto.',
      icono: [
        'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
        'M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
        'M22 21v-2a4 4 0 0 0-3-3.87',
        'M16 3.13a4 4 0 0 1 0 7.75',
      ],
    },
    {
      titulo: 'En la naturaleza',
      texto: 'El campo es el mejor sitio para aprender a cuidarlo y a cuidarse.',
      icono: [
        'm17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z',
        'M12 22v-3',
      ],
    },
    {
      titulo: 'Con valores',
      texto: 'Un compromiso personal con la ley scout: ayudar a los demás y dejar el mundo mejor.',
      icono: [
        'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
      ],
    },
  ];
}
