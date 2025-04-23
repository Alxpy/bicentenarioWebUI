import { IUbicacion } from "./IUbicacion";
export interface IHistory {
  id: number
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  imagen: string
  id_ubicacion: number
  nombre_ubicacion: string
  id_categoria: number
  nombre_categoria: string
}

interface ICategoria{
  id: number;
  nombre: string;
  descripcion: string;
}