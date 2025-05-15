import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormGen } from './FormGen'
import { FormExpositores } from './FormExpo'
import { FormPatrocinadores } from './FormPatro'
import { MapaInteractivo } from '@/components/ubicacion/MapaInteractivo'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiService } from '@/service/apiservice'
import useLocalStorage from '@/hooks/useLocalStorage'
import { iEvento, iEventoCreate } from '@/components/interface'
import { FormCar } from './FormCar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const TabsForm = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [eventoData, setEventoData] = useLocalStorage<iEventoCreate>('eventoFormData', {
    
    nombre: '',
    descripcion: '',
    imagen: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_tipo_evento: 0,
    precio: 0,
    categoria: '',
    enlace: '',
    id_ubicacion: 0,
    id_usuario: 2,
    id_organizador: 2,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Orden de las pestañas
  const tabsOrder = ['general', 'feat', 'expositores', 'patrocinadores', 'ubicacion']
  
  const handlePartialSubmit = (data: Partial<iEvento>) => {
    setEventoData(prev => ({ ...prev, ...data }))
    toast.success('Datos guardados temporalmente')
  }

  const navigateToTab = (direction: 'next' | 'prev') => {
    const currentIndex = tabsOrder.indexOf(activeTab)
    if (direction === 'next' && currentIndex < tabsOrder.length - 1) {
      setActiveTab(tabsOrder[currentIndex + 1])
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabsOrder[currentIndex - 1])
    }
  }

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Validar datos completos antes de enviar
      if (!eventoData.nombre || !eventoData.descripcion) {
        throw new Error('Faltan datos generales del evento')
      }

      // Enviar datos al servidor
      const response = await apiService.post('eventos', eventoData)

      // Limpiar localStorage después del éxito
      setEventoData({
        nombre: '',
        descripcion: '',
        imagen: '',
        fecha_inicio: '',
        fecha_fin: '',
        id_tipo_evento: 0,
        precio: '',
        modalidad: '',
        enlace: '',
        id_ubicacion: 0,
        id_usuario: 0,
        id_organizador: 0,
      })

      toast.success('Evento creado exitosamente!')
      return response.data
    } catch (error) {
      console.error('Error al crear evento:', error)
      toast.error('Error al crear el evento')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Indicador de progreso */}
      <div className="flex items-center justify-between mb-6">
        <div className="hidden md:flex items-center space-x-4">
          {tabsOrder.map((tab, index) => (
            <div key={tab} className="flex items-center">
              <button
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${activeTab === tab ? 'bg-amber-600 text-white' : 'bg-muted text-muted-foreground'}`}
              >
                {index + 1}
              </button>
              {index < tabsOrder.length - 1 && (
                <div className={`w-16 h-1 ${tabsOrder.indexOf(activeTab) > index ? 'bg-amber-600' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Paso {tabsOrder.indexOf(activeTab) + 1} de {tabsOrder.length}
        </div>
      </div>

      <div  className="flex-1 overflow-y-auto w-full">
        <Tabs value={activeTab} className="w-full">
        {/* Tabs para mobile */}
        <div className="md:hidden mb-4">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="general">Generales</TabsTrigger>
            <TabsTrigger value="feat">Características</TabsTrigger>
            <TabsTrigger value="expositores">Expositores</TabsTrigger>
            <TabsTrigger value="patrocinadores">Patrocinadores</TabsTrigger>
          </TabsList>
        </div>

        {/* Tabs para desktop */}
        <div className="hidden md:block mb-6">
          <TabsList className="flex w-full space-x-2">
            <TabsTrigger value="general" className="flex-1">Datos Generales</TabsTrigger>
            <TabsTrigger value="feat" className="flex-1">Características</TabsTrigger>
            <TabsTrigger value="expositores" className="flex-1">Expositores</TabsTrigger>
            <TabsTrigger value="patrocinadores" className="flex-1">Patrocinadores</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <FormGen
            initialData={eventoData}
            onSuccess={(data) => {
              handlePartialSubmit(data)
              navigateToTab('next')
            }}
          />
        </TabsContent>

        <TabsContent value="feat">
          <FormCar
            initialData={eventoData}
            onSuccess={(data) => {
              handlePartialSubmit(data)
              navigateToTab('next')
            }}
            onBack={() => navigateToTab('prev')}
          />
        </TabsContent>

        <TabsContent value="expositores">
          <FormExpositores
            eventoId={eventoData.id?.toString()} // Asumiendo que el id se genera después
            onSuccess={() => navigateToTab('next')}
            onBack={() => navigateToTab('prev')}
          />
        </TabsContent>

        <TabsContent value="patrocinadores">
          <FormPatrocinadores
            eventoId={eventoData.id?.toString()}
            onSuccess={() => navigateToTab('next')}
            onBack={() => navigateToTab('prev')}
          />
        </TabsContent>

      </Tabs>
      </div>

      {/* Navegación entre pasos */}
      <div className="flex justify-between pt-6">
        {activeTab !== 'general' && (
          <Button
            variant="outline"
            onClick={() => navigateToTab('prev')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
        )}
        
        {activeTab !== 'ubicacion' ? (
          <Button
            onClick={() => navigateToTab('next')}
            className="ml-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="ml-auto bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando Evento...
              </span>
            ) : 'Crear Evento'}
          </Button>
        )}
      </div>
    </div>
  )
}