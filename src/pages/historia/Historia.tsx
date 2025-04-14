import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IHistory } from '@/components/interface'
import MainLayout from '@/templates/MainLayout'
const historias: IHistory[] = [
  {
    id: 1,
    titulo: 'Guerra del Pacífico',
    descripcion: 'La guerra del Pacífico fue un conflicto armado ocurrido entre 1879 y 1884 que enfrentó a Chile y a los aliados Bolivia y Perú.',
    fechaInicio: '1879',
    fechaFin: '1884',
    imagen: 'https://i.pinimg.com/736x/08/ea/d8/08ead837b1c3bd53daad81ad08bc95c9.jpg',
    id_ubicacion: 1,
    id_categoria: 1,
    ubicacion: {
      id: 1,
      nombre: 'Viejo Puerto',
      descripcion: 'Zona portuaria histórica',
      latitud: -12.3456,
      longitud: -76.7890,
      imagen: ''
    },
    categoria: { id: 1, nombre: 'Batallas', descripcion: 'Historia' },
    estado: true
  }
]

export const Historia = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-emerald-800 mb-12 text-center"
          >
            Historia de Bolivia
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {historias.map((historia, index) => (
              <motion.div
                key={historia.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={historia.imagen}
                      alt={historia.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded-full">
                          {historia.categoria.nombre}
                        </span>
                        <span className="text-slate-500 text-sm flex items-center">
                          <FiMapPin className="mr-1" />
                          {historia.ubicacion.nombre}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                        {historia.titulo}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 mb-4">
                        {historia.descripcion}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-slate-500 flex items-center">
                        <FiCalendar className="mr-2" />
                        {historia.fechaInicio} - {historia.fechaFin}
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        Ver más
                        <FiArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}