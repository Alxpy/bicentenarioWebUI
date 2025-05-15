
export interface iEvento{
    id: number
    nombre: string
    descripcion: string
    imagen: string
    fecha_inicio: string
    fecha_fin: string
    id_tipo_evento: number
    precio: string
    nombre_evento: string
    id_ubicacion: number
    nombre_ubicacion: string
    id_usuario: number
    nombre_usuario: string
    id_organizador: number
    nombre_organizador: string
    categoria: string
    enlace: string
    
}

export interface iEventoCreate{
    nombre: string
    descripcion: string
    imagen: string
    fecha_inicio: string
    fecha_fin: string
    id_tipo_evento: number
    precio: number
    categoria: string
    enlace: string
    id_ubicacion: number
    id_usuario: number
    id_organizador: number
} 