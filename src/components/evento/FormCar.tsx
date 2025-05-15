import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo';
import { ca, id } from 'date-fns/locale';

interface TipoEvento {
  id: number;
  nombre_evento: string;
}

interface FormCarProps {
  onSuccess: (data: {
    id_tipo_evento: number;
    categoria: 'presencial' | 'virtual';
    enlace?: string;
    id_ubicacion?: number;
  }) => void;
  onBack: () => void;
  initialData?: {
    id?: number;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    precio?: number;
    nombre_evento?: string;
    id_usuario?: number;
    id_organizador?: number;
    
    id_tipo_evento?: number;
    categoria?: 'presencial' | 'virtual';
    enlace?: string;
    id_ubicacion?: number;
  };
}

export const FormCar = ({ onSuccess, onBack, initialData }: FormCarProps) => {
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    id_tipo_evento: initialData?.id_tipo_evento || 0,
    categoria: initialData?.categoria || 'presencial' as 'presencial' | 'virtual',
    enlace: initialData?.enlace || '',
    id_ubicacion: initialData?.id_ubicacion || 0
  });

  useEffect(() => {
    const cargarTiposEvento = async () => {
      try {
        const response = await apiService.get<{ data: TipoEvento[] }>('tipo_evento');
        setTiposEvento(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error cargando tipos de evento');
        console.error('Error:', error);
        setLoading(false);
      }
    };

    cargarTiposEvento();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUbicacionExitosa = () => {
    handleInputChange('id_ubicacion', JSON.parse(localStorage.getItem('ubicacion') || '').id);
    toast.success('Ubicación guardada');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id_tipo_evento: formState.id_tipo_evento,
        categoria: formState.categoria,
        ...(formState.categoria === 'virtual' && { enlace: formState.enlace }),
        ...(formState.categoria === 'presencial' && { id_ubicacion: formState.id_ubicacion })
      };

      // Simular llamada API
      console.log('Datos enviados:', payload);
      await apiService.post('evento', {
        nombre: initialData?.nombre || '',
        descripcion: initialData?.descripcion || '',
        imagen: initialData?.imagen || '',
        fecha_inicio: initialData?.fecha_inicio || '',
        fecha_fin: initialData?.fecha_fin || '',
        id_tipo_evento: formState.id_tipo_evento,
        id_ubicacion: formState.id_ubicacion,
        precio: initialData?.precio || 0,
        nombre_evento: initialData?.nombre_evento || '',
        id_usuario: initialData?.id_usuario || 2,
        id_organizador: initialData?.id_organizador || 2,
        categoria: formState.categoria,
        enlace: formState.enlace        

      }).then((response) => {
        console.log('Respuesta de la API:', response);
          localStorage.setItem('idEvento', response.data.id);
          toast.success('Evento guardado correctamente');
        
      }
      ).catch((error) => {
        console.error('Error al guardar el evento:', error);
        toast.error('Error al guardar el evento');
      });
      // Llamada real a la API
      // await apiService.post('evento', payload);
      
      onSuccess(payload);
      toast.success('Evento guardado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tipo de Evento */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Evento *</label>
        <Select
          value={formState.id_tipo_evento.toString()}
          onValueChange={value => handleInputChange('id_tipo_evento', Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            {tiposEvento.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.id.toString()}>
                {tipo.nombre_evento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Categoría *</label>
        <Select
          value={formState.categoria}
          onValueChange={value => handleInputChange('categoria', value as 'presencial' | 'virtual')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formState.categoria === 'virtual' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Enlace de reunión *</label>
          <Input
            placeholder="https://meet.example.com"
            value={formState.enlace}
            onChange={(e) => handleInputChange('enlace', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicación *</label>
          <div className="rounded-lg border p-4">
            <MapaInteractivo 
              onSucces={handleUbicacionExitosa}
              ubicacionInicial={formState.id_ubicacion}
            />
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Volver
        </Button>
        <Button
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700"
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            'Guardar Evento'
          )}
        </Button>
      </div>
    </div>
  );
};