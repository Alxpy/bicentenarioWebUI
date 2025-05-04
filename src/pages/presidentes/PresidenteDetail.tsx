import MainLayout from '@/templates/MainLayout'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '@/hooks/useLocalStorage'
import { iPresidente } from '@/components/interface'
import { Button } from '@/components/ui/button'
import { CalendarDays, ArrowLeft } from 'lucide-react'

export const PresidenteDetail = () => {
  const navigate = useNavigate()
  const [showPresidente, setShowPresidente] = useLocalStorage<iPresidente | null>('showPresidente', null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!showPresidente) {
    return (
      <MainLayout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-gray-600">No se ha seleccionado ningún presidente</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-64 bg-gray-200">
              <img
                src={showPresidente.imagen}
                alt={`${showPresidente.nombre} ${showPresidente.apellido}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">
                  {showPresidente.nombre} {showPresidente.apellido}
                </h1>
                <p className="text-lg mt-1">{showPresidente.partido_politico}</p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6 text-slate-600">
                <CalendarDays className="w-5 h-5" />
                <span className="font-medium">
                  {formatDate(showPresidente.inicio_periodo)} - {formatDate(showPresidente.fin_periodo)}
                </span>
              </div>

              <section className="mb-8">
                <h2 className="text-xl text-slate-600 font-semibold mb-4">Biografía</h2>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {showPresidente.bibliografia}
                </p>
              </section>

              <section>
                <h2 className="text-xl text-slate-600 font-semibold mb-4">Principales Políticas</h2>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {showPresidente.principales_politicas}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}