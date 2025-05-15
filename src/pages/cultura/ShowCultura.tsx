import { apiService } from '@/service/apiservice'
import React from 'react'
import { ICultura, IUbicacion } from '@/components/interface'
import useLocalStorage from '@/hooks/useLocalStorage'
import {Mapa} from '@/components/ubicacion/Mapa'
import MainLayout from '@/templates/MainLayout'
import { useParams } from 'react-router-dom'
interface IMultimediacultura {
  id_multimedia: number;
  id_cultura: number;
  enlace: string;
  tipo: string;
}

interface IComentario {
  id: number;
  contenido: string;
  fecha: string;
  usuario: string;
}


export const ShowCultura = () => {
  const [multimedia, setMultimedia] = React.useState<IMultimediacultura[]>([])
  const [ubicacion, setUbicacion] = React.useState<IUbicacion>()
  const [comentarios, setComentarios] = React.useState<IComentario[]>([])
  const [nuevoComentario, setNuevoComentario] = React.useState('')
  const [cultura, setshowICultura] = useLocalStorage<ICultura>('selectedCultura',{} as ICultura)
  const { id } = useParams<{ id: string }>()
  React.useEffect(() => {
    console.log(cultura)
    if (cultura.id === undefined ) {
      const getch = async () => { 
        console.log(id)
        if (id) {
          const response = await apiService.get<ICultura>(`cultures/${id}`)
          setshowICultura(response.data)
        }
      }
      getch()
    }

    const fetchData = async () => {
      try {
        // Fetch multimedia
        const multimediaResponse = await apiService.get<IMultimediacultura[]>(
          `multimedia_cultura/byCulturaId/${cultura.id}`
        )
        setMultimedia(multimediaResponse.data)

        // Fetch ubicación
        const ubicacionResponse = await apiService.get<IUbicacion>(
          `location/${cultura.id_ubicacion}`
        )
        setUbicacion(ubicacionResponse.data)

        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [cultura.id])

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return

    try {
      // Simular envío de comentario
      const response = await apiService.post<IComentario>('comentarios', {
        contenido: nuevoComentario,
        culturaId: cultura.id,
        usuario: "Usuario Actual" // Reemplazar con usuario real
      })
      
      setComentarios([...comentarios, response.data])
      setNuevoComentario('')
    } catch (error) {
      console.error('Error enviando comentario:', error)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{cultura.nombre}</h1>
        
      </div>

      {/* Imagen principal */}
      {cultura.imagen && (
        <img
          src={cultura.imagen}
          alt={cultura.nombre}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      {/* Descripción */}
      <p className="text-lg leading-relaxed">{cultura.descripcion}</p>

      {/* Multimedia */}
      {multimedia.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {multimedia.map((media) => (
            <div key={media.id_multimedia} className="aspect-square">
              {media.tipo === 'imagen' ? (
                <img
                  src={media.enlace}
                  alt="Multimedia"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <video controls className="w-full h-full object-cover rounded-lg">
                  <source src={media.enlace} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ubicación */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Ubicación</h2>
        {ubicacion ? (
          <div>
            <p>{ubicacion.nombre}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {ubicacion.latitud}, {ubicacion.longitud}
            </p>
            <Mapa ubicacion={ubicacion} key={`map-${ubicacion.id}`} />
          </div>
        ) : (
          <p>Cargando ubicación...</p>
        )}
      </div>

    </div>
    </MainLayout>
  )
}