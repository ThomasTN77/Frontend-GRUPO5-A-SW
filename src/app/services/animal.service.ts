import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Animal, AnimalActualizar, AnimalCrear } from '../models/animal.model';
import { ApiLista, ApiUno } from '../models/api-respuesta.model';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/animales`;

  listar(): Observable<Animal[]> {
    return this.http.get<Animal[] | ApiLista<Animal>>(this.base).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          return res;
        }
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      })
    );
  }

  obtener(id: string): Observable<Animal> {
    return this.http.get<Animal | ApiUno<Animal>>(`${this.base}/${id}`).pipe(
      map((res: any) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      })
    );
  }

  crear(datos: AnimalCrear): Observable<Animal> {
    return this.http.post<Animal | ApiUno<Animal>>(this.base, datos).pipe(
      map((res: any) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      })
    );
  }

  actualizar(id: string, datos: AnimalActualizar): Observable<Animal> {
    return this.http.put<Animal | ApiUno<Animal>>(`${this.base}/${id}`, datos).pipe(
      map((res: any) => {
        if (res && res.data) {
          return res.data;
        }
        return res;
      })
    );
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
