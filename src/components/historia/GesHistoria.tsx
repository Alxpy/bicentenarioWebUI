import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { apiService } from '@/service/apiservice';
import { useEffect, useState } from 'react';
import { DialogEdit } from './DialogEdit';
import { useAtom } from 'jotai';
import { 
  openAdminHistoryAtom, 
  openAdminCreateHistoryAtom,
  historyAdminEditAtom 
} from '@/context/context';
import { DialogAdd } from './DialogAdd';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {IHistory} from '@/components/interface'
import { MapaInteractivo } from '../ubicacion/MapaInteractivo';

export const GesHistoria = () => {
  
  const [histories, setHistories] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [open, setOpen] = useAtom(openAdminHistoryAtom);
  const [openCreate, setOpenCreate] = useAtom(openAdminCreateHistoryAtom);
  const [, setHistory] = useAtom(historyAdminEditAtom);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchHistories = async () => {
    const isRefreshing = histories.length > 0;
    isRefreshing ? setRefreshing(true) : setLoading(true);
    
      await apiService.get('history').then((response)=>{
        const data  : any= response.data;
        setHistories(data)
        setLastUpdated(format(new Date(), 'PPpp', { locale: es }));
      toast.success(isRefreshing ? 'Lista de historias actualizada' : 'Historias cargadas');
      }). catch( (error) => {
        toast.error('Error al cargar historias');
        console.error(error);
      }).finally(() => {
        setLoading(false);
        setRefreshing(false);
      })
  };

  const handleSelectHistory = (history: IHistory) => {
    setHistory(history);
    setOpen(true);
  };

  const addHistory = () => {
    setOpenCreate(true);
  };

  const deleteHistory = async (id: number) => {
    setDeletingId(id);
    try {
      // En un caso real, aquí iría la llamada a la API
      // await apiService.delete(`historia/${id}`);
      
      // Simulamos la eliminación
      await new Promise(resolve => setTimeout(resolve, 500));
      setHistories(histories.filter(history => history.id !== id));
      toast.success('Historia eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar historia');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render: (value: any, row: T) => JSX.Element;
  }

  const columns: Column<IHistory>[] = [
    { 
      key: 'titulo', 
      header: 'Título',
      render: (titulo: string, row) => (
        <div className="font-medium">
          {titulo}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {row.descripcion}
          </p>
        </div>
      )
    },
    { 
      key: 'fechas', 
      header: 'Fechas',
      render: (_, row) => (
        <div className="text-sm">
          <div>Inicio: {format(new Date(row.fecha_inicio), 'PP', { locale: es })}</div>
          {row.fecha_fin && (
            <div>Fin: {format(new Date(row.fecha_fin), 'PP', { locale: es })}</div>
          )}
        </div>
      )
    },
    { 
      key: 'ubicacion', 
      header: 'Ubicación',
      render: (_,row) => (
        <Badge variant="outline" className="text-xs">
          {row.nombre_ubicacion}
        </Badge>
      )
    },
    { 
      key: 'categoria', 
      header: 'Categoría',
      render: (_,row) => (
        <Badge variant="secondary">
          {row.nombre_categoria}
        </Badge>
      )
    },
    {
      key: 'estado', 
      header: 'Estado',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right w-40',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectHistory(row)}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => deleteHistory(row.id)}
            disabled={deletingId === row.id}
            className="hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
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
                Gestión de Historias
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Administra las historias y eventos históricos
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {lastUpdated && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  Actualizado: {lastUpdated}
                </div>
              )}
              
              <div className="flex gap-2 w-full sm:w-auto text-slate-800">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={fetchHistories}
                  disabled={loading || refreshing}
                  className="gap-2"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className=" hidden sm:inline">Refrescar</span>
                </Button>
                
                <Button 
                  size="sm"
                  onClick={addHistory}
                  disabled={loading}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar Historia</span>
                  <span className="inline sm:hidden">Agregar</span>
                </Button>
              </div>
            </div>
          </div>

          {loading && !histories.length ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400">
                Cargando historias...
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-800">
              <DataTable 
                columns={columns} 
                data={histories}
                className="[&_th]:bg-slate-100 dark:[&_th]:bg-slate-800"
              />
            </div>
          )}
        </div>
        {open && <DialogEdit onSuccess={fetchHistories} />}
        {openCreate && <DialogAdd open={openCreate} onClose={() => setOpenCreate(false)}  onSuccess={fetchHistories} />}
      </div>
    </RoleLayout>
  );
}

export default GesHistoria;