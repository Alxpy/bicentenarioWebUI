import * as React from "react"
 
import CardNew from "./CardNew"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const CarrouselNews = () => {
    return (
        <Carousel
          opts={{
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-[80vw] h-[100%]  md:h-[80vh]  lg:h-[70vh] mb-20"
        >
          <CarouselContent>
            {Array.from({ length: 15 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <CardNew/>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        )
}

export default CarrouselNews
