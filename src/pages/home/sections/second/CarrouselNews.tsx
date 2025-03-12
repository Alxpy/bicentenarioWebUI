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

import { IDataNew } from "@/components/interface"

const dataNew:IDataNew[] = [
  {
    title: "Alexander el Aestetic.",
    description:
      "Aleaxander el aestetic es visto en la paz.",
    date: "12/12/2021",
    image: "http://127.0.0.1:3000/images/alex.jpg",
  },
  {
    title: "Alexander el aestetic en el monte",
    description:
      "Nos encontramos con alex en la pampa.",
    date: "12/12/2021",
    image: "http://127.0.0.1:3000/images/alexAbrigado.jpg"
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.",
    date: "12/12/2021",
    image: "http://127.0.0.1:3000/images/lago.png"
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.",
    date: "12/12/2021",
    image: "http://127.0.0.1:3000/images/illimani.jpg"
    }
]


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
            {dataNew.map((data, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
