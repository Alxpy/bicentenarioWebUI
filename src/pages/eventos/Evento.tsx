import React from 'react';
import { apiService } from '@/service/apiservice';
import { iEvento } from '@/components/interface';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, User, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/templates/MainLayout';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export const EventosList = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = React.useState<iEvento[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [selectedEvento, setSelectedEvento] = useLocalStorage<iEvento | null>('selectedEvento', null);

  const formatDateToDDMMYYYY = (isoDate: string): string => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate; 

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

  const fetchEventos = async () => {
    setRefreshing(true);
    try {
      const response = await apiService.get('evento');
      const data: iEvento[] = response.data;
      setEventos(data);
    } catch (error) {
      console.error('Error fetching eventos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchEventos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Próximos Eventos</h1>
        <Button 
          variant="outline" 
          onClick={fetchEventos}
          disabled={refreshing}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay eventos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <Card key={evento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    src={evento.imagen || '/placeholder-event.jpg'}
                    alt={evento.nombre}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle>{evento.nombre}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {evento.descripcion}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDateToDDMMYYYY(evento.fecha_inicio)} - {formatDateToDDMMYYYY(evento.fecha_fin)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{evento.nombre_ubicacion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{evento.nombre_organizador}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Responsable: {evento.nombre_usuario}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {evento.nombre_evento}
                </span>
                <Button variant="outline" size="sm"
                onClick={ async () => {
                  await setSelectedEvento(evento)
                  await navigate(`/evento/${evento.id}`)
                }}>
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
};