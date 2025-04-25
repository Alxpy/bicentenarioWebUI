import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormBiblioteca } from "./FormBiblioteca";
import { PlusCircle } from "lucide-react";
import { apiService } from "@/service/apiservice";
import { useEffect, useState } from "react";
import { ITipo, ILibro } from "../interface";

export const DialogCrear = () => {
    const [tipos, setTipos] = useState<ITipo[]>([
        { id: 0, tipo: "" },
    ]);

    const fetchTipos = async () => {

        await apiService.get("documentTypes").then((response: any) => {
            console.log("Tipos:", response.data);
            setTipos(response.data);
        }).catch((error) => {
            console.error("Error fetching tipos:", error);
        });
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const handleAgregarTipo = async (nuevoNombre: string) => {
        try {
            await apiService.post("documentTypes", { tipo: nuevoNombre });
            fetchTipos();
        } catch (error) {
            console.error("Error adding tipo:", error);
        }
    };

    const handleSubmit = async (libro: ILibro) => {
        try {
           console.log("Libro a guardar:", libro);
            await apiService.post("library", {
                titulo: libro.titulo,
                autor: libro.autor,
                imagen: libro.imagen,
                fecha_publicacion: libro.fecha_publicacion,
                edicion: libro.edicion,
                id_tipo: libro.id_tipo,
                id_usuario: 4,
                fuente: libro.fuente,
                enlace: libro.enlace

            });
            console.log("Libro guardado:", libro);
        } catch (error) {
            console.error("Error saving libro:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-all">
                <PlusCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Agregar Libro</span>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Crear un nuevo libro</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Completa los siguientes campos para registrar un nuevo libro en la biblioteca.
                    </DialogDescription>
                </DialogHeader>

                <FormBiblioteca
                    tipos={tipos}
                    onGuardar={handleSubmit}
                    onAgregarTipo={handleAgregarTipo}
                />
            </DialogContent>
        </Dialog>
    );
};
