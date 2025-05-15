import { apiService } from "@/service/apiservice"
import {iPresidente} from "@/components/interface"

export const fetchPresidents = async () => {
    try {
        const response = await apiService.get<iPresidente[]>('president')
        const data: iPresidente[] = response.data
        const markdownBlocks = data.map((libro) => {
        const url = `http://localhost:5173/presidente/detalle/${libro.id}`;
      return `### [${libro.nombre}](${libro.apellido})\n` +
              `- **Periodo:** ${libro.inicio_periodo} - ${libro.fin_periodo}\n` +
              `- **Partido:** ${libro.partido_politico}\n\n`+ 
              `**[Leer más aquí](${url})**\n`;
    });
    return markdownBlocks.join('\n');
    }

    catch (error) {
        console.error(error)
        return []
    }

}