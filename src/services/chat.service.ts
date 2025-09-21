
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

        // Detectar si se creó un ticket en la respuesta anidada
        if (data.respuesta && data.respuesta.type === 'ticket_created') {
            console.log("🎫 TICKET CREATED DETECTED:", data.respuesta);
            return {
                type: 'ticket_created',
                ticket: data.respuesta.ticket,
                message: data.respuesta.message || 'Ticket creado exitosamente'
            };
        }

        // Si es una respuesta de ticket (formato anterior por compatibilidad)
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

/**
 * Obtiene el historial de chat de un ticket específico
 * @param ticketId - ID del ticket
 * @returns Historial de mensajes del chat
 */
export const getChatByTicket = async (ticketId: string) => {
    try {
        console.log(`🔍 Obteniendo chat para ticket ${ticketId}...`);
        
        const data = await apiRequest(`${ENDPOINTS.CHAT_GET}?ticket=${ticketId}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
        });

        console.log("💬 CHAT DATA RECEIVED:", data);
        
        // Mapear la respuesta a formato de mensajes
        if (data && Array.isArray(data)) {
            // Caso 1: Array directo con {role, content}
            const messages = data.map((msg: any, index: number) => ({
                id: index + 1,
                text: msg.content || msg.contenido || "",
                sender: msg.role === "user" ? "user" : "bot",
                timestamp: new Date(),
                content: msg.content || msg.contenido || "",
            }));
            
            console.log("✅ MAPPED MESSAGES (direct array):", messages);
            return messages;
        } else if (data && Array.isArray(data.chat)) {
            // Caso 2: Objeto con propiedad 'chat' (TU CASO)
            const messages = data.chat
                .filter((msg: any) => {
                    // Filtrar mensajes vacíos o sin contenido
                    const content = msg.content || msg.contenido || msg.text || "";
                    return content.trim() !== "";
                })
                .map((msg: any, index: number) => {
                    // Mapear role correctamente: 'user' = usuario, todo lo demás = bot
                    const isUser = msg.role === "user";
                    const content = msg.content || msg.contenido || msg.text || "";
                    
                    console.log(`📝 Mensaje ${index + 1}: role="${msg.role}" → sender="${isUser ? 'user' : 'bot'}" | content="${content.substring(0, 50)}..."`);
                    
                    return {
                        id: index + 1,
                        text: content,
                        sender: isUser ? "user" : "bot",
                        timestamp: msg.fecha ? new Date(msg.fecha) : new Date(),
                        content: content,
                    };
                });
            
            console.log("✅ MAPPED MESSAGES (data.chat):", messages);
            return messages;
        } else if (data && Array.isArray(data.conversacion)) {
            // Caso 3: Objeto con propiedad conversacion
            const messages = data.conversacion.map((msg: any, index: number) => ({
                id: index + 1,
                text: msg.content || msg.contenido || msg.text || "",
                sender: (msg.role === "user" || msg.remitente === "user" || msg.remitente === "usuario") ? "user" : "bot",
                timestamp: msg.fecha ? new Date(msg.fecha) : new Date(),
                content: msg.content || msg.contenido || msg.text || "",
            }));
            
            console.log("✅ MAPPED MESSAGES (nested conversacion):", messages);
            return messages;
        }
        
        console.log("⚠️ No conversation data found, returning empty array");
        return [];
    } catch (error) {
        console.error("Error al obtener chat del ticket:", error);
        throw new Error("Error al cargar el historial de conversación");
    }
};