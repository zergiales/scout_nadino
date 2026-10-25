import { Injectable, Signal, signal } from '@angular/core';

import { Album } from '../models/album';
import { leerColeccion, texto } from './contenido';

/**
 * Álbumes de fotos, de `src/content/albumes/*.md`. Se ven en la página de
 * Documentos, con un enlace a su carpeta de Google Drive.
 */
@Injectable({ providedIn: 'root' })
export class AlbumesService {
  private readonly albumes = signal<Album[]>(
    leerColeccion('albumes')
      .map(({ slug, datos }) => ({
        slug,
        titulo: texto(datos['titulo']),
        descripcion: texto(datos['descripcion']),
        enlace: texto(datos['enlace']),
      }))
      // Solo enlaces https: nada de javascript: ni rutas raras desde el CMS.
      .filter((album) => album.enlace.startsWith('https://'))
      // El nombre del fichero empieza por el año: los más recientes, primero.
      .sort((a, b) => b.slug.localeCompare(a.slug)),
  );

  /** Todos, del más reciente al más antiguo. */
  readonly todos: Signal<Album[]> = this.albumes.asReadonly();
}
