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
import { iPatrocinador } from '@/components/interface';
import useLocalStorage from '@/hooks/useLocalStorage';
// Esquema de validación
const patrocinadorSchema = z.object({
  nombre: z.string()
    .min(3, 'Nombre debe tener al menos 3 caracteres')
    .max(100, 'Nombre no puede exceder los 100 caracteres'),
  contacto: z.string()
    .min(3, 'Contacto debe tener al menos 3 caracteres')
    .max(100, 'Contacto no puede exceder los 100 caracteres'),
  imagen: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
});

interface FormPatrocinadoresProps {

  onSuccess: () => void;
  onBack: () => void;
  initialData?: iPatrocinador[];
}

export const FormPatrocinadores = ({ onSuccess, onBack, initialData = [] }: FormPatrocinadoresProps) => {
  const [patrocinadores, setPatrocinadores] = useState<iPatrocinador[]>([]);
  const [allPatrocinadores, setAllPatrocinadores] = useState<iPatrocinador[]>([
    {
      id: 0,
      nombre: '',
      contacto: '',
      imagen: ''
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [eventoId] = useLocalStorage('idEvento', null);
  console.log('Evento ID:', eventoId);
  const form = useForm({
    resolver: zodResolver(patrocinadorSchema),
    defaultValues: {
      nombre: '',
      contacto: '',
      imagen: ''
    }
  });

  const fetchPatrocinadores = async () => {
    try {
      setLoading(true);

      // Cargar patrocinadores del evento si hay eventoId
      if (eventoId) {
        await apiService.get(`patrocinador_evento/evento/${eventoId}`).then((response: any) => {
          setPatrocinadores(response.data || []); // Asegurar array vacío si es null
        }
        ).catch((error: any) => {
          toast.error('Error al cargar patrocinadores del evento');
          console.error('Error:', error);
        }
        );

      }



    } catch (error) {
      toast.error('Error al cargar patrocinadores');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPatrocinadores = async () => {
    await apiService.get('patrocinadores').then((response: any) => {
      console.log('Todos los patrocinadores:', response);
      setAllPatrocinadores(response.data);
    }).catch((error: any) => {
      toast.error('Error al cargar todos los patrocinadores');
      console.error('Error:', error);
    });

  }

  // Cargar patrocinadores al montar el componente
  useEffect(() => {
    // Cargar todos los patrocinadores disponibles


    fetchPatrocinadores();
  }, [eventoId]);

  useEffect(() => {
    fetchAllPatrocinadores();
  }, []);

  // Manejar cambio de archivo de imagen
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

  // Subir imagen al servidor
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: any = await apiService.postFiles('files/upload?max_file_size=10485760', formData);
      return response.data.file_url;
    } catch (error) {
      toast.error('Error subiendo imagen');
      throw error;
    }
  };

  // Agregar nuevo patrocinador
  const addPatrocinador = async (data: { nombre: string; contacto: string; imagen?: string }) => {
    try {
      setIsSubmitting(true);

      // Subir imagen si se seleccionó un archivo
      let imageUrl = data.imagen === '#uploaded-file' && selectedFile
        ? await uploadImage(selectedFile)
        : data.imagen;

      // Crear el patrocinador
      const response = await apiService.post('patrocinadores', {
        nombre: data.nombre,
        contacto: data.contacto,
        imagen: imageUrl || ''
      });
      const newPatrocinador: any = response.data;
      console.log('Nuevo patrocinador:', newPatrocinador);
      // Si hay un eventoId, asociarlo al evento
      if (eventoId) {
        await apiService.post(`patrocinador_evento`, {
          id_evento: eventoId,
          id_patrocinador: newPatrocinador.id
        });
      }

      // Actualizar la lista
      fetchAllPatrocinadores();
      fetchPatrocinadores();
      form.reset();
      setSelectedFile(null);
      setPreviewUrl('');
      toast.success('Patrocinador agregado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar patrocinador');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Asociar patrocinador existente al evento
  const addExistingPatrocinador = async (patrocinadorId: number) => {
    try {
      if (!eventoId) {
        toast.warning('No se puede asociar patrocinador sin evento');
        return;
      }

      // Verificar si ya está asociado
      if (patrocinadores.some(p => p.id === patrocinadorId)) {
        toast.info('Este patrocinador ya está asociado al evento');
        return;
      }

      // Asociar al evento
      await apiService.post(`patrocinador_evento`, {
        id_evento: eventoId,
          id_patrocinador:  patrocinadorId
      });

      // Encontrar el patrocinador en la lista completa
      const patrocinadorToAdd = allPatrocinadores.find(p => p.id === patrocinadorId);
      if (patrocinadorToAdd) {
        setPatrocinadores([...patrocinadores, patrocinadorToAdd]);
        toast.success('Patrocinador asociado al evento');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al asociar patrocinador');
    }
  };

  // Eliminar patrocinador del evento
  const removePatrocinador = async (patrocinadorId: number) => {
    try {
      if (!eventoId) {
        // Si no hay eventoId, solo eliminar de la lista local
        setPatrocinadores(patrocinadores.filter(p => p.id !== patrocinadorId));
        toast.info('Patrocinador eliminado');
        return;
      }

      // Eliminar la relación evento-patrocinador
      await apiService.delete(`evento_patrocinador/${eventoId}/${patrocinadorId}`);

      // Actualizar la lista
      setPatrocinadores(patrocinadores.filter(p => p.id !== patrocinadorId));
      toast.success('Patrocinador eliminado del evento');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar patrocinador');
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
      <h2 className="text-xl font-semibold">Gestión de Patrocinadores</h2>

      {/* Formulario para agregar nuevo patrocinador */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => addPatrocinador({ ...data, imagen: data.imagen || '' }))} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nombre del patrocinador"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email o teléfono"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección de Imagen */}
          <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
            <h3 className="text-base font-medium">Logo del Patrocinador</h3>

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
                name="imagen"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>URL del Logo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://ejemplo.com/logo.jpg"
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
              <FormItem className="mt-4">
                <FormLabel>Subir Logo</FormLabel>
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
                <div className="relative h-40 overflow-hidden rounded-lg border">
                  <img
                    src={previewUrl}
                    alt="Previsualización del logo"
                    className="h-full w-full object-contain"
                    onError={() => setPreviewUrl('')}
                  />
                </div>
              </div>
            )}
          </div>

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
              Agregar Nuevo Patrocinador
            </Button>
          </div>
        </form>
      </Form>

      {/* Sección para agregar patrocinadores existentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Agregar Patrocinador Existente</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {allPatrocinadores
            .filter(p => !patrocinadores.some(pat => pat.id === p.id))
            .map(patrocinador => (
              <div key={patrocinador.id} className="rounded-lg border p-4 flex flex-col">
                {patrocinador.imagen && (
                  <div className="h-20 mb-2 flex items-center justify-center">
                    <img
                      src={patrocinador.imagen}
                      alt={patrocinador.nombre}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h4 className="font-medium text-center">{patrocinador.nombre}</h4>
                  <p className="text-sm text-muted-foreground text-center">{patrocinador.contacto}</p>
                </div>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => addExistingPatrocinador(patrocinador.id)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Asociar
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Lista de patrocinadores asociados */}
      {patrocinadores.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Patrocinadores Asociados</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {patrocinadores.map(patrocinador => (
              <div key={patrocinador.id} className="rounded-lg border p-4 flex flex-col">
                {patrocinador.imagen && (
                  <div className="h-20 mb-2 flex items-center justify-center">
                    <img
                      src={patrocinador.imagen}
                      alt={patrocinador.nombre}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h4 className="font-medium text-center">{patrocinador.nombre}</h4>
                  <p className="text-sm text-muted-foreground text-center">{patrocinador.contacto}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-500 hover:text-red-600"
                  onClick={() => removePatrocinador(patrocinador.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
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