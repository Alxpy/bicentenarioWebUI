import { useEffect, useState } from 'react'
import { apiService } from '@/service/apiservice'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { ro } from 'date-fns/locale'

interface Roles {
  id: number
  nombre_rol: string
  descripcion: string
}

interface RoleProps {
  id_usuario: number
  open: boolean
  onClose: () => void
}

export const RolesForm = ({ id_usuario, open, onClose }: RoleProps) => {
  const [roles, setRoles] = useState<Roles[]>([])
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchRoles = async () => {
    try {
      const res : any = await apiService.get('rol')
      setRoles(res.data)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = (id: number) => {
    setSelectedRoles(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const handleAssignRoles = async () => {
    
      selectedRoles.forEach(async (rol) => {
        await apiService.post(`usuario_rol`, {
          id_usuario: id_usuario,
          id_rol: rol 
        }).then((res: any) => {
            toast.success('Roles asignados correctamente')
        }
        ).catch((error: any) => {
          console.error('Error assigning roles:', error)
          toast.error('Error al asignar roles')
        })
      })
      toast.success('Roles asignados correctamente')
      onClose()
    
  }

  useEffect(() => {
    if (open) {
      fetchRoles()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
        <DialogHeader>
          <DialogTitle>Asignar Roles</DialogTitle>
          <DialogDescription>Selecciona los roles que deseas asignar al usuario.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-center mt-4">Cargando roles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {roles.map(rol => (
              <div key={rol.id} className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedRoles.includes(rol.id)}
                  onCheckedChange={() => toggleRole(rol.id)}
                  id={`role-${rol.id}`}
                />
                <Label htmlFor={`role-${rol.id}`} className="cursor-pointer">
                  <strong>{rol.nombre_rol}</strong> 
                </Label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAssignRoles} disabled={selectedRoles.length === 0}>
            Asignar Roles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
