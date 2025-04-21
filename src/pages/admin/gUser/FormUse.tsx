import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogFooter } from "@/components/ui/dialog"
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiService } from '@/service/apiservice'
import { iUser_Register } from "@/components/interface/iuser"

const userFormSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  apellidoPaterno: z.string().min(2, "Mínimo 2 caracteres"),
  apellidoMaterno: z.string().optional(),
  genero: z.string().min(1, "Selecciona un género"),
  telefono: z.string().min(6, "Mínimo 6 dígitos").optional(),
  correo: z.string().email("Correo inválido"),
  pais: z.string().min(2, "País requerido"),
  ciudad: z.string().min(2, "Ciudad requerida"),
  contrasena: z.string().min(8, "Mínimo 8 caracteres").optional(),
  confirmarContrasena: z.string().optional()
}).refine(data => !data.contrasena || data.contrasena === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"]
})

type UserFormValues = z.infer<typeof userFormSchema>

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
]

interface FormUserProps {
  userData?: iUser_Register;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export const FormUserAdm = ({ userData, onSuccess, mode = 'edit' }: FormUserProps) => {
  const isCreateMode = mode === 'create'

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: isCreateMode ? {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      genero: '',
      telefono: '',
      correo: '',
      pais: '',
      ciudad: '',
    } : {
      ...userData,
      contrasena: '',
      confirmarContrasena: ''
    }
  })

  const handleSubmit = async (data: UserFormValues) => {
    try {
      const payload = {
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        correo: data.correo,
        genero: data.genero,
        telefono: data.telefono,
        pais: data.pais,
        ciudad: data.ciudad,
        ...(isCreateMode && { contrasena: data.contrasena })
      }

      const response = isCreateMode 
        ? await apiService.post('user', payload)
        : await apiService.put(`user/${userData?.id}`, payload)

      toast.success(isCreateMode ? "Usuario creado" : "Actualización exitosa")
      onSuccess?.()
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error en la operación")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Nombre</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: Juan"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Apellido Paterno */}
          <FormField
            control={form.control}
            name="apellidoPaterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Apellido Paterno</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: Pérez"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Apellido Materno */}
          <FormField
            control={form.control}
            name="apellidoMaterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Apellido Materno (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: López"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Género */}
          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Género</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-1 focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: 5512345678"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Correo */}
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Correo electrónico</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                    disabled={!isCreateMode}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* País */}
          <FormField
            control={form.control}
            name="pais"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">País</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: México"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Ciudad */}
          <FormField
            control={form.control}
            name="ciudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Ciudad</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Ej: Ciudad de México"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {isCreateMode && (
            <>
              {/* Contraseña */}
              <FormField
                control={form.control}
                name="contrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        {...field} 
                        className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                        placeholder="Mínimo 8 caracteres"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Confirmar Contraseña */}
              <FormField
                control={form.control}
                name="confirmarContrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        {...field} 
                        className="bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500"
                        placeholder="Repetir contraseña"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="submit"
            className="w-full py-3 px-6 text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg flex items-center justify-center group bg-gradient-to-r from-emerald-500 to-cyan-600 hover:shadow-cyan-500/30"
          >
            {isCreateMode ? 'Crear Usuario' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}