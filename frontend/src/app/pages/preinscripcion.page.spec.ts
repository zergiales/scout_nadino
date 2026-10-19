import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import PreinscripcionPage from './preinscripcion.page';

describe('PreinscripcionPage', () => {
  let pagina: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreinscripcionPage],
      providers: [provideRouter([])],
    }).compileComponents();

    pagina = TestBed.createComponent(PreinscripcionPage).componentInstance;
  });

  it('con el formulario vacío lista un error por cada campo obligatorio', () => {
    pagina.enviar();

    expect(pagina.errores().map((e: { campo: string }) => e.campo)).toEqual([
      'adulto',
      'email',
      'telefono',
      'anyoNacimiento',
      'privacidad',
    ]);
    expect(pagina.enviado()).toBe(false);
  });

  it('rechaza un correo sin arroba', () => {
    pagina.formulario.patchValue({
      adulto: 'Ana Pérez',
      email: 'ana.ejemplo.com',
      telefono: '600000000',
      anyoNacimiento: '2016',
      privacidad: true,
    });
    pagina.enviar();

    expect(pagina.errores().length).toBe(1);
    expect(pagina.errores()[0].campo).toBe('email');
  });

  it('no da por enviado nada si no se acepta la privacidad', () => {
    pagina.formulario.patchValue({
      adulto: 'Ana Pérez',
      email: 'ana@ejemplo.com',
      telefono: '600000000',
      anyoNacimiento: '2016',
      privacidad: false,
    });
    pagina.enviar();

    expect(pagina.errores()[0].campo).toBe('privacidad');
    expect(pagina.enviado()).toBe(false);
  });

  it('con todo relleno no quedan errores', () => {
    pagina.formulario.patchValue({
      adulto: 'Ana Pérez',
      email: 'ana@ejemplo.com',
      telefono: '600000000',
      anyoNacimiento: '2016',
      observaciones: 'Viene con una amiga.',
      privacidad: true,
    });
    pagina.enviar();

    expect(pagina.errores()).toEqual([]);
    expect(pagina.enviado()).toBe(true);
  });
});
