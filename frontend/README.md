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
- **`prerender.routes`** — las 13 rutas actuales. **Cada ruta nueva hay que añadirla aquí**, o existirá en desarrollo y no en el build. Es el fallo más fácil de cometer.
- El resaltador de Markdown (`shiki`) y el plugin de Tailwind.

## Qué existe hoy

- **Layout completo** en `src/app/layout/`: `header.ts` (navegación y menú móvil) y `footer.ts`. El shell con el skip link está en `app.ts`.
- **13 páginas** en `src/app/pages/`: portada, Conócenos, Ramas, Preinscripción, Contacto, Calendario, Jota-Joti 2026, Documentos, Acceso (puerta del backoffice), los cuatro legales y el 404.
- **Tokens provisionales** en `src/styles.css`: elegidos solo para cumplir contraste. Los oficiales del grupo están pendientes del kraal (tarea 0.2).
- Un componente en `shared/ui/`: `mapa-conexiones` (la ilustración del Jota-Joti).
- **`core/models`** (`Seccion`, `Evento`, `Documento`, `Noticia`) y **`core/services`** (`SeccionesService`, `EventosService`, `DocumentosService`, `NoticiasService`). Leen `src/content/` a través de `core/services/contenido.ts`.
- **`src/content/`** con `secciones/` (las cinco ramas), `eventos/` (Jota-Joti), `documentos/` (autorización genérica) y `noticias/` (una de ejemplo, Medinaceli, inventada).

**Deuda consciente:** Conócenos, Contacto, Preinscripción, Jota-Joti y los legales todavía llevan el texto escrito a mano dentro del componente. Eso contradice la regla 1 de más abajo, y es temporal: se mueve a `src/content` con el mismo patrón que las ramas. Las páginas no lo avisan a la vista, así que no des una página por terminada solo porque lo parezca.

El resto de `shared/ui/` se crea conforme avanza el Sprint 0 (ver [`docs/frontend/plan-trabajo.md`](../docs/frontend/plan-trabajo.md)).

## Decisiones de implementación que conviene no deshacer

- **El menú móvil no usa el CDK**, sino un `signal` con `aria-expanded` y cierre con Escape. Para cinco enlaces no hace falta overlay ni foco atrapado.
- **El mapa de Contacto es de OpenStreetMap, no de Google Maps**: el de Google instala cookies y obligaría a un banner de consentimiento en todo el sitio. La dirección va además en texto, porque un mapa incrustado no lo lee un lector de pantalla.
- **El formulario de preinscripción no envía nada todavía** y lo dice en pantalla. Cuando se decida el destino, el envío va en un servicio de `core/services`, no en el componente.
- **El formulario pide los datos mínimos** a propósito: ni nombre del menor, ni fecha exacta de nacimiento, ni domicilio. Ver la Enmienda 1 del ADR antes de añadir campos.

## Ficheros estáticos: fotos y documentos

Todo lo que hay en `public/` se publica tal cual en la raíz de la web: `public/documentos/x.pdf` se sirve en `/documentos/x.pdf`. Por eso aquí no va nada que no deba ser público, y por eso esta explicación está en este README y no en uno dentro de `public/`, que también se publicaría.

| Carpeta | Qué va | Quién la mantiene |
|---|---|---|
| `public/img/portada/` | Foto principal de la portada | El front, siempre |
| `public/img/asociaciones/` | Logos del pie | El front, siempre |
| `public/documentos/` | PDF descargables de `/documentos` (plantillas en blanco) | El front **hasta la fase 3** |

**Fotos.** Se quedan en el front también en el futuro: son pocas, cambian poco y no necesitan backend.

- Antes de subir una foto de educandos, confirma que todos los que salen tienen firmada la autorización de imagen. Ante la duda, de espaldas o sin caras.
- Formato WebP, a 1600 px de ancho como mucho, más una versión de 800 px para móvil (`srcset`). El original del móvil (HEIC, 4000+ px) no se sube nunca: pesa demasiado y deja ampliar caras.
- Sin metadatos: las fotos del móvil llevan la ubicación GPS en el EXIF. Al convertir con `sharp`, los metadatos se quitan por defecto.
- Nombre en minúsculas, sin espacios ni tildes, con año: `campamento-2026-1600.webp`.

**Documentos.** Hoy el PDF se copia a `public/documentos/` y se añade a mano a la lista de `documentos.page.ts`. Es provisional. **En la fase 3 los documentos irán asociados a una base de datos**: el fichero en un almacenamiento del backend y sus datos (título, descripción, categoría, tamaño, fecha, quién lo subió) en una tabla, servidos por la API de Spring Boot. Entonces la lista sale de `documentos.page.ts` hacia un `DocumentosService` de `core/services`, que es el único que sabe de dónde vienen; la página no cambia. Mientras tanto:

- Solo plantillas en blanco. Nunca un documento ya relleno o firmado: lleva datos de menores.
- Nombre en minúsculas y con guiones (`autorizacion-generica.pdf`), sin versiones en el nombre (`-v3`, `-nadino3`): la URL tiene que seguir valiendo cuando se actualice el documento.

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

Las claves van en español y coinciden con los campos de `core/models`. El nombre del fichero es el `slug` (la URL): minúsculas, guiones, sin tildes. Las fechas, `AAAA-MM-DD`; mejor entre comillas, aunque el servicio acepta las dos formas. Un campo vacío o mal escrito no rompe el build, pero el elemento puede no salir: `npm test` lo detecta (`core/services/contenido.spec.ts`).

**Rama** — `src/content/secciones/<slug>.md`. Solo los cinco slugs conocidos (`castores`, `lobatos`, `scouts`, `pioneros`, `rutas`); el color sale del token `--color-<slug>`, no del contenido.

```markdown
---
nombre: Lobatos
edades: '8 a 11'
orden: 2
resumen: 'Viven su aventura ambientada en «El libro de la selva»…'
queHacen:
  - 'Juegos, canciones y actividades en la naturaleza'
  - 'Excursiones y campamentos'
---
```

**Evento** — `src/content/eventos/<slug>.md`. Los pasados se ocultan solos.

```markdown
---
titulo: Acampada de otoño
inicio: '2026-11-07'
fin: '2026-11-08'          # opcional
lugar: Albergue de …        # opcional
ramas: [lobatos, scouts]    # vacío = todo el grupo
descripcion: Primera acampada de la ronda.
enlace: /eventos/joti-2026  # opcional: página propia
---
```

**Documento** — `src/content/documentos/<slug>.md`, con el PDF en `public/documentos/`.

```markdown
---
titulo: Autorización genérica
descripcion: Permiso para las actividades de toda la ronda…
fichero: /documentos/autorizacion-generica.pdf
formato: PDF
tamano: 120 KB
categoria: autorizaciones   # inscripcion | autorizaciones | actividades
---
```

**Noticia** — `src/content/noticias/<AAAA-MM-DD>-<slug>.md`. No hay página de noticias: las tres últimas salen en la portada con su `resumen` (dos o tres frases) y el cuerpo del `.md` se despliega dentro de la tarjeta con «Leer la noticia». El cuerpo es opcional y no lleva títulos (`#`): ver `.texto-noticia` en `styles.css`.

```markdown
---
titulo: Salida de otoño a la Sierra de Ayllón
fecha: '2026-10-12'
seccion: lobatos            # opcional
resumen: Primera salida de la ronda con los nuevos lobatos, por los hayedos de la sierra.
portada: /img/noticias/2026-10-12-ayllon.webp   # opcional
portadaAlt: Grupo de lobatos caminando por un hayedo, de espaldas
---

Texto completo, opcional: **negrita**, listas, enlaces y fotos.
```

Lo normal es no escribir estos ficheros a mano, sino desde el **backoffice** (`public/backoffice/`, Sveltia CMS). En local: `npm run dev`, abre `http://localhost:5173/backoffice/index.html` en Chrome o Edge, pulsa «Trabajar con el repositorio local» y elige la carpeta raíz del repositorio (la que tiene `.git`). Al guardar escribe los `.md` y las fotos directamente en el proyecto, y la portada se recarga sola con la noticia nueva.

**Ojo con entrar «con GitHub» en local:** entonces no escribe en tu carpeta, sino que publica directamente en GitHub (en la rama de `backend.branch` de `config.yml`, hoy `main`), y en tu `npm run dev` no se ve hasta que la traigas con git. Para probar, usa siempre el repositorio local.
