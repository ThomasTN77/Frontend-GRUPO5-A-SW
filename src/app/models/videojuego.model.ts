export interface Videojuego {
  id?: string; // Permite el UUID retornado por FastAPI
  titulo: string;
  plataforma: string;
  genero: string;
  precio: number;
}