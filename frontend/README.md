# Frontend — Angular 22 + Analog + Tailwind

Web pública del Grupo Scout Nadino, prerenderizada a HTML estático. Las decisiones están en [`docs/adr/0001-arquitectura-frontend.md`](../docs/adr/0001-arquitectura-frontend.md).

## Generar el proyecto (Sprint 0, tarea 0.1)

Desde la raíz del repo:

```bash
# Borra este README temporalmente si el asistente pide carpeta vacía
npm create analog@latest frontend
# Elige: plantilla "Blog/Content" (incluye Markdown) y Tailwind: sí
cd frontend
npm install
npm run dev
```

> Antes de generar, comprueba que la versión de Analog es compatible con **Angular 22**. Si el generador crea una versión anterior, actualiza con `ng update @angular/core@22 @angular/cli@22`.

Después del generador, crea las carpetas de la estructura objetivo y vuelve a poner este README.

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
│   │       ├── secciones/
│   │       │   ├── index.page.ts             → /secciones
│   │       │   └── [slug].page.ts            → /secciones/:slug
│   │       ├── noticias/
│   │       │   ├── index.page.ts             → /noticias
│   │       │   └── [slug].page.ts            → /noticias/:slug
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
└── vite.config.ts                # (generado) prerender: lista de rutas + rutas de content/
```

## Reglas

1. **Las páginas no leen contenido directamente**: siempre `inject(NoticiasService)` etc. Así el cambio a la API de Spring Boot solo toca `core/services`.
2. **`shared/ui` no conoce los servicios**: recibe datos por `input()` y emite eventos por `output()`.
3. **Colores y tamaños solo desde tokens** de `styles.css`. Nada de `#990000` sueltos.
4. **Componentes standalone + signals**, sin NgModules.
5. **Accesibilidad**: ver la definición de hecho en [`docs/frontend/plan-trabajo.md`](../docs/frontend/plan-trabajo.md).

## Formato del contenido (frontmatter)

```markdown
---
title: Salida de otoño a la Sierra de Ayllón
date: 2026-10-12
seccion: lobatos           # opcional
resumen: Primera salida de la ronda con los nuevos lobatos.
portada: /img/noticias/2026-10-12-ayllon.webp
portadaAlt: Grupo de lobatos caminando por un hayedo, de espaldas
---

Texto de la noticia en Markdown...
```
