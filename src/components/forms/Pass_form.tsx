import * as Yup from 'yup'
import { Label, Button } from '@/components/ui'
import { toast } from 'sonner'
import { apiService, fetchShortApi } from '@/service/apiservice'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { Input } from './Input'
import { BarLoader } from 'react-spinners'
interface SendCodeProps {
  email: string;
  setIsOpen: (isOpen: boolean) => void;

}

const schemaValidate = Yup.object().shape({
  password: Yup.string().required('Campo requerido').min(8, 'La contraseña debe tener al menos 8 caracteres')
  .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Debe tener al menos una letra mayúscula, una letra minúscula y un número'),
  confirm: Yup.string().required('Campo requerido').equals([Yup.ref('password')], 'Las contraseñas no coinciden')
  
})


export const Pass_form = ({ email, setIsOpen }: SendCodeProps) => {
  const navigate = useNavigate()



  return (
    <Formik 
      className="space-y-4"  
      initialValues={{ password: '', confirm: '' }}
      onSubmit={(values, {
        setSubmitting, resetForm
      } ) => {
        fetchShortApi(`password`, {
          "correo": email,
          "nueva_contrasena": values.password
        }).then(response => {
          console.log(response)
          if (response.success) {
            toast.success('Contraseña actualizada correctamente')
            setIsOpen(false)
            navigate('/auth')
          }
        }).finally(() => {
          setSubmitting(false)
          resetForm()
        }
        )
      }}
      validationSchema={schemaValidate}
     >
      {({
        isSubmitting
      }) => (
        <Form className="space-y-4">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                name="password"
              />
             
            </div>          
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <Input
              name="confirm"
              variant='secondary'
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full disabled:text-red-500 "  >
            {
              isSubmitting ? <BarLoader /> : 'Actualizar'
            }
          </Button>
          

        </Form>
      )}
    </Formik>
  )
}
