import React from 'react'
import { apiService } from '@/service/apiservice'
import { ILibro } from '@/components/interface'
import MainLayout from '@/templates/MainLayout'
import { Button } from '@/components/ui'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
interface DocumentType {
  id: number
  tipo: string
}

export const Biblioteca = () => {
  const [libros, setLibros] = React.useState<ILibro[]>([])
  const [documentTypes, setDocumentTypes] = React.useState<DocumentType[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<number | 'all'>('all')
  const [loading, setLoading] = React.useState(true)
  const [showLibro, setShowLibro] = useLocalStorage<ILibro | null>('showLibro', null)
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosResponse, typesResponse] = await Promise.all([
          apiService.get('library'),
          apiService.get('documentTypes')
        ])
        
        setLibros(librosResponse.data)
        setDocumentTypes(typesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredBooks = libros.filter(libro => {
    const matchesSearch = libro.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         libro.autor.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'all' || libro.id_tipo === selectedType
    
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="text-black container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Biblioteca Digital</h1>
        
        {/* Filtros y buscador */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            className="flex-1 input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select 
            className="select select-bordered w-full sm:w-48"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Todos los tipos</option>
            {documentTypes.map(type => (
              <option key={type.id} value={type.id}>{type.tipo}</option>
            ))}
          </select>
        </div>

        {/* Resultados */}
        {filteredBooks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No se encontraron libros con los criterios seleccionados
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((libro) => (
              <div key={libro.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="px-4 pt-4">
                  <img 
                    src={libro.imagen || '/placeholder-book.jpg'} 
                    alt={libro.titulo}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                
                <div className="card-body">
                  <h2 className="card-title">{libro.titulo}</h2>
                  <p className="text-sm text-gray-600">{libro.autor}</p>
                  
                  <div className="mt-2 text-sm">
                    <p>Publicación: {new Date(libro.fecha_publicacion).toLocaleDateString()}</p>
                    <p>Edición: {libro.edicion}</p>
                    <p>Fuente: {libro.fuente}</p>
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                   
                      <Button className="w-full"
                        onClick={() => {
                          setShowLibro(libro)
                          navigate('/showlibro')
                        }}
                      >
                        Ver Libro
                      </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}