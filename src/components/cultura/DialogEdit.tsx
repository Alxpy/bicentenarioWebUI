import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { FormCultura } from './FormCultura'
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo';
import { apiService } from '@/service/apiservice';
import { ICultura } from "../interface";

interface IBibliotecaProrops {
  cultura: ICultura
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}
export const DialogEdit = ({ cultura, open, onClose, onSuccess }: IBibliotecaProrops) => {
  
  const [cambiarUbi, setCreateUbi] = useState(true)

    const enviar = async () => {
      const culturaRaw = localStorage.getItem('cultura')
      const ubicacionRaw = localStorage.getItem('ubicacion')
  
      if (!culturaRaw || !ubicacionRaw) {
        console.error("Falta información en localStorage")
        return
      }
  
      const cultura = JSON.parse(culturaRaw)
      const ubicacion = JSON.parse(ubicacionRaw)
  
      console.log(cultura)
      console.log(ubicacion)
  
      const payload = {
        nombre: cultura.nombre,
        descripcion: cultura.descripcion,
        id_ubicacion: ubicacion.id
      }
      console.log(payload)
      await apiService.post('cultures', payload)
        .then((response) => {
          console.log(response
          )
          onSuccess && onSuccess()
        }).catch((error) => {
          console.error(error)
        })
    }

    const handleChangeLocation = () => {
      setCreateUbi(!cambiarUbi)
    }

    console.log(open)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[100vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
        <DialogHeader>
          <DialogTitle>Editar Etnia</DialogTitle>
          <DialogDescription>Edita .</DialogDescription>
        </DialogHeader>
        {!cambiarUbi ? (<div className='overflow-y-auto max-h-[90vh] pr-2'>
          <MapaInteractivo onSucces={enviar} />
        </div>
        ) : (
          <FormCultura initialData={cultura}  setCreateUbi={handleChangeLocation} />
        )}
      </DialogContent>
    </Dialog>
  )
}
