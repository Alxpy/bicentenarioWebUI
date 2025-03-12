import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const CardProducto = () => {
    return (
        <div
            className="flex justify-center items-center w-[400px] h-full text-white text-lg"
        >
            <Card className="flex flex-row items-center w-[350px] h-[160px] rounded-2xl shadow-lg overflow-visible border border-gray-200 relative">
                
                <img 
                    src="http://127.0.0.1:3000/images/alexAbrigado.jpg" 
                    alt="Producto" 
                    crossOrigin="anonymous"
                    className="w-32 h-32 z-10 object-cover rounded-full absolute left-[-40px] top-1/2 transform -translate-y-1/2 border-4 border-white shadow-lg"
                />
                <div className="flex flex-col justify-between p-4 pl-20 pr-4 w-full">
                    <CardHeader className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Nombre del Producto
                        </CardTitle>
                        <p className="text-sm text-gray-500">Breve descripción del producto.</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold text-gray-800">$99.99</p>
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
