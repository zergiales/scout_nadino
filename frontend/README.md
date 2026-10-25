# Frontend — Angular 22 + Analog + Tailwind

Web pública del Grupo Scout Nadino, prerenderizada a HTML estático. Las decisiones están en [`docs/adr/0001-arquitectura-frontend.md`](../docs/adr/0001-arquitectura-frontend.md).

Stack real: Angular 22, Analog 2.8, Tailwind 4, TypeScript 6, Vite 8, vitest 5 y shiki para el resaltado de código en Markdown.

## Arrancar

Requisito: **Node 24 LTS** (Angular 22 exige `^22.22.3 || ^24.15.0 || >=26.0.0`) con npm 11.

```bash
cd frontend
npm install
npm run dev        # servidor de desarrollo
```

Otros comandos:

```bash
npm run build          # → dist/analog/public/ (HTML prerenderizado)
npm run preview        # sirve ese dist/ en localhost:4173, para ver el resultado real del build
npm test -- --run      # tests una pasada; sin --run queda en modo watch
npm run ng             # Angular CLI local
```

El `preview` que traía la plantilla apuntaba a una salida de servidor que el modo estático no genera. Ahora es `vite preview --outDir dist/analog/public`, que sirve el HTML prerenderizado sin añadir ninguna dependencia.

Para enseñar la web a otras personas mientras corre en tu ordenador, con un enlace público temporal, sigue [`docs/frontend/compartir-con-tunel.md`](../docs/frontend/compartir-con-tunel.md).

## Configuración

En `vite.config.ts`:

- **`static: true`** — prerenderiza sin generar servidor Nitro. Es lo que mantiene el hosting gratuito y sin mantenimiento.
- **`prerender.routes`** — las 12 rutas actuales. **Cada ruta nueva hay que añadirla aquí**, o existirá en desarrollo y no en el build. Es el fallo más fácil de cometer.
- El resaltador de Markdown (`shiki`) y el plugin de Tailwind.

## Qué existe hoy

- **Layout completo** en `src/app/layout/`: `header.ts` (navegación y menú móvil) y `footer.ts`. El shell con el skip link está en `app.ts`.
- **12 páginas** en `src/app/pages/`: portada, Conócenos, Ramas, Preinscripción, Contacto, Calendario, Jota-Joti 2026, Documentos, los cuatro legales y el 404.
- **Tokens provisionales** en `src/styles.css`: elegidos solo para cumplir contraste. Los oficiales del grupo están pendientes del kraal (tarea 0.2).
- Un componente en `shared/ui/`: `mapa-conexiones` (la ilustración del Jota-Joti).
- `src/content/` **vacía**.

**Deuda consciente:** como `core/services` todavía no existe (tarea 0.4), el texto de esas páginas está escrito a mano dentro de los componentes. Eso contradice la regla 1 de más abajo, y es temporal: cuando existan los servicios, el texto se mueve a `src/content`. Las páginas no lo avisan a la vista, así que no des una página por terminada solo porque lo parezca.

`core/` y el resto de `shared/ui/` se crean conforme avanza el Sprint 0 (ver [`docs/frontend/plan-trabajo.md`](../docs/frontend/plan-trabajo.md)).

## Decisiones de implementación que conviene no deshacer

- **El menú móvil no usa el CDK**, sino un `signal` con `aria-expanded` y cierre con Escape. Para cinco enlaces no hace falta overlay ni foco atrapado.
- **El mapa de Contacto es de OpenStreetMap, no de Google Maps**: el de Google instala cookies y obligaría a un banner de consentimiento en todo el sitio. La dirección va además en texto, porque un mapa incrustado no lo lee un lector de pantalla.
- **El formulario de preinscripción no envía nada todavía** y lo dice en pantalla. Cuando se decida el destino, el envío va en un servicio de `core/services`, no en el componente.
- **El formulario pide los datos mínimos** a propósito: ni nombre del menor, ni fecha exacta de nacimiento, ni domicilio. Ver la Enmienda 1 del ADR antes de añadir campos.

## Estructura objetivo

```
frontend/
├── public/
│   ├── img/                      # Imágenes optimizadas (WebP/AVIF), solo con autorización de imagen
│   ├── documentos/               # PDFs descargables
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── app.config.ts         # (generado) providers: router, http, content
│   │   ├── app.ts                # (generado) componente raíz → <app-shell>
│   │   │
│   │   ├── core/                 # Lógica sin UI. Lo único que cambia al llegar el backend
│   │   │   ├── models/           # noticia.ts, evento.ts, seccion.ts, documento.ts
│   │   │   ├── services/         # noticias.service.ts, eventos.service.ts, ...
│   │   │   │                     #   Fase 1: leen src/content · Fase 3: HttpClient → API
│   │   │   └── seo/              # seo.service.ts: <title> y meta por página
│   │   │
│   │   ├── layout/               # Esqueleto común a todas las páginas
│   │   │   ├── shell/            # skip link + header + <main> + footer
│   │   │   ├── header/
│   │   │   ├── nav/              # navegación + menú móvil (Angular CDK)
│   │   │   └── footer/
│   │   │
│   │   ├── shared/ui/            # Componentes reutilizables y "tontos" (solo inputs/outputs)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── section-heading/
│   │   │   ├── responsive-image/
│   │   │   └── seccion-badge/    # etiqueta con color y edades de cada sección
│   │   │
│   │   └── pages/                # Rutas de Analog (un fichero = una ruta)
│   │       ├── index.page.ts                 → /
│   │       ├── conocenos.page.ts             → /conocenos
│   │       ├── ramas.page.ts                 → /ramas (un desplegable por rama)
│   │       ├── noticias/
│   │       │   ├── index.page.ts             → /noticias
│   │       │   └── [slug].page.ts            → /noticias/:slug
│   │       ├── eventos.page.ts               → /eventos
│   │       ├── documentos.page.ts            → /documentos
│   │       ├── inscripcion.page.ts           → /inscripcion
│   │       ├── contacto.page.ts              → /contacto
│   │       ├── legal/
│   │       │   └── [slug].page.ts            → /legal/aviso-legal, /privacidad, /cookies, /accesibilidad
│   │       └── [...not-found].page.ts        → 404
│   │
│   ├── content/                  # Lo que edita el kraal (y en fase 2, Decap CMS)
│   │   ├── paginas/              # conocenos.md, inscripcion.md, contacto.md
│   │   ├── secciones/            # castores.md, lobatos.md, scouts.md, pioneros.md, rutas.md
│   │   ├── noticias/             # 2026-10-12-salida-otono.md
│   │   ├── eventos/              # 2026-11-08-acampada.md
│   │   ├── documentos/           # autorizacion-salidas.md (apunta a public/documentos/*.pdf)
│   │   └── legal/                # aviso-legal.md, privacidad.md, cookies.md, accesibilidad.md
│   │
│   └── styles.css                # Tailwind + tokens (@theme): colores del grupo y de secciones
│
└── vite.config.ts                # prerender: lista de rutas + rutas de content/
```

## Reglas

1. **Las páginas no leen contenido directamente**: siempre `inject(NoticiasService)` etc. Así el cambio a la API de Spring Boot solo toca `core/services`. Ojo: los ejemplos de Analog llaman a `injectContentFiles()` / `injectContent()` dentro de la página; aquí esas llamadas van en el servicio.
2. **`shared/ui` no conoce los servicios**: recibe datos por `input()` y emite eventos por `output()`.
3. **Colores y tamaños solo desde tokens** de `styles.css`. Nada de `#990000` sueltos.
4. **Componentes standalone + signals**, sin NgModules.
5. **Accesibilidad**: ver la definición de hecho en [`docs/frontend/plan-trabajo.md`](../docs/frontend/plan-trabajo.md).

## Formato del contenido (frontmatter)

```markdown
---
title: Salida de otoño a la Sierra de Ayllón
date: 2026-10-12
seccion: lobatos           # opcional
resumen: Primera salida de la ronda con los nuevos lobatos.
portada: /img/noticias/2026-10-12-ayllon.webp
portadaAlt: Grupo de lobatos caminando por un hayedo, de espaldas
---

Texto de la noticia en Markdown...
```
