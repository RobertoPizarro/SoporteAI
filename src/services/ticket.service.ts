import { Ticket, Colaborador } from "@/types";
import { apiRequest, ENDPOINTS } from "./api.config";
import { tickets } from "@/data/tickets";
import { mockUsers } from "@/data/users";

// Interface para actualización de ticket
export interface UpdateTicketData {
  estado: string;
  solucion?: string; // Opcional: solo para estados de cierre
  resumen?: string; // Opcional: resumen general
}

// Estados que requieren descripción obligatoria
const CLOSING_STATES = ["Resuelto", "Cerrado", "Rechazado"];

// Interface para el ticket que viene del backend
interface BackendTicket {
  id_ticket: number;
  asunto: string;
  estado: string;
  nivel: string;
  tipo: string;
  id_colaborador: string;
  id_analista: string | null;
  id_cliente_servicio: string;
  diagnostico: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

// Función para transformar ticket del backend al formato del frontend
const transformBackendTicket = (backendTicket: BackendTicket): Ticket => {
  return {
    id: backendTicket.id_ticket.toString(),
    usuario: backendTicket.id_colaborador, // Por ahora usamos el ID, luego podemos mapear a nombre
    analista: backendTicket.id_analista || "Sin asignar",
    cliente: "Cliente", // Por ahora placeholder, luego mapear desde id_cliente_servicio
    servicio: "Servicio", // Por ahora placeholder, luego mapear desde id_cliente_servicio  
    fechaCreacion: backendTicket.created_at,
    fechaActualizacion: backendTicket.updated_at,
    fechaCierre: backendTicket.closed_at || "",
    asunto: backendTicket.asunto,
    nivel: backendTicket.nivel === "bajo" ? 1 : backendTicket.nivel === "medio" ? 2 : 3,
    estado: backendTicket.estado === "aceptado" ? "Nuevo" : "",
    diagnostico: backendTicket.diagnostico || "",
    tipo: backendTicket.tipo
  };
};

// Obtener todos los tickets
export const getTickets = async (): Promise<Ticket[] | null> => {
  try {
    // Intentar backend primero
    const data = await apiRequest(ENDPOINTS.TICKETS);
    console.log("🎫 Backend response:", data);
    console.log("🎫 Data response:", data.tickets);
    
    // El backend devuelve {tickets: [...]}
    if (data.tickets && Array.isArray(data.tickets)) {
      return data.tickets.map(transformBackendTicket);
    }
    
    return [];
  } catch (error) {
    console.warn("Backend no disponible, usando datos locales:", error);
    // Fallback a datos locales
    return tickets;
  }
};

// Obtener ticket por ID
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    // Intentar backend primero
    const data = await apiRequest(ENDPOINTS.TICKET_BY_ID(id));
    return data;
  } catch (error) {
    console.warn("Backend no disponible, usando datos locales:", error);
    // Fallback a datos locales
    return tickets.find((t) => t.id === id) || null;
  }
};

// Obtener usuario por ID
export const getUserById = async (
  userId: string
): Promise<Colaborador | null> => {
  try {
    // Intentar backend primero
    const data = await apiRequest(ENDPOINTS.USER_BY_ID(userId));
    return data;
  } catch (error) {
    console.warn(
      "Backend no disponible, buscando usuario por nombre en datos locales:",
      error
    );
    // Fallback: buscar usuario por nombre en datos mock
    return mockUsers.find((user) => user.nombre === userId) || null;
  }
};

// Actualizar estado del ticket
export const updateTicketStatus = async (
  ticketId: string,
  newStatus: string,
  solution?: string // Opcional: descripción de solución
): Promise<Ticket | null> => {
  // Validación: Si es un estado de cierre, requiere solución
  if (CLOSING_STATES.includes(newStatus) && !solution?.trim()) {
    throw new Error(
      `El estado "${newStatus}" requiere una descripción de la solución`
    );
  }

  const updateData = {
    estado: newStatus,
    ...(solution && { solucion: solution }),
  };

  try {
    // Intentar backend primero
    const updatedTicket = await apiRequest(
      ENDPOINTS.UPDATE_TICKET_STATUS(ticketId),
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      }
    );
    return updatedTicket;
  } catch (error) {
    console.warn("Backend no disponible, usando datos locales:", error);

    // Fallback a datos locales
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      // Actualizar el ticket local
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        estado: newStatus,
        fechaActualizacion: new Date().toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        // Agregar solución si existe
        ...(solution && { solucion: solution }),
      };
      return tickets[ticketIndex];
    }

    throw new Error(`Ticket con ID ${ticketId} no encontrado`);
  }
};

