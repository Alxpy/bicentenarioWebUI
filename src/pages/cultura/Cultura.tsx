import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiArrowRight, FiCalendar } from 'react-icons/fi'
import useLocalStorage from '@/hooks/useLocalStorage'
import MainLayout from '@/templates/MainLayout'
import { apiService } from '@/service/apiservice'
import { ICultura, IUbicacionGeneral } from '@/components/interface'
import { MapaMultiple } from '@/components/ubicacion/MapaMultiple'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const Cultura = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [culturas, setCulturas] = useState<ICultura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCultura, setSelectedCultura] = useLocalStorage<ICultura | null>('selectedCultura', null)
  const [mapKey, setMapKey] = useState(Date.now())

  useEffect(() => {
    const fetchCulturas = async () => {
      setLoading(true)
      setError(null)
      try {
        const response : any = await apiService.get('cultures')
        setCulturas(response.data)
      } catch (error) {
        console.error('Error fetching culturas:', error)
        setError('Error al cargar las etnias')
      } finally {
        setLoading(false)
      }
    }
    fetchCulturas()
    return () => {
      // Resetear el mapa al desmontar
      setMapKey(Date.now())
    }
  }, [])

  const filteredCulturas = culturas.filter(cultura => 
    cultura.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cultura.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const ubicaciones : IUbicacionGeneral[] = culturas.map(cultura => ({
    id: cultura.id,
    nombre: cultura.nombre,
    latitud: cultura.latitud,
    longitud: cultura.longitud,
    id_x: cultura.id
  }))


  const onClickMarkerMap = async (id: number) => {
    const cultura = culturas.find(c => c.id === id)
    if (cultura) {
      await setSelectedCultura(cultura)
      await navigate(`/cultura/${id}`)
    }
  }


  return (
    <MainLayout>
      <div className="grid grid-cols-6 grid-rows-5 gap-0 h-screen y-overflow-hidden">
      
        <div className="col-span-6 row-span-1 p-6 bg-slate-50">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-800 mb-6 text-center"
          >
            Etnias de Bolivia
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar etnias..."
                className="pl-9 text-slate-800 bg-white/90"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        <div className="col-span-3 row-span-4 row-start-2 col-start-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-600">Cargando etnias...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredCulturas.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredCulturas.map((cultura, index) => (
                <motion.div
                  key={cultura.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-1/3">
                        <img
                          src={cultura.imagen}
                          alt={cultura.nombre}
                          className="w-full h-40 object-cover rounded-l-lg"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMapPin className="text-slate-500" />
                          <span className="text-sm text-slate-600">
                            {cultura.nombre_ubicacion}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {cultura.nombre}
                        </h3>
                        <p className="text-slate-600 line-clamp-3 mb-4">
                          {cultura.descripcion}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-2 text-blue-800"
                          onClick={ async () => {
                            await setSelectedCultura(cultura)
                            await navigate(`/cultura/${cultura.id}`)
                          }}
                        >
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
              <p className="text-slate-600 text-lg">No se encontraron etnias que coincidan con tu búsqueda.</p>
              <Button
                variant="ghost"
                className="mt-4 text-blue-600 hover:text-blue-800"
                onClick={() => setSearchTerm('')}
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </div>

        <div className="col-span-3 row-span-4 row-start-2 col-start-4 p-6">
          <div className="h-full rounded-lg overflow-hidden shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-slate-600">Cargando mapa...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <MapaMultiple ubicaciones={ubicaciones}  onClick={onClickMarkerMap} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}