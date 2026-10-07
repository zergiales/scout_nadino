# Backend — Spring Boot 4 + Java 25 (fase 3)

Reservado para el backend. Maven multimódulo con un pom padre:

```
backend/
├── pom.xml            # padre (packaging pom) → spring-boot-starter-parent 4.x, java.version=25
├── auth-service/      # Spring Authorization Server (OAuth2/JWT) — login de monitores
└── docker-compose.yml # PostgreSQL + servicios para desarrollo
```

La web pública **no depende** del backend: debe funcionar aunque esté caído.
