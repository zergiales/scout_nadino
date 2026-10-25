import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccesoService, ResultadoAcceso } from '../core/services/acceso.service';
import AccesoPage from './acceso.page';

describe('AccesoPage', () => {
  let pagina: any;
  let respuesta: ResultadoAcceso;
  const entrar = vi.fn(async () => respuesta);

  beforeEach(async () => {
    respuesta = { ok: true, destino: '/backoffice/index.html' };
    entrar.mockClear();

    await TestBed.configureTestingModule({
      imports: [AccesoPage],
      providers: [provideRouter([]), { provide: AccesoService, useValue: { entrar } }],
    }).compileComponents();

    pagina = TestBed.createComponent(AccesoPage).componentInstance;
    // jsdom no navega: se espía la salida al backoffice.
    pagina.irA = vi.fn();
  });

  it('no muestra errores hasta que se intenta entrar', () => {
    expect(pagina.error('usuario')).toBeNull();
    expect(pagina.error('clave')).toBeNull();
  });

  it('con el formulario vacío marca los dos campos y no pregunta al servicio', async () => {
    await pagina.entrar();

    expect(pagina.error('usuario')).not.toBeNull();
    expect(pagina.error('clave')).not.toBeNull();
    expect(entrar).not.toHaveBeenCalled();
    expect(pagina.irA).not.toHaveBeenCalled();
  });

  it('con datos válidos pregunta al servicio y manda al backoffice', async () => {
    pagina.formulario.setValue({ usuario: 'ana.lopez', clave: 'secreta' });
    await pagina.entrar();

    expect(entrar).toHaveBeenCalledWith('ana.lopez', 'secreta');
    expect(pagina.irA).toHaveBeenCalledWith('/backoffice/index.html');
  });

  it('si el servicio dice que no (fase 3), avisa, sacude y no navega', async () => {
    respuesta = { ok: false, motivo: 'credenciales' };
    pagina.formulario.setValue({ usuario: 'ana.lopez', clave: 'mala' });
    await pagina.entrar();

    expect(pagina.rechazado()).toBe('Usuario o contraseña incorrectos.');
    expect(pagina.sacudir()).toBe(true);
    expect(pagina.irA).not.toHaveBeenCalled();
  });

  it('«He olvidado mi contraseña» muestra la ayuda y vuelve a ocultarla', () => {
    expect(pagina.olvido()).toBe(false);
    pagina.olvido.set(!pagina.olvido());
    expect(pagina.olvido()).toBe(true);
  });

  it('da un mensaje distinto según el fallo del usuario', async () => {
    const usuario = pagina.formulario.controls.usuario;
    await pagina.entrar();

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

  it('sacude el formulario solo si hay errores', async () => {
    await pagina.entrar();
    expect(pagina.sacudir()).toBe(true);

    pagina.sacudir.set(false);
    pagina.formulario.setValue({ usuario: 'ana.lopez', clave: 'secreta' });
    await pagina.entrar();
    expect(pagina.sacudir()).toBe(false);
  });
});
