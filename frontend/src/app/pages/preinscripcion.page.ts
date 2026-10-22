import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';


export const routeMeta: RouteMeta = {
  title: 'Preinscripción · Grupo Scout Nadino',
};

interface ErrorResumen {
  campo: string;
  mensaje: string;
}

/**
 * Preinscripción: apuntarse a la lista, que no es formalizar la inscripción.
 * Por eso aquí se piden los datos mínimos para poder llamar a la familia; los
 * datos del educando, la salud y la autorización de imagen se recogen en
 * persona al formalizarla, y no viajan por la web.
 *
 * El envío NO está conectado: una web estática no puede recibir datos. Cuando
 * se decida el destino, el envío saldrá de un servicio de `core/services`.
 */
@Component({
  selector: 'app-preinscripcion',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="relative isolate">
      <div
        aria-hidden="true"
        class="absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
      ></div>
      <p
        class="m-0 inline-block rounded-full bg-marca px-3 py-1 text-sm font-bold text-white"
      >
        Ronda 2026-2027
      </p>
      <h1 class="mt-4 mb-0 text-4xl font-extrabold text-marca sm:text-5xl">
        Preinscripción
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta-suave sm:text-xl">
        Déjanos tus datos y te llamamos para contarte cómo funciona el grupo y
        si hay plaza en la rama que le corresponde. Esto <strong>no</strong> es
        la inscripción: no te compromete a nada.
      </p>
    </section>


    <div class="relative isolate mt-8 grid items-start gap-6 lg:grid-cols-3">
      <div
        aria-hidden="true"
        class="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-marca/20 blur-3xl"
      ></div>

      <div
        class="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-xl shadow-marca/10 backdrop-blur-xl sm:p-8 lg:col-span-2"
      >
        @if (enviado()) {
          <p
            role="status"
            class="mt-0 mb-6 rounded-r-xl border-l-4 border-marca bg-marca-suave px-4 py-3"
          >
            Los datos son válidos, pero <strong>no se han enviado</strong>: el
            destino todavía no está configurado. Nada ha salido de tu navegador.
          </p>
        }

        @if (errores().length > 0) {
          <div
            #resumen
            tabindex="-1"
            role="alert"
            class="mb-6 rounded-r-xl border-l-4 border-error bg-error-suave px-4 py-3 text-tinta"
          >
            <h2 class="m-0 text-base font-bold text-error">
              Revisa {{ errores().length === 1 ? 'este campo' : 'estos campos' }}
            </h2>
            <ul class="mt-2 mb-0 pl-5">
              @for (error of errores(); track error.campo) {
                <li>
                  <button
                    type="button"
                    class="bg-transparent p-0 text-left underline"
                    (click)="enfocar(error.campo)"
                  >
                    {{ error.mensaje }}
                  </button>
                </li>
              }
            </ul>
          </div>
        }

        <form
          [formGroup]="formulario"
          (ngSubmit)="enviar()"
          novalidate
          class="flex flex-col gap-6"
        >
          <p class="m-0 text-sm text-tinta-suave">
            Los campos marcados como obligatorios hacen falta para poder
            responderte.
          </p>

          <div class="flex flex-col gap-1.5">
            <label for="adulto" class="font-semibold text-tinta">
              Tu nombre y apellidos
              <span class="font-normal text-tinta-suave">(obligatorio)</span>
            </label>
            <p id="adulto-ayuda" class="m-0 text-sm text-tinta-suave">
              De la madre, el padre o el tutor que hace la preinscripción.
            </p>
            <input
              id="adulto"
              type="text"
              formControlName="adulto"
              autocomplete="name"
              aria-describedby="adulto-ayuda"
              [attr.aria-invalid]="esInvalido('adulto') ? 'true' : null"
              [class]="claseCampo"
            />
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="email" class="font-semibold text-tinta">
                Correo electrónico
                <span class="font-normal text-tinta-suave">(obligatorio)</span>
              </label>
              <p id="email-ayuda" class="m-0 text-sm text-tinta-suave">
                Es por donde te contestamos: revísalo bien.
              </p>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                aria-describedby="email-ayuda"
                [attr.aria-invalid]="esInvalido('email') ? 'true' : null"
                [class]="claseCampo"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="telefono" class="font-semibold text-tinta">
                Teléfono
                <span class="font-normal text-tinta-suave">(obligatorio)</span>
              </label>
              <p id="telefono-ayuda" class="m-0 text-sm text-tinta-suave">
                Para llamarte y contarte cómo funciona.
              </p>
              <input
                id="telefono"
                type="tel"
                formControlName="telefono"
                autocomplete="tel"
                aria-describedby="telefono-ayuda"
                [attr.aria-invalid]="esInvalido('telefono') ? 'true' : null"
                [class]="claseCampo"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="anyoNacimiento" class="font-semibold text-tinta">
              Año de nacimiento del niño o la niña
              <span class="font-normal text-tinta-suave">(obligatorio)</span>
            </label>
            <p id="anyo-ayuda" class="m-0 text-sm text-tinta-suave">
              Solo el año, cuatro cifras. Con eso sabemos qué rama le toca.
            </p>
            <input
              id="anyoNacimiento"
              type="number"
              inputmode="numeric"
              formControlName="anyoNacimiento"
              aria-describedby="anyo-ayuda"
              [attr.aria-invalid]="esInvalido('anyoNacimiento') ? 'true' : null"
              [class]="claseCampo + ' sm:max-w-48'"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="observaciones" class="font-semibold text-tinta">
              ¿Algo que quieras contarnos?
            </label>
            <textarea
              id="observaciones"
              rows="4"
              formControlName="observaciones"
              [class]="claseCampo"
            ></textarea>
          </div>

          <div class="flex gap-3 rounded-2xl bg-marca-suave p-4">
            <input
              id="privacidad"
              type="checkbox"
              formControlName="privacidad"
              [attr.aria-invalid]="esInvalido('privacidad') ? 'true' : null"
              class="mt-0.5 h-5 w-5 shrink-0 accent-marca"
            />
            <label for="privacidad" class="text-tinta">
              He leído la
              <a routerLink="/legal/privacidad" class="font-bold text-marca">
                política de privacidad
              </a>
              y acepto que uséis estos datos para contactar conmigo.
              <span class="text-tinta-suave">(obligatorio)</span>
            </label>
          </div>

          <button
            type="submit"
            class="group inline-flex items-center gap-2 self-start rounded-xl bg-marca px-6 py-4 text-lg font-bold text-white shadow-lg shadow-marca/25 transition duration-500 ease-suave hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
          >
            Enviar la preinscripción
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5 fill-none stroke-current transition-transform duration-500 ease-suave motion-safe:group-hover:translate-x-1"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      <!-- Cómo funciona -->
      <aside
        aria-labelledby="titulo-pasos"
        class="rounded-3xl bg-marca-suave p-6 sm:p-8 lg:sticky lg:top-28"
      >
        <h2 id="titulo-pasos" class="m-0 text-xl font-extrabold text-marca">
          Cómo funciona
        </h2>
        <ol class="mt-5 mb-0 flex list-none flex-col gap-5 p-0">
          @for (paso of pasos; track paso.titulo; let i = $index) {
            <li class="flex gap-4">
              <span
                aria-hidden="true"
                class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marca font-bold text-white"
              >
                {{ i + 1 }}
              </span>
              <div>
                <p class="m-0 font-bold text-tinta">{{ paso.titulo }}</p>
                <p class="mt-0.5 mb-0 text-sm text-tinta-suave">
                  {{ paso.texto }}
                </p>
              </div>
            </li>
          }
        </ol>
        <p class="mt-6 mb-0 border-t border-marca/20 pt-4 text-sm text-tinta-suave">
          Solo pedimos lo imprescindible. Los datos del niño o la niña se
          recogen en persona al formalizar la inscripción, nunca por la web.
        </p>
      </aside>
    </div>
  `,
})
export default class PreinscripcionPage {
  private readonly fb = inject(FormBuilder);
  private readonly resumen = viewChild<ElementRef<HTMLElement>>('resumen');

  protected readonly enviado = signal(false);
  protected readonly errores = signal<ErrorResumen[]>([]);

  /** Mismo aspecto para todos los campos de texto; en rojo si tienen error. */
  protected readonly claseCampo =
    'w-full rounded-xl border-2 border-borde bg-white/80 px-4 py-3 text-tinta transition-colors duration-300 ease-suave hover:border-marca-claro focus:border-marca aria-invalid:border-error aria-invalid:bg-error-suave';

  protected readonly pasos = [
    { titulo: 'Rellenas este formulario', texto: 'Son dos minutos.' },
    {
      titulo: 'Te llamamos',
      texto: 'Te contamos cómo funciona el grupo y si hay plaza.',
    },
    {
      titulo: 'Formalizáis la inscripción',
      texto: 'En persona, en el local, con el resto de datos.',
    },
  ];

  protected readonly formulario = this.fb.nonNullable.group({
    adulto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    anyoNacimiento: [
      '',
      [Validators.required, Validators.min(2000), Validators.max(2026)],
    ],
    observaciones: [''],
    privacidad: [false, Validators.requiredTrue],
  });

  private readonly mensajes: Record<string, string> = {
    adulto: 'Escribe tu nombre y apellidos.',
    email: 'Escribe un correo electrónico válido, con @.',
    telefono: 'Escribe un teléfono de contacto.',
    anyoNacimiento: 'Escribe el año de nacimiento con cuatro cifras.',
    privacidad: 'Tienes que aceptar la política de privacidad.',
  };

  protected esInvalido(campo: string): boolean {
    return this.errores().some((error) => error.campo === campo);
  }

  protected enfocar(campo: string): void {
    document.getElementById(campo)?.focus();
  }

  protected enviar(): void {
    const fallos = Object.keys(this.mensajes)
      .filter((campo) => this.formulario.get(campo)?.invalid)
      .map((campo) => ({ campo, mensaje: this.mensajes[campo] }));

    this.errores.set(fallos);
    this.enviado.set(fallos.length === 0);

    if (fallos.length > 0) {
      // El foco va al resumen: así un lector de pantalla lo anuncia y con
      // teclado no hay que ir buscando los errores a mano.
      setTimeout(() => this.resumen()?.nativeElement.focus(), 0);
    }
  }
}
