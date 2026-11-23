import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Moto, MotoCrear } from '../../models/moto.model';
import { MotoService } from '../../services/moto.service';

type ModoPopup = 'crear' | 'editar';

@Component({
  selector: 'app-motos',
  imports: [FormsModule],
  templateUrl: './motos.html',
  styleUrl: './motos.css',
})
export class Motos implements OnInit {
  private readonly motoService = inject(MotoService);

  readonly filas = signal<Moto[]>([]);
  readonly mensaje = signal('');
  readonly esError = signal(false);
  readonly cargando = signal(false);
  readonly popupAbierto = signal(false);
  readonly modo = signal<ModoPopup>('crear');

  idFiltro = '';
  formulario: MotoCrear = this.formularioVacio();
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
    this.motoService.obtener(id).subscribe({
      next: (moto) => {
        this.filas.set([moto]);
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
    this.idFiltro = '';
    this.cargarTodos();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.idEditando = '';
    this.formulario = this.formularioVacio();
    this.popupAbierto.set(true);
  }

  abrirEditar(fila: Moto): void {
    this.modo.set('editar');
    this.idEditando = fila.id;
    this.formulario = {
      marca: fila.marca,
      modelo: fila.modelo,
      cilindraje: fila.cilindraje,
      anio: fila.anio,
    };
    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    this.popupAbierto.set(false);
  }

  guardar(): void {
    if (!this.formularioValido()) {
      this.avisar(
        'Completa marca y modelo; el cilindraje debe estar entre 1 y 3000 y el año entre 1900 y 2100.',
        true,
      );
      return;
    }

    this.cargando.set(true);
    const datos = this.datosFormulario();
    if (this.modo() === 'crear') {
      this.motoService.crear(datos).subscribe({
        next: () => this.despuesDeGuardar('Moto creada correctamente'),
        error: (error: HttpErrorResponse) => this.falloGuardar(error),
      });
      return;
    }

    this.motoService.actualizar(this.idEditando, datos).subscribe({
      next: () => this.despuesDeGuardar('Moto actualizada correctamente'),
      error: (error: HttpErrorResponse) => this.falloGuardar(error),
    });
  }

  eliminar(fila: Moto): void {
    const confirmar = confirm(
      `¿Estás seguro de eliminar la moto "${fila.marca} ${fila.modelo}"?`,
    );
    if (!confirmar) {
      return;
    }

    this.cargando.set(true);
    this.motoService.eliminar(fila.id).subscribe({
      next: () => {
        this.idFiltro = '';
        this.cargarTodos('Moto eliminada correctamente');
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(this.textoError(error, false), true);
        this.cargando.set(false);
      },
    });
  }

  private cargarTodos(mensajeExito = ''): void {
    this.cargando.set(true);
    this.motoService.listar().subscribe({
      next: (filas) => {
        this.filas.set(filas);
        this.avisar(mensajeExito || (filas.length ? '' : 'No hay registros'));
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        const listaVacia = error.status === 404;
        this.avisar(
          mensajeExito || (listaVacia ? 'No hay registros' : this.textoError(error, true)),
          !mensajeExito && !listaVacia,
        );
        this.cargando.set(false);
      },
    });
  }

  private despuesDeGuardar(texto: string): void {
    this.popupAbierto.set(false);
    this.idFiltro = '';
    this.cargarTodos(texto);
  }

  private falloGuardar(error: HttpErrorResponse): void {
    this.avisar(this.textoError(error, false), true);
    this.cargando.set(false);
  }

  private formularioValido(): boolean {
    const datos = this.formulario;
    return Boolean(
      datos.marca?.trim() &&
        datos.marca.length <= 80 &&
        datos.modelo?.trim() &&
        datos.modelo.length <= 120 &&
        Number.isInteger(datos.cilindraje) &&
        datos.cilindraje >= 1 &&
        datos.cilindraje <= 3000 &&
        Number.isInteger(datos.anio) &&
        datos.anio >= 1900 &&
        datos.anio <= 2100,
    );
  }

  private datosFormulario(): MotoCrear {
    return {
      marca: this.formulario.marca.trim(),
      modelo: this.formulario.modelo.trim(),
      cilindraje: Number(this.formulario.cilindraje),
      anio: Number(this.formulario.anio),
    };
  }

  private formularioVacio(): MotoCrear {
    return {
      marca: '',
      modelo: '',
      cilindraje: 1,
      anio: new Date().getFullYear(),
    };
  }

  private avisar(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error && texto.length > 0);
  }

  private textoError(error: HttpErrorResponse, alListar: boolean): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API de motos. Revisa que el backend esté desplegado y tenga CORS configurado.';
    }
    if (error.status === 404) {
      return alListar ? 'No hay registros' : 'Moto no encontrada';
    }
    if (error.status === 422) {
      return 'Revisa los datos de la moto y que el ID sea un UUID válido.';
    }
    const detail = error.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    return 'No se pudo completar la operación';
  }
}
