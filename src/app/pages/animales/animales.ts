import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Animal, AnimalCrear } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';

type ModoPopup = 'crear' | 'editar';

@Component({
  selector: 'app-animales',
  imports: [FormsModule],
  templateUrl: './animales.html',
  styleUrl: './animales.css',
})
export class Animales implements OnInit {
  private readonly animalService = inject(AnimalService);

  readonly filas = signal<Animal[]>([]);
  readonly mensaje = signal('');
  readonly esError = signal(false);
  readonly cargando = signal(false);
  readonly popupAbierto = signal(false);
  readonly modo = signal<ModoPopup>('crear');

  idFiltro = '';
  formulario: AnimalCrear = this.formularioVacio();
  private idEditando = '';

  ngOnInit(): void {
    this.cargarTodos();
  }

  buscarPorId(): void {
    const id = this.idFiltro.trim();
    if (!id) {
      this.cargarTodos();
      return;
    }

    this.cargando.set(true);
    this.animalService.obtener(id).subscribe({
      next: (animal) => {
        this.filas.set(animal ? [animal] : []);
        this.avisar(animal ? '' : 'No encontrado', !animal);
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
    this.idFiltro = '';
    this.cargarTodos();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.idEditando = '';
    this.formulario = this.formularioVacio();
    this.popupAbierto.set(true);
  }

  abrirEditar(fila: Animal): void {
    this.modo.set('editar');
    this.idEditando = fila.id;
    this.formulario = {
      nombre: fila.nombre,
      especie: fila.especie,
      edad: fila.edad,
    };
    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    this.popupAbierto.set(false);
  }

  guardar(): void {
    if (!this.formularioValido()) {
      this.avisar('Completa nombre, especie y una edad válida (0-200).', true);
      return;
    }

    this.cargando.set(true);
    const datos = this.datosFormulario();
    if (this.modo() === 'crear') {
      this.animalService.crear(datos).subscribe({
        next: () => this.despuesDeGuardar('Animal creado correctamente'),
        error: (error: HttpErrorResponse) => this.falloGuardar(error),
      });
      return;
    }

    this.animalService.actualizar(this.idEditando, datos).subscribe({
      next: () => this.despuesDeGuardar('Animal actualizado correctamente'),
      error: (error: HttpErrorResponse) => this.falloGuardar(error),
    });
  }

  eliminar(fila: Animal): void {
    const confirmar = confirm(`¿Estás seguro de eliminar a "${fila.nombre}"?`);
    if (!confirmar) {
      return;
    }

    this.cargando.set(true);
    this.animalService.eliminar(fila.id).subscribe({
      next: () => {
        this.avisar('Animal eliminado correctamente');
        this.refrescar();
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(this.textoError(error, false), true);
        this.cargando.set(false);
      },
    });
  }

  private cargarTodos(): void {
    this.cargando.set(true);
    this.animalService.listar().subscribe({
      next: (filas) => {
        this.filas.set(filas || []);
        this.avisar(filas && filas.length ? '' : 'No hay registros');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        const listaVacia = error.status === 404;
        this.avisar(listaVacia ? 'No hay registros' : this.textoError(error, true), !listaVacia);
        this.cargando.set(false);
      },
    });
  }

  private refrescar(): void {
    if (this.idFiltro.trim()) {
      this.buscarPorId();
      return;
    }
    this.cargarTodos();
  }

  private despuesDeGuardar(texto: string): void {
    this.popupAbierto.set(false);
    this.avisar(texto);
    this.refrescar();
  }

  private falloGuardar(error: HttpErrorResponse): void {
    this.avisar(this.textoError(error, false), true);
    this.cargando.set(false);
  }

  private formularioValido(): boolean {
    const datos = this.formulario;
    return Boolean(
      datos.nombre?.trim() &&
      datos.especie?.trim() &&
      typeof datos.edad === 'number' &&
      datos.edad >= 0 &&
      datos.edad <= 200
    );
  }

  private datosFormulario(): AnimalCrear {
    const datos = this.formulario;
    return {
      nombre: datos.nombre.trim(),
      especie: datos.especie.trim(),
      edad: Number(datos.edad),
    };
  }

  private formularioVacio(): AnimalCrear {
    return {
      nombre: '',
      especie: '',
      edad: 0,
    };
  }

  private avisar(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error && texto.length > 0);
  }

  private textoError(error: HttpErrorResponse, alListar: boolean): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API. Revisa que el backend esté corriendo en el puerto 8000 y tenga CORS configurado.';
    }
    if (error.status === 404) {
      return alListar ? 'No hay registros' : 'Animal no encontrado';
    }
    if (error.status === 422) {
      return 'Revisa los datos. Para filtrar por ID debe ser un UUID válido.';
    }
    const detail = error.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    return 'No se pudo completar la operación';
  }
}
