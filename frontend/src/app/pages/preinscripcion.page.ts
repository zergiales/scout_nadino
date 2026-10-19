import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { AvisoBorrador } from '../shared/ui/aviso-borrador';

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
  imports: [ReactiveFormsModule, RouterLink, AvisoBorrador],
  template: `
    <h1 class="m-0 text-3xl font-bold text-marca">Preinscripción</h1>

    <p class="mt-4 max-w-2xl text-lg text-tinta-suave">
      Déjanos tus datos y te llamamos para contarte cómo funciona el grupo y si
      hay plaza en la sección que le corresponde. Esto <strong>no</strong> es la
      inscripción: no te compromete a nada.
    </p>

    <app-aviso-borrador>
      El formulario funciona, pero <strong>todavía no envía nada</strong>: falta
      decidir a dónde llegan las preinscripciones. Los plazos y las cuotas
      también están pendientes.
    </app-aviso-borrador>

    @if (enviado()) {
      <p
        role="status"
        class="my-6 border-l-4 border-scouts bg-marca-suave px-4 py-3"
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
        class="my-6 border-l-4 border-rutas bg-red-50 px-4 py-3"
      >
        <h2 class="m-0 text-base font-bold">
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
      class="mt-8 flex max-w-xl flex-col gap-6"
    >
      <p class="m-0 text-sm text-tinta-suave">
        Los campos marcados como obligatorios hacen falta para poder
        responderte.
      </p>

      <div class="flex flex-col gap-1">
        <label for="adulto" class="font-semibold">
          Tu nombre y apellidos <span class="font-normal">(obligatorio)</span>
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
          class="rounded border-2 border-gray-400 px-3 py-2"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="email" class="font-semibold">
          Correo electrónico <span class="font-normal">(obligatorio)</span>
        </label>
        <p id="email-ayuda" class="m-0 text-sm text-tinta-suave">
          Es por donde te contestamos, así que revísalo bien.
        </p>
        <input
          id="email"
          type="email"
          formControlName="email"
          autocomplete="email"
          aria-describedby="email-ayuda"
          [attr.aria-invalid]="esInvalido('email') ? 'true' : null"
          class="rounded border-2 border-gray-400 px-3 py-2"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="telefono" class="font-semibold">
          Teléfono <span class="font-normal">(obligatorio)</span>
        </label>
        <input
          id="telefono"
          type="tel"
          formControlName="telefono"
          autocomplete="tel"
          [attr.aria-invalid]="esInvalido('telefono') ? 'true' : null"
          class="rounded border-2 border-gray-400 px-3 py-2"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="anyoNacimiento" class="font-semibold">
          Año de nacimiento del niño o la niña
          <span class="font-normal">(obligatorio)</span>
        </label>
        <p id="anyo-ayuda" class="m-0 text-sm text-tinta-suave">
          Solo el año, cuatro cifras. Con eso sabemos qué sección le toca.
        </p>
        <input
          id="anyoNacimiento"
          type="number"
          inputmode="numeric"
          formControlName="anyoNacimiento"
          aria-describedby="anyo-ayuda"
          [attr.aria-invalid]="esInvalido('anyoNacimiento') ? 'true' : null"
          class="rounded border-2 border-gray-400 px-3 py-2"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="observaciones" class="font-semibold">
          ¿Algo que quieras contarnos?
        </label>
        <textarea
          id="observaciones"
          rows="4"
          formControlName="observaciones"
          class="rounded border-2 border-gray-400 px-3 py-2"
        ></textarea>
      </div>

      <div class="flex gap-3">
        <input
          id="privacidad"
          type="checkbox"
          formControlName="privacidad"
          [attr.aria-invalid]="esInvalido('privacidad') ? 'true' : null"
          class="mt-1 h-5 w-5 shrink-0"
        />
        <label for="privacidad">
          He leído la
          <a routerLink="/legal/privacidad" class="text-marca">
            política de privacidad
          </a>
          y acepto que uséis estos datos para contactar conmigo.
          <span class="font-normal">(obligatorio)</span>
        </label>
      </div>

      <button
        type="submit"
        class="self-start rounded bg-acento px-5 py-3 font-semibold text-white"
      >
        Enviar la preinscripción
      </button>
    </form>
  `,
})
export default class PreinscripcionPage {
  private readonly fb = inject(FormBuilder);
  private readonly resumen = viewChild<ElementRef<HTMLElement>>('resumen');

  protected readonly enviado = signal(false);
  protected readonly errores = signal<ErrorResumen[]>([]);

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
