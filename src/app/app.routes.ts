import { Routes } from '@angular/router';

import { Shell } from './layout/shell/shell';
import { Animales } from './pages/animales/animales';
import { Inicio } from './pages/inicio/inicio';
import { Libros } from './pages/libros/libros';
import { Placeholder } from './pages/placeholder/placeholder';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: Inicio },
      { path: 'animales', component: Animales },
      {
        path: 'motos',
        component: Placeholder,
        data: { entidad: 'Motos', responsable: 'Juanda' },
      },
      { path: 'libros', component: Libros },
      {
        path: 'videojuegos',
        component: VideojuegosComponent,
        data: { entidad: 'Videojuegos', responsable: 'María' },
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
