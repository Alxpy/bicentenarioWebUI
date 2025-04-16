import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiArrowRight, FiSearch } from 'react-icons/fi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IHistory } from '@/components/interface'
import MainLayout from '@/templates/MainLayout'
import { useState } from 'react'

// Mock data - Reemplazar con tus datos reales
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
  },
  {
    id: 2,
    titulo: 'Independencia de Bolivia',
    descripcion: 'Proceso independentista que culminó el 6 de agosto de 1825 con la creación de la República de Bolivia.',
    fechaInicio: '1809',
    fechaFin: '1825',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Declaraci%C3%B3n_de_Independencia_del_Alto_Per%C3%BA_%28Bolivia%29.jpg/800px-Declaraci%C3%B3n_de_Independencia_del_Alto_Per%C3%BA_%28Bolivia%29.jpg',
    id_ubicacion: 2,
    id_categoria: 2,
    ubicacion: {
      id: 2,
      nombre: 'Sucre',
      descripcion: 'Capital histórica',
      latitud: -19.0476,
      longitud: -65.2596,
      imagen: ''
    },
    categoria: { id: 2, nombre: 'Independencia', descripcion: 'Proceso independentista' },
    estado: true
  },
  {
    id: 3,
    titulo: 'Revolución Nacional de 1952',
    descripcion: 'Movimiento revolucionario que marcó un hito en la historia boliviana con reformas como el voto universal y la nacionalización de minas.',
    fechaInicio: '1952',
    fechaFin: '1952',
    imagen: 'https://www.eldiario.net/fotos/2022/04/09/o_1683f6f7a8.jpg',
    id_ubicacion: 3,
    id_categoria: 3,
    ubicacion: {
      id: 3,
      nombre: 'La Paz',
      descripcion: 'Sede de gobierno',
      latitud: -16.4955,
      longitud: -68.1336,
      imagen: ''
    },
    categoria: { id: 3, nombre: 'Revoluciones', descripcion: 'Movimientos sociales' },
    estado: true
  }
]

// Categorías disponibles
const categorias = [
  { id: 0, nombre: 'Todas las categorías' },
  { id: 1, nombre: 'Batallas' },
  { id: 2, nombre: 'Independencia' },
  { id: 3, nombre: 'Revoluciones' }
]

export const Historia = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)

  // Filtrar historias
  const filteredHistorias = historias.filter(historia => {
    const matchesSearch = historia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         historia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 0 || historia.id_categoria === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-gradient-to-b from-sky-100 to-blue-400 py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-800 mb-6 text-center"
          >
            Historia de Bolivia
          </motion.h1>

          {/* Filtros de búsqueda */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar historias..."
                className="pl-9 bg-white/90"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory.toString()} onValueChange={(value) => setSelectedCategory(Number(value))}>
              <SelectTrigger className="bg-white/90 ">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Resultados */}
          {filteredHistorias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHistorias.map((historia, index) => (
                <motion.div
                  key={historia.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                    <div className="relative h-48">
                      <img
                        src={historia.imagen}
                        alt={historia.titulo}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                    </div>

                    <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                            {historia.categoria.nombre}
                          </span>
                          <span className="text-slate-600 text-sm flex items-center">
                            <FiMapPin className="mr-1" />
                            {historia.ubicacion.nombre}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {historia.titulo}
                        </h3>
                        <p className="text-slate-600 line-clamp-3 mb-4">
                          {historia.descripcion}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-slate-500 flex items-center text-sm">
                          <FiCalendar className="mr-2" />
                          {historia.fechaInicio} - {historia.fechaFin}
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 text-blue-800 border-blue-300 hover:bg-blue-100">
                          Ver más
                          <FiArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-600 text-lg">No se encontraron historias que coincidan con tu búsqueda.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(0)
                }}
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}