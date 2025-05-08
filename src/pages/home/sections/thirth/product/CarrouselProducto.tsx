import React, { useEffect } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { iShowProducto, iEvento } from '@/components/interface'
import { CardProducto } from './CardProducto'
import { apiService } from '@/service/apiservice'

const dataP: iShowProducto[] = [
  
]

const CarrouselProducto = () => {

    const [eventos, setEventos] = React.useState<iShowProducto[]>([]);

    const fetchEventos = async () => {
        try {
            const response = await apiService.get<iEvento[]>('/evento');
            const eventosData : any = response.data;
            setEventos(eventosData);
        } catch (error) {
            console.error("Error fetching eventos:", error);
        }
    }
    useEffect(() => {
        fetchEventos();
    }
    , []);

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
                    {eventos.map((data, index) => (
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
