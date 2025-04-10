import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const GesBiblioteca = () => {
  const [libros, setLibros] = useState([
    {
      id: 1,
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      imagen: 'https://covers.openlibrary.org/b/id/8221256-L.jpg',
      fechaPublicacion: '1967-05-30',
      edicion: 'Primera'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      imagen: 'https://covers.openlibrary.org/b/id/1535410-L.jpg',
      fechaPublicacion: '1949-06-08',
      edicion: 'Segunda'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchLibros = async () => {
    setRefreshing(true);
    try {
      // Aquí podrías hacer una llamada a una API real
      setTimeout(() => {
        setLastUpdated(format(new Date(), 'PPpp', { locale: es }));
        toast.success('Lista de libros actualizada');
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      toast.error('Error al cargar libros');
      console.error(error);
      setRefreshing(false);
    }
  };

  const deleteLibro = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setLibros(prev => prev.filter(libro => libro.id !== id));
      toast.success('Libro eliminado correctamente');
      setDeletingId(null);
    }, 1000);
  };

  const columns = [
    {
      key: 'imagen',
      header: 'Imagen',
      render: (_: any, row: any) => (
        <img src={row.imagen} alt={row.titulo} className="w-12 h-16 object-cover rounded" />
      )
    },
    {
      key: 'titulo',
      header: 'Título',
      render: (_: any, row: any) => (
        <div className="font-medium">{row.titulo}</div>
      )
    },
    {
      key: 'autor',
      header: 'Autor',
      render: (_: any, row: any) => row.autor
    },
    {
      key: 'fechaPublicacion',
      header: 'Fecha de Publicación',
      render: (fecha: string) =>
        format(new Date(fecha), 'PPP', { locale: es })
    },
    {
      key: 'edicion',
      header: 'Edición',
      render: (edicion: string) => <Badge>{edicion}</Badge>
    },
    {
      key: 'acciones',
      header: 'Acciones',
      className: 'text-right w-40',
      render: (_: any, row: any) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" className="hover:bg-blue-50">
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteLibro(row.id)}
            disabled={deletingId === row.id}
            className="hover:bg-red-50 text-red-600"
          >
            {deletingId === row.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : 'Eliminar'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <RoleLayout role="admin">
      <div className="w-full px-4 py-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Gestión de Biblioteca
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Administra los libros disponibles
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {lastUpdated && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  Actualizado: {lastUpdated}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLibros}
                  disabled={refreshing}
                  className="gap-2"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Refrescar</span>
                </Button>
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar Libro</span>
                </Button>
              </div>
            </div>
          </div>

          {loading && !libros.length ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400">
                Cargando libros...
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-800">
              <DataTable
                columns={columns}
                data={libros}
                className="[&_th]:bg-slate-100 dark:[&_th]:bg-slate-800"
              />
            </div>
          )}
        </div>
      </div>
    </RoleLayout>
  );
};

export default GesBiblioteca;
