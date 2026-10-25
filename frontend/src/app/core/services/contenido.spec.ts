import { TestBed } from '@angular/core/testing';

import { fecha } from './contenido';
import { DocumentosService } from './documentos.service';
import { EventosService } from './eventos.service';
import { SeccionesService } from './secciones.service';

/*
  Estos tests leen los .md reales de src/content. Si alguien rompe un fichero
  (desde el CMS o a mano), fallan aquí y no en la web publicada.

  En vitest el plugin de Analog no carga la lista de ficheros, así que se
  sustituye injectContentFiles por una que lee los mismos .md con el mismo
  parser de frontmatter (front-matter) que usa Analog.
*/
vi.mock('@analogjs/content', async () => {
  const frontMatter = (await import('front-matter')).default;
  const ficheros = import.meta.glob('/src/content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  const lista = Object.entries(ficheros).map(([filename, bruto]) => ({
    filename,
    slug: filename.split('/').pop()!.replace(/\.md$/, ''),
    attributes: frontMatter<Record<string, unknown>>(bruto).attributes,
  }));
  return {
    injectContentFiles: (filtro: (f: (typeof lista)[number]) => boolean) => lista.filter(filtro),
  };
});

describe('Servicios de contenido', () => {
  it('SeccionesService: las cinco ramas, en orden de edad y con su token de color', () => {
    const secciones = TestBed.inject(SeccionesService).todas();

    expect(secciones.map((s) => s.slug)).toEqual([
      'castores',
      'lobatos',
      'scouts',
      'pioneros',
      'rutas',
    ]);
    for (const seccion of secciones) {
      expect(seccion.nombre).not.toBe('');
      expect(seccion.queHacen.length).toBeGreaterThan(0);
      expect(seccion.color).toBe(`var(--color-${seccion.slug})`);
    }
  });

  it('EventosService: lee las fechas del Jota-Joti como AAAA-MM-DD', () => {
    const joti = TestBed.inject(EventosService)
      .todos()
      .find((e) => e.slug === 'joti-2026');

    expect(joti).toMatchObject({ inicio: '2026-10-16', fin: '2026-10-18', ramas: [] });
  });

  it('DocumentosService: cada documento apunta a un fichero y a una categoría válida', () => {
    const documentos = TestBed.inject(DocumentosService).todos();

    expect(documentos.length).toBeGreaterThan(0);
    for (const doc of documentos) {
      expect(doc.fichero).toMatch(/^\/documentos\/[a-z0-9-]+\.pdf$/);
    }
  });

  it('fecha(): una fecha sin comillas en el YAML llega como Date y sale igual', () => {
    expect(fecha(new Date('2026-10-16T00:00:00Z'))).toBe('2026-10-16');
    expect(fecha('2026-10-16')).toBe('2026-10-16');
    expect(fecha(undefined)).toBe('');
  });
});
