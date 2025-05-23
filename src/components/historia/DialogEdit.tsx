import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { FormHistoria } from './FormHistoria'
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo';
import { apiService } from '@/service/apiservice';
import { useAtom } from 'jotai';
import { 
  openAdminHistoryAtom, 
  openAdminCreateHistoryAtom,
  historyAdminEditAtom 
} from '@/context/context';

interface IBibliotecaProrops {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}
export const DialogEdit = ({ open, onClose, onSuccess }: IBibliotecaProrops) => {
  const [history, setHistory] = useAtom(historyAdminEditAtom);
  const [cambiarUbi, setCreateUbi] = useState(true)

    const enviar = async () => {
      const historiaRaw = localStorage.getItem('historia')
      const ubicacionRaw = localStorage.getItem('ubicacion')
  
      if (!historiaRaw || !ubicacionRaw) {
        console.error("Falta información en localStorage")
        return
      }
  
      const historia = JSON.parse(historiaRaw)
      const ubicacion = JSON.parse(ubicacionRaw)
  
      console.log(historia)
      console.log(ubicacion)
  
      const payload = {
        titulo: historia.titulo,
        descripcion: historia.descripcion,
        fecha_inicio: historia.fecha_inicio,
        fecha_fin: historia.fecha_fin,
        imagen: historia.imagen,
        id_categoria: historia.id_categoria,
        id_ubicacion: ubicacion.id
      }
      console.log(payload)
      await apiService.post('history', payload)
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
          <DialogTitle>Agregar Noticia</DialogTitle>
          <DialogDescription>Agrega una nueva noticia.</DialogDescription>
        </DialogHeader>
        {!cambiarUbi ? (<div className='overflow-y-auto max-h-[90vh] pr-2'>
          <MapaInteractivo onSucces={enviar} />
        </div>
        ) : (
          <FormHistoria initialData={history}  setCreateUbi={handleChangeLocation} />
        )}
      </DialogContent>
    </Dialog>
  )
}
