/** Las cinco ramas del grupo, en orden de edad. */
export const SLUGS_SECCION = ['castores', 'lobatos', 'scouts', 'pioneros', 'rutas'] as const;

export type SlugSeccion = (typeof SLUGS_SECCION)[number];

/**
 * Una rama del grupo. En el código se llama «sección» (como en el plan y en
 * `src/content/secciones/`); en la web se le dice «rama», que es como lo
 * dice el grupo.
 */
export interface Seccion {
  slug: SlugSeccion;
  nombre: string;
  /** Texto libre, p. ej. «6 a 8». Pendiente de confirmar con el kraal. */
  edades: string;
  /** Posición en las listas: de la más pequeña a la mayor. */
  orden: number;
  resumen: string;
  queHacen: string[];
  /**
   * Color de la rama como valor CSS: siempre el token `var(--color-<slug>)`
   * de `styles.css`. No viene del contenido, para que nadie pueda meter un
   * color suelto desde el CMS.
   */
  color: string;
}
