
export interface IUbicacion {
    id: number;
    nombre: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    imagen: string;
  }

export interface iUbicacionCreate {
    nombre: string
    latitud: number
    longitud: number
    imagen: string
    descripcion: string
  }
  
export interface IUbicacionGeneral{
    id: number
    nombre: string
    latitud: number
    longitud: number
  }
