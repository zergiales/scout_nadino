import { Injectable, Signal, signal } from '@angular/core';

import { CATEGORIAS_DOCUMENTO, CategoriaDocumento, Documento } from '../models/documento';
import { leerColeccion, texto } from './contenido';

/**
 * Documentos descargables, de `src/content/documentos/*.md`. Cada `.md`
 * describe un fichero de `public/documentos/`. En la fase 3 saldrán de una
 * base de datos a través de la API (ver `frontend/README.md`).
 */
@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private readonly documentos = signal<Documento[]>(
    leerColeccion('documentos')
      .map(({ slug, datos }) => ({
        slug,
        titulo: texto(datos['titulo']),
        descripcion: texto(datos['descripcion']),
        fichero: texto(datos['fichero']),
        formato: texto(datos['formato']) || 'PDF',
        tamano: texto(datos['tamano']),
        categoria: texto(datos['categoria']) as CategoriaDocumento,
      }))
      // Sin fichero no hay nada que descargar; con una categoría que no
      // existe no habría dónde mostrarlo.
      .filter((doc) => doc.fichero !== '' && CATEGORIAS_DOCUMENTO.includes(doc.categoria))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'es')),
  );

  /** Todos, por orden alfabético. */
  readonly todos: Signal<Documento[]> = this.documentos.asReadonly();
}
