import React from "react";
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button"; // Importamos el botón

import lapazF from '@/assets/wallpers/lapaz.jpg';
import oruroF from '@/assets/wallpers/oruro.jpg';
import potosiF from '@/assets/wallpers/potosi.jpg';
import santaCruzF from '@/assets/wallpers/santa.jpg';
import tarijaF from '@/assets/wallpers/tarija.jpg';
import sucreF from '@/assets/wallpers/sucre.jpg';
import beniF from '@/assets/wallpers/beni.jpeg';
import pandoF from '@/assets/wallpers/pando.jpg';
import cochabambaF from '@/assets/wallpers/cocha.jpg';

const departamentos = [
  { nombre: "Pando", imagen: pandoF },
  { nombre: "Beni", imagen: beniF },
  { nombre: "La Paz", imagen: lapazF },
  { nombre: "Cochabamba", imagen: cochabambaF },
  { nombre: "Oruro", imagen: oruroF },
  { nombre: "Potosí", imagen: potosiF },
  { nombre: "Santa Cruz", imagen: santaCruzF },
  { nombre: "Chuquisaca", imagen: sucreF },
  { nombre: "Tarija", imagen: tarijaF },
];

export const Eventos = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white text-lg p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Historia de Bolivia</h2>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full justify-center">
        {departamentos.map((dep, index) => (
          <Card
            key={index}
            className=" relative overflow-hidden rounded-xl shadow-lg w-[100%] h-72 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 flex flex-col"
          >
            {/* Imagen de fondo */}
            <img src={dep.imagen} alt={dep.nombre} className="absolute inset-0 w-full h-full object-cover" />
            
            {/* Fondo oscuro para mejorar visibilidad */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white text-lg font-bold">
              <p className="text-center">{dep.nombre}</p>
              <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mx-auto">
                Ir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
