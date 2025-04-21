import { IUbicacion } from "./IUbicacion";
export interface IHistory {
    id: number;
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    imagen: string;
    id_ubicacion: number;
    id_categoria: number;
    ubicacion: IUbicacion;
    categoria: ICategoria;
    estado: boolean;
  }

interface ICategoria{
  id: number;
  nombre: string;
  descripcion: string;
}