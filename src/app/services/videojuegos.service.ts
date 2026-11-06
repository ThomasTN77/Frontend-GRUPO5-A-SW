import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego.model';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {
  private apiUrl = 'http://localhost:8000/videojuegos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl);
  }

  getById(id: string): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}/${id}`);
  }

  create(videojuego: Videojuego): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.apiUrl, videojuego);
  }

  update(id: string, videojuego: Videojuego): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.apiUrl}/${id}`, videojuego);
  }

  delete(id: string): Observable<Videojuego> {
    return this.http.delete<Videojuego>(`${this.apiUrl}/${id}`);
  }
}