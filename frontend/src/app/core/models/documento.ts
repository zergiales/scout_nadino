export const CATEGORIAS_DOCUMENTO = ['inscripcion', 'autorizaciones', 'actividades'] as const;

export type CategoriaDocumento = (typeof CATEGORIAS_DOCUMENTO)[number];

/**
 * Un documento descargable. Hoy el fichero vive en `public/documentos/`; en
 * la fase 3 irá a una base de datos (ver `frontend/README.md`, «Ficheros
 * estáticos»). Solo plantillas en blanco: nunca un documento relleno.
 */
export interface Documento {
  slug: string;
  titulo: string;
  descripcion: string;
  /** Ruta pública del fichero, p. ej. `/documentos/autorizacion-generica.pdf`. */
  fichero: string;
  formato: string;
  /** Tamaño para mostrar, p. ej. «120 KB». */
  tamano: string;
  categoria: CategoriaDocumento;
}
