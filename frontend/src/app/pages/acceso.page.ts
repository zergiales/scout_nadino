import { Component, DOCUMENT, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { AccesoService } from '../core/services/acceso.service';

/** Rechaza el correo en el campo de usuario: es el despiste más común. */
function sinArroba(control: AbstractControl): ValidationErrors | null {
  return String(control.value).includes('@') ? { correo: true } : null;
}

export const routeMeta: RouteMeta = {
  title: 'Acceso al backoffice · Grupo Scout Nadino',
  meta: [{ name: 'robots', content: 'noindex' }],
};

/**
 * Pantalla de acceso al backoffice, a la que lleva el botón «Acceso» de la
 * cabecera.
 *
 * HOY ES UNA PUERTA, NO UN LOGIN (ADR-0003, enmienda 2): valida el formato de
 * los campos, pregunta a `AccesoService` y, si dice que sí, manda a
 * /backoffice/index.html, donde el backoffice pide la cuenta de GitHub para
 * publicar. El servicio todavía no comprueba la contraseña: eso llega con
 * `auth-service` en la fase 3, y entonces esta página no cambia, porque ya
 * sabe mostrar «usuario o contraseña incorrectos».
 *
 * La pantalla lo dice (debajo del botón) para que nadie crea que su
 * contraseña protege algo todavía.
 */
@Component({
  selector: 'app-acceso',
  imports: [ReactiveFormsModule, RouterLink],
  // Sin bloque `styles:` (vitest no resuelve los estilos en línea, ver
  // app.ts): el ojo, la entrada de la tarjeta y la sacudida están en
  // src/styles.css.
  template: `
    <section class="relative isolate mx-auto max-w-md py-4 sm:py-10">
      <div aria-hidden="true">
        <div
          class="absolute -top-10 -left-24 -z-10 h-72 w-72 rounded-full bg-marca/25 blur-3xl"
        ></div>
        <div
          class="absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-marca-claro/20 blur-3xl"
        ></div>
      </div>

      <div
        class="tarjeta-entra rounded-3xl border border-superficie/80 bg-superficie/60 p-6 shadow-xl shadow-marca/10 backdrop-blur-xl sm:p-8"
      >
        <img
          src="/img/logo-nadino.jpeg"
          alt=""
          width="64"
          height="64"
          class="mx-auto h-16 w-16 rounded-xl"
        />
        <h1 class="mt-4 mb-0 text-center text-3xl font-extrabold text-marca">
          Acceso al backoffice
        </h1>
        <p class="mt-2 text-center text-tinta-suave">
          Para el kraal: noticias, calendario y documentos de la web.
        </p>

        @if (rechazado()) {
          <p
            role="alert"
            class="mt-6 mb-0 rounded-r-xl border-l-4 border-error bg-error-suave px-4 py-3 text-sm text-tinta"
          >
            {{ rechazado() }}
          </p>
        }

        <form
          [formGroup]="formulario"
          (ngSubmit)="entrar()"
          novalidate
          class="mt-6 flex flex-col gap-5"
          [class.sacude]="sacudir()"
          (animationend)="sacudir.set(false)"
        >
          <div class="flex flex-col gap-1.5">
            <label for="usuario" class="font-semibold text-tinta">Usuario</label>
            <p id="usuario-pista" class="m-0 text-sm text-tinta-suave">
              Letras sin tilde, números, punto o guion. Sin espacios.
            </p>
            <input
              id="usuario"
              type="text"
              formControlName="usuario"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              [attr.aria-invalid]="error('usuario') ? 'true' : null"
              [attr.aria-describedby]="
                error('usuario') ? 'usuario-pista usuario-error' : 'usuario-pista'
              "
              [class]="claseCampo"
            />
            @if (error('usuario')) {
              <p id="usuario-error" class="m-0 text-sm font-semibold text-error">
                {{ error('usuario') }}
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="clave" class="font-semibold text-tinta">Contraseña</label>
            <div class="relative">
              <input
                id="clave"
                [type]="verClave() ? 'text' : 'password'"
                formControlName="clave"
                autocomplete="current-password"
                [attr.aria-invalid]="error('clave') ? 'true' : null"
                [attr.aria-describedby]="error('clave') ? 'clave-error' : null"
                [class]="claseCampo + ' pr-14'"
                (keyup)="comprobarMayusculas($event)"
                (keydown)="comprobarMayusculas($event)"
                (blur)="mayusculas.set(false)"
              />
              <!-- El nombre accesible no cambia: con aria-pressed, el lector
                   ya anuncia si está activado. El ojo cerrado es la contraseña
                   oculta; abierto, a la vista. -->
              <button
                type="button"
                class="absolute inset-y-0 right-2 my-auto flex h-10 w-10 items-center justify-center rounded-lg text-marca transition-colors hover:bg-marca-suave"
                [attr.aria-pressed]="verClave()"
                aria-controls="clave"
                (click)="verClave.set(!verClave())"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="ojo h-6 w-6 fill-none stroke-current"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  [attr.data-abierto]="verClave()"
                >
                  <path class="parpado parpado-sup" d="M2 12C5 6.5 8.5 5 12 5s7 1.5 10 7" />
                  <path class="parpado parpado-inf" d="M2 12c3 5.5 6.5 7 10 7s7-1.5 10-7" />
                  <circle class="iris" cx="12" cy="12" r="3" />
                  <g class="pestanas">
                    <path d="M5.5 14.6l-1.2 1.9" />
                    <path d="M12 15.2v2.3" />
                    <path d="M18.5 14.6l1.2 1.9" />
                  </g>
                </svg>
                <span class="sr-only">Mostrar contraseña</span>
              </button>
            </div>
            <p aria-live="polite" class="m-0 text-sm font-semibold text-tinta">
              @if (mayusculas()) {
                Tienes activado Bloq Mayús.
              }
            </p>
            @if (error('clave')) {
              <p id="clave-error" class="m-0 text-sm font-semibold text-error">
                {{ error('clave') }}
              </p>
            }
          </div>

          <button
            type="submit"
            class="mt-2 rounded-xl bg-marca px-6 py-3 text-lg font-bold text-sobre-marca shadow-lg shadow-marca/25 transition duration-500 ease-suave hover:bg-marca-oscuro disabled:opacity-60 motion-safe:hover:-translate-y-0.5"
            [disabled]="entrando()"
          >
            {{ entrando() ? 'Entrando…' : 'Entrar' }}
          </button>
          <!-- Mientras no exista la fase 3, la que protege es la cuenta de
               GitHub. Se dice aquí para no dar falsa seguridad. -->
          <p class="m-0 text-center text-sm text-tinta-suave">
            Después el backoffice te pedirá tu cuenta de GitHub para publicar.
          </p>
        </form>

        <p class="mt-6 mb-0 text-center text-sm text-tinta-suave">
          ¿Problemas para entrar?
          <button
            type="button"
            class="font-bold text-marca underline hover:text-marca-oscuro"
            [attr.aria-expanded]="olvido()"
            aria-controls="olvido-ayuda"
            (click)="olvido.set(!olvido())"
          >
            He olvidado mi contraseña
          </button>
        </p>
        <!-- Sin backend no hay correo de recuperación que mandar: de momento
             solo explica a quién pedírsela. -->
        <div id="olvido-ayuda">
          @if (olvido()) {
            <p
              role="status"
              class="mt-3 mb-0 rounded-r-xl border-l-4 border-marca bg-marca-suave px-4 py-3 text-sm text-tinta"
            >
              Todavía no se puede recuperar la contraseña desde la web. Pide
              una nueva a la coordinación del kraal.
            </p>
          }
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-tinta-suave">
        ¿Eres una familia? Lo que buscas está en
        <a routerLink="/preinscripcion" class="font-bold text-marca">preinscripción</a>
        o en
        <a routerLink="/documentos" class="font-bold text-marca">documentos</a>.
      </p>
    </section>
  `,
})
export default class AccesoPage {
  private readonly fb = inject(FormBuilder);
  private readonly acceso = inject(AccesoService);
  private readonly documento = inject(DOCUMENT);

  protected readonly verClave = signal(false);
  protected readonly enviado = signal(false);
  protected readonly entrando = signal(false);
  /** Mensaje si el servicio dice que no (fase 3), o null. */
  protected readonly rechazado = signal<string | null>(null);
  protected readonly olvido = signal(false);
  protected readonly sacudir = signal(false);
  protected readonly mayusculas = signal(false);

  protected readonly claseCampo =
    'w-full rounded-xl border-2 border-borde bg-superficie/80 px-4 py-3 text-tinta transition-colors duration-300 ease-suave hover:border-marca-claro focus:border-marca aria-invalid:border-error aria-invalid:bg-error-suave';

  protected readonly formulario = this.fb.nonNullable.group({
    usuario: [
      '',
      [
        Validators.required,
        sinArroba,
        Validators.pattern(/^[A-Za-z0-9._-]+$/),
        Validators.minLength(3),
        Validators.maxLength(30),
      ],
    ],
    clave: ['', Validators.required],
  });

  /** Un mensaje por validador, en el orden en que se comprueban. */
  private readonly mensajes: Record<'usuario' | 'clave', Record<string, string>> = {
    usuario: {
      required: 'Escribe tu nombre de usuario.',
      correo: 'Aquí va tu usuario, no tu correo electrónico.',
      pattern: 'El usuario solo lleva letras sin tilde, números, punto o guion, sin espacios.',
      minlength: 'El usuario tiene al menos 3 caracteres.',
      maxlength: 'El usuario tiene como mucho 30 caracteres.',
    },
    clave: {
      required: 'Escribe tu contraseña.',
    },
  };

  /**
   * Mensaje de error del campo. Sale al salir del campo o al intentar entrar,
   * no mientras se escribe por primera vez.
   */
  protected error(campo: 'usuario' | 'clave'): string | null {
    const control = this.formulario.controls[campo];
    if (control.valid || !(this.enviado() || control.touched)) return null;
    const mensajes = this.mensajes[campo];
    const fallo = Object.keys(mensajes).find((k) => control.hasError(k));
    return fallo ? mensajes[fallo] : null;
  }

  protected comprobarMayusculas(evento: KeyboardEvent): void {
    this.mayusculas.set(evento.getModifierState?.('CapsLock') ?? false);
  }

  protected async entrar(): Promise<void> {
    this.enviado.set(true);
    this.rechazado.set(null);

    if (this.formulario.invalid) {
      this.sacudir.set(true);
      // El foco va al primer campo con error para que no haya que buscarlo.
      const primero = this.formulario.controls.usuario.invalid ? 'usuario' : 'clave';
      setTimeout(() => this.documento.getElementById(primero)?.focus(), 0);
      return;
    }

    this.entrando.set(true);
    const { usuario, clave } = this.formulario.getRawValue();
    const resultado = await this.acceso.entrar(usuario, clave);
    this.entrando.set(false);

    if (resultado.ok) {
      this.irA(resultado.destino);
      return;
    }
    this.sacudir.set(true);
    this.rechazado.set(
      resultado.motivo === 'credenciales'
        ? 'Usuario o contraseña incorrectos.'
        : 'No se puede entrar ahora mismo. Prueba en un rato.',
    );
  }

  /** Navegación completa (no del router): el backoffice no es de Angular. */
  protected irA(url: string): void {
    this.documento.location.assign(url);
  }
}
