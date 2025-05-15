import React from 'react';
import { iEvento, iPatrocinador, IUbicacion, IComentario, IComentarioEve,  iUser  } from '@/components/interface';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Mapa } from '@/components/ubicacion/Mapa';
import { apiService } from '@/service/apiservice';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, MapPin, User, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import MainLayout from '@/templates/MainLayout';
import { toast } from 'sonner';
import { FaMoneyBill } from 'react-icons/fa';
interface Expositor {
    id: number;
    nombre: string;
}
export const ShowEvento = () => {
    const [expositores, setExpositores] = React.useState<Expositor[]>([]);
    const [evento, setEvento] = useLocalStorage<iEvento>('selectedEvento', {} as iEvento);
    const [ubicacion, setUbicacion] = React.useState<IUbicacion>();
    const [patrocinadores, setPatrocinadores] = React.useState<iPatrocinador[]>([]);
    const [comentarios, setComentarios] = React.useState<IComentarioEve[]>([]);
    const [nuevoComentario, setNuevoComentario] = React.useState('');
    const [userC, setUser] = useLocalStorage<iUser | null>('user', null)
    const [isRegistered, setIsRegistered] = React.useState(false)
    const formatDateToDDMMYYYY = (isoDate: string): string => {
        if (!isoDate) return '';

        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return isoDate;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    console.log('Fetching expositores for evento ID:', evento);

    const fetchComments = async () => {
        await apiService.get(`comentario_evento`).then((response) => {
            const data: any = response.data
            const filteredComments = data.filter((comment: IComentarioEve) => comment.id_evento === evento?.id)
            setComentarios(filteredComments)
        })
    }

    const fetchData = async () => {
        try {
            const ubicacionResponse = await apiService.get<IUbicacion>(`location/${evento.id_ubicacion}`);
            setUbicacion(ubicacionResponse.data);

            const patrocinadoresResponse = await apiService.get(`patrocinador_evento/evento/${evento.id}`);
            setPatrocinadores(patrocinadoresResponse.data);

            const expositoresResponse = await apiService.get(`expositor/byEventoId/${evento.id}`);
            console.log('Expositores:', expositoresResponse.data);
            setExpositores(expositoresResponse.data);

            const isRegistradoEvento = await apiService.get(`usuario/{usuarioId}?usuario_eventoId=${userC?.id}`);
            const data = isRegistradoEvento.data
            const isRegistered = data.some((evento: any) => evento.id_evento === evento?.id);

            if (isRegistered) {
                setIsRegistered(true)
            }
            else {
                setIsRegistered(false)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const registerEvento = async () => {
        if (userC !== null) {
            await apiService.post('usuario_evento', {
                id_usuario: userC.id,
                id_evento: evento?.id || 0
            }).then((response) => {
                console.log(response)
                toast.success('Te has registrado en el evento correctamente')
                setIsRegistered(true)
            }).catch((error) => {
                console.error('Error al registrar el evento:', error);
            })
        }
        else {

            alert('Debes iniciar sesión para registrarte en el evento')
        }
    }

    const handleAddComment = async () => {
        const hoy = new Date()
        if (userC !== null) {
            const newCommentData: IComentario = {
                id: 0,
                id_usuario: userC.id,
                contenido: nuevoComentario,
                fecha_creacion: hoy.toISOString().split('T')[0]
            }
            await apiService.post('comentario', newCommentData).then(async (response) => {
                const data: any = response.data

                console.log(response)
                const newCommentBlb: any = {
                    id_comentario: data.id,
                    id_evento: evento?.id || 0
                }
                await apiService.post('comentario_evento', newCommentBlb).then((response) => {
                    console.log(response)
                })
            })
            if (nuevoComentario.trim()) {
                fetchComments()
                setNuevoComentario('')
            }
        }
        else {
            alert('Debes iniciar sesión para comentar')
        }
    }

    React.useEffect(() => {
        if (evento?.id) {
            fetchData();
            fetchComments();
        }
    }, [evento]);

    if (!evento?.id) return (
        <MainLayout>
            <div className="p-4 text-center w-full">Selecciona un evento para ver los detalles</div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="w-full px-4 py-6 max-w-7xl mx-auto space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                            <img
                                src={evento.imagen || '/placeholder-event.jpg'}
                                alt={evento.nombre}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            {!isRegistered ? (<Button className="w-full sm:w-auto" onClick={() => registerEvento()}>
                                Registrarse en el evento
                            </Button>) : (
                                <Button className="w-full sm:w-auto" disabled>
                                    Ya estás registrado
                                </Button>
                            )}
                        </div>
                        <div>
                            <h1 className="text-slate-900 text-3xl  font-bold">{evento.nombre}</h1>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>Organizado por {evento.nombre_organizador}</span>
                            </div>
                        </div>

                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <CalendarDays className="h-5 w-5 mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-medium">Fecha</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDateToDDMMYYYY(evento.fecha_inicio)} - {formatDateToDDMMYYYY(evento.fecha_fin)}
                                        </p>
                                    </div>
                                </div>

                                {evento.categoria === 'presencial' ? (
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                                        <div>
                                            <p className="font-medium">Ubicación</p>
                                            <p className="text-sm text-muted-foreground">{evento.nombre_ubicacion}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <p className="font-medium">Enlace</p>
                                            <p className="text-sm text-muted-foreground">{evento.enlace}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <User className="h-5 w-5 mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-medium">Responsable</p>
                                        <p className="text-sm text-muted-foreground">{evento.nombre_usuario}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaMoneyBill className="h-5 w-5 mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-medium">Costo</p>
                                        <p className="text-sm text-muted-foreground">{evento.precio}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Acerca del Evento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{evento.descripcion}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {evento.categoria === 'presencial' && (
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ubicación</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ubicacion && (
                                        <div className="h-64 rounded-lg overflow-hidden">
                                            <Mapa ubicacion={ubicacion} key={`map-${ubicacion.id}`} />
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-muted-foreground">{ubicacion?.nombre || 'Cargando ubicación...'}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
                {expositores.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Expositores</h2>
                        <Carousel className="w-full">
                            <CarouselContent>
                                {expositores.map((expositor) => (
                                    <CarouselItem key={expositor.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                        <div className="p-2">
                                            <Card className="h-full transition-all hover:shadow-md">
                                                <CardContent className="flex flex-col items-center p-6 gap-4">
                                                    <Avatar className="h-20 w-20 bg-primary/10">
                                                        <AvatarFallback className="text-lg bg-primary/20 text-primary">
                                                            {expositor.nombre.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="text-center space-y-1">
                                                        <p className="font-medium">{expositor.nombre}</p>
                                                        <p className="text-sm text-muted-foreground">Expositor</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden sm:flex" />
                            <CarouselNext className="hidden sm:flex" />
                        </Carousel>
                    </div>
                )}
                {patrocinadores.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Patrocinadores</h2>
                        <Carousel className="w-full">
                            <CarouselContent>
                                {patrocinadores.map((patrocinador) => (
                                    <CarouselItem key={patrocinador.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                        <div className="p-2">
                                            <Card className="h-full transition-all hover:shadow-md">
                                                <CardContent className="flex flex-col items-center p-6 gap-4">
                                                    <Avatar className="h-20 w-20">
                                                        <AvatarImage src={patrocinador.imagen} />
                                                        <AvatarFallback>{patrocinador.nombre.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="text-center space-y-1">
                                                        <p className="font-medium">{patrocinador.nombre}</p>
                                                        <p className="text-sm text-muted-foreground">{patrocinador.contacto}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden sm:flex" />
                            <CarouselNext className="hidden sm:flex" />
                        </Carousel>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" /> Comentarios
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">



                                <div className="space-y-4 overflow-y-auto max-h-60">
                                    {comentarios.length > 0 ? (
                                        comentarios.map((comentario) => (
                                            <Card key={comentario.id_comentario} className="border-none shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium">{comentario.nombre}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(comentario.fecha_creacion).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{comentario.contenido}</p>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No hay comentarios aún</p>
                                    )}
                                </div>

                                <Textarea
                                    value={nuevoComentario}
                                    onChange={(e) => setNuevoComentario(e.target.value)}
                                    placeholder="Escribe tu comentario..."
                                    className="min-h-[100px]"
                                />
                                <Button className="w-full sm:w-auto" onClick={handleAddComment}>
                                    Publicar comentario
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};