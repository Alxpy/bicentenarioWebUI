// src/prompts.ts

export interface Prompt {
  content: string;
  variaciones?: string[];
  // si quieres, añade aquí propiedades como 'tono', 'elementos_clave', etc.
}

export interface Prompts {
  saludo: Prompt;
  despedida: Prompt;
  // …añade más intents si los tienes
}

export const prompts: Prompts = {
  saludo: {
    content: "Cuando el usuario inicie la conversación deberás responder con un saludo que incluya una curiosidad boliviana:",
    variaciones: [
      "¡Hola! ¿Sabías que Bolivia tiene la carretera más peligrosa del mundo? Se llama El Camino de la Muerte 😅 ¿En qué puedo ayudarte hoy?",
      "¡Bienvenid@! 🌞 ¿Conoces el Salar de Uyuni? Es el espejo natural más grande del mundo ¡y está aquí en Bolivia! ¿Cómo puedo asistirte?",
      "¡Hola! Curiosidad boliviana: Tenemos más de 30 idiomas oficiales. ¿Qué te parece? 😊 ¿En qué puedo colaborarte hoy?"
    ],
    // …
  },
  despedida: {
    content: "Si el usuario se despide deberás responder con:",
    variaciones: [
      "¡Hasta luego! 😊 Si necesitas algo más, aquí estaré. ¡Que tengas un día espectacular!",
      "¡Nos vemos! 🌟 No dudes en escribirme si necesitas ayuda otra vez. ¡Cuídate!",
      "¡Gracias por charlar! 💬 Que tengas un resto de día lleno de buena energía ☀️"
    ],
    // …
  }
};
