import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Videojuego {
  id?: string;
  titulo: string;
  plataforma: string;
  genero: string;
  precio: number;
}

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videojuegos.component.html',
  styleUrls: ['./videojuegos.component.css']
})
export class VideojuegosComponent implements OnInit {
  // Dirección URL de la API de FastAPI
  private apiUrl = 'http://127.0.0.1:8000/videojuegos';

  videojuegos: Videojuego[] = [];
  videojuegoForm: Videojuego = {
    titulo: '',
    plataforma: '',
    genero: '',
    precio: 0
  };

  editando: boolean = false;
  idEnEdicion: string | null = null;
  errorMessage: string = '';
  conectado: boolean = false;

  // Buscador por ID
  searchId: string = '';
  videojuegosFiltrados: Videojuego[] = [];
  modoBusqueda: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerVideojuegos();
  }

  // GET: Obtener todos los videojuegos
  obtenerVideojuegos(): void {
    this.http.get<Videojuego[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.errorMessage = '';
        this.conectado = true;
      },
      error: (err) => {
        console.error('Error al conectar con la API:', err);
        this.errorMessage = 'Error al conectar con la API. Verifica que el backend esté encendido.';
        this.conectado = false;
      }
    });
  }

  // Buscar videojuego por ID
  buscarPorId(): void {
    const id = this.searchId.trim();
    if (!id) {
      this.limpiarBusqueda();
      return;
    }

    this.http.get<Videojuego>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        this.videojuegosFiltrados = [data];
        this.modoBusqueda = true;
        this.errorMessage = '';
        this.conectado = true;
      },
      error: (err) => {
        console.error('Error al buscar por ID:', err);
        this.videojuegosFiltrados = [];
        this.modoBusqueda = true;
        if (err.status === 404) {
          this.errorMessage = 'No se encontró ningún videojuego con ese ID.';
        } else if (err.status === 422) {
          this.errorMessage = 'El ID ingresado no tiene un formato válido (UUID).';
        } else {
          this.errorMessage = 'Error al buscar por ID. Verifica que el backend esté encendido.';
        }
        this.conectado = err.status !== 0;
      }
    });
  }

  // Limpiar búsqueda y mostrar todos
  limpiarBusqueda(): void {
    this.searchId = '';
    this.modoBusqueda = false;
    this.videojuegosFiltrados = [];
    this.obtenerVideojuegos();
  }

  // POST / PUT: Guardar o actualizar registro
  guardar(): void {
    if (this.editando && this.idEnEdicion !== null) {
      this.http.put<Videojuego>(`${this.apiUrl}/${this.idEnEdicion}`, this.videojuegoForm).subscribe({
        next: () => {
          this.obtenerVideojuegos();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.http.post<Videojuego>(this.apiUrl, this.videojuegoForm).subscribe({
        next: () => {
          this.obtenerVideojuegos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  // Prepara el formulario para edición
  seleccionarParaEditar(juego: Videojuego): void {
    this.editando = true;
    this.idEnEdicion = juego.id || null;
    this.videojuegoForm = { ...juego };
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idEnEdicion = null;
    this.limpiarFormulario();
  }

  // DELETE: Eliminar un registro por ID
  eliminar(id: string): void {
    if (confirm('¿Estás segura de eliminar este videojuego?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.obtenerVideojuegos(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.videojuegoForm = {
      titulo: '',
      plataforma: '',
      genero: '',
      precio: 0
    };
  }
}