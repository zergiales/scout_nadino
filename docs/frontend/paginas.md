# Mapa de páginas

Prioridad: **P0** = imprescindible para lanzar (MVP) · **P1** = justo después · **P2** = cuando haya backend.

| Página | Ruta | Prioridad | Contenido | Fuente de datos |
|---|---|---|---|---|
| Inicio | `/` | P0 | Presentación breve, secciones por edades, próximos eventos (si hay), llamada a inscribirse | Markdown + servicios |
| Conócenos | `/conocenos` | P0 | Historia del grupo, método scout, kraal, asociación (Scouts de Guadalajara / MSC), dónde está el local | `content/paginas/conocenos.md` |
| Secciones (listado) | `/secciones` | P0 | Tarjeta por sección con edades y color | `content/secciones/*.md` |
| Sección (detalle) | `/secciones/:slug` | P0 | Qué hacen, edades, horario de reuniones, fotos | `content/secciones/<slug>.md` |
| Inscripción | `/inscripcion` | P0 | Cómo apuntarse, plazos, cuotas, documentación, enlace al formulario externo | `content/paginas/inscripcion.md` |
| Contacto | `/contacto` | P0 | Correo, dirección del local, horario, redes sociales. Sin formulario en fase 1 | `content/paginas/contacto.md` |
| Aviso legal | `/legal/aviso-legal` | P0 | Obligatorio | Markdown |
| Privacidad | `/legal/privacidad` | P0 | Obligatorio (RGPD) | Markdown |
| Cookies | `/legal/cookies` | P0 | Obligatorio si hay cookies; si no, declararlo | Markdown |
| Accesibilidad | `/legal/accesibilidad` | P0 | Declaración de accesibilidad y contacto para incidencias | Markdown |
| No encontrada | `/**` | P0 | 404 con enlaces útiles | — |
| Noticias (listado) | `/noticias` | P1 | Crónicas de actividades y campamentos, paginadas | `content/noticias/*.md` |
| Noticia (detalle) | `/noticias/:slug` | P1 | Texto, fotos (solo con autorización de imagen), fecha, sección | `content/noticias/<slug>.md` |
| Eventos / Calendario | `/eventos` | P1 | Próximos eventos en lista (no rejilla de calendario: es más accesible) | `content/eventos/*.md` |
| Documentos | `/documentos` | P1 | Autorizaciones, circulares, listas de material (PDF) | `content/documentos/*.md` + `public/documentos/` |
| Área privada | `/privado/**` | P2 | Login de monitores, gestión | `auth-service` + API |
| Formulario de contacto | `/contacto` | P2 | Formulario real con envío | API |

## Navegación principal (máx. 6 elementos)

Inicio · Conócenos · Secciones · Noticias · Eventos · Inscripción
Contacto, Documentos y los enlaces legales van en el **footer**. «Inscripción» puede destacarse como botón.

## Secciones (confirmar nombres y edades con el kraal)

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
