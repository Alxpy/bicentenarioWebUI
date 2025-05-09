import { apiService } from '@/service/apiservice'
import React from 'react'
import { IHistory, IUbicacion } from '@/components/interface'
import useLocalStorage from '@/hooks/useLocalStorage'
import {Mapa} from '@/components/ubicacion/Mapa'
import MainLayout from '@/templates/MainLayout'
interface IMultimediaHistoria {
  id_multimedia: number;
  id_historia: number;
  enlace: string;
  tipo: string;
}

interface IComentario {
  id: number;
  contenido: string;
  fecha: string;
  usuario: string;
}


export const ShowHistoria = () => {
  const [multimedia, setMultimedia] = React.useState<IMultimediaHistoria[]>([])
  const [ubicacion, setUbicacion] = React.useState<IUbicacion>()
  const [comentarios, setComentarios] = React.useState<IComentario[]>([])
  const [nuevoComentario, setNuevoComentario] = React.useState('')
  const [historia, setshowHistory] = useLocalStorage<IHistory>('showHistory',{} as IHistory)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch multimedia
        const multimediaResponse = await apiService.get<IMultimediaHistoria[]>(
          `multimedia_historia/ByHistoriaId/${historia.id}`
        )
        setMultimedia(multimediaResponse.data)

        // Fetch ubicación
        const ubicacionResponse = await apiService.get<IUbicacion>(
          `location/${historia.id_ubicacion}`
        )
        setUbicacion(ubicacionResponse.data)

        // Fetch comentarios (simulado)
        const comentariosResponse = await apiService.get<IComentario[]>(
          `comentarios/historia/${historia.id}`
        )
        setComentarios(comentariosResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [historia.id])

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return

    try {
      // Simular envío de comentario
      const response = await apiService.post<IComentario>('comentarios', {
        contenido: nuevoComentario,
        historiaId: historia.id,
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
        <h1 className="text-3xl font-bold">{historia.titulo}</h1>
        <div className="flex gap-4 text-gray-600 dark:text-gray-400">
          <span>
            {new Date(historia.fecha_inicio).toLocaleDateString()} -{' '}
            {new Date(historia.fecha_fin).toLocaleDateString()}
          </span>
          <span>•</span>
          <span>{historia.nombre_categoria}</span>
        </div>
      </div>

      {/* Imagen principal */}
      {historia.imagen && (
        <img
          src={historia.imagen}
          alt={historia.titulo}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      {/* Descripción */}
      <p className="text-lg leading-relaxed">{historia.descripcion}</p>

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