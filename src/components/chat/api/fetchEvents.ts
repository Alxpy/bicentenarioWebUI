import { apiService } from "@/service/apiservice"
import { iEvento} from "@/components/interface"

export const fetchEvents = async () => {
    try {
        const response = await apiService.get<iEvento[]>('evento')
        localStorage.removeItem('selectedEvento');
        const data: iEvento[] = response.data
         const markdownBlocks = data.map((libro) => {
        const url = `http://localhost:5173/evento/${libro.id}`;
      return `### [${libro.nombre}](${libro.categoria})\n` +
             `- **Fechas:** ${libro.fecha_inicio} - ${libro.fecha_fin}\n` +
             `- **Precio:** ${libro.precio}\n` +
             `- **Tema:** ${libro.nombre_evento}\n\n\n`+
             `**[Leer más aquí](${url})**\n\n\n\n ----------------------------------------`;
    });

    // Unir bloques con separador de línea en blanco
    return markdownBlocks.join('\n');
    } catch (error) {
        console.error(error)
        return []
    }
}