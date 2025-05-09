export interface IDataNew {
    titulo: string
    resumen: string
    fecha_publicacion: string
    imagen: string
}

export interface IResponse {
    data: IDataNew[]
}

export interface iNews {
    id: number
    titulo: string
    resumen: string
    contenido: string
    imagen: string
    id_Categoria: number
    id_usuario: number
    nombre_usuario?: string
    nombre_categoria: string
    fecha_publicacion: string
  }
  