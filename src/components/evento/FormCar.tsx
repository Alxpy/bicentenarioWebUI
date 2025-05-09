import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo';

interface iTipoEvento {
  id: number;
  nombre_evento: string;
}

interface iUbicacion {
  id: number;
  // otras propiedades de ubicación si las hay
}

interface FormCarProps {
  onSuccess: (data: { 
    id_tipo_evento?: number; 
    modalidad?: string; 
    enlace?: string;
    id_ubicacion?: number;
  }) => void;
  onBack: () => void;
  initialData?: {
    id_tipo_evento?: number;
    modalidad?: string;
    enlace?: string;
    id_ubicacion?: number;
  };
}

const formSchema = z.object({
  id_tipo_evento: z.number({
    required_error: "Seleccione un tipo de evento",
    invalid_type_error: "Seleccione un tipo válido"
  }).min(1, "Seleccione un tipo de evento"),
  modalidad: z.enum(['presencial', 'virtual'], {
    required_error: "Seleccione una modalidad",
  }),
  enlace: z.string().superRefine((val, ctx) => {
    if (ctx.parent.modalidad === 'virtual') {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enlace es requerido para eventos virtuales",
        });
      } else if (!z.string().url().safeParse(val).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingrese una URL válida",
        });
      }
    }
    return z.void();
  }).optional(),
  id_ubicacion: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

export const FormCar = ({ onSuccess, onBack, initialData }: FormCarProps) => {
  const [tipoEventos, setTipoEventos] = useState<iTipoEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ubicacion, setUbicacion] = useLocalStorage<iUbicacion | null>('ubicacion', null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_tipo_evento: initialData?.id_tipo_evento || undefined,
      modalidad: initialData?.modalidad as 'presencial' | 'virtual' || undefined,
      enlace: initialData?.enlace || '',
      id_ubicacion: initialData?.id_ubicacion || undefined
    }
  });

  const modalidad = form.watch('modalidad');

  // Cargar tipos de evento al montar el componente
  useEffect(() => {
    const fetchTipoEventos = async () => {
      try {
        const response: any = await apiService.get('tipo_evento');
        setTipoEventos(response.data);
      } catch (error) {
        toast.error('Error al cargar tipos de evento');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipoEventos();
  }, []);

  // Cargar ubicación inicial si existe
  useEffect(() => {
    if (ubicacion) {
      form.setValue('id_ubicacion', ubicacion.id);
    }
  }, [ubicacion, form]);

  const handleUbicacionSuccess = () => {
    
    form.setValue('id_ubicacion', ubicacion.id);
    toast.success('Ubicación guardada');
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Preparar datos para enviar
      const data = {
        id_tipo_evento: values.id_tipo_evento,
        modalidad: values.modalidad,
        ...(values.modalidad === 'virtual' && { enlace: values.enlace }),
        ...(values.modalidad === 'presencial' && { id_ubicacion: values.id_ubicacion })
      };

      onSuccess(data);
      toast.success('Configuración guardada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la configuración');
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Evento */}
        <FormField
          control={form.control}
          name="id_tipo_evento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoEventos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre_evento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modalidad */}
        <FormField
          control={form.control}
          name="modalidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalidad *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la modalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Enlace (condicional para virtual) o Mapa (para presencial) */}
        {modalidad === 'virtual' ? (
          <FormField
            control={form.control}
            name="enlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlace de la reunión virtual *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground mt-1">
                  Ingrese el enlace de Zoom, Google Meet, Teams, etc.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="space-y-2">
            <FormLabel>Ubicación del evento *</FormLabel>
            <div className="rounded-lg border p-4">
              <MapaInteractivo 
                onSucces={handleUbicacionSuccess}
              />
            </div>
            {form.formState.errors.id_ubicacion && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.id_ubicacion.message}
              </p>
            )}
            {ubicacion && (
              <p className="text-sm text-muted-foreground">
                Ubicación seleccionada correctamente
              </p>
            )}
          </div>
        )}

        {/* Botones de acción */}
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
            type="submit"
            disabled={isSubmitting || (modalidad === 'presencial' && !ubicacion)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              'Continuar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};