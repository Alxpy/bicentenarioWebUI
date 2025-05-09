import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiService } from '@/service/apiservice';
import { toast } from 'sonner';
import { ICultura, iEvento, iUser, iPatrocinador, iPatrocinadorCreate } from '@/components/interface';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { se } from 'date-fns/locale';
import useLocalStorage from '@/hooks/useLocalStorage';

const formSchema = z.object({
    nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
    descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
    imagen: z.string().optional(),
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional(),
    id_tipo_evento: z.number().optional(),
    id_ubicacion: z.number().optional(),
    id_usuario: z.number().optional(),
    precio: z.string().optional(),
    modalidad: z.string().optional(),
    id_organizador: z.number().optional(),
    patrocinadores: z.array(z.number()).optional(),
    expositores: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormEventoProps {
    initialData?: iEvento;
    setCreateUbi?: (value: boolean) => void;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface iTipoEvento {
    id: number;
    nombre_evento: string
}

export const FormEvento = ({ initialData, setCreateUbi, onSuccess, onCancel }: FormEventoProps) => {
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [patrocinadores, setPatrocinadores] = useState<iPatrocinador[]>([]);
    const [organizadores, setOrganizadores] = useState<iUser[]>([]);
    const [usuarios, setUsuarios] = useState<iUser[]>([]);
    const [tipoEventos, setTipoEventos] = useState<iTipoEvento[]>([]);
    const [userLogged,] = useLocalStorage('user', null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            imagen: '',
            fecha_inicio: '',
            fecha_fin: '',
            id_tipo_evento: 0,
            id_ubicacion: 0,
            id_usuario: userLogged?.id || 0,
            precio: '',
            modalidad: '',
            id_organizador: 0,
            patrocinadores: [],
            expositores: [],
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
            setPreviewUrl(initialData.imagen || '');
        }
    }, [initialData, form]);

    useEffect(() => {
        handlePatrocinadores().then((data) => {
            setPatrocinadores(data);
        });
        handleOrganizadores();
        handleUsuarios();
        handleTipoEventos();
    }, []);

    const handlePatrocinadores = async () => {
        const response = await apiService.get('patrocinadores');
        const data: iPatrocinador[] = response.data;
        return data;
    }

    const handleOrganizadores = async () => {
        //   const response = await apiService.get('users?rol=organizador');
        const response = await apiService.get('user');
        const data: iUser[] = response.data;
        setOrganizadores(data);

    }

    const handleTipoEventos = async () => {
        const response = await apiService.get('tipo_evento');
        const data: iTipoEvento[] = response.data;
        setTipoEventos(data);
    }

    const handleUsuarios = async () => {
        //const response = await apiService.get('users?rol=usuario');
        const response = await apiService.get('user');
        const data: iUser[] = response.data;
        setUsuarios(data);
    }



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            form.setValue('imagen', '#uploaded-file');
        }
    };


    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiService.postFiles('files/upload?max_file_size=10485760', formData);
            return response.data.file_url;
        } catch (error) {
            toast.error('Error subiendo imagen');
            throw error;
        }
    };
    const formatDateToDDMMYYYY = (isoDate: string): string => {
        if (!isoDate) return '';

        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return isoDate; // Si la fecha no es válida, devuelve el valor original

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const handleSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            let imageUrl = values.imagen;

            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const payload = {
                ...values,
                imagen: imageUrl || '',
                id_ubicacion: initialData?.id_ubicacion || 0
            };

            if (initialData) {
                await apiService.put(`evento/${initialData.id}`, payload);
                toast.success('Cultura actualizada correctamente');
            } else {
                localStorage.setItem('evento', JSON.stringify(payload));
                toast.success('Cultura creada correctamente');
                setCreateUbi && setCreateUbi(true);
            }

            onSuccess?.();
        } catch (error) {
            console.error('Error:', error);
            toast.error(initialData ? 'Error actualizando cultura' : 'Error creando cultura');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="overflow-y-auto max-h-[80vh] pr-2 space-y-3">
                {/* Sección Principal */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Nombre del Evento */}
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base">Nombre del Evento</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Festival Cultural Andino"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="rounded-lg bg-muted/50"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Organizador */}
                    <FormField
                        control={form.control}
                        name="id_organizador"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base">Organizador</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Selecciona un organizador" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-lg">
                                        {organizadores.map((organizador) => (
                                            <SelectItem
                                                value={organizador.id.toString()}
                                                className="focus:bg-accent/50"
                                            >
                                                {organizador.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Fecha de Inicio */}
                    <FormField
                        control={form.control}
                        name="fecha_inicio"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base">Fecha de Inicio</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            {...field}
                                            disabled={isSubmitting}
                                            className="rounded-lg bg-muted/50 flex-1"
                                            value={field.value?.split('T')[0] || ''}
                                            onChange={(e) => {
                                                const date = e.target.value;
                                                field.onChange(date ? `${date}T00:00:00` : '');
                                            }}
                                        />
                                        
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fecha de Fin */}
                    <FormField
                        control={form.control}
                        name="fecha_fin"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base">Fecha de Fin</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            {...field}
                                            disabled={isSubmitting}
                                            className="rounded-lg bg-muted/50 flex-1"
                                            value={field.value?.split('T')[0] || ''}
                                            onChange={(e) => {
                                                const date = e.target.value;
                                                field.onChange(date ? `${date}T23:59:59` : '');
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* Descripción */}
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-base">Descripción</FormLabel>
                            <FormControl>
                                <textarea
                                    placeholder="Descripción detallada de la cultura..."
                                    {...field}
                                    disabled={isSubmitting}
                                    className="flex h-32 w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sección de Imagen */}
                <div className="space-y-4 rounded-lg border bg-muted/20 p-6">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant={imageMode === 'url' ? 'default' : 'outline'}
                            onClick={() => setImageMode('url')}
                            className="flex-1 rounded-lg"
                        >
                            🖼️ Usar URL
                        </Button>
                        <Button
                            type="button"
                            variant={imageMode === 'upload' ? 'default' : 'outline'}
                            onClick={() => setImageMode('upload')}
                            className="flex-1 rounded-lg"
                        >
                            📤 Subir Imagen
                        </Button>
                    </div>

                    {imageMode === 'url' && (
                        <FormField
                            control={form.control}
                            name="imagen"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>URL de la Imagen</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            {...field}
                                            disabled={isSubmitting}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setPreviewUrl(e.target.value);
                                            }}
                                            className="rounded-lg bg-muted/50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {imageMode === 'upload' && (
                        <FormItem className="space-y-2">
                            <FormLabel>Subir Imagen</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    className="cursor-pointer rounded-lg border bg-muted/50 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-accent-foreground"
                                />
                            </FormControl>
                            <FormMessage>{form.formState.errors.imagen?.message}</FormMessage>
                        </FormItem>
                    )}

                    {previewUrl && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Vista previa:</p>
                            <div className="relative aspect-video overflow-hidden rounded-lg border">
                                <img
                                    src={previewUrl}
                                    alt="Previsualización"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tipo de Evento */}
                <FormField
                    control={form.control}
                    name="id_tipo_evento"
                    render={({ field }) => (

                        <FormItem className="space-y-2">
                            <FormLabel className="text-base">Tipo de Evento</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger className="rounded-lg">
                                        <SelectValue placeholder="Selecciona un tipo de evento" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-lg">
                                    {tipoEventos.map((tipo_evento) => (
                                        <SelectItem
                                            key={tipo_evento.id}
                                            value={tipo_evento.id.toString()}
                                            className="focus:bg-accent/50"
                                        >
                                            {tipo_evento.nombre_evento}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>


                    )}
                />

                 {/* Modalidad de Evento Virtual o Presencial */}
                <FormField
                    control={form.control}
                    name="modalidad"
                    render={({ field }) => (

                        <FormItem className="space-y-2">
                            <FormLabel className="text-base">Modalidad de Evento</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger className="rounded-lg">
                                        <SelectValue placeholder="Selecciona un tipo de evento" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-lg">
                                    <SelectItem
                                        key={1}
                                        value={"1"}
                                        className="focus:bg-accent/50"
                                    >
                                        Presencial
                                    </SelectItem>
                                    <SelectItem
                                        key={2}
                                        value={"2"}
                                        className="focus:bg-accent/50"
                                    >
                                        Virtual 
                                    </SelectItem>


                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>


                    )}
                />

                {/* Precio */}
                <FormField
                        control={form.control}
                        name="precio"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base">Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: 00.00"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="rounded-lg bg-muted/50"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                {/*Expositores */}
                

                {/* Patrocinadores */}
                <FormField
                    control={form.control}
                    name="patrocinadores"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-base">Patrocinadores</FormLabel>
                            <FormControl>
                                <div className="space-y-4 rounded-lg border bg-muted/20 p-6">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {patrocinadores.map((patrocinador) => {
                                            const isChecked = field.value?.includes(patrocinador.id);
                                            return (
                                                <label
                                                    key={patrocinador.id}
                                                    className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${isChecked
                                                        ? 'border-primary bg-primary/10'
                                                        : 'hover:bg-muted/30'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={patrocinador.id}
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const value = parseInt(e.target.value);
                                                            let newValue = [...(field.value || [])];

                                                            if (checked) {
                                                                newValue.push(value);
                                                            } else {
                                                                newValue = newValue.filter((id) => id !== value);
                                                            }

                                                            field.onChange(newValue);
                                                        }}
                                                        disabled={isSubmitting}
                                                        className="h-4 w-4 rounded border accent-primary"
                                                    />
                                                    <span className="text-sm">{patrocinador.nombre}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => console.log("Abrir diálogo")}
                                        className="w-full rounded-lg"
                                    >
                                        ＋ Registrar nuevo patrocinador
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Acciones */}
                <div className="flex justify-end gap-4 pt-6">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="rounded-lg px-6"
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-amber-600 px-6 hover:bg-amber-700"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Procesando...
                            </span>
                        ) : initialData ? (
                            'Guardar Cambios'
                        ) : (
                            'Crear Nueva Cultura'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
