import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

/** Rechaza el correo en el campo de usuario: es el despiste más común. */
function sinArroba(control: AbstractControl): ValidationErrors | null {
  return String(control.value).includes('@') ? { correo: true } : null;
}

export const routeMeta: RouteMeta = {
  title: 'Acceso al blog · Grupo Scout Nadino',
  meta: [{ name: 'robots', content: 'noindex' }],
};

/**
 * Pantalla de acceso para quien escribe en el blog del grupo.
 *
 * Todavía NO autentica: el área privada es la fase 3 (`auth-service` con
 * OAuth2/JWT, ver CLAUDE.md) y una web estática no puede comprobar una
 * contraseña de forma segura. Al enviar, el formulario valida los campos y
 * avisa de que el acceso aún no está disponible, sin mandar nada a ningún
 * sitio. No metas aquí una contraseña ni una lista de usuarios para
 * «simularlo»: cualquiera podría leerla desde el navegador.
 *
 * Cuando exista el backend, el envío saldrá de un servicio de
 * `core/services` y esta página solo lo inyectará.
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
        class="tarjeta-entra rounded-3xl border border-white/80 bg-white/60 p-6 shadow-xl shadow-marca/10 backdrop-blur-xl sm:p-8"
      >
        <img
          src="/img/logo-nadino.jpeg"
          alt=""
          width="64"
          height="64"
          class="mx-auto h-16 w-16 rounded-xl"
        />
        <h1 class="mt-4 mb-0 text-center text-3xl font-extrabold text-marca">
          Acceso al blog
        </h1>
        <p class="mt-2 text-center text-tinta-suave">
          Para quien escribe en el blog del grupo.
        </p>

        @if (avisado()) {
          <p
            role="status"
            class="mt-6 mb-0 rounded-r-xl border-l-4 border-marca bg-marca-suave px-4 py-3 text-sm text-tinta"
          >
            <strong>El acceso al blog todavía no está disponible.</strong> Se
            abrirá cuando esté listo el sistema de cuentas del grupo. No se ha
            enviado nada.
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
            class="mt-2 rounded-xl bg-marca px-6 py-3 text-lg font-bold text-white shadow-lg shadow-marca/25 transition duration-500 ease-suave hover:bg-marca-oscuro motion-safe:hover:-translate-y-0.5"
          >
            Entrar
          </button>
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

  protected readonly verClave = signal(false);
  protected readonly enviado = signal(false);
  protected readonly avisado = signal(false);
  protected readonly olvido = signal(false);
  protected readonly sacudir = signal(false);
  protected readonly mayusculas = signal(false);

  protected readonly claseCampo =
    'w-full rounded-xl border-2 border-borde bg-white/80 px-4 py-3 text-tinta transition-colors duration-300 ease-suave hover:border-marca-claro focus:border-marca aria-invalid:border-error aria-invalid:bg-error-suave';

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

  protected entrar(): void {
    this.enviado.set(true);
    this.avisado.set(this.formulario.valid);

    if (this.formulario.invalid) {
      this.sacudir.set(true);
      // El foco va al primer campo con error para que no haya que buscarlo.
      const primero = this.formulario.controls.usuario.invalid ? 'usuario' : 'clave';
      setTimeout(() => document.getElementById(primero)?.focus(), 0);
    }
  }
}
