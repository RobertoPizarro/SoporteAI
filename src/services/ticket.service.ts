import { Ticket, Colaborador } from "@/types";
import { apiRequest, ENDPOINTS } from "./api.config";

// Obtener ticket por ID
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    const data = await apiRequest(ENDPOINTS.TICKET_BY_ID(id));
    return data;
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    return null;
  }
};

// Obtener usuario por ID
export const getUserById = async (userId: string): Promise<Colaborador | null> => {
  try {
    const data = await apiRequest(ENDPOINTS.USER_BY_ID(userId));
    return data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};
