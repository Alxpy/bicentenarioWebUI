import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { libroAdminEditAtom } from '@/context/context';
import { ILibro, ITipo } from '../interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiPlus } from 'react-icons/fi';

interface Props {
  tipos: ITipo[];
  onGuardar: (libro: ILibro) => void;
  onAgregarTipo: (nuevoNombre: string) => void;
}

export const FormBiblioteca = ({ tipos, onGuardar, onAgregarTipo }: Props) => {
  const [libro,] = useAtom(libroAdminEditAtom);
  const [formData, setFormData] = useState<ILibro>(libro || {
    id: 0,
    titulo: '',
    autor: '',
    imagen: '',
    fecha_publicacion: '',
    edicion: '',
    id_tipo: 0,
    fuente: '',
    enlace: ''
  });

  const [mostrarNuevoTipo, setMostrarNuevoTipo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');

  useEffect(() => {
    if (libro) setFormData(libro);
  }, [libro]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(formData);
  };

  const handleAgregarTipo = () => {
    if (nuevoTipo.trim()) {
      onAgregarTipo(nuevoTipo.trim());
      setNuevoTipo('');
      setMostrarNuevoTipo(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Título</Label>
          <Input name="titulo" value={formData.titulo} onChange={handleChange} required />
        </div>
        <div>
          <Label>Autor</Label>
          <Input name="autor" value={formData.autor} onChange={handleChange} required />
        </div>
        <div>
          <Label>Imagen (URL)</Label>
          <Input name="imagen" value={formData.imagen} onChange={handleChange} />
        </div>
        <div>
          <Label>Fecha de publicación</Label>
          <Input type="date" name="fecha_publicacion" value={formData.fecha_publicacion} onChange={handleChange} />
        </div>
        <div>
          <Label>Edición</Label>
          <Input name="edicion" value={formData.edicion} onChange={handleChange} />
        </div>
        <div>
          <Label>Fuente</Label>
          <Input name="fuente" value={formData.fuente} onChange={handleChange} />
        </div>
        <div>
          <Label>Enlace</Label>
          <Input name="enlace" value={formData.enlace} onChange={handleChange} />
        </div>

        <div>
          <Label>Tipo de libro</Label>
          <div className="flex items-center gap-2">
            <select
              name="id_tipo"
              value={formData.id_tipo}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.tipo}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={() => setMostrarNuevoTipo(!mostrarNuevoTipo)}>
              <FiPlus />
            </Button>
          </div>

          {mostrarNuevoTipo && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Nuevo tipo"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
              />
              <Button type="button" onClick={handleAgregarTipo}>
                Agregar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <Button type="submit" className="px-6">
          {formData.id ? 'Actualizar Libro' : 'Crear Libro'}
        </Button>
      </div>
    </form>
  );
};
