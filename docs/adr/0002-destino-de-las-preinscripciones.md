# ADR-0002: A dónde llegan las preinscripciones

**Estado:** Propuesto
**Fecha:** 20/10/2026
**Deciden:** Sergio + kraal del grupo

## Contexto

La [enmienda 1 del ADR-0001](0001-arquitectura-frontend.md#enmienda-1-formulario-de-preinscripción-propio-19102026) decidió que la preinscripción se hace con un formulario propio, con los datos recortados: nombre del adulto de contacto, correo, teléfono, año de nacimiento del educando y observaciones. El formulario ya está construido y validado, pero **no envía nada**: una web estática no puede recibir datos.

Falta decidir el canal. Las restricciones no son técnicas:

- **Coste 0 €** salvo el dominio.
- **Nadie vigila el sistema.** El kraal rota y no hay guardia: lo que falle en silencio, fallará en silencio durante meses.
- **Datos personales de un adulto y la edad de un menor.** Ya no viajan el nombre ni el domicilio del educando, así que el riesgo es bajo, pero no nulo: sigue siendo un dato que identifica a una familia.
- **Volumen real: decenas de preinscripciones al año**, concentradas en septiembre. Cualquier plan gratuito sobra por capacidad; el problema nunca va a ser el volumen.
- El ADR-0001 dejó el hosting en «Cloudflare Pages **o** Netlify», sin cerrar. Esta decisión **cierra también esa**, porque el canal más simple es el del propio hosting.

## Decisión

**Opción A: formulario propio → función del hosting → correo del grupo. Sin base de datos.**

La función recibe el envío y lo reenvía como correo a una cuenta del grupo. No se guarda en ninguna parte: ni base de datos, ni panel del proveedor, ni hoja de cálculo.

Eso es lo importante de esta decisión, más que el proveedor concreto. **Sin almacén no hay nada que mantener, nada que filtrar y nada que purgar**, que es justo lo que exige el RGPD (minimización y limitación del plazo de conservación) y justo lo que un grupo de voluntarios no va a hacer a mano.

Concretamente: **Cloudflare Pages + Pages Functions + Resend** para el envío, y **Cloudflare Turnstile** contra el spam, que no usa cookies (un reCAPTCHA sí, y nos devolvería al problema de la [enmienda 2](0001-arquitectura-frontend.md#enmienda-2-el-mapa-de-contacto-es-de-openstreetmap-19102026)).

## Opciones consideradas

### Opción A: función del hosting → correo (Cloudflare Pages + Resend) — ✅ elegida

| Dimensión | Valoración |
|---|---|
| Complejidad | Media: una función de ~30 líneas |
| Coste | 0 € |
| Mantenimiento | Bajo: nada que actualizar, nada que vaciar |
| Datos | No se almacenan; viven en el buzón del grupo |

**Pros:** el formulario es nuestro, accesible y ya está hecho; sin almacén que custodiar; estáticos sin medir y la función dentro del plan gratuito; Turnstile sin cookies.
**Contras:** hay que escribir y desplegar código; dos proveedores que declarar (Cloudflare y Resend); si el envío falla, la preinscripción se pierde sin que nadie se entere, salvo que la función avise.

### Opción B: Netlify Forms

| Dimensión | Valoración |
|---|---|
| Complejidad | Baja: un atributo en el `<form>` |
| Coste | 0 €, con una pega grave |
| Mantenimiento | Bajo, pero los datos se acumulan |
| Datos | Almacenados en el panel de Netlify |

**Pros:** lo más rápido de montar, sin escribir backend.
**Contras:** dos de peso. Los envíos **se guardan** en el panel, así que alguien tiene que entrar a borrarlos, y nadie lo hará. Y el plan gratuito pasó a un modelo de créditos con **300 al mes como límite duro**: al agotarlos, los proyectos de la cuenta **quedan en pausa** hasta el ciclo siguiente. Que la web se apague sola por una cuota es inaceptable cuando nadie la vigila.

### Opción C: Google Forms (enlace o incrustado)

| Dimensión | Valoración |
|---|---|
| Complejidad | Nula |
| Coste | 0 € |
| Mantenimiento | Nulo |
| Datos | En Google, indefinidamente |

**Pros:** cero código, cero despliegue, funciona mañana. Ya lo usáis para los contactos del Jota-Joti.
**Contras:** tira a la basura el formulario accesible que ya existe y nos devuelve al problema que la enmienda 1 venía a resolver: los datos acaban en un tercero, acumulados sin fecha de caducidad y fuera de nuestro control. Incrustado además mete cookies de Google en la web.

### Opción D: sin formulario (correo y teléfono)

| Dimensión | Valoración |
|---|---|
| Complejidad | Nula |
| Coste | 0 € |
| Mantenimiento | Nulo |
| Datos | Solo en el buzón |

**Pros:** imposible de romper. Es el mínimo honesto, y mejor que un formulario que no envía.
**Contras:** una familia que no sabe qué escribir no escribe. El formulario existe precisamente para que el primer contacto no dependa de redactar un correo.

## Análisis de compromisos

A y C se parecen más de lo que parece: las dos acaban en «algo externo recibe el envío». La diferencia es **qué se queda guardado y dónde**. C acumula datos de familias en Google sin que nadie decida cuándo se borran; A no guarda nada y convierte el buzón del grupo en el único sitio donde existen, que es donde ya está el resto de la correspondencia del grupo.

B parece el camino cómodo y es el más arriesgado: es el único en que **la propia web puede caerse** por una cuota.

Frente a D, el coste de A es escribir treinta líneas una vez. Ese es un precio bajo por no perder a la familia que no se atreve a escribir un correo.

## Consecuencias

- **Más fácil:** la preinscripción funciona de punta a punta sin servidor propio y sin coste; el día que llegue el `auth-service` (fase 3) solo se cambia el destino dentro del servicio de `core/services`, no el formulario.
- **Más difícil:** hay que configurar un dominio en Resend, guardar una clave de API como secreto del proyecto y mantener dos proveedores declarados en la política de privacidad.
- **Consecuencia que no es técnica, y es la que más importa:** el buzón que reciba los correos pasa a ser el lugar donde viven datos personales de familias. **Tiene que ser una cuenta del grupo, no el Gmail personal de nadie**, con acceso transferible cuando rote el kraal. Si esto se hace mal, da igual lo bien elegido que esté el proveedor.
- **A revisar:** si alguna vez hacen falta más de 100 envíos en un día, el plan gratuito de Resend se queda corto. Para un grupo scout eso no va a pasar; si pasa, es que hay que replantear otras cosas antes.

## Riesgos y cómo se mitigan

| Riesgo | Mitigación |
|---|---|
| El envío falla y la preinscripción se pierde | La función devuelve error y el formulario muestra el correo del grupo como alternativa, en vez de decir «enviado» |
| Spam | Turnstile, más un campo trampa oculto |
| Clave de API filtrada | Secreto del proyecto en Cloudflare, nunca en el repositorio |
| Nadie lee el buzón en septiembre | Es un acuerdo del kraal, no un problema de software. Debe quedar escrito quién lo revisa |

## Datos de los planes gratuitos

Comprobados en octubre de 2026 **en fuentes de terceros, no en las páginas oficiales**. Hay que verificarlos antes de montarlo, porque cambian: el plan de Netlify cambió en abril de 2026 y muchos artículos siguen dando las cifras viejas.

- **Cloudflare Pages:** estáticos sin medir; las Functions comparten la cuota de Workers, ~100.000 peticiones al día.
- **Resend:** 3.000 correos al mes con un tope de 100 al día; al llegar al tope se pausa en vez de cobrar.
- **Netlify:** plan gratuito de 300 créditos al mes como límite duro, con pausa de los proyectos al agotarlos.

## Acciones

1. [ ] Decidir y crear la **cuenta de correo del grupo** que recibirá las preinscripciones, con acceso transferible. Bloquea todo lo demás.
2. [ ] Confirmar en las páginas oficiales los límites de Cloudflare y Resend, y si Resend ofrece tratamiento de datos en la UE.
3. [ ] Cerrar el hosting en Cloudflare Pages en el ADR-0001 (hoy dice «Cloudflare Pages o Netlify»).
4. [ ] Escribir la función de Pages y conectarla desde un servicio de `core/services`, no desde el componente.
5. [ ] Añadir Turnstile y el campo trampa.
6. [ ] Declarar Cloudflare y Resend en la política de privacidad, con el plazo de conservación de los correos.
7. [ ] Quitar el aviso de «no envía nada» de la página de preinscripción.
