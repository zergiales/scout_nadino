import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SLUGS_SECCION, Seccion } from '../core/models/seccion';
import { SeccionesService } from '../core/services/secciones.service';
import RamasPage from './ramas.page';

// La página solo conoce el servicio: aquí no se leen los .md de verdad.
const secciones: Seccion[] = SLUGS_SECCION.map((slug, i) => ({
  slug,
  nombre: slug,
  edades: '',
  orden: i,
  resumen: '',
  queHacen: [],
  color: `var(--color-${slug})`,
}));

describe('RamasPage', () => {
  function crear(fragmento: string | null) {
    TestBed.configureTestingModule({
      imports: [RamasPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: of(fragmento) } },
        { provide: SeccionesService, useValue: { todas: signal(secciones) } },
      ],
    });
    const fixture = TestBed.createComponent(RamasPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('cada rama tiene su ancla para enlazarla desde la portada', () => {
    const pagina = crear(null);
    for (const slug of ['castores', 'lobatos', 'scouts', 'pioneros', 'rutas']) {
      expect(pagina.querySelector(`#${slug}`)).not.toBeNull();
    }
  });

  it('con #lobatos en la URL abre solo esa rama', () => {
    const pagina = crear('lobatos');
    const abiertas = [...pagina.querySelectorAll('details')].filter((d) => d.open);

    expect(abiertas).toHaveLength(1);
    expect(abiertas[0].closest('li')?.id).toBe('lobatos');
  });

  it('sin ancla no abre ninguna', () => {
    const pagina = crear(null);
    expect([...pagina.querySelectorAll('details')].some((d) => d.open)).toBe(false);
  });
});
