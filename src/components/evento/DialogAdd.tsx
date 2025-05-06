import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { FormEvento } from './FormEvento'
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo';
import { apiService } from '@/service/apiservice';

interface IBibliotecaProrops {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const DialogAdd = ({ open, onClose, onSuccess }: IBibliotecaProrops) => {

  const [crateUbi, setCreateUbi] = React.useState(true)

  const enviar = async () => {
    const culturaRaw = localStorage.getItem('cultura')
    const ubicacionRaw = localStorage.getItem('ubicacion')
    console.log(culturaRaw)
    console.log(ubicacionRaw)
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
      imagen: cultura.imagen,
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



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[100vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
        <DialogHeader>
          <DialogTitle>Agregar Etnia</DialogTitle>
          <DialogDescription>Agrega una nueva Etnia.</DialogDescription>
        </DialogHeader>
        {!crateUbi ? (<div className='overflow-y-auto max-h-[90vh] pr-2'>
          <MapaInteractivo onSucces={enviar} />
        </div>

        ) : (
          <FormEvento setCreateUbi={() => setCreateUbi(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
