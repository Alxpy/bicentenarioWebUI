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


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[100vh] bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden text-white">
        <DialogHeader>
          <DialogTitle>Agregar Evento</DialogTitle>
          <DialogDescription>Agrega una nuevo evento.</DialogDescription>
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
