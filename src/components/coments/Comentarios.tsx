import { DataTable } from '@/components/dataTable/DataTable';
import React from 'react'
import { IComentarioGen, IComentarioBlb, IComentarioEve } from '../interface'
import { apiService } from '@/service/apiservice'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2, Search, Book, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const Comentarios = () => {
    const [comentarios, setComentarios] = useState<IComentarioGen[]>([]);
    const [filteredComentarios, setFilteredComentarios] = useState<IComentarioGen[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'books' | 'events'>('all');

    const fetchComentarios = async () => {
        const isRefreshing = comentarios.length > 0;
        isRefreshing ? setRefreshing(true) : setLoading(true);

        try {
            // Obtener todos los comentarios
            const response = await apiService.get('comentario');
            const data: IComentarioGen[] = response.data;

            setComentarios(data);
            setFilteredComentarios(data);
            setLastUpdated(new Date().toLocaleString());
            toast.success(isRefreshing ? 'Lista actualizada' : 'Datos cargados');
        } catch (error) {
            toast.error('Error al cargar datos');
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchComentariosByType = async (type: 'all' | 'books' | 'events') => {
        setLoading(true);
        try {
            let endpoint = 'comentario';
            if (type === 'books') endpoint = 'comentario_biblioteca';
            if (type === 'events') endpoint = 'comentario_evento';

            const response = await apiService.get(endpoint);
            const data: IComentarioGen[] = response.data;

            setComentarios(data);
            setFilteredComentarios(data);
            setLastUpdated(new Date().toLocaleString());
        } catch (error) {
            toast.error('Error al cargar datos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = comentarios.filter(comentario =>
            comentario.contenido.toLowerCase().includes(term.toLowerCase()) ||
            comentario.nombre.toLowerCase().includes(term.toLowerCase()) ||
            comentario.apellidoPaterno.toLowerCase().includes(term.toLowerCase()) ||
            comentario.apellidoMaterno.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredComentarios(filtered);
    };

    const deleteComentario = async (id: number) => {
        await apiService.delete(`comentario/${id}`).then(() => {
            setComentarios(comentarios.filter(c => c.id !== id));
            setFilteredComentarios(filteredComentarios.filter(c => c.id !== id));
            toast.success('Registro eliminado');
        }).catch((error) => {
            toast.error('Error al eliminar');
            console.error(error);
        });
    };

    useEffect(() => {
        fetchComentarios();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [comentarios, searchTerm]);

    interface Column<T> {
        key: keyof T | string;
        header: string;
        className?: string;
        render: (value: any, row: T) => JSX.Element;
    }

    const columns: Column<IComentarioGen>[] = [
        {
            key: 'usuario',
            header: 'Usuario',
            render: (_, row) => (
                <div className="font-medium">
                    {`${row.nombre} ${row.apellidoPaterno} ${row.apellidoMaterno}`}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {row.contenido}
                    </p>
                </div>
            )
        },
        {
            key: 'fecha_creacion',
            header: 'Fecha',
            render: (fecha: string) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(fecha).toLocaleDateString()}
                </div>
            )
        },
        {
            key: 'tipo',
            header: 'Tipo',
            render: (_, row) => (
                <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200">
                    {filterType === 'books' ? 'Libro' : filterType === 'events' ? 'Evento' : 'General'}
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
                        onClick={() => deleteComentario(row.id)}
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
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Gestión de Comentarios
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administración de comentarios del sistema
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {lastUpdated && (
                                <div className="text-xs text-muted-foreground bg-gray-100 px-3 py-1.5 rounded-full">
                                    Última actualización: {lastUpdated}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar comentarios..."
                                className="pl-9 text-slate-900"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant={filterType === 'all' ? 'default' : 'outline'}
                                onClick={() => {
                                    setFilterType('all');
                                    fetchComentarios();
                                }}
                                className="gap-2"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Todos
                            </Button>
                            <Button
                                variant={filterType === 'books' ? 'default' : 'outline'}
                                onClick={() => {
                                    setFilterType('books');
                                    fetchComentariosByType('books');
                                }}
                                className="gap-2"
                            >
                                <Book className="h-4 w-4" />
                                Libros
                            </Button>
                            <Button
                                variant={filterType === 'events' ? 'default' : 'outline'}
                                onClick={() => {
                                    setFilterType('events');
                                    fetchComentariosByType('events');
                                }}
                                className="gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                Eventos
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchComentarios}
                            disabled={loading || refreshing}
                            className="gap-2"
                        >
                            {refreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Actualizar
                        </Button>
                    </div>

                    {loading && !comentarios.length ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <p className="text-gray-600">
                                Cargando comentarios...
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={filteredComentarios}
                                emptyMessage="No se encontraron comentarios"
                            />
                        </div>
                    )}
                </div>
            </div>
        </RoleLayout>
    )
}