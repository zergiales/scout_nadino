# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del repositorio

El frontend compila a HTML estático: `npm run build` genera **10 rutas prerenderizadas**. `backend/` sigue siendo solo un README reservado para la fase 3.

Lo que **ya existe** en `frontend/`: el proyecto Analog con su configuración, el layout completo (`layout/header.ts` y `layout/footer.ts`, con el shell en `app.ts`), las 10 páginas (portada, Conócenos, Secciones, Preinscripción, Contacto, Jota-Joti 2026, los cuatro legales y el 404), tokens **provisionales** en `src/styles.css` y un componente en `shared/ui/`.

Lo que **todavía no**: `core/` entera (modelos, servicios, SEO), el resto de `shared/ui/`, el CI y el despliegue. `src/content/` está vacía. Antes de dar por hecho un fichero o un comando, comprueba que existe.

El idioma del proyecto es el español: documentación, commits, rutas (`/conocenos`, `/inscripcion`), nombres de modelos (`Noticia`, `Evento`, `Seccion`) y contenido. Solo los identificadores propios del framework quedan en inglés.

## Entorno

Angular 22 exige Node `^22.22.3 || ^24.15.0 || >=26.0.0`; el proyecto se desarrolla sobre **Node 24 LTS con npm 11**. Con un Node anterior la instalación falla, así que comprueba `node -v` antes de depurar un error de dependencias.

## Comandos

Desde `frontend/`:

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción → `dist/analog/public/` |
| `npm run preview` | Sirve ese `dist/` en `localhost:4173` (el resultado real del build) |
| `npm test -- --run` | Tests con vitest, una pasada (sin `--run` queda en modo watch) |
| `npm run ng` | Angular CLI local |

Para ejecutar **un solo test**: `npm test -- --run src/app/app.spec.ts`, o `-t "<nombre del test>"` para filtrar por nombre.

`npm run dev` y `npm run ng -- serve` son equivalentes: `angular.json` enruta sus targets a los builders de Analog, así que los dos levantan el mismo Vite en el 5173. Para compilar, usa `npm run build`: el target `build` de `angular.json` declara otro `outputPath` y no está comprobado que produzca la misma salida.

Todavía no hay `lint`, axe ni Lighthouse: los define la tarea 0.7. Cuando existan, documéntalos aquí.

## Arquitectura

Tres fases, con la fase 1 en curso:

1. **Web pública estática** — Angular 22 + Analog prerenderizado a HTML, contenido en Markdown bajo `frontend/src/content`, hosting estático gratuito (Cloudflare Pages/Netlify).
2. **Decap CMS** sobre ese mismo Markdown, para que el kraal edite sin PRs.
3. **Backend** Spring Boot 4 + Java 25, Maven multimódulo: `auth-service` (OAuth2/JWT para monitores) y API de inscripciones/área privada.

La decisión clave que explica casi todo el diseño: **la capa de servicios de `core/services` es la única frontera con el origen de datos.** Hoy esos servicios leen Markdown de `src/content`; en la fase 3 llamarán a la API de Spring Boot con `HttpClient`. Por eso ningún componente ni página lee contenido directamente — siempre `inject(NoticiasService)` y similares. Si una página importa contenido por su cuenta, el cambio de fase deja de ser local y el diseño se rompe.

Esto es fácil de incumplir sin darse cuenta: los ejemplos de Analog llaman a `injectContentFiles()` / `injectContent()` **dentro de la página**. Aquí esas llamadas van en el servicio de `core/services`, y la página solo inyecta el servicio.

**Deuda consciente, no permiso.** Las páginas actuales llevan su texto escrito a mano en el componente, porque se adelantaron a la tarea 0.4 para poder ver la web funcionando. Eso se arregla moviendo el texto a `src/content` en cuanto existan los servicios; no es el patrón a imitar. Cada página afectada lleva un `<app-aviso-borrador>` visible, y ese aviso se borra cuando entra el contenido de verdad.

Consecuencia operativa: **la web pública no depende del backend** y debe funcionar con él caído o inexistente. En la fase 1 el contacto es correo y dirección (sin formulario) y la inscripción es un enlace a un formulario externo.

Capas, de dentro a fuera: `core/` (modelos, servicios, SEO — sin UI) → `layout/` (shell con skip link, header, nav con menú móvil del CDK, footer) → `shared/ui/` (componentes tontos: solo `input()`/`output()`, nunca inyectan servicios) → `pages/` (rutas por ficheros de Analog: `index.page.ts`, `[slug].page.ts`, `[...not-found].page.ts`).

### Configuración que importa

Todo vive en `frontend/vite.config.ts`:

- **`static: true`** — el build prerenderiza sin producir servidor Nitro, conforme a la decisión 5 del ADR. No lo quites: sin él el despliegue dejaría de ser estático y habría un proceso Node que mantener.
- **`prerender.routes`** — las 10 rutas actuales. **Hay que añadir cada ruta nueva aquí**, o la página existirá en desarrollo pero no se prerenderizará en el build. Es el fallo más fácil de cometer, y no da ningún error.
- **`content.highlighter: 'shiki'`** y el plugin de Tailwind.

### Decisiones de implementación que no hay que deshacer sin motivo

- **El menú móvil no usa el CDK**, sino un `signal` con `aria-expanded` y cierre con Escape. Para cinco enlaces no hace falta overlay ni foco atrapado, y evita una dependencia (enmienda la decisión 2 del ADR).
- **El mapa de Contacto es de OpenStreetMap, no de Google Maps.** El iframe de Google instala cookies: obligaría a un banner de consentimiento en todo el sitio y contradiría la página de cookies.
- **El formulario de preinscripción pide los datos mínimos** y no envía nada todavía. No añadas campos sin leer la Enmienda 1 del ADR-0001 y el [ADR-0002](docs/adr/0002-destino-de-las-preinscripciones.md), que decide el canal de envío: el recorte de datos (sin nombre del menor, sin fecha exacta, sin domicilio) es justo lo que hace defendible tener formulario propio en una web estática.
- **La navegación está en el tope de 6 elementos.** Para meter uno hay que sacar otro; la tabla manda está en `docs/frontend/paginas.md`.

El árbol de carpetas objetivo, el formato del frontmatter de cada tipo de contenido y las reglas de estilo están en [`frontend/README.md`](frontend/README.md). El razonamiento y las alternativas descartadas (SPA + backend desde el día 1, WordPress), en [`docs/adr/0001-arquitectura-frontend.md`](docs/adr/0001-arquitectura-frontend.md).

## Convenciones vinculantes

- **Componentes standalone + signals.** Sin NgModules.
- **Colores y tamaños solo desde los tokens `@theme` de `src/styles.css`.** Nada de valores sueltos como `#990000` en los componentes. Hay tokens del grupo y uno por sección (castores, lobatos, scouts, pioneros, rutas). Los valores que hay ahora son **provisionales**, elegidos solo por contraste: los oficiales del grupo siguen pendientes del kraal (tarea 0.2).
- **Accesibilidad = criterio de aceptación, no mejora posterior.** La web actual se rehace precisamente porque la auditoría encontró 14 incidencias WCAG 2.1 AA. Objetivo: WCAG 2.1 AA, axe sin errores, Lighthouse accesibilidad ≥ 95, un solo `<h1>` por página, foco visible, sin scroll horizontal a 320 px, legible con zoom 200 %, contraste ≥ 4,5:1 en texto y ≥ 3:1 en componentes. La checklist completa está en la "Definición de hecho" de [`docs/frontend/plan-trabajo.md`](docs/frontend/plan-trabajo.md) y en la plantilla de issue.
- **Datos de menores (RGPD).** Fotos de educandos solo con autorización de imagen firmada; ante la duda, fotos de grupo de espaldas o sin caras. Nunca nombres completos, colegios ni otros datos personales de educandos. Todas las imágenes con `alt` descriptivo, o `alt=""` si son decorativas.
- **Restricción de fondo:** el grupo es voluntariado con kraal rotatorio y presupuesto ≈ 0 € salvo el dominio. Al elegir entre opciones, prefiere la que se mantenga sola: menos dependencias, menos servidores, menos cosas que caducan.

## Qué construir y en qué orden

El Sprint 0 (fundaciones) **bloquea todo lo demás** y lo hace una sola persona. Hechas: 0.1 (proyecto) y 0.3 (layout). A medias: 0.2 (tokens provisionales), 0.5 (un componente) y 0.6 (títulos sí, meta description no). **Lo siguiente es 0.4**, modelos y servicios, porque es lo que desbloquea mover el contenido fuera de los componentes. Quedan además el CI (0.7) y el despliegue (0.8).

Prioridades: **P0** = MVP (Inicio, Conócenos, Secciones listado y detalle, Preinscripción, Contacto, los cuatro legales y el 404) · **P1** = Noticias, Eventos, Documentos · **P2** = requiere backend (área privada, formulario de contacto real). La tabla de rutas, fuente de datos de cada página y la navegación principal (máx. 6 elementos) están en [`docs/frontend/paginas.md`](docs/frontend/paginas.md).

**Datos pendientes del kraal** que bloquean contenido real: colores oficiales del grupo y de cada sección, correo del grupo (en la web antigua está puesto como imagen), horario de reuniones, redes sociales, edades definitivas de cada sección (las del plan no coinciden con las de la web antigua), datos legales del titular, y a dónde deben llegar las preinscripciones.

## Flujo de trabajo

Una issue por página (plantilla «Nueva página»), rama `feat/<pagina>` desde `main`, PR con preview revisada por otra persona y checklist de accesibilidad completa, merge a `main` → despliegue automático. La preview por PR depende de la tarea 0.8, que aún no está hecha.
