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

    const handlePatrocinadores = async () => {
        const response = await apiService.get('patrocinadores');
        const data: iPatrocinador[] = response.data;
        return data;
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
                await apiService.put(`cultures/${initialData.id}`, payload);
                toast.success('Cultura actualizada correctamente');
            } else {
                localStorage.setItem('cultura', JSON.stringify(payload));
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
        <div>FormEvento</div>
    )
}
