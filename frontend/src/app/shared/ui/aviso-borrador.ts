import { Component } from '@angular/core';

/**
 * Marca una página cuyo contenido todavía no es el definitivo, para que nadie
 * confunda el esqueleto del Sprint 0 con la web terminada. Se borra de cada
 * página cuando su contenido real entra desde `src/content`.
 *
 * Componente tonto: no inyecta servicios (regla 2 de `frontend/README.md`).
 */
@Component({
  selector: 'app-aviso-borrador',
  template: `
    <p
      class="my-6 border-l-4 border-acento bg-amber-50 px-4 py-3 text-sm text-tinta"
    >
      <strong>Borrador.</strong>
      <ng-content />
    </p>
  `,
})
export class AvisoBorrador {}
