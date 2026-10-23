# Web del Grupo Scout Nadino

Nueva web del Grupo Scout Nadino (Azuqueca de Henares), que sustituirá a la actual en scoutsnadino.es.

## Estructura del repositorio

```
scout_nadino/
├── frontend/        # Angular 22 + Analog + Tailwind — web pública (fase 1)
├── backend/         # Spring Boot 4 + Java 25, Maven multimódulo (fase 3)
└── docs/
    ├── adr/         # Decisiones de arquitectura
    ├── frontend/    # Mapa de páginas y plan de trabajo
    └── auditoria/   # Auditoría de accesibilidad de la web actual
```

## Fases

| Fase | Qué | Estado |
|---|---|---|
| 1 | Web pública estática: Inicio, Conócenos, Ramas, Inscripción, Contacto, Legal | En curso |
| 2 | Panel de edición para el kraal (Decap CMS sobre el Markdown) | Pendiente |
| 3 | Backend: `auth-service` (login de monitores) y API para inscripciones/área privada | Pendiente |

## Empezar

- Arquitectura: [`docs/adr/0001-arquitectura-frontend.md`](docs/adr/0001-arquitectura-frontend.md)
- A dónde llegan las preinscripciones: [`docs/adr/0002-destino-de-las-preinscripciones.md`](docs/adr/0002-destino-de-las-preinscripciones.md)
- Qué páginas hay: [`docs/frontend/paginas.md`](docs/frontend/paginas.md)
- Por dónde empezar y cómo repartir: [`docs/frontend/plan-trabajo.md`](docs/frontend/plan-trabajo.md)
- Montar el frontend: [`frontend/README.md`](frontend/README.md)

## Flujo de trabajo

1. Coge una issue y asígnatela.
2. Crea una rama `feat/<pagina>` desde `main`.
3. Abre una PR: se genera una preview y la revisa otra persona.
4. Merge a `main` → despliegue automático.
