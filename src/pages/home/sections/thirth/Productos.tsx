import React from "react";
import SelectCategorias from "./product/SelectCategorias";
import  CarrouselProducto  from "./product/CarrouselProducto";
export const Productos = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white text-lg">
      <h2 className="text-2xl font-bold">Productos</h2>
      <SelectCategorias />
      <CarrouselProducto />
    </div>
  );
};
