import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IDataNew, iNews } from "@/components/interface";
import  useLocalStorage  from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
interface CardNewProps {
  dataNew: iNews;
}

const CardNew = ({ dataNew }: CardNewProps) => {
  const navigate = useNavigate();
  const [showNews, setShowNews] = useLocalStorage<iNews | null>('showNews', null)

  

  return (
    <Card className=" flex flex-col justify-between h-[450px] w-[250px] shadow-lg rounded-lg inset-shadow-sm inset-shadow-slate-800">
     
      <CardHeader className="p-4 bg-slate-200">
        <CardTitle className="text-lg font-semibold text-center truncate">
          {dataNew.titulo}
        </CardTitle>
      </CardHeader>

      <div className="flex justify-center items-center h-[100%] w-full overflow-hidden shadow-xl">
        <img
          src={dataNew.imagen}
          alt={dataNew.titulo}
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-xs text-gray-700 line-clamp-3">
          {dataNew.resumen}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
        <span className="text-xs text-gray-500">{dataNew.fecha_publicacion}</span>
        <button className="text-blue-500 text-xs hover:underline"
        onClick={() => {
          setShowNews(dataNew)
          navigate(`/noticias/${dataNew.id}`)
        }}
        >Ver más</button>
      </CardFooter>
    </Card>
  );
};

export default CardNew;
