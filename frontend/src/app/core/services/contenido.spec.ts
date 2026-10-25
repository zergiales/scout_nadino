import { TestBed } from '@angular/core/testing';

import { fecha } from './contenido';
import { DocumentosService } from './documentos.service';
import { EventosService } from './eventos.service';
import { NoticiasService } from './noticias.service';
import { SeccionesService } from './secciones.service';

/*
  Estos tests leen los .md reales de src/content. Si alguien rompe un fichero
  (desde el CMS o a mano), fallan aquí y no en la web publicada.

  En vitest el plugin de Analog no carga la lista de ficheros, así que se
  sustituyen injectContentFiles e injectContentFilesMap por unas que leen
  los mismos .md con las mismas librerías que usa Analog (front-matter para
  la cabecera, marked para el cuerpo) y en el mismo formato de salida.
*/
vi.mock('@analogjs/content', async () => {
  const frontMatter = (await import('front-matter')).default;
  const { marked } = await import('marked');
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
  const mapa = Object.fromEntries(
    Object.entries(ficheros).map(([filename, bruto]) => {
      const { frontmatter, body } = frontMatter(bruto);
      return [filename, async () => `---\n${frontmatter}\n---\n\n${await marked.parse(body)}`];
    }),
  );
  return {
    injectContentFiles: (filtro: (f: (typeof lista)[number]) => boolean) => lista.filter(filtro),
    injectContentFilesMap: () => mapa,
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

  it('NoticiasService: de la más reciente a la más antigua, con fecha y resumen', () => {
    const noticias = TestBed.inject(NoticiasService).todas();

    expect(noticias.length).toBeGreaterThan(0);
    const fechas = noticias.map((n) => n.fecha);
    expect(fechas).toEqual([...fechas].sort().reverse());
    for (const noticia of noticias) {
      expect(noticia.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(noticia.resumen).not.toBe('');
      // Con foto, el texto alternativo es obligatorio (accesibilidad).
      if (noticia.portada) expect(noticia.portadaAlt).toBeTruthy();
    }
  });

  it('NoticiasService: carga el texto completo ya en HTML, sin el frontmatter', async () => {
    const servicio = TestBed.inject(NoticiasService);
    const slug = '2026-10-11-acampada-medinaceli';

    await vi.waitFor(() => expect(servicio.cuerpo(slug)).not.toBe(''));
    expect(servicio.cuerpo(slug)).toContain('<strong>ruta hasta el arco romano</strong>');
    expect(servicio.cuerpo(slug)).not.toContain('titulo:');
    expect(servicio.cuerpo('no-existe')).toBe('');
  });

  it('fecha(): una fecha sin comillas en el YAML llega como Date y sale igual', () => {
    expect(fecha(new Date('2026-10-16T00:00:00Z'))).toBe('2026-10-16');
    expect(fecha('2026-10-16')).toBe('2026-10-16');
    expect(fecha(undefined)).toBe('');
  });
});
