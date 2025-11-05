import { apiRequest, ENDPOINTS } from "./api.config";

export interface PromptContent {
  identidadObjetivos?: string;
  reglasComunicacion?: string;
  flujoTrabajo?: string;
  formatoBusquedas?: string;
  formatoTickets?: string;
  plantillaRespuesta?: string;
}

// Prompt de fallback con todas las secciones
const FALLBACK_PROMPT: PromptContent = {
  identidadObjetivos: "Eres un asistente de soporte técnico especializado.",
  reglasComunicacion: "Comunícate de manera profesional y amigable.",
  flujoTrabajo: "1. Escucha al usuario\n2. Analiza el problema\n3. Proporciona solución",
  formatoBusquedas: "Busca información relevante en la base de conocimientos.",
  formatoTickets: "Crea tickets con información clara y detallada.",
  plantillaRespuesta: "Saludo + Solución + Cierre cordial",
};

// Obtener el prompt actual
export async function getPrompt(): Promise<PromptContent> {
 
  
  try {
    const data = await apiRequest(ENDPOINTS.ADMIN_PROMPT, {
      method: "GET",
    });

    

    // El backend devuelve directamente el diccionario con las secciones
    if (!data || typeof data !== 'object') {
      console.warn("⚠️ Backend no devolvió prompt válido, usando fallback");
      return FALLBACK_PROMPT;
    }

    // Si el backend devuelve {ok: true, overrides: {...}}, extraer overrides
    let promptData = data;
    if (data.overrides) {
      promptData = data.overrides;
    }


    return promptData as PromptContent;
  } catch (error) {
    console.error("❌ Error loading prompt, usando fallback:", error);
    return FALLBACK_PROMPT;
  }
}

// Actualizar el prompt
export async function updatePrompt(updates: Partial<PromptContent>): Promise<PromptContent> {
  try {
    
    const data = await apiRequest(ENDPOINTS.UPDATE_ADMIN_PROMPT, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });


    // El backend devuelve {ok: true, overrides: {...}}
    if (data && data.ok && data.overrides) {

      return data.overrides as PromptContent;
    }

    // Si solo tiene ok: true sin overrides
    if (!data || data.ok === true || data.ok === "true") {
      return updates as PromptContent;
    }

    // Si devuelve el prompt actualizado directamente
    if (data && typeof data === 'object') {
      return data as PromptContent;
    }

    // Retornar los updates de todos modos
    return updates as PromptContent;
  } catch (error) {
    console.error("❌ Error updating prompt:", error);
    // Retornar los updates de todos modos para que la UI se actualice
    return updates as PromptContent;
  }
}
