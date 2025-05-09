import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { iEventoCreate } from '@/components/interface';
import { Loader2 } from 'lucide-react';

// Esquema de validación mejorado
const formSchema = z.object({
  nombre: z.string()
    .min(3, 'Nombre debe tener al menos 3 caracteres')
    .max(100, 'Nombre no puede exceder los 100 caracteres'),
  descripcion: z.string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(500, 'Descripción no puede exceder los 500 caracteres'),
  imagen: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
  fecha_inicio: z.string()
    .refine(val => !val || !isNaN(new Date(val).getTime()), { 
      message: 'Fecha inválida' 
    }),
  fecha_fin: z.string()
    .refine(val => !val || !isNaN(new Date(val).getTime()), { 
      message: 'Fecha inválida' 
    }),
  precio: z.string()
    .refine(val => !val || /^\d+(\.\d{1,2})?$/.test(val), {
      message: 'Precio debe ser un número con hasta 2 decimales'
    })
    .optional(),
}).refine(data => {
  // Validar que fecha_fin no sea anterior a fecha_inicio
  if (data.fecha_inicio && data.fecha_fin) {
    return new Date(data.fecha_fin) >= new Date(data.fecha_inicio);
  }
  return true;
}, {
  message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
  path: ['fecha_fin']
});

type FormValues = z.infer<typeof formSchema>;

interface FormEventoProps {
  initialData?: Partial<iEventoCreate>;
  onSuccess: (data: Partial<iEventoCreate>) => void;
}

export const FormGen = ({ onSuccess, initialData }: FormEventoProps) => {
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      imagen: initialData?.imagen || '',
      fecha_inicio: initialData?.fecha_inicio?.split('T')[0] || '',
      fecha_fin: initialData?.fecha_fin?.split('T')[0] || '',
      precio: initialData?.precio || '',
    }
  });

  // Cargar datos iniciales y preview de imagen
  useEffect(() => {
    if (initialData) {
      form.reset({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        imagen: initialData.imagen || '',
        fecha_inicio: initialData.fecha_inicio?.split('T')[0] || '',
        fecha_fin: initialData.fecha_fin?.split('T')[0] || '',
        precio: initialData.precio || '',
      });
      
      if (initialData.imagen) {
        setPreviewUrl(initialData.imagen);
        setImageMode('url');
      }
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo y tamaño de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('La imagen no puede exceder los 10MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue('imagen', '#uploaded-file');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.postFiles('files/upload?max_file_size=10485760', formData);
      return response.data.file_url;
    } catch (error) {
      toast.error('Error subiendo imagen');
      throw error;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Subir imagen si se seleccionó un archivo
      let imageUrl = values.imagen === '#uploaded-file' && selectedFile 
        ? await uploadImage(selectedFile) 
        : values.imagen;

      // Preparar payload
      const payload: Partial<iEventoCreate> = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        ...(imageUrl && { imagen: imageUrl }),
        ...(values.fecha_inicio && { fecha_inicio: `${values.fecha_inicio}T00:00:00` }),
        ...(values.fecha_fin && { fecha_fin: `${values.fecha_fin}T23:59:59` }),
        ...(values.precio && { precio: values.precio }),
      };

      onSuccess(payload);
      toast.success('Datos generales guardados correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar los datos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Nombre del Evento */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Nombre del Evento *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Festival Cultural Andino"
                  {...field}
                  disabled={isSubmitting}
                  className="rounded-lg bg-muted/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fechas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-lg bg-muted/50"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Fecha de Fin</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-lg bg-muted/50"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    min={form.watch('fecha_inicio')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Descripción *</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Descripción detallada del evento..."
                  {...field}
                  disabled={isSubmitting}
                  className="flex h-32 w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sección de Imagen */}
        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
          <h3 className="text-base font-medium">Imagen del Evento</h3>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant={imageMode === 'url' ? 'default' : 'outline'}
              onClick={() => setImageMode('url')}
              className="flex-1 rounded-lg"
            >
              🖼️ Usar URL
            </Button>
            <Button
              type="button"
              variant={imageMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setImageMode('upload')}
              className="flex-1 rounded-lg"
            >
              📤 Subir Imagen
            </Button>
          </div>

          {imageMode === 'url' && (
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        field.onChange(e);
                        setPreviewUrl(e.target.value);
                      }}
                      className="rounded-lg bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {imageMode === 'upload' && (
            <FormItem className="mt-4">
              <FormLabel>Subir Imagen</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-lg border bg-muted/50 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-accent-foreground"
                />
              </FormControl>
              <p className="text-sm text-muted-foreground mt-1">
                Formatos soportados: JPG, PNG, WEBP. Máx. 10MB
              </p>
              <FormMessage />
            </FormItem>
          )}

          {previewUrl && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Vista previa:</p>
              <div className="relative aspect-video overflow-hidden rounded-lg border">
                <img
                  src={previewUrl}
                  alt="Previsualización del evento"
                  className="h-full w-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Precio */}
        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Precio de Entrada</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    placeholder="0.00"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-lg bg-muted/50 pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de enviar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-amber-600 px-8 hover:bg-amber-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              'Guardar Datos'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};