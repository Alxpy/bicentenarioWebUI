import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/service/apiservice';

// Esquema de validación
const expositorSchema = z.object({
  nombre: z.string()
    .min(3, 'Nombre debe tener al menos 3 caracteres')
    .max(100, 'Nombre no puede exceder los 100 caracteres'),
  titulo: z.string()
    .min(3, 'Título debe tener al menos 3 caracteres')
    .max(100, 'Título no puede exceder los 100 caracteres'),
  bio: z.string()
    .min(10, 'Biografía debe tener al menos 10 caracteres')
    .max(500, 'Biografía no puede exceder los 500 caracteres'),
  foto: z.string().url('Debe ser una URL válida').optional(),
});

interface iExpositor {
  id: string;
  nombre: string;
  titulo: string;
  bio: string;
  foto?: string;
}

interface FormExpositoresProps {
  eventoId?: string; // ID del evento para asociar expositores
  onSuccess: () => void;
  onBack: () => void;
}

export const FormExpositores = ({ eventoId, onSuccess, onBack }: FormExpositoresProps) => {
  const [expositores, setExpositores] = useState<iExpositor[]>([]);
  const [allExpositores, setAllExpositores] = useState<iExpositor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(expositorSchema),
    defaultValues: {
      nombre: '',
      titulo: '',
      bio: '',
      foto: ''
    }
  });

  // Cargar expositores del evento y todos los expositores disponibles
  useEffect(() => {
    const fetchExpositores = async () => {
      try {
        setLoading(true);
        
        // Si hay un eventoId, cargar sus expositores
        if (eventoId) {
          const response : any = await apiService.get(`evento_expositor/evento/${eventoId}`);
          setExpositores(response.data);
        }
        
        // Cargar todos los expositores disponibles
        const allResponse :any = await apiService.get('expositores');
        setAllExpositores(allResponse.data);
        
      } catch (error) {
        toast.error('Error al cargar expositores');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpositores();
  }, [eventoId]);

  // Agregar un nuevo expositor
  const addExpositor = async (data: Omit<iExpositor, 'id'>) => {
    try {
      setIsSubmitting(true);
      
      // Crear el expositor
      const response = await apiService.post('expositores', data);
      const newExpositor: any = response.data;
      
      // Si hay un eventoId, asociarlo al evento
      if (eventoId) {
        await apiService.post(`evento_expositor/evento`, {
          evento_id: eventoId,
          expositor_id: newExpositor.id
        });
      }
      
      // Actualizar la lista
      setExpositores([...expositores, newExpositor]);
      setAllExpositores([...allExpositores, newExpositor]);
      form.reset();
      toast.success('Expositor agregado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar expositor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar un expositor del evento
  const removeExpositor = async (expositorId: string) => {
    try {
      if (!eventoId) {
        // Si no hay eventoId, solo eliminar de la lista local
        setExpositores(expositores.filter(e => e.id !== expositorId));
        toast.info('Expositor eliminado');
        return;
      }
      
      // Eliminar la relación evento-expositor
      await apiService.delete(`evento_expositor/${eventoId}/${expositorId}`);
      
      // Actualizar la lista
      setExpositores(expositores.filter(e => e.id !== expositorId));
      toast.success('Expositor eliminado del evento');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar expositor');
    }
  };

  // Asociar un expositor existente al evento
  const addExistingExpositor = async (expositorId: string) => {
    try {
      if (!eventoId) {
        // Si no hay eventoId, no podemos asociar
        toast.warning('No se puede asociar expositor sin evento');
        return;
      }
      
      // Verificar si ya está asociado
      if (expositores.some(e => e.id === expositorId)) {
        toast.info('Este expositor ya está asociado al evento');
        return;
      }
      
      // Asociar al evento
      await apiService.post(`evento_expositor/evento/${eventoId}`, {
        expositor_id: expositorId
      });
      
      // Encontrar el expositor en la lista completa
      const expositorToAdd = allExpositores.find(e => e.id === expositorId);
      if (expositorToAdd) {
        setExpositores([...expositores, expositorToAdd]);
        toast.success('Expositor asociado al evento');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al asociar expositor');
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
      <h2 className="text-xl font-semibold">Gestión de Expositores</h2>
      
      {/* Formulario para agregar nuevo expositor */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addExpositor)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nombre completo" 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Título profesional" 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografía *</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="flex h-32 w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm"
                    placeholder="Breve biografía del expositor"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            name="foto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto (URL)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://ejemplo.com/foto.jpg" 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Volver
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Agregar Nuevo Expositor
            </Button>
          </div>
        </form>
      </Form>

      {/* Sección para agregar expositores existentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Agregar Expositor Existente</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {allExpositores
            .filter(e => !expositores.some(exp => exp.id === e.id))
            .map(expositor => (
              <div key={expositor.id} className="rounded-lg border p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{expositor.nombre}</h4>
                  <p className="text-sm text-muted-foreground">{expositor.titulo}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addExistingExpositor(expositor.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Lista de expositores asociados */}
      {expositores.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Expositores Asociados</h3>
          <div className="space-y-2">
            {expositores.map(expositor => (
              <div key={expositor.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">{expositor.nombre}</h4>
                  <p className="text-sm text-muted-foreground">{expositor.titulo}</p>
                  {expositor.bio && (
                    <p className="text-sm mt-1 line-clamp-2">{expositor.bio}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExpositor(expositor.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={onSuccess}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Guardar y Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};