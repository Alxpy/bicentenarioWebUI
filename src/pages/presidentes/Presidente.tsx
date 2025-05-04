import MainLayout from '@/templates/MainLayout'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { iPresidente } from '@/components/interface'
import { apiService } from '@/service/apiservice'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight, FiCalendar } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const Presidente = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedParty, setSelectedParty] = useState('')
    const [presidentes, setPresidentes] = useState<iPresidente[]>([{
        id: 0,
        id_usuario: 0,
        nombre: '',
        apellido: '',
        imagen: '',
        inicio_periodo: '',
        fin_periodo: '',
        bibliografia: '',
        partido_politico: '',
        principales_politicas: '',
    }])
    const [politicalParties, setPoliticalParties] = useState<string[]>([])
    const [, setShowPresidente] = useLocalStorage<iPresidente | null>('showPresidente', null)

    useEffect(() => {
        const fetchPresidentes = async () => {
            try {
                const data: any = await apiService.get('president').then((response) => { return response.data })
                console.log(data)
                setPresidentes(data)

                const parties : any = Array.from(new Set(data.map(p => p.partido_politico)))
                setPoliticalParties(parties)
            } catch (error) {
                console.error('Error fetching presidentes:', error)
            }
        }
        fetchPresidentes()
    }, [])

    const filteredPresidentes = presidentes.filter(presidente => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            `${presidente.nombre} ${presidente.apellido}`.toLowerCase().includes(searchLower) ||
            presidente.partido_politico.toLowerCase().includes(searchLower) ||
            presidente.principales_politicas.toLowerCase().includes(searchLower);

        const matchesParty = selectedParty === 'todos' ||
            selectedParty === '' ||
            presidente.partido_politico === selectedParty;

        return matchesSearch && matchesParty;
    });



    return (
        <MainLayout>
            <div className="w-full min-h-screen bg-gradient-to-b from-sky-100 to-blue-400 py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-800 mb-6 text-center"
                    >
                        Presidentes de Bolivia
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
                                placeholder="Buscar presidentes..."
                                className="pl-9 bg-white/90"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select
                            value={selectedParty}
                            onValueChange={(value) => setSelectedParty(value === 'todos' ? '' : value)}
                        >
                            <SelectTrigger className="bg-white/90">
                                <SelectValue placeholder="Filtrar por partido político" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los partidos</SelectItem>
                                {politicalParties.map((party, index) => (
                                    <SelectItem key={index} value={party}>
                                        {party}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* Resultados */}
                    {filteredPresidentes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPresidentes.map((presidente, index) => (
                                <motion.div
                                    key={presidente.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                                        <div className="relative h-48">
                                            <img
                                                src={presidente.imagen}
                                                alt={`${presidente.nombre} ${presidente.apellido}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                                        </div>

                                        <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                                                        {presidente.partido_politico}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                                    {presidente.nombre} {presidente.apellido}
                                                </h3>
                                                <p className="text-slate-600 line-clamp-3 mb-4">
                                                    {presidente.principales_politicas}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-slate-500 flex items-center text-sm">
                                                    <FiCalendar className="mr-2" />
                                                    {presidente.inicio_periodo} - {presidente.fin_periodo}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-blue-800 border-blue-300 hover:bg-blue-100"
                                                    onClick={() => {
                                                        setShowPresidente(presidente)
                                                        navigate(`/presidente/detalle`)
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
                            <p className="text-slate-600 text-lg">No se encontraron presidentes que coincidan con tu búsqueda.</p>
                            <Button
                                variant="ghost"
                                className="mt-4 text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedParty('')
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