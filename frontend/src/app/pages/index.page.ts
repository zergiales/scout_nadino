import { Component } from '@angular/core';

// Página provisional del Sprint 0: solo sirve para validar que el build
// prerenderiza HTML. La portada real es tarea del Bloque A y debe tomar su
// contenido de src/content a través de un servicio de core/services.
@Component({
  selector: 'app-home',
  template: ` <h1>Grupo Scout Nadino</h1> `,
})
export default class HomePage {}
