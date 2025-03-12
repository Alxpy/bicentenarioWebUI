import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CardNew = () => {
  return (
    <Card className="flex flex-col justify-between h-full">
     
      <CardHeader className="p-4 bg-gray-100">
        <CardTitle className="text-xl font-semibold">Título de la noticia</CardTitle>
      </CardHeader>

      <div className="flex justify-center p-4">
        <img
          src="https://via.placeholder.com/300"
          alt="Imagen de la noticia"
          width={300}
          height={200}
          className="object-cover rounded-md" 
        />
      </div>

      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-gray-700">
          Este es el resumen de la noticia. Aquí puedes colocar una breve descripción o un pequeño extracto de lo que trata la noticia.
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
        <span className="text-sm text-gray-500">12 de Marzo, 2025</span>
        <button className="text-blue-500 text-sm hover:underline">Ver más</button>
      </CardFooter>
    </Card>
  );
};

export default CardNew;
