import { TestBed } from '@angular/core/testing';

import { MapaConexiones } from './mapa-conexiones';

describe('MapaConexiones', () => {
  let mapa: any;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaConexiones],
    }).compileComponents();

    const fixture = TestBed.createComponent(MapaConexiones);
    mapa = fixture.componentInstance;
    elemento = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('empieza sin país elegido y con un solo punto tabulable', () => {
    expect(mapa.seleccionado()).toBe(-1);
    expect(elemento.querySelectorAll('[data-punto][tabindex="0"]').length).toBe(1);
  });

  it('al elegir un país muestra cómo se saluda allí', () => {
    const japon = mapa.puntos.findIndex((p: { pais: string }) => p.pais === 'Japón');
    mapa.seleccionar(japon);
    TestBed.tick();

    expect(elemento.querySelector('figcaption')?.textContent).toContain('Konnichiwa!');
    expect(elemento.querySelector('figcaption')?.textContent).toContain('Japón');
  });

  it('las flechas recorren los países y dan la vuelta al final', () => {
    const total = mapa.puntos.length;
    const tecla = (key: string) => new KeyboardEvent('keydown', { key });

    mapa.teclado(tecla('ArrowRight'), 0);
    expect(mapa.seleccionado()).toBe(1);

    mapa.teclado(tecla('ArrowLeft'), 0);
    expect(mapa.seleccionado()).toBe(total - 1);

    mapa.teclado(tecla('Home'), 5);
    expect(mapa.activo()).toBe(0);
  });
});
