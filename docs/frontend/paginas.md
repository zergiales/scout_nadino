# Mapa de páginas

Prioridad: **P0** = imprescindible para lanzar (MVP) · **P1** = justo después · **P2** = cuando haya backend.

| Página | Ruta | Prioridad | Contenido | Fuente de datos |
|---|---|---|---|---|
| Inicio | `/` | P0 | Presentación breve, secciones por edades, próximos eventos (si hay), llamada a inscribirse | Markdown + servicios |
| Conócenos | `/conocenos` | P0 | Historia del grupo, método scout, kraal, asociación (Scouts de Guadalajara / MSC), dónde está el local | `content/paginas/conocenos.md` |
| Ramas | `/ramas` | P0 | Un desplegable por rama: edades, color, qué hacen, horario de reuniones. Sin página de detalle por rama | `content/secciones/*.md` |
| Preinscripción | `/preinscripcion` | P0 | Formulario propio: adulto de contacto, correo, teléfono, año de nacimiento del educando y observaciones. Más plazos, cuotas y documentación | `content/paginas/preinscripcion.md` + formulario |
| Contacto | `/contacto` | P0 | Correo, dirección del local, horario, redes sociales. Sin formulario en fase 1 | `content/paginas/contacto.md` |
| Aviso legal | `/legal/aviso-legal` | P0 | Obligatorio | Markdown |
| Privacidad | `/legal/privacidad` | P0 | Obligatorio (RGPD) | Markdown |
| Cookies | `/legal/cookies` | P0 | Obligatorio si hay cookies; si no, declararlo | Markdown |
| Accesibilidad | `/legal/accesibilidad` | P0 | Declaración de accesibilidad y contacto para incidencias | Markdown |
| No encontrada | `/**` | P0 | 404 con enlaces útiles | — |
| Noticias (listado) | `/noticias` | P1 | Crónicas de actividades y campamentos, paginadas | `content/noticias/*.md` |
| Noticia (detalle) | `/noticias/:slug` | P1 | Texto, fotos (solo con autorización de imagen), fecha, sección | `content/noticias/<slug>.md` |
| Calendario | `/eventos` | P1 | Próximos eventos y ya celebrados, en lista (no rejilla de calendario: es más accesible) | `content/eventos/*.md` |
| Jota-Joti | `/eventos/joti-2026` | P0 | Fechas, JID del grupo, cómo participar y enlaces. Una página por edición | `content/eventos/joti-<año>.md` |
| Documentos | `/documentos` | P1 | Autorizaciones, circulares, listas de material (PDF) | `content/documentos/*.md` + `public/documentos/` |
| Acceso al blog | `/acceso` | P0 (pantalla) / P2 (funcionando) | Login para quien escribe en el blog. Hoy solo es la pantalla: valida los campos y avisa de que el área privada aún no está disponible, sin enviar nada. `noindex` | — (fase 3: `auth-service`) |
| Área privada | `/privado/**` | P2 | Gestión para monitores, tras el login | `auth-service` + API |
| Formulario de contacto | `/contacto` | P2 | Formulario real con envío | API |

## Navegación principal (máx. 6 elementos)

Inicio · Conócenos · Ramas · Calendario · Documentos · **Preinscripción** (destacada como botón)

Aparte, fuera del menú y sin contar para el tope: el botón con icono **Acceso al blog**, que lleva a `/acceso`.

Los enlaces legales y los que vayan apareciendo van en el **footer**. Está en el tope de 6, así que **para meter algo hay que sacar algo**: al entrar Calendario (`/eventos`), el Jota-Joti dejó su sitio y ahora se llega a él desde el calendario. Después Documentos entró en lugar de Contacto, que sigue en el footer. Cuando exista Noticias, habrá que decidir qué enlace sale.

Para comparar, el menú de la web antigua tenía 8 entradas: Inicio · Joti 2025 · Pre-Inscripción · Conócenos · Descargas · Contacto · Calendario · Downloads. `Downloads` era un duplicado de `Descargas`, y un evento de un año concreto no debería ocupar un hueco permanente.

## Dónde está el grupo

Parroquia de la Santa Cruz, Av. de la Constitución 1, 19200 Azuqueca de Henares (Guadalajara). Coordenadas `40.564693, -3.267574`, sacadas del mapa de la web antigua.

El **correo del grupo está pendiente**: en la web antigua figura como imagen, así que no se puede copiar ni leerlo con un lector de pantalla. También faltan el horario de reuniones y las redes sociales.

## Secciones (confirmar nombres y edades con el kraal)

**Aviso:** las edades de abajo **no coinciden** con lo que dice el formulario de la web antigua, que habla de «Exploradores y Pioneros (12 a 17)» y «Castores y Lobatos (6 a 11)». Hay que resolverlo antes de publicar la portada y las páginas de sección, porque aparecen en las dos.

| Slug | Nombre | Edades orientativas |
|---|---|---|
| `castores` | Castores | 6–8 |
| `lobatos` | Lobatos | 8–11 |
| `scouts` | Scouts / Exploradores | 11–14 |
| `pioneros` | Pioneros | 14–17 |
| `rutas` | Rutas | 17–21 |

## Reglas de contenido

- **Fotos de menores solo con autorización de imagen firmada.** Ante la duda, fotos de grupo de espaldas o sin caras.
- Todas las imágenes con `alt` descriptivo (o `alt=""` si son decorativas).
- Nada de datos personales de educandos (nombres completos, colegios, etc.).
- Fechas y textos en español; nada de restos de plantilla en inglés.
