import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { apiService } from '@/service/apiservice';
import { IUserGeneral } from '@/components/interface';
import { useEffect, useState } from 'react';
import { DialogEdit } from './DialogEdit';
import { useAtom } from 'jotai';
import {
  openAdminUserAtom,
  openAdminCreateUserAtom,
  userAdminEditAtom,
  openAdminRolesAtom
} from '@/context/context';
import { DialogAdd } from './DialogAdd';
import { RolesForm } from './RolesForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GesUser = () => {
  const [users, setUsers] = useState<IUserGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [open, setOpen] = useAtom(openAdminUserAtom);
  const [openCreate, setOpenCreate] = useAtom(openAdminCreateUserAtom);
  const [openRoles, setOpenRoles] = useAtom(openAdminRolesAtom);
  const [user, setUser] = useAtom(userAdminEditAtom);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    const isRefreshing = users.length > 0;
    isRefreshing ? setRefreshing(true) : setLoading(true);

    try {
      const response = await apiService.get('user');
      // Asegurarnos de que siempre sea un array, incluso si la respuesta es null/undefined
      const data: any = response.data || [];
      setUsers(data);
      setLastUpdated(format(new Date(), 'PPpp', { locale: es }));
      toast.success(isRefreshing ? 'Lista de usuarios actualizada' : 'Usuarios cargados');
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
      // En caso de error, establecer un array vacío
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleSelectUser = (user: IUserGeneral) => {
    setUser(user);
    setOpen(true);
  };

  const addUser = () => {
    setOpenCreate(true);
  };

  const deleteUser = async (id: number) => {
    setDeletingId(id);
    try {
      await apiService.delete(`user/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar usuario');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render: (value: any, row: T) => JSX.Element;
  }

  interface UserRow {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    email_verified_at: string | null;
    estado: boolean;
    roles: string[];
  }

  const columns: Column<UserRow>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (_, row) => (
        <div className="font-medium">
          {row.nombre} {row.apellidoPaterno} {row.apellidoMaterno}
        </div>
      )
    },
    {
      key: 'correo',
      header: 'Correo',
      render: (email: string) => (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {email}
        </a>
      )
    },
    {
      key: 'email_verified_at',
      header: 'Verificado',
      render: (value: string | null) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Verificado' : 'No verificado'}
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
      key: 'roles',
      header: 'Roles',
      render: (roles: string[]) => (
        <div className="flex flex-wrap gap-1">
          {roles.map(role => (
            <Badge key={role} variant="outline" className="text-xs">
              {role}
            </Badge>
          ))}

        </div>
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
            onClick={() => handleSelectUser(row as IUserGeneral)}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Editar
          </Button>
          <Button
            onClick={() => { setUser(row as IUserGeneral); setOpenRoles(true) }}
          >
            Agregar Roles
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteUser(row.id)}
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
                Gestión de Usuarios
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Administra los usuarios del sistema
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
                  onClick={fetchUsers}
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
                  onClick={addUser}
                  disabled={loading}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar Usuario</span>
                  <span className="inline sm:hidden">Agregar</span>
                </Button>
              </div>
            </div>
          </div>

          {loading && !users.length ? (
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
                data={users}
                className="[&_th]:bg-slate-100 dark:[&_th]:bg-slate-800"
              />
            </div>
          )}
        </div>

        {open && <DialogEdit onSuccess={fetchUsers} />}
        {openCreate && <DialogAdd onSuccess={fetchUsers} />}
        {openRoles && <RolesForm id_usuario={user?.id || 0} open={openRoles} onClose={() => setOpenRoles(false)} />}
      </div>
    </RoleLayout>
  );
}

export default GesUser;