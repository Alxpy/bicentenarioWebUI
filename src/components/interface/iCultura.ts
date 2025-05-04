export interface ICreateCultura {
    nombre: string
    imagen: string
    descripcion: string
    id_ubicacion: number
}

export interface IUpdateCultura {
    nombre: string
    imagen: string
    descripcion: string
    id_ubicacion: number
}

export interface ICultura{
    id: number
    nombre: string
    imagen: string
    descripcion: string
    id_ubicacion: number
    nombre_ubicacion: string
    latitud: number
    longitud: number
}