import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly menu = [
    { ruta: '/inicio', etiqueta: 'Inicio' },
    { ruta: '/animales', etiqueta: 'Animales' },
    { ruta: '/motos', etiqueta: 'Motos' },
    { ruta: '/libros', etiqueta: 'Libros' },
    { ruta: '/videojuegos', etiqueta: 'Videojuegos' },
  ];
}
