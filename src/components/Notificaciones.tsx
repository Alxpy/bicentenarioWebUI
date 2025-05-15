import React from 'react'
import { apiService } from '@/service/apiservice'
import { iEvento } from './interface'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuPortal,    <— comentamos el portal para simplificar
} from '@/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const Notificaciones = () => {
  const [eventos, setEventos] = React.useState<iEvento[]>([])

  const fetchEventos = async () => {
    try {
      const response = await apiService.get<iEvento[]>('evento')
      console.log('🏹 eventos raw:', response.data)
      
      // opcionalmente filtras los futuros:
      const futuros = response.data
        .filter(ev => new Date(ev.fecha_inicio) >= new Date())
        .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())
        .slice(0, 5)
      console.log('🎯 próximos:', futuros)
      
      setEventos(response.data)           // <- ojo que uses el filtrado
    } catch (error) {
      console.error('Error fetching eventos:', error)
    }
  }

  React.useEffect(() => {
    fetchEventos()
  }, [])

  const formatFecha = (fecha: string) =>
    format(new Date(fecha), "d 'de' MMMM", { locale: es })

  return (
    <div className="relative">
      {/* PRUEBA: forzamos abierto para ver el contenido */}
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {eventos.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {eventos.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        {/* sin portal por ahora */}
        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={4}
          className="w-72 z-50 bg-white border border-gray-200 shadow-lg"
        >
          <div className="p-2">
            <h3 className="font-semibold px-2">Eventos próximos</h3>
            {eventos.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No hay eventos próximos
              </p>
            ) : (
              eventos.map(ev => (
                <DropdownMenuItem
                  key={ev.id}
                  className="flex flex-col items-start gap-1 p-2 hover:bg-gray-100 rounded"
                  onSelect={() => console.log('clic en', ev.id)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium truncate">{ev.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFecha(ev.fecha_inicio)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">
                    {ev.nombre_ubicacion}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
