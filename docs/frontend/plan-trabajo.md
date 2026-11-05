# Plan de trabajo del frontend

Última revisión: 04/11/2026.

## Orden

```
Sprint 0 ─ Fundaciones (bloqueante, 1 persona)
   │
   ├─▶ Bloque A ─ Páginas institucionales   (Inicio, Conócenos, Ramas)
   ├─▶ Bloque B ─ Páginas de servicio       (Preinscripción, Contacto, Legal, 404)
   ├─▶ Bloque C ─ Contenido dinámico        (Noticias, Calendario, Documentos)   ← P1
   └─▶ Bloque D ─ Contenido real (kraal)    (textos, fotos, documentos)       ← en paralelo desde el día 1
   │
   ▼
Lanzamiento MVP (A + B + D)  →  Bloque C  →  Fase 2: CMS (Sveltia, ADR-0003)  →  Fase 3: auth-service / API
```

**Se empieza por el Sprint 0** porque todo lo demás depende de él: si cada persona monta su propio header o sus propios colores, la web acaba siendo incoherente.

## Próximos pasos

En este orden. Los dos primeros no dependen de nadie más que de quien programa.

1. **CI (0.7).** Es la red que falta: comprueba la accesibilidad de cada PR y avisa si un cambio desde el CMS rompe el build.
2. **Organización del grupo en GitHub** (al menos dos propietarios, 2FA obligatorio, repositorio privado) y **despliegue (0.8)**. Hoy el repositorio está en una cuenta personal. El despliegue desbloquea las previews por PR, el backoffice en producción y la función de preinscripción.
3. **En paralelo, mientras contesta el kraal:** mover a `src/content` el texto escrito a mano y terminar el SEO (0.6).
4. **Pedir al kraal, en un solo mensaje,** todo lo de la lista «Pendiente del kraal», empezando por el buzón de las preinscripciones.

## Sprint 0 — Fundaciones (una sola persona)

Estado: **✅** hecho · **⏳** empezado, falta algo · sin marca, sin empezar.

| # | Tarea | Hecho cuando… |
|---|---|---|
| ✅ 0.1 | Generar proyecto Analog + Angular 22 en `frontend/` | `npm run build` genera las rutas prerenderizadas en `dist/analog/public/` (hoy son 13, más el 404) |
| ⏳ 0.2 | Tailwind con tokens: colores del grupo y de cada sección, tipografía, espaciados | Tokens en `src/styles.css`, nada de colores sueltos en componentes. Hechos, con tema oscuro por defecto y claro opcional. Los colores son **provisionales**, elegidos solo por contraste: faltan los oficiales (Bloque D) |
| ⏳ 0.3 | Layout: skip link, header, navegación, footer | Navegable con teclado y lector de pantalla; sin scroll horizontal a 320 px. Hecho, con un `signal` en vez del CDK para el menú móvil. **Falta comprobarlo** con lector de pantalla y a 320 px |
| ✅ 0.4 | Modelos y servicios (`core/models`, `core/services`) | Hechos `Seccion`, `Evento`, `Documento`, `Noticia` y `Album`, con sus servicios. Ramas, eventos, documentos, noticias y álbumes salen de `src/content` |
| ⏳ 0.5 | Componentes base en `shared/ui`: botón, tarjeta, encabezado de sección, imagen responsive | Con estado de foco visible y contraste ≥ 4,5:1. Existe `mapa-conexiones`; faltan los cuatro de la lista |
| ⏳ 0.6 | SEO por página: `<title>`, meta description, `lang="es"` | Cada ruta con título único. Hechos los títulos (`routeMeta`) y el `lang="es"`; faltan `core/seo`, la meta description y Open Graph |
| 0.7 | CI: lint + build + tests + axe + Lighthouse (umbral de accesibilidad ≥ 95) | La PR falla si baja la accesibilidad. También avisa si un commit del CMS rompe el build |
| 0.8 | Despliegue en Cloudflare Pages con preview por PR | URL de preview en cada PR. El hosting quedó cerrado en Cloudflare Pages ([ADR-0002](../adr/0002-destino-de-las-preinscripciones.md)). Antes conviene tener la organización del grupo en GitHub |

**Deuda consciente.** Varias páginas se adelantaron para poder ver la web funcionando, así que su texto está escrito a mano dentro del componente. Eso **incumple la definición de hecho** a propósito y de forma temporal. Ya se movió lo que edita el CMS (ramas, eventos, documentos, noticias y álbumes). **Faltan Conócenos, Contacto, Preinscripción, Jota-Joti y los cuatro legales**, y también la portada, salvo sus noticias. Las páginas ya no llevan un aviso visible de borrador (el grupo lo quitó), así que esta lista es el único recordatorio.

## Bloques en paralelo

### Bloque A — Institucional
- [ ] **Conócenos**: hecha la estructura, con texto provisional escrito en el componente; la presentación del kraal está pendiente
- [ ] **Inicio**: foto del grupo, las tres últimas noticias, secciones y llamadas a la acción. El resto del texto es provisional y escrito a mano
- [x] **Ramas**: un desplegable por rama, leído de `src/content/secciones`. Sin página de detalle (decisión en [paginas.md](paginas.md)). Faltan las edades definitivas

### Bloque B — Servicio
- [ ] **Preinscripción**: formulario accesible y validado con los datos mínimos (Enmienda 1 del ADR-0001). El canal de envío ya está decidido ([ADR-0002](../adr/0002-destino-de-las-preinscripciones.md): función de Cloudflare → correo), pero **está bloqueado por el buzón del grupo y por el despliegue (0.8)**. Todavía no envía nada
- [ ] **Contacto**: dirección, correo, horario de reuniones y mapa de OpenStreetMap. Faltan las redes sociales
- [ ] **Legal**: aviso legal, privacidad, cookies y declaración de accesibilidad. Las cuatro existen con un párrafo de «estamos preparando este texto»; los textos son del Bloque D
- [x] **404**, con enlaces útiles

### Bloque C bis — Jota-Joti (adelantado)
- [ ] **Jota-Joti 2026** (`/eventos/joti-2026`): **el evento ya pasó** (16-18 de octubre de 2026). Hay que decidir si la página se queda como crónica, se retira o se prepara la de 2027. Nunca llegaron el JID del grupo ni el enlace de registro

### Bloque C — Dinámico (P1)
- [x] **Noticias**: sin página propia; las tres últimas salen en la portada, con su texto desplegable. La de Medinaceli es un ejemplo inventado: **hay que sustituirla o borrarla antes de lanzar**
- [x] **Calendario** (`/eventos`): lista de próximos y celebrados, separados solos por la fecha
- [x] **Documentos**: plantillas por categoría y, al final, «Fotos» con los álbumes de Google Drive

### Fase 2 — CMS ([ADR-0003](../adr/0003-cms-y-acceso-de-editores.md))
- [x] Backoffice con Sveltia en `public/backoffice/`, funcionando en local sin login
- [x] `/acceso` como puerta hacia el backoffice
- [ ] Organización del grupo en GitHub, OAuth App y autenticador en Cloudflare (o login PKCE, si GitHub ya lo permite)
- [ ] **Decidir** si el CMS publica directamente en `main` (exento del flujo de PR) o abre una PR por cada cambio (`editorial_workflow`). Hoy publica en `main`, y eso choca con proteger la rama
- [ ] **Procedimiento para retirar una foto publicada por error**: revertir el commit no basta, porque la foto sigue en el historial de Git y en los despliegues antiguos de Cloudflare Pages
- [ ] Guía de una página para quien edita
- [ ] Imágenes dentro del texto de una noticia: el editor no obliga a describirlas

### Bloque D — Pendiente del kraal (no hace falta saber programar)
- [ ] **Buzón del grupo para las preinscripciones**, con acceso transferible. Bloquea todo el ADR-0002
- [ ] Edades definitivas de cada sección (las del plan no coinciden con las de la web antigua)
- [ ] Textos de Conócenos, cada sección, preinscripción y contacto
- [ ] Fotos **con autorización de imagen** (mínimo 1 por sección + portada)
- [ ] Logos del grupo, la asociación y la federación en SVG/PNG
- [ ] Documentos PDF actuales (autorizaciones, circulares)
- [ ] Datos legales: titular (asociación), CIF, dirección
- [ ] Colores oficiales del grupo y de cada sección
- [ ] Redes sociales
- [x] Correo del grupo (`info@scoutsnadino.es`), año de fundación (2011) y horario de reuniones (sábados de 11:30 a 13:35)

## Cómo repartir

- **Una issue por página** (plantilla «Nueva página» en `.github/ISSUE_TEMPLATE`), asignada a una persona.
- **Una rama por issue**: `feat/conocenos`, `feat/contacto`…
- **PR con preview**: la revisa otra persona y la checklist de accesibilidad debe estar completa. La preview depende de la 0.8.
- Si sois **una sola persona de desarrollo**: sigue la lista de «Próximos pasos».

## Definición de hecho (todas las páginas)

- [ ] Contenido desde `src/content`, nunca escrito a mano en el componente
- [ ] Datos a través de un servicio de `core/services`
- [ ] Un solo `<h1>` y jerarquía de encabezados correcta
- [ ] Imágenes con `alt` adecuado
- [ ] Funciona con teclado y el foco es visible
- [ ] Sin scroll horizontal a 320px; legible con zoom al 200 %
- [ ] Contraste ≥ 4,5:1 (texto) y ≥ 3:1 (componentes)
- [ ] axe sin errores; Lighthouse accesibilidad ≥ 95
- [ ] Título y meta description propios
