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

interface IHistory {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
  ubicacion: string;
  categoria: string;
  estado: boolean;
}

export const GesHistoria = () => {
  // Datos por defecto
  const defaultHistories: IHistory[] = [
    {
      id: 1,
      titulo: 'Fundación de la ciudad',
      descripcion: 'Evento histórico que marcó el inicio de nuestra ciudad',
      fechaInicio: '1541-02-12',
      fechaFin: '1541-02-12',
      imagen: '/images/fundacion.jpg',
      ubicacion: 'Plaza Principal',
      categoria: 'Fundacional',
      estado: true
    },
    {
      id: 2,
      titulo: 'Terremoto del siglo',
      descripcion: 'El terremoto más devastador registrado en la historia local',
      fechaInicio: '1647-05-13',
      fechaFin: '1647-05-13',
      imagen: '/images/terremoto.jpg',
      ubicacion: 'Región completa',
      categoria: 'Desastre natural',
      estado: true
    },
    {
      id: 3,
      titulo: 'Independencia nacional',
      descripcion: 'Celebración de la independencia del país',
      fechaInicio: '1810-09-18',
      fechaFin: '1810-09-18',
      imagen: '/images/independencia.jpg',
      ubicacion: 'Palacio de Gobierno',
      categoria: 'Política',
      estado: true
    },
    {
      id: 4,
      titulo: 'Construcción del ferrocarril',
      descripcion: 'Llegada del ferrocarril que conectó la ciudad con el resto del país',
      fechaInicio: '1850-01-01',
      fechaFin: '1860-12-31',
      imagen: '/images/ferrocarril.jpg',
      ubicacion: 'Estación Central',
      categoria: 'Infraestructura',
      estado: false
    }
  ];

  const [histories, setHistories] = useState<IHistory[]>(defaultHistories);
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
    
    try {
      // En un caso real, aquí iría la llamada a la API
      // const response = await apiService.get('historias');
      // setHistories(response.data);
      
      // Simulamos un pequeño retardo para parecer una llamada real
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastUpdated(format(new Date(), 'PPpp', { locale: es }));
      toast.success(isRefreshing ? 'Lista de historias actualizada' : 'Historias cargadas');
    } catch (error) {
      toast.error('Error al cargar historias');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
          <div>Inicio: {format(new Date(row.fechaInicio), 'PP', { locale: es })}</div>
          {row.fechaFin && (
            <div>Fin: {format(new Date(row.fechaFin), 'PP', { locale: es })}</div>
          )}
        </div>
      )
    },
    { 
      key: 'ubicacion', 
      header: 'Ubicación',
      render: (ubicacion: string) => (
        <Badge variant="outline" className="text-xs">
          {ubicacion}
        </Badge>
      )
    },
    { 
      key: 'categoria', 
      header: 'Categoría',
      render: (categoria: string) => (
        <Badge variant="secondary">
          {categoria}
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
        {openCreate && <DialogAdd onSuccess={fetchHistories} />}
      </div>
    </RoleLayout>
  );
}

export default GesHistoria;