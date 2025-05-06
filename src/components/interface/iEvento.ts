export interface iEvento{
    id: number
    nombre: string
    descripcion: string
    imagen: string
    fecha_inicio: string
    fecha_fin: string
    id_tipo_evento: number
    nombre_evento: string
    id_ubicacion: number
    nombre_ubicacion: string
    id_usuario: number
    nombre_usuario: string
    id_organizador: number
    nombre_organizador: string
}

export interface iEventoCreate{
    nombre: string
    descripcion: string
    imagen: string
    fecha_inicio: string
    fecha_fin: string
    id_tipo_evento: number
    id_ubicacion: number
    id_usuario: number
    id_organizador: number
}