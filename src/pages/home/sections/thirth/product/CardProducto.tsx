import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Star } from 'lucide-react';
import { iShowProducto } from '@/components/interface';


export const CardProducto: React.FC<{ producto: iShowProducto }> = ({ producto }) => {
    const [rating, setRating] = useState(producto.calificacion); // Inicializa con la calificación del producto

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
                        <p className="text-sm text-gray-500">{producto.descripcion}</p>
                        
                        {/* Sección de calificación */}
                        <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 cursor-pointer ${
                                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                                    }`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <p className="text-xl font-bold text-gray-800">${producto.precio.toFixed(2)}</p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between p-4">
                        <Button variant="outline" className="text-blue-500 border-blue-500">
                            Ver más
                        </Button>
                        <Button className="bg-blue-500 text-white">Comprar</Button>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};
