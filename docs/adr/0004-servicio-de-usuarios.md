# ADR-0004: Servicio propio de usuarios para entrar al backoffice

**Estado:** Propuesto
**Fecha:** 07/11/2026
**Deciden:** Sergio + kraal del grupo

## Contexto

El [ADR-0003](0003-cms-y-acceso-de-editores.md) dejó el backoffice (Sveltia CMS) protegido por la cuenta de GitHub de cada editor. En la práctica no sirve: **buena parte del kraal no sabe qué es GitHub**, y pedirles que se creen una cuenta y la vinculen al repositorio es justo la barrera que el CMS venía a quitar.

Lo que se quiere es lo que la [enmienda 2 del ADR-0003](0003-cms-y-acceso-de-editores.md#enmienda-2-vuelve-el-formulario-de-acceso-como-puerta-25102026) dejó descrito para la fase 3: **el monitor entra con usuario y contraseña en `/acceso` y llega al backoffice sin ver GitHub en ningún momento.** Para eso hace falta un servicio nuestro que guarde los usuarios y que, a quien ha entrado, le dé el permiso para publicar.

**El lenguaje y el framework están decididos por el grupo: Java 25 y Spring Boot 4**, como ya preveía el [ADR-0001](0001-arquitectura-frontend.md). Este ADR no los discute; decide cómo se usan.

Restricciones:

- **Pocos usuarios:** 20-30 monitores, pocos accesos a la semana. El rendimiento no es un problema.
- **Nadie vigila el sistema** y el kraal rota. Lo que haya que mantener a mano, no se mantendrá.
- **Presupuesto ≈ 0 €** salvo el dominio. Es la restricción que más choca con tener un servidor (ver «Riesgos»).
- **La web pública no depende del backend:** si el servicio cae, solo deja de funcionar el acceso al backoffice.

## Decisión

**Un único servicio Spring Boot (`auth-service`) con usuarios en PostgreSQL, sesión en cookie y un token de GitHub de corta duración que se fabrica en cada entrada.**

### Flujo

```
/acceso (Angular)                 auth-service (Spring Boot)              GitHub
──────────────────                ──────────────────────────              ──────
usuario + contraseña ──POST /api/acceso──▶ comprueba en PostgreSQL
                     ◀── cookie de sesión (HttpOnly, Secure, SameSite=Lax)
navega a /backoffice
Sveltia abre ventana ──GET /cms/auth──▶ ¿hay sesión válida?
                                         no → manda a /acceso
                                         sí → pide un token ──────────────▶ token de 1 h, solo este repositorio
                     ◀── la ventana entrega el token a Sveltia y se cierra
Sveltia publica con ese token ────────────────────────────────────────────▶ commit en el repositorio
```

En el frontend solo cambian dos cosas: `AccesoService` llama a `POST /api/acceso`, y `config.yml` gana `base_url` apuntando al servicio. La página `/acceso` ya sabe mostrar «usuario o contraseña incorrectos» y «no disponible».

### Piezas

| Pieza | Decisión |
|---|---|
| Servicio | **Uno solo**, `auth-service`, en `backend/`. Si más adelante llegan inscripciones o área privada, entran como **módulos del mismo servicio**, no como servicios nuevos |
| Autenticación | Spring Security con **sesión en servidor** y cookie `HttpOnly`/`Secure`/`SameSite=Lax`. Protección CSRF activada |
| Sesiones | Spring Session JDBC, en la misma PostgreSQL: sobreviven a un reinicio y se pueden borrar al dar de baja a alguien |
| Contraseñas | Argon2id (`Argon2PasswordEncoder` de Spring Security). Nunca en claro, nunca en logs |
| Base de datos | PostgreSQL, con migraciones Flyway |
| Permiso para publicar | Token de GitHub que **caduca en una hora**, generado al momento. Su origen depende de la prueba de la acción 1 (ver «Opciones», punto 3) |
| Dominio | La API en un subdominio del de la web (p. ej. `api.scoutsnadino.es`), para que la cookie sea del mismo sitio |

### Datos

```sql
create table usuario (
  id                  bigint generated always as identity primary key,
  usuario             text not null unique check (usuario ~ '^[a-z0-9._-]{3,30}$'),
  hash_clave          text not null,
  activo              boolean not null default true,
  debe_cambiar_clave  boolean not null default true,
  intentos_fallidos   integer not null default 0 check (intentos_fallidos >= 0),
  bloqueado_hasta     timestamptz,
  creado_en           timestamptz not null default now(),
  ultimo_acceso       timestamptz
);

-- Todos los commits los firma la App (o la cuenta robot): esta tabla es la
-- única forma de saber quién publicó qué.
create table emision_token (
  id          bigint generated always as identity primary key,
  usuario_id  bigint not null references usuario (id),
  emitido_en  timestamptz not null default now()
);
create index on emision_token (usuario_id, emitido_en);
```

- El `check` del nombre de usuario es el mismo formato que ya valida `/acceso`, guardado en minúsculas.
- **Sin correo y sin roles.** Sin correo, porque recuperar la contraseña por correo es otro dato personal que custodiar; la coordinación la restablece con una clave temporal y `debe_cambiar_clave`. Sin roles, porque el grupo decidió que todos publican (ADR-0003).
- **Las bajas son `activo = false`**, y borran las sesiones abiertas de esa persona. No se borra la fila para que `emision_token` siga diciendo quién publicó qué.

### Errores y seguridad

| Caso | Respuesta |
|---|---|
| Usuario o contraseña mal | El mismo mensaje exista o no el usuario, con el mismo tiempo de respuesta |
| Muchos intentos fallidos | Bloqueo temporal por usuario (`bloqueado_hasta`) y límite por IP |
| PostgreSQL o el servicio caídos | `/acceso` muestra «no disponible». La web pública sigue funcionando |
| GitHub no da el token | `/cms/auth` muestra un error claro y lo registra. No se reintenta en bucle |
| El token caduca editando | Hay que volver a entrar. Se explica en la guía de quien edita |

**El token puede escribir cualquier fichero del repositorio**, no solo `src/content`: GitHub no permite limitarlo a una carpeta. Si alguien roba la sesión de un monitor, durante una hora podría cambiar código. Lo mitigan la duración corta, el registro de `emision_token` y la protección de ramas que se decida en el ADR-0003.

### Observabilidad

- Logs estructurados en cada acceso, correcto o fallido, y en cada token emitido: usuario e IP, **nunca la clave ni el token**.
- `/actuator/health` que compruebe de verdad PostgreSQL.
- Un ping externo gratuito contra ese health que **avise al buzón del grupo** si cae. Sin esto, nadie se enteraría.

## Opciones consideradas

Java y Spring Boot no se comparan aquí (están decididos). Lo que sí se decide son tres cosas dentro de Spring.

### 1. Cuántos servicios

**A. Un solo servicio, con módulos internos — ✅ elegida.** Un despliegue, una base de datos, una cosa que actualizar.

**B. Varios microservicios** (`auth-service` + uno por funcionalidad). Descartada por ahora: cada servicio más es otro despliegue, otra cosa que vigilar y comunicación entre servicios, para un grupo sin nadie de guardia. Si un día hace falta, los módulos se pueden separar.

### 2. Cómo se mantiene la sesión

**A. Sesión en servidor con cookie `HttpOnly` — ✅ elegida.** El único cliente es nuestra web. Una baja corta el acceso al momento, porque basta con borrar la sesión.

**B. Spring Authorization Server con OAuth2 y JWT** (lo que decía el README del backend). Descartada: sirve para emitir tokens a aplicaciones de terceros, y aquí no hay ninguna. Un JWT en el navegador no se puede revocar antes de que caduque y es más fácil de robar.

### 3. De dónde sale el token de GitHub

**A. GitHub App del grupo, con permiso solo sobre este repositorio — preferida.** Los tokens duran una hora y no hay secretos que renovar a mano: la clave privada de la App no caduca.

**C. El servicio hace de intermediario con GitHub — plan B si A falla.** Sveltia permite cambiar la dirección de la API de GitHub (`api_root`). Se apunta a `auth-service`, que comprueba la sesión y reenvía cada llamada a GitHub con el token de la App (o del robot). **El navegador no recibe nunca ningún token.** Es lo más seguro, pero también lo que más trabajo da: hay que reenviar todo lo que usa Sveltia, subida de fotos incluida, y el servicio pasa a estar en medio de cada guardado.

**B. Cuenta «robot» del grupo con un token personal — último recurso.** Funciona seguro con Sveltia, pero el token caduca (como mucho, un año) y alguien tiene que renovarlo. Además, sin el intermediario de C, ese mismo token de larga duración llegaría al navegador de cada monitor.

**Hay que probar A antes de nada.** Sveltia, como Decap, está pensado para el token de una persona y al entrar suele pedir sus datos a GitHub. Un token de App no tiene persona detrás y esa llamada puede fallar. Si falla, se pasa a C.

## Consecuencias

- **Más fácil:** el kraal entra con usuario y contraseña, sin GitHub. Las altas y bajas son nuestras. Queda registro de quién publicó qué.
- **Más difícil:** hay un servidor y una base de datos que alojar, actualizar y vigilar, con todo lo que eso supone para un grupo de voluntarios.
- **Hay que gestionar las altas:** al principio, con un comando que lanza quien desarrolla. Más adelante, desde una pantalla para la coordinación, que ya es el área privada (P2).
- **Hay dos secretos en el servidor:** la clave privada de la GitHub App (o el token del robot) y la contraseña de la base de datos. Van como variables de entorno del alojamiento, nunca en el repositorio.
- **El ADR-0003 sigue en pie** en todo lo demás (Sveltia, contenido en Markdown, publicación por commit). Este ADR solo sustituye «cada editor con su cuenta de GitHub» por «cada editor con un usuario nuestro».

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Sveltia no acepta un token de GitHub App | Se prueba primero (acción 1); si falla, el servicio hace de intermediario (opción 3C) |
| **No hay dónde alojarlo a 0 €** sin que duerma, se pause o haya que mantener una máquina | Decisión pendiente (acción 2). Es el riesgo principal de este ADR |
| Nadie se entera de que el servicio ha caído | Ping externo que avisa al buzón del grupo |
| Se roba la sesión de un monitor | Cookie `HttpOnly`/`Secure`, token de una hora, registro de emisiones, bajas inmediatas |
| Se filtra la base de datos | Solo hay nombres de usuario y hashes Argon2id. Ningún token de GitHub se guarda |

## Acciones

1. [ ] **Prueba:** crear la GitHub App, generar un token de instalación a mano y comprobar que Sveltia publica con él. Decide entre las opciones 3A y 3C.
2. [x] **Alojamiento, de momento:** PostgreSQL en local, con Docker (decisión del 07/11/2026). Más adelante se migrará a un servidor; ese paso sigue siendo el riesgo principal y se decidirá aparte.
3. [ ] Decidir quién da las altas mientras no haya área privada.
4. [ ] Esqueleto en `backend/`: pom padre, `auth-service`, Flyway con las dos tablas, `docker-compose.yml` con PostgreSQL para desarrollo.
5. [ ] `POST /api/acceso`, `POST /api/salir` y `GET /cms/auth`, con sus tests.
6. [ ] Cambiar `AccesoService` en el frontend y añadir `base_url` en `config.yml`.
7. [ ] Health, logs y ping externo antes de abrirlo al kraal.
8. [ ] Actualizar la guía de quien edita: se entra por `/acceso`, y la sesión de edición dura una hora.
