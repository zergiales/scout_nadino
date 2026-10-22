# Plan de trabajo del frontend

## Orden

```
Sprint 0 ─ Fundaciones (bloqueante, 1 persona)
   │
   ├─▶ Bloque A ─ Páginas institucionales   (Inicio, Conócenos, Secciones)
   ├─▶ Bloque B ─ Páginas de servicio       (Inscripción, Contacto, Legal, 404)
   ├─▶ Bloque C ─ Contenido dinámico        (Noticias, Eventos, Documentos)   ← P1
   └─▶ Bloque D ─ Contenido real (kraal)    (textos, fotos, documentos)       ← en paralelo desde el día 1
   │
   ▼
Lanzamiento MVP (A + B + D)  →  Bloque C  →  Fase 2: Decap CMS  →  Fase 3: auth-service / API
```

**Se empieza por el Sprint 0** porque todo lo demás depende de él: si cada persona monta su propio header o sus propios colores, la web acaba siendo incoherente. Después, **Conócenos** es la primera página, porque es la que hoy está rota.

## Sprint 0 — Fundaciones (una sola persona)

Estado: **✅** hecho · **⏳** empezado, falta algo · sin marca, sin empezar.

| # | Tarea | Hecho cuando… |
|---|---|---|
| ✅ 0.1 | Generar proyecto Analog + Angular 22 en `frontend/` | `npm run build` genera las 10 rutas prerenderizadas en `dist/analog/public/` |
| ⏳ 0.2 | Tailwind con tokens: colores del grupo y de cada sección, tipografía, espaciados | Tokens en `src/styles.css`, nada de colores sueltos en componentes. Los que hay son **provisionales**, elegidos solo por contraste: faltan los oficiales (Bloque D) |
| ⏳ 0.3 | Layout: skip link, header, navegación (con menú móvil vía CDK), footer | Navegable con teclado y lector de pantalla; sin scroll horizontal a 320px. Hecho, pero con un `signal` en vez del CDK, y sin comprobar todavía con lector de pantalla ni a 320 px |
| 0.4 | Modelos y servicios vacíos (`core/models`, `core/services`) | Interfaces `Noticia`, `Evento`, `Seccion`, `Documento` definidas |
| ⏳ 0.5 | Componentes base en `shared/ui`: botón, tarjeta, encabezado de sección, imagen responsive | Con estado de foco visible y contraste ≥ 4,5:1. Existe `mapa-conexiones`; faltan los cuatro de la lista |
| ⏳ 0.6 | SEO por página: `<title>`, meta description, `lang="es"` | Cada ruta con título único. Hechos los títulos (`routeMeta`) y el `lang="es"`; faltan meta description y Open Graph |
| 0.7 | CI: lint + build + axe + Lighthouse (umbral de accesibilidad ≥ 95) | La PR falla si baja la accesibilidad |
| 0.8 | Despliegue en Cloudflare Pages/Netlify con preview por PR | URL de preview en cada PR |

**Ojo con el orden.** Las páginas de abajo se adelantaron para poder ver la web funcionando, así que su contenido está escrito a mano dentro de los componentes. Eso **incumple la definición de hecho** a propósito y de forma temporal: en cuanto exista la capa de servicios (0.4), ese texto se mueve a `src/content`. Cada página lleva un aviso «Borrador» visible para que no se olvide.

## Bloques en paralelo

### Bloque A — Institucional (dev 1)
- [ ] **Conócenos** (primera, sustituye la página rota) — esqueleto puesto, sin contenido
- [ ] **Inicio** — portada provisional con las secciones y las dos llamadas a la acción
- [ ] **Secciones**: listado + detalle por slug — esqueleto del listado; el detalle no existe

### Bloque B — Servicio (dev 2)
- [ ] **Preinscripción** (formulario propio, ver Enmienda 1 del ADR) — formulario accesible y validado; **falta decidir a dónde se envía**
- [ ] **Contacto** (sin formulario) — hecho con dirección y mapa de OpenStreetMap; faltan correo, horario y redes
- [ ] **Legal**: aviso legal, privacidad, cookies, declaración de accesibilidad — las cuatro existen vacías; los textos son del Bloque D
- [ ] **404** — hecho, con enlaces útiles

### Bloque C bis — Jota-Joti (adelantado)
- [ ] **Jota-Joti 2026** (`/eventos/joti-2026`) — página con las fechas del 16 al 18 de octubre de 2026; faltan el JID del grupo y el enlace de registro de contactos

### Bloque C — Dinámico, P1 (quien acabe antes)
- [ ] **Noticias**: listado paginado + detalle
- [ ] **Eventos**: lista de próximos, eventos pasados ocultos automáticamente
- [ ] **Documentos**: listado de PDFs por categoría

### Bloque D — Contenido (kraal, no hace falta saber programar)
- [ ] Textos de Conócenos, cada sección, inscripción y contacto
- [ ] Fotos **con autorización de imagen** (mínimo 1 por sección + portada)
- [ ] Logos del grupo, la asociación y la federación en SVG/PNG
- [ ] Documentos PDF actuales (autorizaciones, circulares)
- [ ] Datos legales: titular (asociación), CIF, dirección, correo de contacto
- [ ] Colores oficiales del grupo y de cada sección

## Cómo repartir

- **Una issue por página** (plantilla «Nueva página» en `.github/ISSUE_TEMPLATE`), asignada a una persona.
- **Una rama por issue**: `feat/conocenos`, `feat/noticias`…
- **PR con preview**: la revisa otra persona y la checklist de accesibilidad debe estar completa.
- Si sois **una sola persona de desarrollo**: Sprint 0 → Conócenos → Inicio → Secciones → Inscripción → Contacto → Legal → 404 → lanzamiento → Bloque C.

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
