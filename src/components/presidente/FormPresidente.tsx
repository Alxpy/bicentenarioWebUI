import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { iPresidente, IUserGeneral } from '../interface';
import { DialogFooter } from '@/components/ui/dialog';
import { apiService } from '@/service/apiservice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PresidenteFormProps {
  initialData?: iPresidente;
}

export const PresidenteForm = ({ initialData }: PresidenteFormProps) => {
  const [modoImagen, setModoImagen] = useState<'url' | 'archivo'>('url');
  const [users, setUsers] = useState<IUserGeneral[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formData, setFormData] = useState<Omit<iPresidente, 'id'>>({
    id_usuario: 0,
    nombre: '',
    apellido: '',
    imagen: '',
    inicio_periodo: '',
    fin_periodo: '',
    bibliografia: '',
    partido_politico: '',
    principales_politicas: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get('user');
        const data : any = response.data || [];
        setUsers(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
      setPreviewUrl(rest.imagen || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (value: string) => {
    setFormData(prev => ({ ...prev, id_usuario: Number(value) }));
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
        const response :any = await apiService.postFiles('files/upload?max_file_size=10485760',imageFormData);
        imageUrl = response.data.file_url;
        console.log('Imagen subida:', imageUrl);
      }

      const payload = { ...formData, imagen: imageUrl };
      console.log('Datos del formulario:', payload);
      const method = initialData ? 'put' : 'post';
      const url = initialData ? `president/${initialData.id}` : 'president';

      await apiService[method](url, payload);
      alert(`Presidente ${initialData ? 'actualizado' : 'registrado'} con éxito`);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error al procesar la solicitud');
    }
  };

  return (
    <div className="h-[80vh] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-md text-white">
        {/* Sección de Datos Personales */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Datos Personales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre del presidente"
              />
            </div>
            
            <div>
              <Label>Apellido</Label>
              <Input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                placeholder="Apellido del presidente"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Usuario Asociado</Label>
              {loadingUsers ? (
                <Input disabled placeholder="Cargando usuarios..." />
              ) : (
                <Select onValueChange={handleSelectUser} value={formData.id_usuario?.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {`${user.nombre} ${user.apellidoPaterno}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Periodo */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Periodo Presidencial</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Inicio del Periodo</Label>
              <Input
                type="date"
                name="inicio_periodo"
                value={formData.inicio_periodo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label>Fin del Periodo</Label>
              <Input
                type="date"
                name="fin_periodo"
                value={formData.fin_periodo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Partido Político</Label>
              <Input
                name="partido_politico"
                value={formData.partido_politico}
                onChange={handleChange}
                placeholder="Nombre del partido político"
              />
            </div>
          </div>
        </div>

        {/* Sección de Imagen */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Imagen del Presidente</h2>
          
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
                alt="Vista previa"
                className="mt-2 rounded-lg shadow-md max-h-48 object-cover"
              />
            </div>
          )}
        </div>

        {/* Sección de Información Adicional */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Información Adicional</h2>
          
          <div>
            <Label>Principales Políticas</Label>
            <Textarea
              name="principales_politicas"
              value={formData.principales_politicas}
              onChange={handleChange}
              placeholder="Describa las principales políticas..."
              rows={4}
            />
          </div>
          
          <div>
            <Label>Bibliografía</Label>
            <Textarea
              name="bibliografia"
              value={formData.bibliografia}
              onChange={handleChange}
              placeholder="Información biográfica..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
            {initialData ? 'Actualizar Presidente' : 'Crear Presidente'}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};