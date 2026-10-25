import { Injectable, Signal, signal } from '@angular/core';

import { Noticia } from '../models/noticia';
import { fecha, leerColeccion, texto, textoOpcional } from './contenido';
import { esSlugSeccion } from './secciones.service';

/**
 * Entradas del blog, de `src/content/noticias/*.md`. Todavía no hay ninguna
 * ni página que las muestre (Bloque C). El texto completo de cada noticia
 * lo añadirá la página de detalle, también a través de este servicio.
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
}
