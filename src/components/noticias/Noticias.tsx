import React,{useState, useEffect} from 'react'
import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw } from 'lucide-react';
import { apiService } from '@/service/apiservice';
import { DialogEdit } from './DialogEdit';
import { DialogAdd } from './DialogAdd';
import { iNews } from '../interface';
import { set } from 'date-fns';

export const Noticias = () => {
  interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render: (value: any, row: T) => JSX.Element;
  }

  const columns: Column<iNews>[] = [
    { 
      key: 'titulo', 
      header: 'Título',
      render: (value) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
      )
    },
    { 
      key: 'nombre_categoria', 
      header: 'Categoría',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {value}
        </span>
      )
    },
    { 
      key: 'fecha_publicacion', 
      header: 'Fecha Publicación',
      render: (value) => <span>{new Date(value).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" className="text-slate-700 dark:text-slate-300" 
            onClick={() => handleSelectNews(row)}>
            Editar
          </Button>
          <Button onClick={() => deleteNews(row.id)} variant="outline" size="sm" className="text-red-600 dark:text-red-400">
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  // Sample data structure for news
  const [news	, setNews] = useState<iNews[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [noticiaSelected, setNoticiaSelected] = React.useState<iNews>();

  const fetchNews = async () => {
    setLoading(true);
    try {
       const response : any = await apiService.get('news');
       setNews(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNews = (newsItem : iNews) => {
    setNoticiaSelected(newsItem);
    setOpen(true);
  };

  const deleteNews = async (id:number) => {
    if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      try {
        // await apiService.delete(`/noticias/${id}`);
        // fetchNews(); // Refresh the list
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const addNews = () => {
    setOpenCreate(true);
  };

  return (
    <RoleLayout role="admin">
      <div className="w-full px-4">
        <div className="dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gestión de Noticias</h2>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Actualizado: {lastUpdated}
                </span>
              )}
              <Button 
                size="sm" 
                onClick={fetchNews}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </Button>
              <Button 
                size="sm" 
                onClick={addNews}
                disabled={loading}
              >
                Agregar Noticia
              </Button>
            </div>
          </div>

          {loading && !news.length ? (
            <div className="flex justify-center items-center h-64">
              <p>Cargando noticias...</p>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={news} 
              onRowClick={(row) => console.log('Noticia seleccionada:', row)}
            />
          )}
        </div>
        {open && <DialogEdit open={open} onClose={()=>setOpen(false)} noticia={noticiaSelected}  />}
        {openCreate && <DialogAdd open={openCreate} onClose={() => setOpenCreate(false)}  />}
      </div>
    </RoleLayout>
  );
}