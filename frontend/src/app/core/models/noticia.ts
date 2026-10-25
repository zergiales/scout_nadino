import { SlugSeccion } from './seccion';

/**
 * Una noticia del grupo: crónica corta de una actividad o campamento. Es lo
 * que más se va a editar desde el CMS (ADR-0003). No tiene página propia: se
 * ven las tres últimas en la portada, debajo de la foto, con su resumen.
 */
export interface Noticia {
  slug: string;
  titulo: string;
  /** Fecha de la actividad o de publicación (AAAA-MM-DD). */
  fecha: string;
  /** El texto que se ve en la portada: dos o tres frases. */
  resumen: string;
  /** Rama de la que va, si va de una sola. */
  seccion?: SlugSeccion;
  /** Imagen de portada (ruta pública). Solo con autorización de imagen. */
  portada?: string;
  /** Obligatorio si hay portada: describe la foto, nunca nombra a menores. */
  portadaAlt?: string;
}
