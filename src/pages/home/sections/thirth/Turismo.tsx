import React from "react";
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/apiservice";

export const Eventos = () => {
  const [historias, setHistorias] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const response = await apiService.get('history');
        // Filtrar historias que tengan título y descripción
        const historiasValidas = response.data.filter(
          (historia: any) => historia.titulo && historia.descripcion
        );
        
        // Mezclar las historias y tomar las primeras 9
        const historiasAleatorias = shuffleArray(historiasValidas).slice(0, 6);
        setHistorias(historiasAleatorias);
      } catch (error) {
        console.error("Error al obtener historias:", error);
        setHistorias([]);
      }
    };

    fetchHistorias();
  }, []);

  // Función para mezclar un array (Fisher-Yates shuffle)
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Imagen de placeholder si no hay imagen en la historia
  const getPlaceholderImage = (nombreUbicacion: string) => {
    // Puedes reemplazar esto con tus imágenes locales si lo prefieres
    return `https://source.unsplash.com/random/300x200/?${encodeURIComponent(nombreUbicacion || 'bolivia')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white text-lg p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Historias de Bolivia</h2>

      {historias.length === 0 ? (
        <p className="text-center">Cargando historias...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full justify-center">
          {historias.map((historia, index) => (
            <Card
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg w-[100%] h-96 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 flex flex-col"
            >
              {/* Imagen de fondo */}
              <img 
                src={historia.imagen || getPlaceholderImage(historia.nombre_ubicacion)} 
                alt={historia.titulo} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              
              {/* Fondo oscuro para mejorar visibilidad */}
              <div className="absolute inset-0 bg-black opacity-50"></div>

              {/* Contenido */}
              <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2">{historia.titulo}</h3>
                  <p className="text-sm line-clamp-3">{historia.descripcion}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{historia.nombre_ubicacion}</span>
                    <span>{new Date(historia.fecha_inicio).toLocaleDateString()}</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full">
                    Ver más
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};