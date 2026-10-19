# ADR-0001: Arquitectura del frontend de la web del Grupo Scout Nadino

**Estado:** Propuesto
**Fecha:** 07/10/2026
**Deciden:** Sergio + kraal del grupo

## Contexto

La web actual (scoutsnadino.es) funciona sobre **e107**, un CMS PHP antiguo con plantilla XHTML 1.1. Nadie la mantiene, la página «Conócenos» está desactivada y la auditoría de accesibilidad (ver `docs/auditoria/`) detecta 14 incidencias WCAG 2.1 AA, 3 críticas: no es responsive, el menú enlaza a una página rota y los formularios no tienen etiquetas.

Queremos rehacerla desde cero para demostrar que una web propia y bien hecha es mejor que una plantilla gratuita. Restricciones:

- **Voluntariado:** poco tiempo y rotación del kraal. Lo que no se pueda mantener con poco esfuerzo acabará como la web actual.
- **Coste ≈ 0 €** salvo el dominio.
- **Público principal:** familias, que entran desde el móvil.
- **Datos de menores (RGPD):** fotos y datos personales con mucho cuidado.
- **Stack decidido:** Angular 22 + framework de estilos. A futuro, backend Spring Boot 4 + Java 25 con Maven multimódulo.

## Decisión

1. **Angular 22 con Analog** (meta-framework de Angular) y **prerender a HTML estático**. Rutas basadas en ficheros (`src/app/pages`) y contenido en **Markdown** (`src/content`).
2. **Tailwind CSS** para los estilos, con los colores del grupo definidos como *tokens*. **Angular CDK / Spartan UI** solo para componentes interactivos (menú móvil, diálogos, pestañas). En la práctica el menú móvil se hizo con un `signal` propio y sin CDK: para una lista de cinco enlaces no hace falta overlay ni foco atrapado, y así no se añade una dependencia. El CDK sigue siendo la opción si aparece un diálogo de verdad.
3. **Capa de servicios obligatoria:** los componentes nunca leen contenido directamente. Hoy los servicios leen Markdown; mañana llamarán a la API de Spring Boot sin cambiar los componentes.
4. **Hosting estático** (Cloudflare Pages o Netlify), con despliegue automático desde `main` y *preview* por cada PR.
5. **Sin backend en la fase 1.** Contacto con correo y dirección, sin formulario; inscripción mediante enlace a un formulario externo. → **Enmendada**, ver [Enmienda 1](#enmienda-1-formulario-de-preinscripción-propio-19102026).
6. **Accesibilidad como criterio de aceptación:** WCAG 2.1 AA, comprobado con axe y Lighthouse en CI.

## Opciones consideradas

### Opción A: Angular + Analog (estático) + Tailwind — ✅ elegida
| Dimensión | Valoración |
|---|---|
| Complejidad | Media |
| Coste | 0 € (hosting estático) |
| Escalabilidad | Alta: CDN; el backend se añade cuando haga falta |
| Familiaridad | Alta (Angular + Java en el equipo) |

**Pros:** cumple el stack deseado; HTML prerenderizado (SEO y accesibilidad); el contenido en Markdown permite añadir un panel de edición (Decap CMS) sin reescribir; no hay servidor que mantener.
**Contras:** sin panel de edición hasta la fase 2; Analog es menos conocido que Angular «a secas».

### Opción B: Angular SPA + Spring Boot desde el día 1
| Dimensión | Valoración |
|---|---|
| Complejidad | Alta |
| Coste | 5–10 €/mes (VPS/contenedor) |
| Escalabilidad | Alta |
| Familiaridad | Alta |

**Pros:** todo bajo control; base para el área privada.
**Contras:** hay que construir un CMS propio; servidor que mantener y actualizar; una SPA sin SSR penaliza SEO y accesibilidad; retrasa el lanzamiento meses.

### Opción C: WordPress con tema accesible
| Dimensión | Valoración |
|---|---|
| Complejidad | Baja |
| Coste | 3–8 €/mes hosting PHP |
| Escalabilidad | Media |
| Familiaridad | Baja (PHP) |

**Pros:** panel de edición inmediato; cualquiera publica.
**Contras:** plugins y actualizaciones de seguridad constantes (justo lo que ha fallado); no cumple el objetivo de demostrar una solución propia.

## Análisis de compromisos

La diferencia clave entre A y B es **cuándo se paga el coste del backend**. Con A la web pública sale en semanas, cuesta 0 € y sigue funcionando aunque nadie la toque. El backend llega cuando haya una necesidad concreta (login de monitores, inscripciones), y la capa de servicios hace que ese cambio no afecte a los componentes. C resolvería la edición antes, pero repite el modelo que ha fallado.

## Consecuencias

- **Más fácil:** lanzar rápido, cumplir accesibilidad, hosting gratuito, añadir Decap CMS (fase 2) y la API Spring Boot (fase 3).
- **Más difícil:** hasta la fase 2, publicar contenido requiere editar Markdown y hacer un PR. Hay que documentar el proceso para el kraal.
- **A revisar:** formulario de contacto (cuando exista backend); calendario dinámico; área privada y login (`auth-service`).

## Enmiendas

Las decisiones de arriba se dejan tal como se tomaron. Lo que cambia se escribe aquí, con su motivo.

### Enmienda 1: formulario de preinscripción propio (19/10/2026)

La decisión 5 decía que la inscripción sería «un enlace a un formulario externo». Se cambia: la **preinscripción** se hace con un formulario propio dentro de la web.

**Motivo.** El formulario de la web antigua pide nombre y apellidos del educando, su fecha de nacimiento y el domicilio completo, y lo guarda en un plugin de encuestas de e107 que nadie mantiene. Un enlace a un formulario externo arreglaba la accesibilidad, pero movía esos mismos datos a un tercero sobre el que no tenemos control.

**Lo que hace viable el formulario propio es recortar los datos.** La preinscripción solo pide nombre del adulto de contacto, correo, un teléfono, el año de nacimiento del educando y observaciones. Sin nombre del menor, sin fecha exacta y sin domicilio: con eso sobra para apartar una plaza y llamar a la familia. El resto se recoge en persona al formalizar la inscripción.

**Lo que no cambia:** la web sigue siendo estática y sin servidor propio. El envío irá a un servicio externo de plan gratuito (Cloudflare Pages Functions, Netlify Forms o similar), **pendiente de decidir**, y saldrá de un servicio de `core/services`, nunca del componente. Hasta que se decida, el formulario valida pero no envía, y lo dice en pantalla.

**Consecuencias:** un proveedor más que declarar en la política de privacidad, y el tope de envíos del plan gratuito como límite. Para las preinscripciones de un grupo scout, sobra.

### Enmienda 2: el mapa de contacto es de OpenStreetMap (19/10/2026)

El iframe de Google Maps instala cookies, lo que obligaría a un banner de consentimiento en todo el sitio y contradiría lo que dice la página de cookies. Se usa OpenStreetMap, que no instala ninguna. La dirección va además en texto dentro de un `<address>`, porque un mapa incrustado no lo lee un lector de pantalla.

## Acciones

1. [x] Generar el proyecto Analog en `frontend/` (ver `frontend/README.md`). Hecho con la plantilla «Blog» de Analog 2.8 sobre Angular 22, Tailwind 4 y `static: true` en `vite.config.ts` para prerenderizar sin servidor.
2. [ ] Definir tokens de diseño (colores del grupo y de cada sección) en Tailwind. Hay tokens **provisionales** en `src/styles.css`, elegidos solo por contraste; faltan los colores oficiales del grupo.
3. [x] Montar el layout accesible: skip link, header, navegación, footer.
4. [ ] Configurar despliegue en Cloudflare Pages/Netlify y CI con axe + Lighthouse.
5. [ ] Desarrollar las páginas según `docs/frontend/plan-trabajo.md`.
6. [ ] Redactar «Cómo publicar contenido» para el kraal.
