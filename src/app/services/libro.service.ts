import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Libro, LibroActualizar, LibroCrear } from '../models/libro.model';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.librosApiUrl}/libros`;

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.base);
  }

  obtener(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.base}/${id}`);
  }

  crear(datos: LibroCrear): Observable<Libro> {
    return this.http.post<Libro>(this.base, datos);
  }

  actualizar(id: number, datos: LibroActualizar): Observable<Libro> {
    return this.http.put<Libro>(`${this.base}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
