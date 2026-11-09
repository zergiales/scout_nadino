# Backend — Spring Boot 4 + Java 25 (fase 3)

Reservado para el backend. Maven multimódulo con un pom padre:

```
backend/
├── pom.xml            # padre (packaging pom) → spring-boot-starter-parent 4.x, java.version=25
├── auth-service/      # Usuarios del kraal y entrada al backoffice (ADR-0004)
└── docker-compose.yml # PostgreSQL para desarrollo
```

El diseño está en el [ADR-0004](../docs/adr/0004-servicio-de-usuarios.md): **un solo servicio**, Spring Security con **sesión en cookie** (no Authorization Server ni JWT), usuarios en **PostgreSQL** y un token de GitHub de una hora para que Sveltia publique. Lo que llegue después (inscripciones, área privada) entra como módulo de este mismo servicio, no como un servicio nuevo.

La web pública **no depende** del backend: debe funcionar aunque esté caído.
