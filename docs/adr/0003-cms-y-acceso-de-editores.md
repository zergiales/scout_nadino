# ADR-0003: CMS y acceso de quien edita la web

**Estado:** Propuesto
**Fecha:** 25/10/2026
**Deciden:** Sergio + kraal del grupo

## Contexto

La fase 2 del [ADR-0001](0001-arquitectura-frontend.md) prevé un CMS sobre el mismo Markdown de `frontend/src/content`, para que el kraal publique noticias, eventos y documentos sin abrir PRs. Ese mismo ADR nombraba Decap CMS, pero no decidía cómo se identifica quien edita.

Mientras tanto se construyó la pantalla `/acceso` («Acceso al blog»), con usuario y contraseña. **No autentica a nadie:** una web estática no puede comprobar una contraseña de forma segura. Esta decisión fija qué hay detrás de esa puerta.

Restricciones, las mismas de siempre:

- **Coste 0 €** salvo el dominio.
- **Nadie vigila el sistema** y el kraal rota cada pocos años. Lo que haya que mantener, no se mantendrá.
- **El hosting es Cloudflare Pages** ([ADR-0002](0002-destino-de-las-preinscripciones.md)).
- **Quien edita no es técnico.** El editor tiene que ser un formulario, no Markdown ni Git.
- **Todos los usuarios que se den de alta pueden editar y publicar.** No hay roles (decisión del grupo, 25/10/2026).

## Decisión

**CMS basado en Git en `/admin`, con Sveltia CMS, login con GitHub y un pequeño autenticador OAuth en Cloudflare.**

1. Quien edita entra en `/admin` e inicia sesión con **su cuenta de GitHub**.
2. Rellena un formulario: «Nueva noticia», «Nuevo evento», «Subir documento».
3. Al guardar, el CMS hace un commit del `.md` (y de las imágenes) en el repositorio.
4. Cloudflare Pages lo despliega solo. En uno o dos minutos está publicado.

Las piezas:

| Pieza | Qué es | Dónde vive |
|---|---|---|
| Sveltia CMS | Una página estática con el editor | `frontend/public/admin/index.html` + `config.yml` |
| Autenticador OAuth | Intercambia el código de GitHub por un token. Unas decenas de líneas, sin estado | Worker o Pages Function de Cloudflare (`sveltia-cms-auth`) |
| GitHub OAuth App | Registra la aplicación en GitHub | Cuenta del grupo en GitHub |
| Contenido | Los mismos `.md` que ya leen los servicios de `core/services` | `frontend/src/content/` |

**Dar de alta a alguien** es añadirlo como colaborador del repositorio con permiso de escritura. Darlo de baja, quitarlo. No hay base de datos de usuarios, contraseñas ni correos de recuperación.

**`/acceso` se queda como puerta**, porque el botón de la cabecera ya lleva allí. El formulario de usuario y contraseña se sustituye por un botón «Entrar con GitHub» que lleva a `/admin`, con una línea que explique quién puede entrar y a quién pedir acceso. Lo que se construyó para la contraseña (ojo animado, control de errores) se retira: no hay contraseña que escribir en nuestra web.

**Sin revisión obligatoria.** Como todos pueden publicar, lo que se guarda sale publicado. La red de seguridad es el historial de Git: cualquier cambio se puede deshacer. La regla de fotos de menores (solo con autorización de imagen firmada) es una norma de quien edita, no algo que el sistema compruebe.

## Opciones consideradas

### Opción A: CMS Git con Sveltia — ✅ elegida

Sveltia CMS es un sustituto de Decap/Netlify CMS que lee **la misma configuración** (`config.yml`). Lo elegimos frente a Decap porque se mantiene más activamente y porque puede **convertir las imágenes a WebP al subirlas**, algo útil con fotos de móvil (HEIC de 4000 px o más).

**Pros:** 0 €; sin servidor ni base de datos; el contenido sigue en Markdown en el repo, que es el diseño de la fase 1; historial y deshacer gratis; altas y bajas desde GitHub.

**Contras:** cada editor necesita una cuenta de GitHub (gratis, se crea una vez); publicar tarda lo que tarda un despliegue (1-2 min); Sveltia todavía no ha llegado a la 1.0.

### Opción B: Decap CMS

Lo que nombraba el ADR-0001. Misma arquitectura y misma configuración que A.

**Pros:** más años en producción y más documentación.

**Contras:** avanza despacio; no optimiza imágenes al subirlas. **Es el plan B:** como la configuración es compatible, volver a Decap es cambiar el script de `admin/index.html`.

### Opción C: usuario y contraseña propios (backend Spring Boot)

Lo que sugiere la pantalla `/acceso` actual: cuentas nuestras, base de datos y un editor hecho a mano.

**Pros:** no depende de GitHub; el editor se puede hacer a medida.

**Contras:** obliga a adelantar la fase 3 entera (`auth-service`, base de datos, servidor, recuperación de contraseña, editor) solo para publicar noticias. Meses de trabajo y un servidor que alguien tendría que pagar, actualizar y vigilar. Choca con todas las restricciones. **Descartada para el CMS.** La fase 3 sigue en pie para lo que sí necesita backend (área privada, inscripciones, documentos en base de datos), y si llega, se puede revisar esta decisión.

### Opción D: CMS SaaS (Contentful, Sanity, Storyblok…)

**Pros:** editor pulido; usuarios con correo y contraseña, sin GitHub.

**Contras:** el contenido sale del repo y vive en el proveedor; los planes gratuitos cambian y tienen límites de usuarios; habría que reescribir los servicios de `core/services` para leer su API; otro encargado de tratamiento que declarar. Más cosas que caducan.

## Consecuencias

- **Más fácil:** publicar sin saber Git; dar y quitar acceso; deshacer errores; seguir con 0 € y sin servidor.
- **Más difícil:** quien edite necesita una cuenta de GitHub, y alguien con permisos de administración en el repo tiene que darle acceso.
- **Depende de** la tarea 0.4 (modelos y servicios) y de que el contenido viva de verdad en `src/content`: hoy casi todo el texto está escrito dentro de los componentes, y el CMS solo puede editar Markdown. También depende de la 0.8 (despliegue en Cloudflare Pages).
- **Riesgo:** se publica una foto sin autorización. **Mitigación:** la norma está escrita en el propio formulario del CMS (texto de ayuda del campo de imagen) y en la guía de quien edita; si pasa, se revierte el commit. Que el repositorio de GitHub sea **privado** reduce la exposición del historial (la web sigue siendo pública).
- **Riesgo:** se filtra el secreto de la OAuth App. **Mitigación:** vive como secreto en Cloudflare, nunca en el repo. Con él no se puede escribir en el repo: hace falta además la sesión de un colaborador.

## Pendiente

1. [ ] Hecha la 0.4 y movido el contenido a `src/content` (al menos noticias, eventos y documentos).
2. [ ] Página de Noticias (listado + detalle), que es lo que más se va a editar.
3. [ ] Despliegue en Cloudflare Pages (0.8).
4. [ ] Crear la cuenta u organización del grupo en GitHub, la OAuth App y el autenticador en Cloudflare.
5. [ ] `public/admin/` con Sveltia y `config.yml`: colecciones `noticias`, `eventos`, `documentos`.
6. [ ] Cambiar `/acceso` por el botón «Entrar con GitHub».
7. [ ] Comprobar antes de montarlo, porque cambia: la versión de Sveltia, si GitHub ya permite el login PKCE sin autenticador (Sveltia dejaría de necesitar el Worker) y el estado de Decap como plan B.
8. [ ] Guía de una página para quien edita: cómo entrar, cómo publicar, qué fotos se pueden subir.
