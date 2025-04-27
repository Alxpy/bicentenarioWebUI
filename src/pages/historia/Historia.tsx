import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiArrowRight, FiSearch } from 'react-icons/fi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IHistory, ICategoria } from '@/components/interface'
import MainLayout from '@/templates/MainLayout'
import { useEffect, useState } from 'react'
import { apiService } from '@/service/apiservice'





export const Historia = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  // Mock data - Reemplazar con tus datos reales
  const [historias, setHistorias] = useState<IHistory[]>([])

  // Categorías disponibles
  const [categorias, setCategorias] = useState<ICategoria[]>([])


  const fetchHistorias = async () => {
    await apiService.get('history').then((response: any) => {
      console.log('Historias:', response.data)
      setHistorias(response.data)
    }).catch((error) => {
      console.error('Error fetching historias:', error)
    })
  }

  const fetchCategorias = async () => {
    await apiService.get('historyCategories').then((response: any) => {
      console.log('Categorías:', response.data)
      setCategorias(response.data)
    }).catch((error) => {
      console.error('Error fetching categorias:', error)
    })
  }

  useEffect(() => {
    fetchHistorias()
    fetchCategorias()
  }, [])
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
                            {historia.nombre_categoria}
                          </span>
                          <span className="text-slate-600 text-sm flex items-center">
                            <FiMapPin className="mr-1" />
                            {historia.nombre_ubicacion}
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
                          {historia.fecha_fin} - {historia.fecha_fin}
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