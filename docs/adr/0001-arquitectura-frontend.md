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
2. **Tailwind CSS** para los estilos, con los colores del grupo definidos como *tokens*. **Angular CDK / Spartan UI** solo para componentes interactivos (menú móvil, diálogos, pestañas).
3. **Capa de servicios obligatoria:** los componentes nunca leen contenido directamente. Hoy los servicios leen Markdown; mañana llamarán a la API de Spring Boot sin cambiar los componentes.
4. **Hosting estático** (Cloudflare Pages o Netlify), con despliegue automático desde `main` y *preview* por cada PR.
5. **Sin backend en la fase 1.** Contacto con correo y dirección; inscripción mediante enlace a un formulario externo.
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

## Acciones

1. [ ] Generar el proyecto Analog en `frontend/` (ver `frontend/README.md`).
2. [ ] Definir tokens de diseño (colores del grupo y de cada sección) en Tailwind.
3. [ ] Montar el layout accesible: skip link, header, navegación, footer.
4. [ ] Configurar despliegue en Cloudflare Pages/Netlify y CI con axe + Lighthouse.
5. [ ] Desarrollar las páginas según `docs/frontend/plan-trabajo.md`.
6. [ ] Redactar «Cómo publicar contenido» para el kraal.
