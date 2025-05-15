
// Función optimizada para obtener variaciones
// src/utils/prompts.ts
import { prompts, Prompts } from './prompts';

export const getRandomVariation = (intent: keyof Prompts): string => {
  const prompt = prompts[intent];
  if (prompt.variaciones && prompt.variaciones.length > 0) {
    const idx = Math.floor(Math.random() * prompt.variaciones.length);
    return prompt.variaciones[idx];
  }
  return prompt.content;
};
