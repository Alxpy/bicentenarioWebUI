import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {  iEvento } from '@/components/interface';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export const CardProducto: React.FC<{ producto: iEvento}> = ({ producto }) => {
    const [selectedEvento, setSelectedEvento] = useLocalStorage<iEvento | null>('selectedEvento', null);
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center w-[400px] h-full text-white text-lg">
            <Card className="flex flex-row items-center w-[350px] h-[180px] rounded-2xl shadow-lg overflow-visible border border-gray-200 relative">
                
                {/* Imagen del producto */}
                <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    crossOrigin="anonymous"
                    className="w-32 h-32 z-10 object-cover rounded-full absolute left-[-40px] top-1/2 transform -translate-y-1/2 border-4 border-white shadow-lg"
                />
                
                {/* Contenido de la tarjeta */}
                <div className="flex flex-col justify-between p-4 pl-20 pr-4 w-full">
                    <CardHeader className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {producto.nombre}
                        </CardTitle>
            
                        
                        {/* fecha de inicio y fin */}
                        <p className="text-sm text-gray-500">Inicio: {new Date(producto.fecha_inicio).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Fin: {new Date(producto.fecha_fin).toLocaleDateString()}</p>
                    </CardHeader>
                    
                    <CardContent>
                        <p className="text-sm font-bold text-gray-800">${producto.nombre_ubicacion}</p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between p-4">
                        <Button variant="outline" className="text-blue-500 border-blue-500"
                            onClick={ async () => {
                                await setSelectedEvento(producto)
                                await navigate(`/evento/${producto.id}`)
                              }}>
                        
                            Ver más
                        </Button>
                     </CardFooter>
                </div>
            </Card>
        </div>
    );
};
