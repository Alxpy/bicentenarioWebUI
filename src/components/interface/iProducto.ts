export interface iProducto{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagen: string;
    calificacion: number;
}

export interface iShowProducto{
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    calificacion: number;
}

//setProducto: (producto:iProducto) => void;