import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Libro, LibroCrear } from '../../models/libro.model';
import { LibroService } from '../../services/libro.service';

type ModoPopup = 'crear' | 'editar';

@Component({
  selector: 'app-libros',
  imports: [FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css',
})
export class Libros implements OnInit {
  private readonly libroService = inject(LibroService);

  readonly filas = signal<Libro[]>([]);
  readonly mensaje = signal('');
  readonly esError = signal(false);
  readonly cargando = signal(false);
  readonly popupAbierto = signal(false);
  readonly modo = signal<ModoPopup>('crear');

  idFiltro: number | null = null;
  formulario: LibroCrear = this.formularioVacio();
  private idEditando = 0;

  ngOnInit(): void {
    this.cargarTodos();
  }

  buscarPorId(): void {
    const id = Number(this.idFiltro);
    if (!this.idFiltro || !Number.isInteger(id) || id <= 0) {
      this.cargarTodos();
      return;
    }

    this.cargando.set(true);
    this.libroService.obtener(id).subscribe({
      next: (libro) => {
        this.filas.set([libro]);
        this.avisar('');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.avisar(this.textoError(error, false), true);
        this.cargando.set(false);
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = null;
    this.cargarTodos();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.idEditando = 0;
    this.formulario = this.formularioVacio();
    this.popupAbierto.set(true);
  }

  abrirEditar(fila: Libro): void {
    this.modo.set('editar');
    this.idEditando = fila.id;
    this.formulario = {
      titulo: fila.titulo,
      autor: fila.autor,
      anio: fila.anio,
      disponible: fila.disponible,
    };
    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    this.popupAbierto.set(false);
  }

  guardar(): void {
    if (!this.formularioValido()) {
      this.avisar('Completa título, autor y un año válido (1400-2100).', true);
      return;
    }

    this.cargando.set(true);
    const datos = this.datosFormulario();
    if (this.modo() === 'crear') {
      this.libroService.crear(datos).subscribe({
        next: () => this.despuesDeGuardar('Libro creado correctamente'),
        error: (error: HttpErrorResponse) => this.falloGuardar(error),
      });
      return;
    }

    this.libroService.actualizar(this.idEditando, datos).subscribe({
      next: () => this.despuesDeGuardar('Libro actualizado correctamente'),
      error: (error: HttpErrorResponse) => this.falloGuardar(error),
    });
  }

  eliminar(fila: Libro): void {
    if (!confirm(`¿Seguro que quieres eliminar "${fila.titulo}"?`)) {
      return;
    }

    this.cargando.set(true);
    this.libroService.eliminar(fila.id).subscribe({
      next: () => {
        this.avisar('Libro eliminado correctamente');
        this.limpiarFiltro();
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(this.textoError(error, false), true);
        this.cargando.set(false);
      },
    });
  }

  private cargarTodos(): void {
    this.cargando.set(true);
    this.libroService.listar().subscribe({
      next: (filas) => {
        this.filas.set(filas ?? []);
        this.avisar(filas?.length ? '' : 'No hay libros registrados');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.avisar(this.textoError(error, true), true);
        this.cargando.set(false);
      },
    });
  }

  private refrescar(): void {
    if (this.idFiltro) {
      this.buscarPorId();
      return;
    }
    this.cargarTodos();
  }

  private despuesDeGuardar(texto: string): void {
    this.popupAbierto.set(false);
    this.refrescar();
    this.avisar(texto);
  }

  private falloGuardar(error: HttpErrorResponse): void {
    this.avisar(this.textoError(error, false), true);
    this.cargando.set(false);
  }

  private formularioValido(): boolean {
    const d = this.formulario;
    const anio = Number(d.anio);
    return Boolean(
      d.titulo?.trim() &&
        d.autor?.trim() &&
        Number.isInteger(anio) &&
        anio >= 1400 &&
        anio <= 2100
    );
  }

  private datosFormulario(): LibroCrear {
    const d = this.formulario;
    return {
      titulo: d.titulo.trim(),
      autor: d.autor.trim(),
      anio: Number(d.anio),
      disponible: Boolean(d.disponible),
    };
  }

  private formularioVacio(): LibroCrear {
    return { titulo: '', autor: '', anio: new Date().getFullYear(), disponible: true };
  }

  private avisar(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error && texto.length > 0);
  }

  private textoError(error: HttpErrorResponse, alListar: boolean): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API de libros. Revisa que el backend esté corriendo en el puerto 8001.';
    }
    if (error.status === 404) {
      return alListar ? 'No hay libros registrados' : 'Libro no encontrado';
    }
    if (error.status === 422) {
      return 'Revisa los datos enviados.';
    }
    const detail = error.error?.detail;
    return typeof detail === 'string' ? detail : 'No se pudo completar la operación';
  }
}
