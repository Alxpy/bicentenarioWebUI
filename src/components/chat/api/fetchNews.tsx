import { apiService } from "@/service/apiservice";
import { iNews } from "@/components/interface";
import React from "react";
/**
 * Obtiene noticias y las formatea como un único string en Markdown.
 */
export const fetchNews = async (): Promise<string> => {
  localStorage.removeItem('showNews');
  try {
    const response : any = await apiService.get('news');
    const data: iNews[] = response.data;

    const markdownBlocks = data.map((news) => {
      const url = `http://localhost:5173/noticias/${news.id}`;
      return `## ${news.titulo}\n` +
             `**Fecha:** ${news.fecha_publicacion}\n` +
             `**Categoría:** ${news.nombre_categoria}\n` +
             `**Autor:** ${news.nombre_usuario || 'Desconocido'}\n\n` +
             `> ${news.resumen}\n\n` +
             `${news.contenido}\n\n` +
             `**[Leer más aquí](${url})**\n`;
    });

    // Unir bloques con separador de línea
    return markdownBlocks.join('\n---\n');
  } catch (error) {
    console.error('Error al formatear noticias a Markdown:', error);
    return '**No se pudieron cargar las noticias.**';
  }
};


interface NewsItemProps {
  noticia: iNews;
  onViewDetails: (noticia: iNews) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ noticia, onViewDetails }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <h3>{noticia.titulo}</h3>
      <p style={{ fontSize: '0.9em', color: '#555' }}>{noticia.resumen}</p>
      <button onClick={() => onViewDetails(noticia)}>Ver Detalles</button>
    </div>
  );
};

interface NewsListProps {
  news: iNews[];
  onViewDetails: (noticia: iNews) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onViewDetails }) => {
  if (news.length === 0) {
    return <p>No hay noticias disponibles.</p>;
  }
  return (
    <div>
      {news.map((noticia) => (
        <NewsItem key={noticia.id} noticia={noticia} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

interface DisplayNewsProps {
  initialNews: iNews[];
  onViewDetails: (id: number) => void; // Ahora onViewDetails recibe solo el ID
}

export const DisplayNews: React.FC<DisplayNewsProps> = ({ initialNews, onViewDetails }) => {
  const [news, setNews] = React.useState<iNews[]>(initialNews);

  return (
    <div>
      <h2>Últimas Noticias</h2>
      <ul>
        {news.map((noticia) => (
          <li key={noticia.id}>
            {noticia.titulo} - <a href={`/noticias/${noticia.id}`} onClick={(e) => {
              e.preventDefault(); // Evita la navegación completa si estás en un SPA
              onViewDetails(noticia.id);
            }}>Ver Detalles</a>
          </li>
        ))}
      </ul>
    </div>
  );
};