import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

interface Punto {
  pais: string;
  saludo: string;
  idioma: string;
  x: number;
  y: number;
}

/**
 * Mapa del Jota-Joti: el grupo en el centro de un globo, conectado con
 * scouts de todo el mundo. Cada punto es un país; al pasar el ratón, pulsarlo
 * o llegar con el teclado se ve cómo se saluda allí y se dibuja la conexión
 * desde Azuqueca.
 *
 * Es una ilustración, no un mapa a escala: los puntos van más o menos donde
 * caen (América a la izquierda, Asia a la derecha) pero separados para que se
 * puedan pulsar. Los países son ejemplos de dónde hay scouts, no una lista de
 * contactos del grupo.
 *
 * Teclado: un solo punto está en el orden de tabulación (tabindex itinerante)
 * y las flechas, Inicio y Fin recorren el resto, para no obligar a pasar por
 * 18 paradas con Tab. Lo que muestra el panel se anuncia con aria-live.
 *
 * Componente tonto: no inyecta servicios (regla 2 de `frontend/README.md`);
 * el ElementRef es solo para mover el foco. Los iconos siguen el trazo de
 * Lucide (ISC).
 */
@Component({
  selector: 'app-mapa-conexiones',
  imports: [NgTemplateOutlet],
  template: `
    <figure class="m-0">
      <svg
        viewBox="0 0 360 290"
        class="h-auto w-full overflow-visible"
        role="group"
        aria-label="Mapa de scouts por el mundo. Usa las flechas para recorrer los países."
      >
        <g aria-hidden="true">
          <!-- Globo -->
          <g class="fill-none stroke-marca/25" stroke-width="1.5">
            <circle cx="180" cy="145" r="110" class="fill-white" />
            <ellipse cx="180" cy="145" rx="40" ry="110" />
            <ellipse cx="180" cy="145" rx="80" ry="110" />
            <line x1="180" y1="35" x2="180" y2="255" />
            <line x1="70" y1="145" x2="290" y2="145" />
            <line x1="85" y1="90" x2="275" y2="90" />
            <line x1="85" y1="200" x2="275" y2="200" />
          </g>

          <!-- Formas de participar, alrededor del globo -->
          <g
            class="fill-none stroke-marca/40 motion-safe:animate-flujo"
            stroke-width="1.5"
            stroke-dasharray="4 6"
            stroke-linecap="round"
          >
            @for (nodo of nodos; track nodo.etiqueta) {
              <path [attr.d]="curva(casa, nodo)" />
            }
          </g>
          <!-- Conexión con el país elegido -->
          @if (elegido(); as punto) {
            @if (punto !== casa) {
              <path
                [attr.d]="curva(casa, punto)"
                class="fill-none stroke-marca motion-safe:animate-flujo"
                stroke-width="2.5"
                stroke-dasharray="4 6"
                stroke-linecap="round"
              />
            }
          }
        </g>

        <!-- Formas de participar. JOTA y JOTI llevan a su página oficial; al
             pasar el ratón el círculo se rellena de morado y crece. Los
             group-hover solo actúan dentro del <a class="group">, así que
             los nodos sin enlace no reaccionan. -->
        @for (nodo of nodos; track nodo.etiqueta) {
          @if (nodo.url) {
            <a
              [attr.href]="nodo.url"
              rel="noopener noreferrer"
              [attr.aria-label]="nodo.etiqueta + ': web oficial, en inglés'"
              class="group"
            >
              <ng-container
                *ngTemplateOutlet="dibujoNodo; context: { $implicit: nodo, enlace: true }"
              />
            </a>
          } @else {
            <g aria-hidden="true">
              <ng-container
                *ngTemplateOutlet="dibujoNodo; context: { $implicit: nodo, enlace: false }"
              />
            </g>
          }
        }

        <ng-template #dibujoNodo let-nodo let-enlace="enlace">
          <svg:g [attr.transform]="'translate(' + nodo.x + ' ' + nodo.y + ')'">
            <svg:g
              class="[transform-box:fill-box] origin-center transition-transform duration-500 ease-suave motion-safe:group-hover:scale-110"
            >
              <svg:circle
                r="26"
                class="fill-white stroke-marca transition-colors duration-500 ease-suave group-hover:fill-marca"
                stroke-width="2.5"
              />
              <svg:g
                transform="translate(-12 -12)"
                class="fill-none stroke-marca transition-colors duration-500 ease-suave group-hover:stroke-white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                @for (d of nodo.trazos; track $index) {
                  <svg:path [attr.d]="d" />
                }
              </svg:g>
            </svg:g>
            <svg:text
              y="43"
              text-anchor="middle"
              class="fill-marca-oscuro text-[12px] font-bold group-hover:underline"
            >
              {{ nodo.etiqueta }}
            </svg:text>
          </svg:g>
        </ng-template>

        <!-- Países -->
        @for (punto of puntos; track punto.pais; let i = $index) {
          <g
            data-punto
            role="button"
            [attr.tabindex]="i === activo() ? 0 : -1"
            [attr.aria-label]="punto.pais"
            [attr.aria-pressed]="i === seleccionado()"
            [attr.transform]="'translate(' + punto.x + ' ' + punto.y + ')'"
            class="group cursor-pointer outline-none"
            (click)="seleccionar(i)"
            (mouseenter)="seleccionar(i)"
            (focus)="seleccionar(i)"
            (keydown)="teclado($event, i)"
          >
            <!-- Zona de pulsación más grande que el punto -->
            <circle r="12" class="fill-transparent" />
            @if (i === 0) {
              <circle
                r="11"
                class="fill-acento/50 [transform-box:fill-box] origin-center motion-safe:animate-ping"
              />
            }
            <g
              class="[transform-box:fill-box] origin-center transition-transform duration-300 ease-suave group-hover:scale-150"
              [class.scale-150]="i === seleccionado()"
            >
              <circle
                [attr.r]="i === 0 ? 7 : 5"
                class="transition-colors duration-300"
                [class]="
                  i === seleccionado()
                    ? 'fill-marca stroke-white'
                    : 'fill-acento stroke-marca-oscuro'
                "
                stroke-width="2"
              />
            </g>
            <!-- Anillo de selección: también es el indicador de foco -->
            @if (i === seleccionado()) {
              <circle r="13" class="fill-none stroke-marca" stroke-width="2.5" />
            }
          </g>
        }
      </svg>

      <figcaption
        aria-live="polite"
        class="mt-3 min-h-20 rounded-2xl bg-white/70 px-4 py-3 text-center"
      >
        @if (elegido(); as punto) {
          <span class="block text-2xl font-extrabold text-marca">
            {{ punto.saludo }}
          </span>
          <span class="block text-sm text-tinta-suave">
            @if (punto === casa) {
              Aquí estamos nosotros: Azuqueca de Henares, {{ punto.pais }}.
            } @else {
              Así se saluda en {{ punto.pais }} ({{ punto.idioma }}).
            }
          </span>
        } @else {
          <span class="block pt-2 text-sm text-tinta-suave">
            Pasa el ratón o pulsa en un punto para ver cómo se saluda en cada
            país.
          </span>
        }
      </figcaption>
    </figure>
  `,
})
export class MapaConexiones {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** El país que se muestra en el panel (-1 = ninguno todavía). */
  protected readonly seleccionado = signal(-1);
  /** El único punto con tabindex="0". */
  protected readonly activo = signal(0);

  protected readonly puntos: Punto[] = [
    { pais: 'España', saludo: '¡Hola!', idioma: 'castellano', x: 172, y: 108 },
    { pais: 'Reino Unido', saludo: 'Hello!', idioma: 'inglés', x: 160, y: 80 },
    { pais: 'Alemania', saludo: 'Hallo!', idioma: 'alemán', x: 192, y: 76 },
    { pais: 'Italia', saludo: 'Ciao!', idioma: 'italiano', x: 198, y: 104 },
    { pais: 'Marruecos', saludo: 'Salam!', idioma: 'árabe', x: 166, y: 134 },
    { pais: 'Kenia', saludo: 'Jambo!', idioma: 'suajili', x: 210, y: 170 },
    { pais: 'Sudáfrica', saludo: 'Sawubona!', idioma: 'zulú', x: 196, y: 208 },
    { pais: 'Canadá', saludo: 'Bonjour!', idioma: 'francés', x: 106, y: 82 },
    { pais: 'Estados Unidos', saludo: 'Hi!', idioma: 'inglés', x: 100, y: 112 },
    { pais: 'México', saludo: '¡Hola!', idioma: 'español', x: 112, y: 142 },
    { pais: 'Brasil', saludo: 'Olá!', idioma: 'portugués', x: 140, y: 180 },
    { pais: 'Argentina', saludo: '¡Hola!', idioma: 'español', x: 128, y: 214 },
    { pais: 'India', saludo: 'Namaste!', idioma: 'hindi', x: 246, y: 128 },
    { pais: 'Corea del Sur', saludo: 'Annyeonghaseyo!', idioma: 'coreano', x: 256, y: 92 },
    { pais: 'Japón', saludo: 'Konnichiwa!', idioma: 'japonés', x: 282, y: 110 },
    { pais: 'Filipinas', saludo: 'Kumusta!', idioma: 'tagalo', x: 270, y: 152 },
    { pais: 'Australia', saludo: "G'day!", idioma: 'inglés', x: 260, y: 198 },
    { pais: 'Islandia', saludo: 'Halló!', idioma: 'islandés', x: 140, y: 58 },
  ];

  protected readonly casa = this.puntos[0];

  protected readonly elegido = computed(() => this.puntos[this.seleccionado()]);

  protected readonly nodos = [
    {
      etiqueta: 'Radio · JOTA',
      url: 'https://www.jotajoti.info/jota',
      x: 46,
      y: 44,
      trazos: [
        'M4.9 16.1C1 12.2 1 5.8 4.9 1.9',
        'M7.8 4.7a6.14 6.14 0 0 0-.8 7.5',
        'M16.2 4.8c2 2 2.26 5.11.8 7.47',
        'M19.1 1.9a9.96 9.96 0 0 1 0 14.1',
        'M9.5 18h5',
        'm8 22 4-11 4 11',
        'M12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
      ],
    },
    {
      etiqueta: 'Chat · JOTI',
      url: 'https://www.jotajoti.info/joti',
      x: 314,
      y: 44,
      trazos: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01'],
    },
    {
      etiqueta: 'En acampada',
      x: 46,
      y: 236,
      trazos: ['M3.5 21 14 3', 'M20.5 21 10 3', 'M15.5 21 12 15l-3.5 6', 'M2 21h20'],
    },
    {
      etiqueta: 'Desde casa',
      x: 314,
      y: 236,
      trazos: [
        'M12 20h.01',
        'M2 8.82a15 15 0 0 1 20 0',
        'M5 12.86a10 10 0 0 1 14 0',
        'M8.5 16.43a5 5 0 0 1 7 0',
      ],
    },
  ];

  /** Arco entre dos puntos, curvado hacia arriba como una ruta aérea. */
  protected curva(a: { x: number; y: number }, b: { x: number; y: number }): string {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.3;
    return `M${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  }

  protected seleccionar(i: number): void {
    this.seleccionado.set(i);
    this.activo.set(i);
  }

  protected teclado(evento: KeyboardEvent, i: number): void {
    const total = this.puntos.length;
    const destino: Record<string, number> = {
      ArrowRight: (i + 1) % total,
      ArrowDown: (i + 1) % total,
      ArrowLeft: (i - 1 + total) % total,
      ArrowUp: (i - 1 + total) % total,
      Home: 0,
      End: total - 1,
    };

    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      this.seleccionar(i);
      return;
    }
    if (!(evento.key in destino)) return;

    evento.preventDefault();
    const siguiente = destino[evento.key];
    this.seleccionar(siguiente);
    const puntos = this.host.nativeElement.querySelectorAll<SVGGElement>('[data-punto]');
    puntos[siguiente]?.focus();
  }
}
