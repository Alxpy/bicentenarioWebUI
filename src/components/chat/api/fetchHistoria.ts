import { apiService } from "@/service/apiservice";
import { IHistory} from "@/components/interface";

/**
 * Obtiene libros y los formatea como un único string en Markdown.
 */
export const fetchHistoria = async (): Promise<string> => {
  try {
    const response : any = await apiService.get('history');
    const data: IHistory[] = response.data;
    localStorage.removeItem('showHistory');
    // Convertir cada libro a bloque Markdown
    const markdownBlocks = data.map((libro) => {
        const url = `http://localhost:5173/showhistoria/${libro.id}`;
      return `### [${libro.titulo}]\n` +
             `- **Fecha:** ${libro.fecha_inicio} - ${libro.fecha_fin}\n` +
             `- **Ubicación:** ${libro.nombre_ubicacion}\n` +
             `- **Categoria:** ${libro.nombre_categoria}\n\n` +
             `**[Leer más aquí](${url})**\n`;
    });

    // Unir bloques con separador de línea en blanco
    return markdownBlocks.join('\n');
  } catch (error) {
    console.error('Error al formatear libros a Markdown:', error);
    return '**No se pudieron cargar los libros.**';
  }
};