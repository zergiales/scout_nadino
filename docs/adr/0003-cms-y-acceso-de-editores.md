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

**CMS basado en Git en `/backoffice`, con Sveltia CMS, login con GitHub y un pequeño autenticador OAuth en Cloudflare.**

1. Quien edita entra en `/backoffice` (desde el botón «Acceso» de la cabecera) e inicia sesión con **su cuenta de GitHub**.
2. Rellena un formulario: «Nueva noticia», «Nuevo evento», «Subir documento».
3. Al guardar, el CMS hace un commit del `.md` (y de las imágenes) en el repositorio.
4. Cloudflare Pages lo despliega solo. En uno o dos minutos está publicado.

Las piezas:

| Pieza | Qué es | Dónde vive |
|---|---|---|
| Sveltia CMS | Una página estática con el editor. Versión fijada (0.233.0) y con hash de integridad | `frontend/public/backoffice/index.html` + `config.yml` |
| Autenticador OAuth | Intercambia el código de GitHub por un token. Unas decenas de líneas, sin estado | Worker o Pages Function de Cloudflare (`sveltia-cms-auth`) |
| GitHub OAuth App | Registra la aplicación en GitHub | Cuenta del grupo en GitHub |
| Contenido | Los mismos `.md` que ya leen los servicios de `core/services` | `frontend/src/content/` |

**Dar de alta a alguien** es añadirlo como colaborador del repositorio con permiso de escritura. Darlo de baja, quitarlo. No hay base de datos de usuarios, contraseñas ni correos de recuperación.

**`/acceso` se queda como puerta**, porque el botón de la cabecera ya lleva allí. El formulario de usuario y contraseña se sustituye por un botón «Entrar al backoffice» que lleva a `/backoffice/index.html`, con una línea que explique quién puede entrar y a quién pedir acceso. Lo que se construyó para la contraseña (ojo animado, control de errores) se retira: no hay contraseña que escribir en nuestra web.

**Sin revisión obligatoria.** Como todos pueden publicar, lo que se guarda sale publicado. La red de seguridad es el historial de Git: cualquier cambio se puede deshacer. La regla de fotos de menores (solo con autorización de imagen firmada) es una norma de quien edita, no algo que el sistema compruebe.

## Opciones consideradas

### Opción A: CMS Git con Sveltia — ✅ elegida

Sveltia CMS es un sustituto de Decap/Netlify CMS que lee **la misma configuración** (`config.yml`). Lo elegimos frente a Decap porque se mantiene más activamente y porque puede **convertir las imágenes a WebP al subirlas**, algo útil con fotos de móvil (HEIC de 4000 px o más).

**Pros:** 0 €; sin servidor ni base de datos; el contenido sigue en Markdown en el repo, que es el diseño de la fase 1; historial y deshacer gratis; altas y bajas desde GitHub.

**Contras:** cada editor necesita una cuenta de GitHub (gratis, se crea una vez); publicar tarda lo que tarda un despliegue (1-2 min); Sveltia todavía no ha llegado a la 1.0.

### Opción B: Decap CMS

Lo que nombraba el ADR-0001. Misma arquitectura y misma configuración que A.

**Pros:** más años en producción y más documentación.

**Contras:** avanza despacio; no optimiza imágenes al subirlas. **Es el plan B:** como la configuración es compatible, volver a Decap es cambiar el script de `backoffice/index.html`.

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

## Enmienda 1: backoffice en `/backoffice` y noticias con texto completo (25/10/2026)

- La carpeta se llama `backoffice` y no `admin`, que es como lo llama el grupo.
- **Las noticias llevan texto con estilos y fotos** (el cuerpo del `.md`), escrito con el editor visual del backoffice. No tienen página propia: el texto se despliega dentro de su tarjeta en la portada, con «Leer la noticia». Se eligió así porque las crónicas serán cortas (una foto, a veces un vídeo o una animación), y porque a futuro se quieren completar con publicaciones de Instagram.
- El editor no ofrece títulos (H1-H6): dentro de una tarjeta romperían la jerarquía de la página (un solo `<h1>`, criterio de accesibilidad).
- **Se prueba en local sin login**: en `npm run dev`, Sveltia ofrece «Trabajar con el repositorio local» (Chrome o Edge) y escribe en la carpeta del proyecto. El login con GitHub solo hace falta una vez desplegado.
- Pendiente de decidir: vídeos (subirlos al repo pesa demasiado; mejor enlazar a YouTube o Instagram) y la automatización desde Instagram.

## Enmienda 2: vuelve el formulario de `/acceso`, como puerta (25/10/2026)

El grupo prefiere la pantalla de usuario y contraseña a un botón. Vuelve, con estas condiciones:

- **Hoy es una puerta, no un login.** Valida el formato de los campos y manda a `/backoffice/index.html`; no comprueba la contraseña, porque una web estática no puede hacerlo. Quien protege es la cuenta de GitHub que pide el backoffice. La propia pantalla lo dice, para no dar falsa seguridad, y **hay dos logins** hasta la fase 3.
- **Preparada para la fase 3.** La página no decide nada: pregunta a `AccesoService` (`core/services/acceso.service.ts`), que hoy responde siempre que sí. Ya sabe mostrar «usuario o contraseña incorrectos» cuando el servicio diga que no, así que en la fase 3 solo cambia el servicio.

**Cómo quedaría en la fase 3**, para que entren con un usuario de nuestra base de datos y un solo login:

1. El monitor escribe usuario y contraseña en `/acceso`. `AccesoService` llama a `auth-service`, que los comprueba contra la base de datos y abre sesión (cookie `HttpOnly`).
2. Se le manda al backoffice. Sveltia sigue necesitando un token de GitHub para publicar, pero en vez de pedírselo a GitHub se lo pide a **nuestro** `auth-service`: es el mismo protocolo del autenticador OAuth (`base_url` en `config.yml`), solo que lo atiende nuestro servidor.
3. `auth-service` ve que hay sesión y responde con un **token de GitHub de corta duración** (una hora), generado al momento por una **GitHub App** del grupo con permiso solo sobre este repositorio. La ventana se cierra sola: el monitor no ve un segundo login.

Lo que **no** se hace: guardar un token de GitHub por usuario en la base de datos. Serían secretos de larga duración que, si se filtra la base de datos, dan acceso al repositorio. En la base de datos van usuarios, contraseñas (con hash) y si están activos; el token se fabrica en cada entrada y caduca solo.

Consecuencias: los monitores ya no necesitan cuenta de GitHub, y las altas y bajas se hacen en nuestra base de datos. A cambio, todos los commits aparecen como hechos por la GitHub App; para saber quién publicó qué, `auth-service` tendría que registrarlo aparte. Y todo depende de que exista el backend, con su servidor que mantener.

## Pendiente

1. [x] Hecha la 0.4 y movido el contenido a `src/content` (noticias, eventos, documentos y ramas).
2. [x] Noticias, que es lo que más se va a editar: tres últimas en la portada, con su texto desplegable (enmienda 1).
3. [ ] Despliegue en Cloudflare Pages (0.8).
4. [ ] Crear la cuenta u organización del grupo en GitHub, la OAuth App y el autenticador en Cloudflare.
5. [x] `public/backoffice/` con Sveltia y `config.yml`: colecciones `noticias`, `eventos`, `documentos` y `secciones` (solo editar). Falta el `base_url` del autenticador.
6. [x] `/acceso` es la puerta: formulario que manda al backoffice a través de `AccesoService` (enmienda 2).
7. [ ] Comprobar antes de desplegarlo, porque cambia: si GitHub ya permite el login PKCE sin autenticador (Sveltia dejaría de necesitar el Worker) y el estado de Decap como plan B.
8. [ ] Guía de una página para quien edita: cómo entrar, cómo publicar, qué fotos se pueden subir.
