import { apiService } from "@/service/apiservice"
import { ICultura } from "@/components/interface"

export const fetchEthnicGroups = async () => {
    try {
        const response = await apiService.get<ICultura[]>('cultures')
        const data: ICultura[] = response.data
        localStorage.removeItem('selectedCultura');
        const markdownBlocks = data.map((libro) => {
        const url = `http://localhost:5173/cultura/${libro.id}`;
      return `### [${libro.nombre}]\n` +
             `- **Ubicación:** ${libro.nombre_ubicacion}\n` +
             `**[Leer más aquí](${url})**\n`;
    });

    // Unir bloques con separador de línea en blanco
    return markdownBlocks.join('\n');
    } catch (error) {
        console.error(error)
        return []
    }
}