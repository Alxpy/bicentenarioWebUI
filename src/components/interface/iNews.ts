export interface IDataNew {
    title: string
    description: string
    date: string
    image: string
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
    nombre_categoria: string
    fecha_publicacion: string
  }
  