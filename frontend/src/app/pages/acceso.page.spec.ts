import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import AccesoPage from './acceso.page';

describe('AccesoPage', () => {
  let pagina: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoPage],
      providers: [provideRouter([])],
    }).compileComponents();

    pagina = TestBed.createComponent(AccesoPage).componentInstance;
  });

  it('no muestra errores hasta que se intenta entrar', () => {
    expect(pagina.error('usuario')).toBeNull();
    expect(pagina.error('clave')).toBeNull();
  });

  it('con el formulario vacío marca los dos campos y no avisa de nada', () => {
    pagina.entrar();

    expect(pagina.error('usuario')).not.toBeNull();
    expect(pagina.error('clave')).not.toBeNull();
    expect(pagina.avisado()).toBe(false);
  });

  it('con datos válidos avisa de que el acceso al blog no está disponible', () => {
    pagina.formulario.setValue({ usuario: 'ana.blog', clave: 'secreta' });
    pagina.entrar();

    expect(pagina.error('usuario')).toBeNull();
    expect(pagina.avisado()).toBe(true);
  });

  it('«He olvidado mi contraseña» muestra la ayuda y vuelve a ocultarla', () => {
    expect(pagina.olvido()).toBe(false);
    pagina.olvido.set(!pagina.olvido());
    expect(pagina.olvido()).toBe(true);
  });

  it('da un mensaje distinto según el fallo del usuario', () => {
    const usuario = pagina.formulario.controls.usuario;
    pagina.entrar();

    usuario.setValue('ana@ejemplo.com');
    expect(pagina.error('usuario')).toContain('no tu correo');

    usuario.setValue('ana lópez');
    expect(pagina.error('usuario')).toContain('sin espacios');

    usuario.setValue('an');
    expect(pagina.error('usuario')).toContain('al menos 3');

    usuario.setValue('ana-lopez_2');
    expect(pagina.error('usuario')).toBeNull();
  });

  it('muestra el error al salir del campo, sin esperar a enviar', () => {
    pagina.formulario.controls.usuario.markAsTouched();
    expect(pagina.error('usuario')).toContain('Escribe tu nombre de usuario');
  });

  it('sacude el formulario solo si hay errores', () => {
    pagina.entrar();
    expect(pagina.sacudir()).toBe(true);

    pagina.sacudir.set(false);
    pagina.formulario.setValue({ usuario: 'ana.blog', clave: 'secreta' });
    pagina.entrar();
    expect(pagina.sacudir()).toBe(false);
  });
});
