import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Moto, MotoActualizar, MotoCrear } from '../models/moto.model';

@Injectable({ providedIn: 'root' })
export class MotoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.motosApiUrl}/motos`;

  listar(): Observable<Moto[]> {
    return this.http.get<Moto[]>(this.base);
  }

  obtener(id: string): Observable<Moto> {
    return this.http.get<Moto>(`${this.base}/${id}`);
  }

  crear(datos: MotoCrear): Observable<Moto> {
    return this.http.post<Moto>(this.base, datos);
  }

  actualizar(id: string, datos: MotoActualizar): Observable<Moto> {
    return this.http.put<Moto>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
