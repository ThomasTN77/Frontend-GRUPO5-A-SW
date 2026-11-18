export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  disponible: boolean;
}

export type LibroCrear = Omit<Libro, 'id'>;

export type LibroActualizar = LibroCrear;
