import MainLayout from '@/templates/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import useLocalStorage from '@/hooks/useLocalStorage'
import { iNews } from '@/components/interface'
import { Button } from '@/components/ui/button'
import { CalendarDays, ArrowLeft, Newspaper, User, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiService } from '@/service/apiservice'
import { aw } from 'node_modules/framer-motion/dist/types.d-6pKw1mTI'

export const ShowNews = () => {
    const navigate = useNavigate()
    const [showNews, setShowNews] = useLocalStorage<iNews | null>('showNews', null)
    const [loading, setLoading] = useState(true)
    const [relatedNews, setRelatedNews] = useState<iNews[]>([])
const { id } = useParams<{ id: string }>();
    // Formatear fecha en español
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "PPPP", { locale: es })
    }

    // Cargar noticias relacionadas
    useEffect(() => {
        const fetchRelatedNews = async () => {
            if (!showNews) {
                console.log('No hay noticias seleccionadas')
                const response = await apiService.get(`news/${id}`)
                setShowNews(response.data)
                console.log('Noticia seleccionada:', response.data)
            }
            
            try {
                // Aquí deberías hacer una llamada a tu API para obtener noticias relacionadas
                // por categoría o tema. Este es un ejemplo simulado:
                const response = await fetch(`/api/news/related/${showNews.id_Categoria}`)
                const data = await response.json()
                setRelatedNews(data.filter((news: iNews) => news.id !== showNews.id).slice(0, 3))
            } catch (error) {
                console.error("Error fetching related news:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRelatedNews()
    }, [showNews])

    if (!showNews) {
        return (
            <MainLayout>
                <div className="w-full min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">No se ha seleccionado ninguna noticia</p>
                    <Button 
                        variant="link" 
                        onClick={() => navigate('/noticias')}
                        className="ml-2 text-blue-600"
                    >
                        Volver al listado
                    </Button>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="w-full min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(-1)}
                        className="mb-6 gap-2 hover:bg-slate-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a noticias
                    </Button>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Imagen principal */}
                        <div className="relative h-96 bg-gray-200">
                            {loading ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <>
                                    <img
                                        src={showNews.imagen}
                                        alt={showNews.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <Badge className="mb-3 bg-blue-600 hover:bg-blue-700">
                                            {showNews.nombre_categoria}
                                        </Badge>
                                        <h1 className="text-4xl font-bold leading-tight">
                                            {showNews.titulo}
                                        </h1>
                                        <p className="text-lg mt-2 text-slate-200">
                                            {showNews.resumen}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Contenido */}
                        <div className="p-6 lg:p-8">
                            {/* Metadatos */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Autor: {showNews.nombre_usuario}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <CalendarDays className="w-5 h-5" />
                                    <span className="font-medium">Publicado: {formatDate(showNews.fecha_publicacion)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Tag className="w-5 h-5" />
                                    <span className="font-medium">Categoría: {showNews.nombre_categoria}</span>
                                </div>
                            </div>

                            {/* Contenido principal */}
                            <article className="prose lg:prose-xl max-w-none mb-12">
                                <div 
                                    className="text-slate-700 whitespace-pre-line leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: showNews.contenido }}
                                />
                            </article>

                            {/* Noticias relacionadas */}
                            {relatedNews.length > 0 && (
                                <section className="mt-12 border-t pt-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                                        <Newspaper className="w-6 h-6" />
                                        Noticias relacionadas
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {relatedNews.map(news => (
                                            <div 
                                                key={news.id} 
                                                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => {
                                                    setShowNews(news)
                                                    window.scrollTo(0, 0)
                                                }}
                                            >
                                                <div className="h-40 bg-gray-200 relative">
                                                    <img
                                                        src={news.imagen}
                                                        alt={news.titulo}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold line-clamp-2 mb-2">{news.titulo}</h3>
                                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                                        <CalendarDays className="w-4 h-4" />
                                                        {formatDate(news.fecha_publicacion)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}