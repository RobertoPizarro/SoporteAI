import { apiRequest, ENDPOINTS } from "./api.config";

export const sendMessage = async (message: string) => {
  try {
    const data = await apiRequest(ENDPOINTS.CHAT_MESSAGE, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: message }),
    });

    // 🔍 DEBUG: Ver toda la respuesta del backend
    console.log("🌐 FULL BACKEND RESPONSE:", JSON.stringify(data, null, 2));
    
    // Si es una respuesta de ticket, devolver el objeto completo
    if (data.type === 'ticket') {
      console.log("🎫 TICKET RESPONSE DETECTED:", data);
      return data;
    }
    
    // Si es una respuesta normal, devolver solo el campo respuesta
    return data.respuesta || data;
  } catch (error) {
    console.error("Error en sendMessage:", error);
    throw new Error("Error al conectar con el backend");
  }
};

export const resetChat = async () => {
    try {
        const resp = await apiRequest(ENDPOINTS.CHAT_RESET, {
            method: "POST",
            mode: "cors",
            credentials: "include",
        });

        return resp;
    } catch (error) {
        console.error("Error en resetChat:", error);
        throw new Error("Error al reiniciar la conversación");
    }
};
