import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/service/apiservice';
import { Loader2, Trash2, ImageIcon, VideoIcon } from 'lucide-react';

export interface IMultimedia {
  id: number;
  enlace: string;
  tipo: 'imagen' | 'video';
  id_historia?: number;
}

export interface IMultimediaCultura {
  id_multimedia: number;
  id_cultura: number;
  enlace: string;
  tipo: string;
}


type NewItemType = {
  tipo: 'imagen' | 'video';
  url?: string;
  file?: File | null;
  method: 'url' | 'upload';
  preview?: string;
};

interface MultimediaProps {
  culturaId: number;
}

export const Multimedia = ({ culturaId }: MultimediaProps) => {
  const [multimediaItems, setMultimediaItems] = useState<IMultimediaCultura[]>([]);
  const [newItem, setNewItem] = useState<NewItemType>({
    tipo: 'imagen',
    method: 'url',
    url: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<IMultimedia | null>(null);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsGalleryLoading(true);
    try {
      const response = await apiService.get<IMultimediaCultura[]>(`multimedia_cultura/byCulturaId/${culturaId}`);
      const sortedItems = response.data.sort((a, b) => b.id_multimedia - a.id_multimedia);
      setMultimediaItems(sortedItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsGalleryLoading(false);
    }
  }, [culturaId]);

  useEffect(() => {
    if (culturaId) fetchData();
  }, [fetchData, culturaId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    if (e.target.files?.[0]) {
      console.log('File selected:', e.target.files[0]);
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setNewItem(prev => ({
        ...prev,
        file,
        url: undefined,
        preview: prev.tipo === 'imagen' ? preview : undefined
      }));
    }
  };

  const handleSaveItem = async () => {
    console.log('Saving item:', newItem, 'id', culturaId);
    if (!culturaId) return;
    setIsLoading(true);
    console.log('Saving item:', newItem);
    try {
      let fileUrl = newItem.url;

      // Subir archivo si es necesario
      if (newItem.method === 'upload' && newItem.file) {
        const formData = new FormData();
        formData.append('file', newItem.file);

        const uploadResponse: any = await apiService.postFiles('files/upload?max_file_size=10485760', formData);
        fileUrl = uploadResponse.data.file_url;
      }

      // Crear/Actualizar multimedia
      let multimediaId = editingItem?.id;
      if (editingItem) {
        const updatedMedia = await apiService.put<IMultimedia>(`multimedia/${editingItem.id}`, {
          url: fileUrl,
          tipo: newItem.tipo
        });
        multimediaId = updatedMedia.data.id;
      } else {
        const newMedia = await apiService.post<IMultimedia>('multimedia', {
          enlace: fileUrl,
          tipo: newItem.tipo
        });
        multimediaId = newMedia.data.id;
      }

      // Asociar con historia
      if (multimediaId && !editingItem) {
        await apiService.post('multimedia_cultura', {
          id_cultura: culturaId,
          id_multimedia: multimediaId
        });
      }

      await fetchData();
      cancelEditing();
    } catch (error) {
      console.error('Error saving multimedia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      await apiService.delete(`multimedia_cultura/${id}`);
      await apiService.delete(`multimedia/${id}`);
      setMultimediaItems(prev => prev.filter(item => item.id_multimedia !== id));
    } catch (error) {
      console.error('Error deleting multimedia:', error);
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setNewItem({
      tipo: 'imagen',
      method: 'url',
      url: '',
      file: null,
      preview: undefined
    });
  };

  return (
    <div className="space-y-8">
      {/* Formulario de edición */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-800 mb-6">
          {editingItem ? 'Editar elemento' : 'Nuevo elemento multimedia'}
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Selector de tipo y método */}
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600 dark:text-slate-400">Tipo de contenido</Label>
              <Select
                value={newItem.tipo}
                onValueChange={(value: 'imagen' | 'video') => setNewItem(prev => ({
                  ...prev,
                  tipo: value,
                  preview: undefined
                }))}
              >
                <SelectTrigger className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imagen" className="hover:bg-slate-100">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Imagen
                    </div>
                  </SelectItem>
                  <SelectItem value="video" className="hover:bg-slate-100">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="h-4 w-4" />
                      Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-600 dark:text-slate-400">Método de carga</Label>
              <div className="flex gap-2">
                <Button
                  variant={newItem.method === 'url' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setNewItem(prev => ({
                    ...prev,
                    method: 'url',
                    file: null,
                    preview: undefined
                  }))}
                >
                  Usar URL
                </Button>
                <Button
                  variant={newItem.method === 'upload' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setNewItem(prev => ({
                    ...prev,
                    method: 'upload',
                    url: ''
                  }))}
                >
                  Subir archivo
                </Button>
              </div>
            </div>
          </div>

          {/* Input de contenido */}
          <div className="space-y-4">
            <Label className="text-slate-600 dark:text-slate-400">
              {newItem.method === 'url' ? 'URL del contenido' : 'Seleccionar archivo'}
            </Label>

            {newItem.method === 'url' ? (
              <div className="space-y-2">
                <Input
                  value={newItem.url || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://ejemplo.com/contenido.jpg"
                  className="bg-white dark:bg-slate-800"
                />
                {newItem.url && newItem.tipo === 'imagen' && (
                  <div className="border rounded-lg p-2">
                    <img
                      src={newItem.url}
                      alt="Vista previa"
                      className="h-32 w-full object-contain rounded"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="bg-white dark:bg-slate-800"
                />
                {newItem.preview && newItem.tipo === 'imagen' && (
                  <div className="border rounded-lg p-2">
                    <img
                      src={newItem.preview}
                      alt="Vista previa"
                      className="h-32 w-full object-contain rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {editingItem && (
            <Button
              variant="ghost"
              onClick={cancelEditing}
              className="text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleSaveItem}
            disabled={isLoading || (!newItem.url && !newItem.file)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* Galería */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">
          Galería Multimedia
        </h3>

        {isGalleryLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : multimediaItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No hay elementos multimedia disponibles
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {multimediaItems.map((item) => (
              <div
                key={item.id_multimedia}
                className="group relative border rounded-lg overflow-hidden bg-white dark:bg-slate-800 hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative">
                  {item.tipo === 'imagen' ? (
                    <img
                      src={item.enlace}
                      alt="Multimedia"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        (e.target as HTMLImageElement).classList.add('object-contain', 'p-2');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoIcon className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                      {item.tipo}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id_multimedia)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.enlace}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};