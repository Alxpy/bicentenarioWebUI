import MainLayout from '@/templates/MainLayout'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '@/hooks/useLocalStorage'
import { ILibro, IComentario,  IComentarioResponse ,iUser, ICreateComentarioBlb, IComentarioBlb} from '@/components/interface'
import { Button } from '@/components/ui/button'
import { CalendarDays, ArrowLeft, MessageSquare, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiService } from '@/service/apiservice'

export const ShowLibro = () => {
  const navigate = useNavigate()
  const [showLibro, setShowLibro] = useLocalStorage<ILibro | null>('showLibro', null)
  const [userC, setUser] = useLocalStorage<iUser | null>('user', null)
  const [comments, setComments] = useState<IComentarioBlb[]>([])
  const [newComment, setNewComment] = useState('')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const fetchComments = async () => {
    await apiService.get(`comentario_biblioteca`).then((response) => {
      const data : any = response.data
      const filteredComments = data.filter((comment: IComentarioBlb) => comment.id_biblioteca === showLibro?.id)
      setComments(filteredComments)
    })
  }

  useEffect(() => {
    fetchComments()
  }, [showLibro])

  const handleAddComment = async () => {
    const hoy =  new Date()
    if (userC !== null) {
      const newCommentData: IComentario = {
        id: 0,
        id_usuario: userC.id,
        contenido: newComment,
        fecha_creacion: hoy.toISOString().split('T')[0]
      }
      await apiService.post('comentario', newCommentData).then(async (response) => {
          const data : any = response.data

          console.log(response)
          const newCommentBlb: ICreateComentarioBlb = {
            id_comentario: data.id,
            id_biblioteca: showLibro?.id || 0
          }
          await apiService.post('comentario_biblioteca', newCommentBlb).then((response) => {
            console.log(response)
          })
      })
    if (newComment.trim()) {
      fetchComments()
      setNewComment('')
    }
    }
  }

  if (!showLibro) {
    return (
      <MainLayout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-gray-600">No se ha seleccionado ningún libro</p>
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
                src={showLibro.imagen}
                alt={`${showLibro.titulo} - ${showLibro.autor}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">
                  {showLibro.titulo}
                </h1>
                <p className="text-lg mt-1">por {showLibro.autor}</p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarDays className="w-5 h-5" />
                  <span className="font-medium">
                    Publicado: {formatDate(showLibro.fecha_publicacion)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">
                    Edición: {showLibro.edicion}
                  </span>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-xl text-slate-600 font-semibold mb-4">Detalles del Libro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Tipo:</p>
                    <p className="text-slate-600">{showLibro.id_tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Fuente:</p>
                    <p className="text-slate-600">{showLibro.fuente}</p>
                  </div>
                </div>
              </section>

              {showLibro.enlace && (
                <section className="mb-8">
                  <h2 className="text-xl text-slate-600 font-semibold mb-4">Enlace externo</h2>
                  <a 
                    href={showLibro.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {showLibro.enlace}
                  </a>
                </section>
              )}

              <section className="mt-8 border-t pt-6">
                <h2 className="text-xl text-slate-600 font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comentarios ({comments.length})
                </h2>
                
                <div className="mb-6 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-slate-600 font-semibold">{comment.nombre}</p>
                        <p className="text-slate-700">{comment.contenido}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No hay comentarios aún</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="flex-1 border text-slate-600 border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button 
                    onClick={handleAddComment}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enviar
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}