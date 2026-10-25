# Enseñar la web desde tu ordenador con un túnel

Sirve para pasar un enlace público (por WhatsApp, por correo…) y que otras personas vean la web **mientras corre en tu ordenador**, sin publicarla. El enlace es aleatorio, del tipo `https://cuatro-palabras-raras.trycloudflare.com`, y cambia cada vez que abres el túnel.

Es gratis y no necesita cuenta. A cambio:

- **Tu ordenador tiene que estar encendido**, con conexión y sin suspenderse, mientras lo miran.
- **El enlace muere al cerrar el túnel.** Al día siguiente sale otro y hay que volver a pasarlo.
- **Cualquiera con el enlace puede verla.** Si se lo pasas a familias, avisa de que es una vista previa: el formulario de preinscripción todavía no envía nada.

Para un enlace fijo que no dependa de tu ordenador, lo que toca es publicarla en Cloudflare Pages (tarea 0.8 del [plan de trabajo](plan-trabajo.md)).

## Antes de la primera vez

Instala `cloudflared`, el programa de Cloudflare que abre el túnel. En una terminal de Windows:

```
winget install Cloudflare.cloudflared
```

Cierra y vuelve a abrir la terminal para que encuentre el comando. Comprueba que está con `cloudflared --version`.

## Abrir el túnel

Hacen falta **dos terminales** abiertas a la vez, las dos en la carpeta `frontend/`.

**Terminal 1 — compilar y servir la web:**

```
npm run build
npx serve dist/analog/public -l 4174
```

La primera vez `npx` pregunta si instala `serve`: responde que sí. Cuando ponga `Accepting connections`, la web está en `http://localhost:4174`. Ábrela en tu navegador para comprobar que se ve bien.

**Terminal 2 — abrir el túnel:**

```
cloudflared tunnel --url http://localhost:4174
```

Al cabo de unos segundos aparece un recuadro con el enlace:

```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://cuatro-palabras-raras.trycloudflare.com                                           |
+--------------------------------------------------------------------------------------------+
```

Ese es el enlace que pasas. Puede tardar medio minuto en funcionar la primera vez.

## Cerrar el túnel

Pulsa **Ctrl + C** en las dos terminales, primero en la del túnel y luego en la del servidor. El enlace deja de funcionar en el acto.

## Si cambias algo de la web

El servidor enseña lo que hay en `dist/`, no el código. Para que vean los cambios, para el servidor (Ctrl + C en la terminal 1) y repite `npm run build` y `npx serve …`. El túnel puede seguir abierto: el enlace no cambia mientras no lo cierres.

## Problemas típicos

| Qué pasa | Por qué | Qué hacer |
|---|---|---|
| `cloudflared` no se reconoce como comando | La terminal se abrió antes de instalarlo | Cierra la terminal y abre una nueva |
| El puerto 4174 está ocupado | Ya hay otro servidor ahí (quizá uno anterior que quedó abierto) | Usa otro: `-l 4175` en `serve` y `http://localhost:4175` en `cloudflared` |
| El enlace da error 502 | El servidor de la terminal 1 no está corriendo | Arranca otra vez `npx serve …` |
| La página dice que el host no está permitido | Estás usando `npm run dev` o `npm run preview` en vez de `serve` | Vite bloquea por seguridad los dominios que no conoce, como el del túnel. Usa `npx serve` como arriba |
| Se ve una versión vieja | Falta compilar | `npm run build` y reinicia `serve` |
