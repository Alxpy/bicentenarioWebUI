import MainLayout from '@/templates/MainLayout'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { iNews } from '@/components/interface'
import { apiService } from '@/service/apiservice'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight, FiCalendar } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const Noticias = () => {
    const navigate = useNavigate()
    const [news, setNews] = useState<iNews[]>([])
    const [filteredNews, setFilteredNews] = useState<iNews[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('todos')
    const [categories, setCategories] = useState<{ id: number; nombre_categoria: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [showNews, setShowNews] = useLocalStorage<iNews | null>('showNews', null)

    const fetchNews = async () => {
        setLoading(true)
        try {
            const response = await apiService.get('news')
            const data: iNews[] = response.data
            setNews(data)
            setFilteredNews(data)
        } catch (error) {
            console.error('Error fetching news:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await apiService.get('categories')
            const data: { id: number; nombre_categoria: string }[] = response.data
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        fetchNews()
        fetchCategories()
    }, [])

    useEffect(() => {
        // Filtrar noticias por término de búsqueda y categoría
        let filtered = news

        if (searchTerm) {
            filtered = filtered.filter(noticia =>
                noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                noticia.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory !== 'todos') {
            filtered = filtered.filter(noticia =>
                noticia.nombre_categoria === selectedCategory
            )
        }

        setFilteredNews(filtered)
    }, [searchTerm, selectedCategory, news])

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPP', { locale: es })
    }

    return (
        <MainLayout>
            <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-800 mb-6 text-center"
                    >
                        Últimas Noticias
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
                                placeholder="Buscar noticias..."
                                className="pl-9 bg-white/90 text-slate-500" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value)}
                        >
                            <SelectTrigger className="bg-white/90 text-slate-500">
                                <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas las categorías</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.nombre_categoria}>
                                        {category.nombre_categoria}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* Resultados */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNews.map((noticia, index) => (
                                <motion.div
                                    key={noticia.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col">
                                        <div className="relative h-48">
                                            <img
                                                src={noticia.imagen}
                                                alt={noticia.titulo}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                                            <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                                                {noticia.nombre_categoria}
                                            </Badge>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                                    {noticia.titulo}
                                                </h3>
                                                <p className="text-slate-600 line-clamp-3 mb-4">
                                                    {noticia.resumen}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-slate-500 flex items-center text-sm">
                                                    <FiCalendar className="mr-2" />
                                                    {formatDate(noticia.fecha_publicacion)}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-blue-800 border-blue-300 hover:bg-blue-100"
                                                    onClick={() => {
                                                        setShowNews(noticia)
                                                        navigate(`/noticias/${noticia.id}`)
                                                    }}
                                                >
                                                    Leer más
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
                            <p className="text-slate-600 text-lg">No se encontraron noticias que coincidan con tu búsqueda.</p>
                            <Button
                                variant="ghost"
                                className="mt-4 text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('todos')
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