import { DataTable } from '@/components/dataTable/DataTable';
import { RoleLayout } from '@/templates/RoleLayout';
import { iPresidente } from '../interface/iPresidente';
import { apiService } from '@/service/apiservice';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import React from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';

import { DialogAdd } from './DialogAdd';
import { DialogEdit } from './DialogEdit';

export const GesPresidente = () => {

    const [presidentes, setPresidentes] = useState<iPresidente[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [presidenteToEdit, setPresidenteToEdit] = useState<iPresidente>();

    const fetchPresidentes = async () => {
        const isRefreshing = presidentes.length > 0;
        isRefreshing ? setRefreshing(true) : setLoading(true);

        try {
            const response = await apiService.get('president');
            // Asegurarnos de que siempre sea un array, incluso si la respuesta es null/undefined
            const data: any = response.data || [];
            setPresidentes(data);
            setLastUpdated(new Date().toLocaleString());
            toast.success(isRefreshing ? 'Lista de presidentes actualizada' : 'Presidentes cargados');
        } catch (error) {
            toast.error('Error al cargar presidentes');
            console.error(error);
            // En caso de error, establecer un array vacío
            setPresidentes([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await apiService.delete(`president/${id}`);
            setPresidentes(presidentes.filter((presidente) => presidente.id !== id));
            toast.success('Presidente eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar presidente');
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRefresh = () => {
        fetchPresidentes();
    }

    const handleAdd = () => {
        setOpenAdd(true);
        // Aquí puedes abrir un modal o redirigir a una página para agregar un nuevo presidente
        toast.success('Funcionalidad de agregar presidente no implementada');
    }

    const handleEdit = (presidente: iPresidente) => {
        setPresidenteToEdit(presidente);
        setOpenEdit(true);
        // Aquí puedes abrir un modal o redirigir a una página para editar el presidente seleccionado
        toast.success('Funcionalidad de editar presidente no implementada');
    }
    useEffect(() => {
        fetchPresidentes();
      }, []);
    interface Column<T> {
        key: keyof T | string;
        header: string;
        className?: string;
        render: (value: any, row: T) => JSX.Element;
    }

    const columns: Column<iPresidente>[] = [
        {
          key: 'nombre',
          header: 'Nombre',
          render: (_, row) => (
            <div className="font-medium">{row.nombre} {row.apellido}</div>
          )
        },
        {
          key: 'periodo',
          header: 'Período',
          render: (_, row) => (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Inicio: {row.inicio_periodo}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Fin: {row.fin_periodo}
              </Badge>
            </div>
          )
        },{
          key: 'imagen',
          header: 'Imagen',
          render: (_, row) => (
            <div className="flex items-center gap-2">
              <img
                src={row.imagen}
                alt={row.nombre}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          )
        },
        {
          key: 'partido_politico',
          header: 'Partido Político',
          render: (_, row) => (
            <div>{row.partido_politico}</div>
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
                onClick={() => handleEdit(row as iPresidente)}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(row.id)}
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
        <RoleLayout role='admin'>
            <div className="w-full px-4 py-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                Gestión de Presidentes
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Administra los presidentes del sistema
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
                                    onClick={handleRefresh}
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
                                    onClick={handleAdd}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Agregar Presidnete</span>
                                    <span className="inline sm:hidden">Agregar</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {loading && !presidentes.length ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            <p className="text-slate-500 dark:text-slate-400">
                                Cargando usuarios...
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-800">
                            <DataTable
                                columns={columns}
                                data={presidentes}
                                className="[&_th]:bg-slate-100 dark:[&_th]:bg-slate-800"
                            />
                        </div>
                    )}
                </div>
            </div>
          {openAdd && ( <DialogAdd open={openAdd} onClose={() => setOpenAdd(false)} />)}
          {openEdit && ( <DialogEdit open={openEdit} onClose={() => setOpenEdit(false)} presidente={presidenteToEdit} />)}
        </RoleLayout>
    )
}
