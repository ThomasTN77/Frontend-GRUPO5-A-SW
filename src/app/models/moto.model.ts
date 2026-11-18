export interface Moto {
  id?: string;
  marca: string;
  modelo: string;
  cilindraje: number;
  anio: number;
}

export type MotoCrear = Omit<Moto, 'id'>;
