import { apiRequest, ENDPOINTS } from "./api.config";

export const sendMessage = async (message: string) => {
  try {
    const data = await apiRequest(ENDPOINTS.CHAT_MESSAGE, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: message }),
    });

    return data.respuesta;
  } catch (error) {
    console.error("Error en sendMessage:", error);
    throw new Error("Error al conectar con el backend");
  }
};
