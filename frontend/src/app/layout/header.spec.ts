import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';

describe('Header', () => {
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    html = TestBed.inject(DOCUMENT).documentElement;
    html.setAttribute('data-tema', 'oscuro');
    localStorage.removeItem('tema');
  });

  function botonTema(): HTMLButtonElement {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const boton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.includes('Modo oscuro'),
    );
    return Object.assign(boton, { fixture });
  }

  it('arranca en oscuro si <html> lo dice', () => {
    expect(botonTema().getAttribute('aria-pressed')).toBe('true');
  });

  it('al pulsar pasa a claro, lo aplica en <html> y lo recuerda', () => {
    const boton = botonTema();
    boton.click();
    (boton as any).fixture.detectChanges();

    expect(boton.getAttribute('aria-pressed')).toBe('false');
    expect(html.getAttribute('data-tema')).toBe('claro');
    expect(localStorage.getItem('tema')).toBe('claro');
  });
});
