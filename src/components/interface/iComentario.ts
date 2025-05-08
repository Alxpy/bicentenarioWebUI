export interface IComentario {
    id: number
    id_usuario: number
    contenido: string
    fecha_creacion: string
}

export interface IComentarioResponse {
    id_comentario: number
    id_evento: number
    id_usuario: number
    contenido: string
    fecha_creacion: string
}

export interface ICreateComentarioBlb{
    id_comentario: number
  id_biblioteca: number
}

export interface IComentarioBlb {
    id_comentario: number
    id_biblioteca: number
    id_usuario: number
    contenido: string
    fecha_creacion: string}

    export interface IComentarioEve {
        id_comentario: number
        id_evento: number
        id_usuario: number
        contenido: string
        fecha_creacion: string}