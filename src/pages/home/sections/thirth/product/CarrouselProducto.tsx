import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { iShowProducto } from '@/components/interface'
import { CardProducto } from './CardProducto'

const dataP: iShowProducto[] = [
    {
        nombre: "Producto 1",
        descripcion: "Descripción del producto 1",
        precio: 100,
        imagen: "https://picsum.photos/200/300",
        categoria: "Categoría 1",
        calificacion: 5
    },
    {
        nombre: "Producto 2",
        descripcion: "Descripción del producto 2",
        precio: 120,
        imagen: "https://picsum.photos/200/301",
        categoria: "Categoría 2",
        calificacion: 4
    },
    {
        nombre: "Producto 3",
        descripcion: "Descripción del producto 3",
        precio: 150,
        imagen: "https://picsum.photos/200/302",
        categoria: "Categoría 3",
        calificacion: 3
    },
    {
        nombre: "Producto 4",
        descripcion: "Descripción del producto 4",
        precio: 200,
        imagen: "https://picsum.photos/200/303",
        categoria: "Categoría 4",
        calificacion: 2
    },
    {
        nombre: "Producto 5",
        descripcion: "Descripción del producto 5",
        precio: 250,
        imagen: "https://picsum.photos/200/304",
        categoria: "Categoría 5",
        calificacion: 1
    },
    {
        nombre: "Producto 6",
        descripcion: "Descripción del producto 6",
        precio: 300,
        imagen: "https://picsum.photos/200/304",
        categoria: "Categoría 6",
        calificacion: 5
    },
    {
        nombre: "Producto 7",
        descripcion: "Descripción del producto 7",
        precio: 350,
        categoria: "Categoría 7",
        imagen: "https://picsum.photos/200/303",    
        calificacion: 4
    },
    {
        nombre: "Producto 8",
        descripcion: "Descripción del producto 7",
        precio: 350,
        categoria: "Categoría 7",
        imagen: "https://picsum.photos/200/302",    
        calificacion: 4
    },
    {
        nombre: "Producto 9",
        descripcion: "Descripción del producto 7",
        precio: 350,
        categoria: "Categoría 7",
        imagen: "https://picsum.photos/200/302",    
        calificacion: 4
    },
    {
        nombre: "Producto 10",
        descripcion: "Descripción del producto 7",
        precio: 350,
        categoria: "Categoría 7",
        imagen: "https://picsum.photos/200/301",    
        calificacion: 4
    },

]

const CarrouselProducto = () => {

    return (
        <div className="flex justify-center w-full h-full mt-20">
            <Carousel
                opts={{ align: "start" }}
                plugins={[
                    Autoplay({ delay: 3000 }),
                ]}
                className="w-[90%] max-w-[600px] mb-20"
                orientation="vertical"
            >
                <CarouselContent className='-mt-1 h-[600px]' >
                    {dataP.map((data, index) => (
                        <CarouselItem key={index} className="flex justify-center basis-1/3 md:basis-1/2 lg:basis-1/3">
                            <CardProducto producto={data} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
    
}

export default CarrouselProducto
