import { Injectable, Signal, signal } from '@angular/core';

import { SLUGS_SECCION, Seccion, SlugSeccion } from '../models/seccion';
import { leerColeccion, lista, texto } from './contenido';

export function esSlugSeccion(valor: unknown): valor is SlugSeccion {
  return SLUGS_SECCION.includes(valor as SlugSeccion);
}

/** Las ramas del grupo, de `src/content/secciones/*.md`. */
@Injectable({ providedIn: 'root' })
export class SeccionesService {
  private readonly secciones = signal<Seccion[]>(
    leerColeccion('secciones')
      // Solo las cinco ramas conocidas: cada una tiene su token de color.
      .filter(({ slug }) => esSlugSeccion(slug))
      .map(({ slug, datos }) => ({
        slug: slug as SlugSeccion,
        nombre: texto(datos['nombre']),
        edades: texto(datos['edades']),
        orden: Number(datos['orden']) || 99,
        resumen: texto(datos['resumen']),
        queHacen: lista(datos['queHacen']),
        color: `var(--color-${slug})`,
      }))
      .sort((a, b) => a.orden - b.orden),
  );

  /** Todas, de la más pequeña a la mayor. */
  readonly todas: Signal<Seccion[]> = this.secciones.asReadonly();

  porSlug(slug: string): Seccion | undefined {
    return this.secciones().find((s) => s.slug === slug);
  }
}
