import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { iEvento } from '@/components/interface';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { DialogAdd } from './DialogAdd';
import { DialogEdit } from './DialogEdit';


export const Evento = () => {
    const [eventos, setEventos] = useState<iEvento[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [selectedEvento, setSelectedEvento] = useState<iEvento>();
    const [selectedId, setSelectedId] = useState<number>(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const fetchEventos = async () => {
        const isRefreshing = eventos.length > 0;
        isRefreshing ? setRefreshing(true) : setLoading(true);

        await apiService.get('evento').then((response) => {
            const data: iEvento[] = response.data;
            setEventos(data);
            setLastUpdated(format(new Date(), 'PPpp', { locale: es }));
            toast.success(isRefreshing ? 'Lista actualizada' : 'Eventos cargados');
        }).catch((error) => {
            toast.error('Error al cargar eventos');
            console.error(error);
        }).finally(() => {
            setLoading(false);
            setRefreshing(false);
        });
    };

    const handleSelectEvento = (evento: iEvento) => {
        setSelectedEvento(evento);
        setOpenEdit(true);
    };

    const deleteEvento = async (id: number) => {
        await apiService.delete(`evento/${id}`).then(() => {
            setEventos(eventos.filter(e => e.id !== id));
            toast.success('Evento eliminado');
        }).catch((error) => {
            toast.error('Error al eliminar evento');
            console.error(error);
        });
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    interface Column<T> {
        key: keyof T | string;
        header: string;
        className?: string;
        render: (value: any, row: T) => JSX.Element;
    }

    const columns: Column<iEvento>[] = [
        {
            key: 'nombre',
            header: 'Evento',
            render: (nombre: string, row) => (
                <div className="font-medium ">
                    {nombre}                    
                </div>
            )
        },
        {
            key: 'fechas',
            header: 'Fechas',
            render: (_, row) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200">
                        {format(new Date(row.fecha_inicio), 'PP', { locale: es })}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-900 border-purple-200">
                        {format(new Date(row.fecha_fin), 'PP', { locale: es })}
                    </Badge>
                </div>
            )
        },
        {
            key: 'tipo',
            header: 'Tipo de Evento',
            render: (_, row) => (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {row.nombre_evento}
                </Badge>
            )
        },
        {
            key: 'ubicacion',
            header: 'Ubicación',
            render: (_, row) => (
                <Badge variant="outline" className="bg-orange-50 text-orange-900 border-orange-200">
                    {row.nombre_ubicacion}
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
                        onClick={() => handleSelectEvento(row)}
                        className="hover:bg-blue-50 text-blue-800 border-blue-200"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEvento(row.id)}
                        className="hover:bg-red-50 text-red-800 border-red-200"
                    >
                        Eliminar
                    </Button>
                </div>
            )
        }
    ];

    return (
        <RoleLayout role="admin">
            <div className="w-full px-4 py-6">
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900">
                                Gestión de Eventos
                            </h2>
                            <p className="text-sm text-blue-800/70 mt-1">
                                Administración de eventos culturales
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {lastUpdated && (
                                <div className="text-xs text-blue-800/70 bg-blue-100 px-3 py-1.5 rounded-full">
                                    Última actualización: {lastUpdated}
                                </div>
                            )}

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchEventos}
                                    disabled={loading || refreshing}
                                    className="gap-2 border-blue-200 text-blue-800"
                                >
                                    {refreshing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">Actualizar</span>
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={() => setOpenCreate(true)}
                                    disabled={loading}
                                    className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Nuevo Evento</span>
                                    <span className="inline sm:hidden">Agregar</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {loading && !eventos.length ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                            <p className="text-blue-800">
                                Cargando eventos...
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden border-blue-100">
                            <DataTable
                                columns={columns}
                                data={eventos}
                                className="[&_th]:bg-blue-100 [&_td]:bg-blue-50"
                            />
                        </div>
                    )}
                </div>
            </div>

            {openCreate && (
                <DialogAdd
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onSuccess={fetchEventos}
                />
            )}
            {openEdit && selectedEvento && (
                <DialogEdit
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    evento={selectedEvento}
                    onSuccess={fetchEventos}
                />
            )}
        </RoleLayout>
    )
}