import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ICultura, ICreateCultura } from '@/components/interface';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { DialogAdd } from './DialogAdd';
import { DialogEdit } from './DialogEdit';
import { DialogMul } from './DialogMul';

export const Cultura = () => {
    const [cultura, setCultura] = useState<ICultura[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [selectedCultura, setSelectedCultura] = useState<ICultura>();
    const [selectedId, setSelectedId] = useState<number>(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openMul, setOpenMul] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const fetchCultura = async () => {
        const isRefreshing = cultura.length > 0;
        isRefreshing ? setRefreshing(true) : setLoading(true);

        await apiService.get('cultures').then((response) => {
            const data: any = response.data;
            setCultura(data);
            setLastUpdated(new Date().toLocaleString());
            toast.success(isRefreshing ? 'Lista actualizada' : 'Datos cargados');
        }).catch((error) => {
            toast.error('Error al cargar datos');
            console.error(error);
        }).finally(() => {
            setLoading(false);
            setRefreshing(false);
        });
    };

    const handleSelectCultura = (cultura: ICultura) => {
        setSelectedCultura(cultura);
        setOpenEdit(true);
    };

    const deleteCultura = async (id: number) => {
        await apiService.delete(`cultures/${id}`).then(() => {
            setCultura(cultura.filter(c => c.id !== id));
            toast.success('Registro eliminado');
        }).catch((error) => {
            toast.error('Error al eliminar');
            console.error(error);
        });
    };

    useEffect(() => {
        fetchCultura();
    }, []);

    interface Column<T> {
        key: keyof T | string;
        header: string;
        className?: string;
        render: (value: any, row: T) => JSX.Element;
    }

    const columns: Column<ICultura>[] = [
        {
            key: 'nombre',
            header: 'Nombre',
            render: (nombre: string, row) => (
                <div className="font-medium">
                    {nombre}
                    <p className="text-xs text-amber-800/70 mt-1 line-clamp-1">
                        {row.descripcion}
                    </p>
                </div>
            )
        },
        {
            key: 'imagen',
            header: 'Imagen',
            render: (imagen: string) => (
                <div className="max-w-[100px] truncate text-amber-900">
                    {imagen || 'Sin imagen'}
                </div>
            )
        },
        {
            key: 'ubicacion',
            header: 'Ubicación',
            render: (_, row) => (
                <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-200">
                    #{row.nombre_ubicacion}
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
                        onClick={() => handleSelectCultura(row)}
                        className="hover:bg-amber-50 text-amber-800 border-amber-200"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedId(row.id);
                            setOpenMul(true);
                        }}
                        className="hover:bg-green-50 text-green-800 border-green-200"
                    >
                        Multimedia
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCultura(row.id)}
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
                <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900">
                                Gestión Etnias
                            </h2>
                            <p className="text-sm text-amber-800/70 mt-1">
                                Administración de etnias
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {lastUpdated && (
                                <div className="text-xs text-amber-800/70 bg-amber-100 px-3 py-1.5 rounded-full">
                                    Última actualización: {lastUpdated}
                                </div>
                            )}

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchCultura}
                                    disabled={loading || refreshing}
                                    className="gap-2 border-amber-200 text-amber-800"
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
                                    className="gap-2 bg-amber-700 text-white hover:bg-amber-800"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Nuevo Registro</span>
                                    <span className="inline sm:hidden">Agregar</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {loading && !cultura.length ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                            <p className="text-amber-800">
                                Cargando registros...
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden border-amber-100">
                            <DataTable
                                columns={columns}
                                data={cultura}
                                className="[&_th]:bg-amber-100 [&_td]:bg-amber-50"
                            />
                        </div>
                    )}
                </div>
                {openCreate && (<DialogAdd open={openCreate} onClose={() => setOpenCreate(false)} onSuccess={fetchCultura} />)}
                {openEdit && (<DialogEdit cultura={selectedCultura} open={openEdit} onClose={() => setOpenEdit(false)} onSuccess={fetchCultura} />)}
                {openMul && (<DialogMul id_cultura={selectedId} open={openMul} onClose={() => setOpenMul(false)}  />)}
            </div>
        </RoleLayout>
    );
};