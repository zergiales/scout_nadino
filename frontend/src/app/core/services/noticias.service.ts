import { Injectable, Signal, resource, signal } from '@angular/core';

import { Noticia } from '../models/noticia';
import { cargadorDeCuerpos, fecha, leerColeccion, texto, textoOpcional } from './contenido';
import { esSlugSeccion } from './secciones.service';

/**
 * Noticias, de `src/content/noticias/*.md`. No hay página de detalle: el
 * frontmatter da la tarjeta de la portada y el cuerpo del `.md` (el texto
 * con estilos y fotos que se escribe en el backoffice) se despliega dentro
 * de la tarjeta con «Leer la noticia».
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly noticias = signal<Noticia[]>(
    leerColeccion('noticias')
      .map(({ slug, datos }) => {
        const seccion = texto(datos['seccion']);
        return {
          slug,
          titulo: texto(datos['titulo']),
          fecha: fecha(datos['fecha']),
          resumen: texto(datos['resumen']),
          seccion: esSlugSeccion(seccion) ? seccion : undefined,
          portada: textoOpcional(datos['portada']),
          portadaAlt: textoOpcional(datos['portadaAlt']),
        };
      })
      .filter((noticia) => noticia.fecha !== '')
      .sort((a, b) => b.fecha.localeCompare(a.fecha)),
  );

  /** Todas, de la más reciente a la más antigua. */
  readonly todas: Signal<Noticia[]> = this.noticias.asReadonly();

  private readonly cargarCuerpo = cargadorDeCuerpos('noticias');

  /*
    Los cuerpos se cargan aparte porque Analog los da de forma asíncrona.
    resource() avisa a Angular de que hay trabajo pendiente, así que el
    prerender espera a tenerlos y el texto queda en el HTML estático.
  */
  private readonly cuerpos = resource({
    loader: async () => {
      const pares = await Promise.all(
        this.noticias().map(async (n) => [n.slug, await this.cargarCuerpo(n.slug)] as const),
      );
      return Object.fromEntries(pares) as Record<string, string>;
    },
  });

  /** Texto completo en HTML, o '' si la noticia no tiene (o aún no ha cargado). */
  cuerpo(slug: string): string {
    return this.cuerpos.value()?.[slug] ?? '';
  }
}
