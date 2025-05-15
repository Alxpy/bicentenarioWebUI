import { apiService } from "@/service/apiservice";
import { ILibro } from "@/components/interface";

/**
 * Obtiene libros y los formatea como un único string en Markdown.
 */
export const fetchBooks = async (): Promise<string> => {
  try {
    const response : any = await apiService.get('library');
    const data: ILibro[] = response.data;
    localStorage.removeItem('showLibro');
    // Convertir cada libro a bloque Markdown
    const markdownBlocks = data.map((libro) => {
        const url = `http://localhost:5173/showLibro/${libro.id}`;
      return `### [${libro.titulo}](${libro.enlace})\n` +
             `- **Autor:** ${libro.autor}\n` +
             `- **Edición:** ${libro.edicion}\n` +
             `- **Publicado:** ${libro.fecha_publicacion}\n` +
             `- **Fuente:** ${libro.fuente}\n`+
             `**[Leer más aquí](${url})**\n`;
    });

    // Unir bloques con separador de línea en blanco
    return markdownBlocks.join('\n');
  } catch (error) {
    console.error('Error al formatear libros a Markdown:', error);
    return '**No se pudieron cargar los libros.**';
  }
};