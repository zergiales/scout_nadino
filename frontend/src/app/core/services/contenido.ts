import { injectContentFiles, injectContentFilesMap } from '@analogjs/content';

/** Frontmatter tal como llega del Markdown: sin validar. */
export type Frontmatter = Record<string, unknown>;

/**
 * Los ficheros de una carpeta de `src/content` (p. ej. «secciones»), con su
 * slug (el nombre del fichero) y su frontmatter.
 *
 * Es el único sitio de la web que sabe que el contenido es Markdown. Llama a
 * `injectContentFiles`, así que solo funciona en contexto de inyección: en
 * la declaración de un campo de un servicio, nunca dentro de un método.
 *
 * En la fase 3 los servicios dejan de usar esto y piden los datos a la API.
 */
export function leerColeccion(carpeta: string): { slug: string; datos: Frontmatter }[] {
  return injectContentFiles<Frontmatter>((fichero) =>
    fichero.filename.includes(`/content/${carpeta}/`),
  ).map((fichero) => ({ slug: fichero.slug, datos: fichero.attributes }));
}

/**
 * Cargador del cuerpo de los ficheros de una carpeta, ya convertido a HTML
 * por Analog (con el mismo marked que usa para el resto del contenido).
 * Devuelve '' si el fichero no existe o no tiene cuerpo.
 *
 * Como `leerColeccion`, solo funciona en contexto de inyección; la función
 * que devuelve sí se puede llamar después, desde un `resource`.
 */
export function cargadorDeCuerpos(carpeta: string): (slug: string) => Promise<string> {
  const ficheros = injectContentFilesMap();
  return async (slug) => {
    const cargar = ficheros[`/src/content/${carpeta}/${slug}.md`];
    if (!cargar) return '';
    // Analog lo entrega como «---\n<frontmatter>\n---\n\n<html>».
    return (await cargar()).replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
  };
}

/*
  Lectura defensiva del frontmatter. El contenido lo escribirá gente no
  técnica desde el CMS: un campo vacío o mal puesto no debe romper el build,
  como mucho dejar un hueco.
*/

export function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : valor == null ? '' : String(valor);
}

export function textoOpcional(valor: unknown): string | undefined {
  return texto(valor) || undefined;
}

export function lista(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.map(texto).filter(Boolean) : [];
}

/**
 * Fecha AAAA-MM-DD. El YAML convierte `2026-10-16` sin comillas en un Date
 * (a medianoche UTC), y el CMS puede escribirla de las dos formas.
 */
export function fecha(valor: unknown): string {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().slice(0, 10);
  }
  return texto(valor).slice(0, 10);
}

export function fechaOpcional(valor: unknown): string | undefined {
  return fecha(valor) || undefined;
}
