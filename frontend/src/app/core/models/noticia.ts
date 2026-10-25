import { SlugSeccion } from './seccion';

/**
 * Una entrada del blog del grupo: crónicas de actividades y campamentos. Es
 * lo que más se va a editar desde el CMS (ADR-0003).
 */
export interface Noticia {
  slug: string;
  titulo: string;
  /** Fecha de publicación (AAAA-MM-DD). */
  fecha: string;
  resumen: string;
  /** Rama de la que va, si va de una sola. */
  seccion?: SlugSeccion;
  /** Imagen de portada (ruta pública). Solo con autorización de imagen. */
  portada?: string;
  /** Obligatorio si hay portada: describe la foto, nunca nombra a menores. */
  portadaAlt?: string;
}
