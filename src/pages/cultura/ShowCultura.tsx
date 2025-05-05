import { apiService } from '@/service/apiservice'
import React from 'react'
import { ICultura, IUbicacion } from '@/components/interface'
import useLocalStorage from '@/hooks/useLocalStorage'
import {Mapa} from '@/components/ubicacion/Mapa'
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

  React.useEffect(() => {
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

      {/* Comentarios */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comentarios</h2>
        
        <form onSubmit={handleSubmitComentario} className="space-y-2">
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Publicar comentario
          </button>
        </form>

        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{comentario.usuario}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(comentario.fecha).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{comentario.contenido}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}