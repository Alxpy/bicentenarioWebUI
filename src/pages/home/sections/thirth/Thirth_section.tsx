import React from "react";
import { Productos } from "./Productos";
import { Eventos } from "./Turismo";
import { Separator } from "@/components/ui/separator";
import logo_black from "@/assets/wallpers/logo_header_balck.png"

export const Thirth_section = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-black to-blue-900 p-6">
   
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img src={logo_black} alt="Logo Marca de Agua" className="w-1/2 md:w-1/3" />
      </div>

      <div className="relative w-full md:w-1/2 flex justify-center">
        <Eventos />
      </div>

      <Separator orientation="vertical" />

      <div className="relative w-full md:w-1/2 flex justify-center">
        <Productos />
      </div>
    </section>
  );
};

