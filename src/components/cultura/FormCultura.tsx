import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { ICultura } from '@/components/interface';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  imagen: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormCulturaProps {
  initialData?: ICultura;
  setCreateUbi?: (value: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FormCultura = ({ initialData, setCreateUbi,onSuccess, onCancel }: FormCulturaProps) => {
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      imagen: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setPreviewUrl(initialData.imagen || '');
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue('imagen', '#uploaded-file');
    }
  };

  const uploadImage = async (file: File) => {
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
      let imageUrl = values.imagen;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const payload = {
        ...values,
        imagen: imageUrl || '',
        id_ubicacion: initialData?.id_ubicacion ||0
      };

      if (initialData) {
        await apiService.put(`cultures/${initialData.id}`, payload);
        toast.success('Cultura actualizada correctamente');
      } else {
        localStorage.setItem('cultura', JSON.stringify(payload));
        toast.success('Cultura creada correctamente');
        setCreateUbi &&  setCreateUbi(true);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(initialData ? 'Error actualizando cultura' : 'Error creando cultura');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Cultura</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Danza Tradicional Aymara"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input
                  placeholder="Descripción detallada de la cultura..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant={imageMode === 'url' ? 'default' : 'outline'}
              onClick={() => setImageMode('url')}
              className="flex-1"
            >
              Usar URL
            </Button>
            <Button
              type="button"
              variant={imageMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setImageMode('upload')}
              className="flex-1"
            >
              Subir Imagen
            </Button>
          </div>

          {imageMode === 'url' && (
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {imageMode === 'upload' && (
            <FormItem>
              <FormLabel>Subir Imagen</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.imagen?.message}
              </FormMessage>
            </FormItem>
          )}

          {previewUrl && (
            <div className="mt-4 border rounded-lg p-2">
              <p className="text-sm font-medium mb-2">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Previsualización"
                className="rounded-md object-contain max-h-48 w-full"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </span>
            ) : initialData ? (
              'Guardar Cambios'
            ) : (
              'Crear Nueva Cultura'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};