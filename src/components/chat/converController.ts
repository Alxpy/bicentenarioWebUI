import { getRandomVariation } from './promptHandler';
import { prompts, Prompts } from './prompts';
import {
  fetchEvents,
  fetchBooks,
  fetchPresidents,
  fetchEthnicGroups,
  fetchNews,fetchHistoria

} from './api';

// Interface para tipar el estado del usuario
interface UserState {
  sender: string;
  message?: string;
  states?: Record<string, any>;
}

// Tipo para todas las posibles intenciones
export type IntentType =
  | 'saludo'
  | 'despedida'
  | 'chatbot'
  | 'evento'
  | 'libro'
  | 'historia'
  | 'presidente'
  | 'etnia'
  | 'noticia'
  | 'otra_informacion';

// Funciones para obtener datos dinámicos según la intención
const dataFetchers: Partial<Record<IntentType, () => Promise<string | any[]>>> = {
  evento: async () => {
    const events = await fetchEvents();
    return events;
  },
  libro: async () => {
    const books = await fetchBooks();
    return books;
  },
  presidente: async () => {
    const presidents = await fetchPresidents();
    return presidents;
  },
  etnia: async () => {
    const groups = await fetchEthnicGroups();
    return groups;
  },
  noticia: async () => {
    const news = await fetchNews();
    return news; // Devuelve el array de noticias
  },
  historia: async () => {
    const historia = await fetchHistoria();
    return historia; // Devuelve el array de noticias
  },

};

// Tipo para las funciones manejadoras
type HandlerFunction = (params: {
  userState: UserState;
  prompts: Prompts;
}) => Promise<string> | string;

// Mapeo completo de manejadores
const responseHandlers: Record<IntentType, HandlerFunction> = {
  saludo: () => getRandomVariation('saludo'),
  despedida: () => getRandomVariation('despedida'),
  chatbot: () => getRandomVariation('chatbot'),

  evento: async () => {
    const base = getRandomVariation('evento');
    const list = await dataFetchers.evento!();
    return `${base}\n${list}`;
  },
  libro: async () => {
    const base = getRandomVariation('libro');
    const list = await dataFetchers.libro!();
    return `${base}\n${list}`;
  },
  presidente: async () => {
    const base = getRandomVariation('presidente');
    const list = await dataFetchers.presidente!();
    return `${base}\n${list}`;
  },
  etnia: async () => {
    const base = getRandomVariation('etnia');
    const list = await dataFetchers.etnia!();
    return `${base}\n${list}`;
  },
  noticia: async () => {
    const base = getRandomVariation('noticia');
    const newsArray = await dataFetchers.noticia!();
      return newsArray
    
  },
  historia: async () => {
    const base = getRandomVariation('historia');
    const historiaArray = await dataFetchers.historia!();
    return `${base}\n${historiaArray}`;
  },
  otra_informacion: async () => {
    const base = getRandomVariation('otra_informacion');
    return `${base}`;
  }
};

// Función principal
export const generateResponse = async (
  intent: IntentType,
  userState: UserState
): Promise<string  | React.ReactNode> => {
  try {
    const handler = responseHandlers[intent] || responseHandlers.otra_informacion;
    const response = await handler({ userState, prompts });

     if (process.env.NODE_ENV === 'development') {
      console.log(`[${intent}] => ${typeof response === 'string' ? response.substring(0, 50) + '...' : '[REACT COMPONENT]'}`);
    }


    return response;
  } catch (error) {
    console.error(`Error processing ${intent}:`, error);
    return '¡Vaya! Ha ocurrido un error. Por favor intenta nuevamente.';
  }
};
