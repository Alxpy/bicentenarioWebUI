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


const formSchema = z.object({
    nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
    descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
    imagen: z.string().optional(),
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional(),
    id_tipo_evento: z.number().optional(),
    id_ubicacion: z.number().optional(),
    id_usuario: z.number().optional(),
    id_organizador: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormEventoProps {
    initialData?: iEvento;
    setCreateUbi?: (value: boolean) => void;
    onSuccess?: () => void;
    onCancel?: () => void;
}


export const FormEvento = ({ initialData, setCreateUbi, onSuccess, onCancel }: FormEventoProps) => {
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [patrocinadores, setPatrocinadores] = useState<iPatrocinador[]>([]);
    const [organizadores, setOrganizadores] = useState<iUser[]>([]);
    const [usuarios, setUsuarios] = useState<iUser[]>([]);

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
            id_usuario: 0,
            id_organizador: 0,
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Evento</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: ...."
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Descripción detallada de la cultura..."
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant={imageMode === 'url' ? 'default' : 'outline'}
                            onClick={() => setImageMode('url')}
                            className="flex-1"
                        >
                            Usar URL
                        </Button>
                        <Button
                            type="button"
                            variant={imageMode === 'upload' ? 'default' : 'outline'}
                            onClick={() => setImageMode('upload')}
                            className="flex-1"
                        >
                            Subir Imagen
                        </Button>
                    </div>

                    {imageMode === 'url' && (
                        <FormField
                            control={form.control}
                            name="imagen"
                            render={({ field }) => (
                                <FormItem>
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {imageMode === 'upload' && (
                        <FormItem>
                            <FormLabel>Subir Imagen</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    className="cursor-pointer"
                                />
                            </FormControl>
                            <FormMessage>
                                {form.formState.errors.imagen?.message}
                            </FormMessage>
                        </FormItem>
                    )}

                    {previewUrl && (
                        <div className="mt-4 border rounded-lg p-2">
                            <p className="text-sm font-medium mb-2">Vista previa:</p>
                            <img
                                src={previewUrl}
                                alt="Previsualización"
                                className="rounded-md object-contain max-h-48 w-full"
                            />
                        </div>
                    )}
                </div>
                <FormField
                    control={form.control}
                    name="id_organizador"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organizador</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un organizador" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {organizadores.map((organizador) => (
                                        <SelectItem key={organizador.id} value={organizador.id.toString()}>
                                            {organizador.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Select para Usuario */}
                <FormField
                    control={form.control}
                    name="id_usuario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usuario Responsable</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un usuario" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {usuarios.map((usuario) => (
                                        <SelectItem key={usuario.id} value={usuario.id.toString()}>
                                            {usuario.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Select múltiple para Patrocinadores */}
                <FormField
                    control={form.control}
                    name="patrocinadores"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold">Patrocinadores</FormLabel>
                            <FormControl>
                                <div className="space-y-3 bg-gray-800 p-4 rounded-md border">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {patrocinadores.map((patrocinador) => {
                                            const isChecked = field.value?.includes(patrocinador.id);
                                            return (
                                                <label
                                                    key={patrocinador.id}
                                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition"
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
                                                        className="accent-blue-600"
                                                    />
                                                    <span className="text-sm">{patrocinador.nombre}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Aquí llamas a tu función para abrir el diálogo
                                            console.log("Abrir diálogo para registrar patrocinador");
                                        }}
                                        className="mt-2 inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                    >
                                        Registrar nuevo patrocinador
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex justify-end gap-3">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-600 hover:bg-amber-700"
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
