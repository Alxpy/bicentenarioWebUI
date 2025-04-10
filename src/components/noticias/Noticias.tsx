import React from 'react'
import { DataTable } from '@/components/dataTable/DataTable';
import { Button } from '@/components/ui/button';
import { RoleLayout } from '@/templates/RoleLayout';
import { RefreshCw } from 'lucide-react';
import { apiService } from '@/service/apiservice';
export const Noticias = () => {
  const columns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'nombre', 
      header: 'Nombre',
      render: (_, row) => `${row.nombre} ${row.apellidoPaterno} ${row.apellidoMaterno}`
    },
    { key: 'correo', header: 'Correo' },
    { 
      key: 'email_verified_at', 
      header: 'Verificado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? 'Sí' : 'No'}
        </span>
      )
    },
    {
      key: 'estado', 
      header: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { 
      key: 'roles', 
      header: 'Roles',
      render: (roles) => roles.join(', ')
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" className="text-slate-700 dark:text-slate-300" 
            onClick={() => handleSelectUser(row)}>
            Editar
          </Button>
          <Button onClick={() => delte(row.id)} variant="outline" size="sm" className="text-red-600 dark:text-red-400">
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <RoleLayout role="admin">
      <div className="w-full px-4">
        <div className="dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Actualizado: {lastUpdated}
                </span>
              )}
              <Button 
                size="sm" 
                onClick={fetchUsers}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </Button>
              <Button 
                size="sm" 
                onClick={addUser}
                disabled={loading}
              >
                Agregar Usuario
              </Button>
            </div>
          </div>

          {loading && !users.length ? (
            <div className="flex justify-center items-center h-64">
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={users} 
              onRowClick={(row) => console.log('Usuario seleccionado:', row)}
            />
          )}
        </div>
        {open && <DialogEdit />}
        {openCreate && <DialogAdd />}
        
      </div>
      
    </RoleLayout>
    
  );
}
