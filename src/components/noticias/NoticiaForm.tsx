import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { apiService } from '@/service/apiservice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iNews } from '../interface';

interface NoticiaFormProps {
  initialData?: iNews;
}

interface Categoria {
  id: number;
  nombre_categoria: string;
}

export const NoticiaForm = ({ initialData }: NoticiaFormProps) => {
  const [modoImagen, setModoImagen] = useState<'url' | 'archivo'>('url');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen: '',
    id_Categoria:'',
    id_usuario: '',
    fecha_publicacion: new Date().toISOString(),
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response : any= await apiService.get('categories');
        console.log('Categorias:', response);
        const data = response.data || [];
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar categorías');
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo,
        resumen: initialData.resumen,
        contenido: initialData.contenido,
        imagen: initialData.imagen,
        id_Categoria: initialData.id_Categoria.toString(),
        id_usuario: initialData.id_usuario.toString(),
        fecha_publicacion: initialData.fecha_publicacion,
      });
      setPreviewUrl(initialData.imagen || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCategoria = (value: string) => {
    setFormData(prev => ({ ...prev, id_Categoria: value }));
  };

  const handleSelectUsuario = (value: string) => {
    setFormData(prev => ({ ...prev, id_usuario: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData(prev => ({ ...prev, fecha_publicacion: date.toISOString() }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imagen;

      if (file) {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        const response: any = await apiService.postFiles('files/upload?max_file_size=10485760', imageFormData);
        console.log('Imagen subida:', response);
        imageUrl = response.data.file_url;
      }

      const payload = { 
        ...formData, 
        imagen: imageUrl,
        id_Categoria:formData.id_Categoria,
        id_usuario: formData.id_usuario,
      };
      console.log('Payload:', payload);
      const method = initialData?.id ? 'put' : 'post';
      const url = initialData?.id ? `news/${initialData.id}` : 'news';

      await apiService[method](url, payload);
      alert(`Noticia ${initialData?.id ? 'actualizada' : 'creada'} con éxito`);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error al procesar la solicitud');
    }
  };

  return (
    <div className="h-[80vh] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-md text-white">
        {/* Sección de Información Básica */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Información Básica</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Título</Label>
              <Input
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Título de la noticia"
              />
            </div>
            
            <div>
              <Label>Resumen</Label>
              <Textarea
                name="resumen"
                value={formData.resumen}
                onChange={handleChange}
                required
                placeholder="Resumen breve de la noticia"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Contenido Completo</Label>
              <Textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                required
                placeholder="Contenido completo de la noticia"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Sección de Categoría y Fecha */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Clasificación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categoría</Label>
              {loadingCategorias ? (
                <Input disabled placeholder="Cargando categorías..." />
              ) : (
                <Select 
                  onValueChange={handleSelectCategoria} 
                  value={formData.id_Categoria.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nombre_categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div>
              <Label>Fecha de Publicación</Label>
              <Input
                type="datetime-local"
                name="fecha_publicacion"
                value={formData.fecha_publicacion.substring(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange(date);
                }}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>ID Usuario (Autor)</Label>
              <Input
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                required
                placeholder="ID del usuario autor"
                type="number"
              />
            </div>
          </div>
        </div>

        {/* Sección de Imagen */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Imagen de la Noticia</h2>
          
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
            <div>
              <Label>URL de la Imagen</Label>
              <Input
                name="imagen"
                value={formData.imagen}
                onChange={(e) => {
                  handleChange(e);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          )}

          {modoImagen === 'archivo' && (
            <div>
              <Label>Subir Archivo de Imagen</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {previewUrl && (
            <div className="mt-4">
              <Label>Vista Previa:</Label>
              <img
                src={previewUrl}
                alt="Vista previa de la noticia"
                className="mt-2 rounded-lg shadow-md max-h-48 object-cover"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
            {initialData?.id ? 'Actualizar Noticia' : 'Crear Noticia'}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};