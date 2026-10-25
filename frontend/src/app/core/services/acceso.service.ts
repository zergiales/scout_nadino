import { Injectable } from '@angular/core';

/** Lo que responde un intento de entrar al backoffice. */
export type ResultadoAcceso =
  | { ok: true; destino: string }
  | { ok: false; motivo: 'credenciales' | 'no-disponible' };

/** El backoffice (Sveltia CMS) es una página aparte, fuera de Angular. */
export const DESTINO_BACKOFFICE = '/backoffice/index.html';

/**
 * Entrada al backoffice desde la pantalla de /acceso.
 *
 * FASE 1 (hoy): es una PUERTA, NO UN LOGIN. No comprueba nada: cualquier
 * usuario y contraseña con buen formato pasan, y quien protege de verdad es
 * el backoffice, que pide la cuenta de GitHub antes de dejar publicar (ADR-0003,
 * enmienda 2). No metas aquí una lista de usuarios ni una contraseña para
 * «simularlo»: cualquiera podría leerla desde el navegador.
 *
 * FASE 3: esto llama a `auth-service` (Spring Boot) con HttpClient. Si el
 * usuario existe en la base de datos y la contraseña es buena, el servidor
 * abre la sesión y devuelve ok; si no, `credenciales`. La página ya sabe
 * qué hacer con las dos respuestas, así que solo cambia este fichero.
 */
@Injectable({ providedIn: 'root' })
export class AccesoService {
  async entrar(usuario: string, clave: string): Promise<ResultadoAcceso> {
    // Fase 3: return firstValueFrom(this.http.post<ResultadoAcceso>('/api/acceso', { usuario, clave }));
    void usuario;
    void clave;
    return { ok: true, destino: DESTINO_BACKOFFICE };
  }
}
