import { SlugSeccion } from './seccion';

/** Una actividad del calendario: salida, acampada, campamento, Jota-Joti… */
export interface Evento {
  slug: string;
  titulo: string;
  /** Fecha en formato AAAA-MM-DD. */
  inicio: string;
  /** Último día, si dura más de uno (AAAA-MM-DD). */
  fin?: string;
  lugar?: string;
  /** Ramas que van; vacío = todo el grupo. */
  ramas: SlugSeccion[];
  descripcion: string;
  /** Página propia del evento, si la tiene (p. ej. `/eventos/joti-2026`). */
  enlace?: string;
}
