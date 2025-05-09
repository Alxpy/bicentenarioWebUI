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

import { iNews } from "@/components/interface"
import { apiService } from "@/service/apiservice"

interface INew {
  titulo: string
  resumen: string
  fecha_publicacion: string
  imagen: string
}



const CarrouselNews = () => {

  const [dataNew, setDataNew] = React.useState<iNews[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getData = async () => {
      const response = await apiService.get('news')
      setDataNew(response.data)
      setLoading(false)
    }
    getData()
  }, [])

    return (
        <Carousel
          opts={{
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 9000,
            }),
          ]}
          className="w-[80vw] h-[100%]  md:h-[80vh]  lg:h-[70vh] mb-20"
        >
          <CarouselContent>
            {dataNew.map((data, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <CardNew dataNew={data}/>
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
