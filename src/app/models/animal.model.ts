export interface Animal {
  id: string;
  nombre: string;
  especie: string;
  edad: number;
}

export type AnimalCrear = Omit<Animal, 'id'>;

export type AnimalActualizar = AnimalCrear;
