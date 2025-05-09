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
import { toast } from 'sonner';
interface IBibliotecaProrops {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

import { TabsForm } from './TabsForm';

export const DialogAdd = ({ open, onClose, onSuccess }: IBibliotecaProrops) => {

  const [crateUbi, setCreateUbi] = React.useState(true)
  const enviar = async () => {
    try {
      // Obtener y validar datos del localStorage
      const eventoRaw = localStorage.getItem('evento');
      const ubicacionRaw = localStorage.getItem('ubicacion');
      
      if (!eventoRaw || !ubicacionRaw) {
        toast.error('Falta información requerida en el almacenamiento local');
        return;
      }
  
      // Parsear datos
      const evento = JSON.parse(eventoRaw);
      const ubicacion = JSON.parse(ubicacionRaw);
  
      // Validar estructura básica
      if (!ubicacion.id || !evento.patrocinadores) {
        toast.error('Datos en formato incorrecto');
        return;
      }
  
      // Construir payload del evento
      const payloadEvento = {
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        imagen: evento.imagen || '',
        fecha_inicio: evento.fecha_inicio || new Date().toISOString(),
        fecha_fin: evento.fecha_fin || new Date().toISOString(),
        id_tipo_evento: Number(evento.id_tipo_evento) || 1, // Valor por defecto
        id_ubicacion: Number(ubicacion.id),
        id_usuario: Number(evento.id_usuario),
        id_organizador: Number(evento.id_organizador),
      };
  
      // Crear el evento
      const responseEvento = await apiService.post('evento', payloadEvento);
      const nuevoEventoId = responseEvento.data.id;
  
      // Manejar patrocinadores
      if (evento.patrocinadores?.length > 0) {
        const promesasPatrocinadores = evento.patrocinadores.map(async (idPatrocinador: number) => {
          await apiService.post('patrocinador_evento', {
            id_evento: nuevoEventoId,
            id_patrocinador: Number(idPatrocinador),
          });
        });
  
        await Promise.all(promesasPatrocinadores);
      }
  
      // Limpiar localStorage
      localStorage.removeItem('evento');
      localStorage.removeItem('ubicacion');
  
      // Notificar éxito
      toast.success('Evento creado exitosamente');
      onSuccess?.();
  
    } catch (error) {
      console.error('Error en el proceso:', error);
      toast.error(error instanceof Error 
        ? error.message 
        : 'Ocurrió un error al crear el evento');
    }
  };
/*
 {!crateUbi ? (<div className='overflow-y-auto max-h-[90vh] pr-2'>
          <MapaInteractivo onSucces={enviar} />
        </div>

        ) : (
          <FormEvento setCreateUbi={() => setCreateUbi(false)} />
        )}*/


return (
  <Dialog  open={open} onOpenChange={onClose}>
    <DialogContent className="w-[95vw] min-w-[50vw] max-h-[90vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-y-auto text-white flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4">
        <DialogTitle className="text-2xl">Agregar Evento</DialogTitle>
        <DialogDescription>Complete los datos del nuevo evento</DialogDescription>
      </DialogHeader>
      
      <div className="flex-1 w-[100%] flex flex-col px-6 pb-6">
        <TabsForm />
      </div>
    </DialogContent>
  </Dialog>
)
}
