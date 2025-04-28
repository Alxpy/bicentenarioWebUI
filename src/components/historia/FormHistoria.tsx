import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/service/apiservice';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface iCategorias {
  id: number
  nombre: string
  descripcion: string

}

const formSchema = z.object({
  titulo: z.string().min(2, 'Título muy corto'),
  descripcion: z.string().min(10, 'Descripción muy corta'),
  fecha_inicio: z.string().date(),
  fecha_fin: z.string().date(),
  imagen: z.string().url('URL de imagen inválida').optional(),
  id_categoria: z.coerce.number().min(1, 'Selecciona una categoría')
})

export const FormHistoria = ({ initialData, setCreateUbi }: { initialData?: any, setCreateUbi?: (value: boolean) => void }) => {
  const [categorias, setCategorias] = useState<iCategorias[]>([])
  const [loading, setLoading] = useState(false)
  const [modoImagen, setModoImagen] = useState<'url' | 'archivo'>('url')
  const [archivoTemporal, setArchivoTemporal] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  console.log(initialData)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      imagen: '',
      archivo: undefined,
      id_categoria: 0,
      id_ubicacion: 0
    }
  })

  useEffect(() => {
    fetchCategorias()
    if (initialData) {
      form.reset(initialData)
      setPreviewUrl(initialData.imagen)
    }
  }, [])

  const fetchCategorias = async () => {
    setLoading(true)
    try {
      const response = await apiService.get('historyCategories')
      setCategorias(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArchivoTemporal(file)
      setPreviewUrl(URL.createObjectURL(file))
      form.setValue("imagen",URL.createObjectURL(file)); // Actualiza el valor en react-hook-form
      form.clearErrors("imagen"); // Limpia errores
    }
  }

  const uploadImage = async () => {
    if (!archivoTemporal) return ''

    const imageFormData = new FormData()
    imageFormData.append('file', archivoTemporal)

    try {
      const response = await apiService.postFiles('files/upload?max_file_size=10485760', imageFormData)
      return response.data.file_url
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      return ''
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let imageUrl = values.imagen || '';

      if (archivoTemporal) {
        imageUrl = await uploadImage();
      }
      
      let data = {
        ...values,
        imagen: imageUrl,
      };

      if (initialData) {
        data = {
          ...values,
          id_ubicacion: initialData.id_ubicacion,
        }
        console.log('actualizando historia', data)
        await apiService.put(`history/${initialData.id}`, data);
        // Manejar éxito de actualización
        alert('Historia actualizada correctamente');
      } else {
        // Guardar en localStorage y cambiar estado
        localStorage.setItem('historia', JSON.stringify(data));

        // Resetear formulario después de guardar
        form.reset();
        setPreviewUrl('');
        setArchivoTemporal(null);

         setCreateUbi &&  setCreateUbi(true);
        

        // Opcional: Recargar datos o redirigir
        alert('Historia creada correctamente');
      }

    } catch (error) {
      console.error('Error guardando historia:', error);
      alert('Error al guardar la historia');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Título */}
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título de la historia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Descripción */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción detallada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Fecha Fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Selector de Categoría */}
        <FormField
          control={form.control}
          name="id_categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sección de Imagen */}
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={modoImagen === 'url' ? 'default' : 'outline'}
              onClick={() => setModoImagen('url')}
            >
              Usar URL
            </Button>
            <Button
              type="button"
              variant={modoImagen === 'archivo' ? 'default' : 'outline'}
              onClick={() => setModoImagen('archivo')}
            >
              Subir Archivo
            </Button>
          </div>

          {modoImagen === 'url' && (
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
                      onChange={(e) => {
                        field.onChange(e)
                        setPreviewUrl(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {modoImagen === 'archivo' && (
            <div>
              <FormLabel>Subir Archivo</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          )}

          {previewUrl && (
            <div className="mt-4">
              <FormLabel>Vista Previa</FormLabel>
              <img
                src={previewUrl}
                alt="Vista previa"
                className="mt-2 rounded-lg shadow-md max-h-48 w-full object-cover border"
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            'Procesando...'
          ) : initialData ? (
            'Actualizar Historia'
          ) : (
            'Crear Nueva Historia'
          )}
        </Button>
      </form>
    </Form>
  )
}