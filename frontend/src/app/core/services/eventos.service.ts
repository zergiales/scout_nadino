import { Injectable, Signal, signal } from '@angular/core';

import { Evento } from '../models/evento';
import { fecha, fechaOpcional, leerColeccion, lista, texto, textoOpcional } from './contenido';
import { esSlugSeccion } from './secciones.service';

/** El calendario, de `src/content/eventos/*.md`. */
@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly eventos = signal<Evento[]>(
    leerColeccion('eventos')
      .map(({ slug, datos }) => ({
        slug,
        titulo: texto(datos['titulo']),
        inicio: fecha(datos['inicio']),
        fin: fechaOpcional(datos['fin']),
        lugar: textoOpcional(datos['lugar']),
        ramas: lista(datos['ramas']).filter(esSlugSeccion),
        descripcion: texto(datos['descripcion']),
        enlace: textoOpcional(datos['enlace']),
      }))
      // Sin fecha no se puede colocar en el calendario.
      .filter((evento) => evento.inicio !== '')
      .sort((a, b) => a.inicio.localeCompare(b.inicio)),
  );

  /**
   * Todos, del más antiguo al más reciente. El reparto entre próximos y
   * pasados lo hace la página, porque depende de la fecha de hoy.
   */
  readonly todos: Signal<Evento[]> = this.eventos.asReadonly();
}
