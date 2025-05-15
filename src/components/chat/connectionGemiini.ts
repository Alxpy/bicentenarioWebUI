// src/api/classifyIntent.ts
import { INTENT_CLASSIFIER_PROMPT } from '@/components/chat/prompts';
import { apiService } from '@/service/apiservice';
// Reemplaza con la URL de tu API
//const API_URL = 'AIzaSyCUzhzhE8oLdY_6z47tqfN2-qLCMh81V3E';

export async function classifyIntent(message: string): Promise<string> {
  const promptText = INTENT_CLASSIFIER_PROMPT.replace('{message}', message);
  console.log('Prompt para clasificar intención:', promptText);

  try {
    return apiService.post("chat/", {
      conversation_id: Date.now().toString(),
      message: promptText,
      role: "user"
    }).then((response) => {
      const aiResponse: any = response;
      console.log(aiResponse);
      const data = aiResponse.response;
      console.log('Respuesta de la API:', data);

      // Adapta la siguiente línea según la estructura de la respuesta de tu API
      const intent = data?.toLowerCase() || 'otra_informacion';
      console.log('Intención clasificada:', intent);
      return intent;
    }).catch((error) => {
      console.error('Error clasificando intención:', error);
      return 'otra_informacion';
    });

  } catch (err) {
    console.error('Error clasificando intención:', err);
    return 'otra_informacion';
  }
}