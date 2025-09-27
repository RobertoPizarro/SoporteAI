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

// Función utilitaria para capitalizar texto
const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función utilitaria para formatear fechas ISO a formato legible
const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return "";
  
  try {
    const date = new Date(isoDate);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return "";
    
    // Formato: "20 Sep 2025, 18:00"
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima' // Ajusta según tu zona horaria
    });
  } catch (error) {
    console.warn('Error formateando fecha:', isoDate, error);
    return "";
  }
};

// Función utilitaria para formatear estado del backend al frontend
const formatEstado = (estado: string): string => {
  const estadoMap: { [key: string]: string } = {
    'aceptado': 'Nuevo',
    'en atención': 'En Progreso', 
    'finalizado': 'Finalizado',
    'cancelado': 'Rechazado'
  };
  
  return estadoMap[estado] || capitalize(estado);
};

// Función utilitaria para convertir estado del frontend al backend
const formatEstadoToBackend = (estado: string): string => {
  const estadoMap: { [key: string]: string } = {
    'Nuevo': 'aceptado',
    'En Progreso': 'en atención',
    'Finalizado': 'finalizado', 
    'Rechazado': 'cancelado'
  };
  
  return estadoMap[estado] || estado.toLowerCase();
};

// Interface para el ticket que viene del backend
interface BackendTicket {
  id_ticket: number;
  asunto: string;
  estado: string;
  nivel: string;
  tipo: string;
  id_colaborador: string;
  colaborador_nombre: string
  id_analista: string | null;
  id_cliente_servicio: string;
  servicio: string;
  servicio_nombre: string;
  diagnostico: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  cliente_nombre: string;
  email: string;
}

// Función para transformar ticket del backend al formato del frontend
const transformBackendTicket = (backendTicket: BackendTicket): Ticket => {
  return {
    id: backendTicket.id_ticket.toString(),
    usuario: backendTicket.colaborador_nombre, // Por ahora usamos el ID, luego podemos mapear a nombre
    analista: backendTicket.id_analista || "Sin asignar",
    cliente: backendTicket.cliente_nombre,
    servicio: backendTicket.servicio_nombre,
    fechaCreacion: formatDate(backendTicket.created_at), // ✨ Formatear fecha
    fechaActualizacion: formatDate(backendTicket.updated_at), // ✨ Formatear fecha
    fechaCierre: formatDate(backendTicket.closed_at), // ✨ Formatear fecha (puede ser null)
    asunto: capitalize(backendTicket.asunto), // ✨ Capitalizar asunto
    nivel: backendTicket.nivel,
    estado: formatEstado(backendTicket.estado), // ✨ Formatear estado
    diagnostico: backendTicket.diagnostico || "",
    tipo: capitalize(backendTicket.tipo), // ✨ Capitalizar tipo
    email: backendTicket.email,
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
    console.log("🎫 Single ticket response:", data);
    
    // El backend devuelve {ticket: {...}}
    if (data.ticket) {
      return transformBackendTicket(data.ticket);
    }
    
    return null;
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

// Actualizar nivel del ticket 
export const updateTicketLevel = async (
  ticketId: string,
  newLevel: string
): Promise<Ticket | null> => {
  try {
    console.log(`🔄 Actualizando nivel del ticket ${ticketId} a "${newLevel}"`);
    
    // Intentar backend primero - ajustado para compatibilidad con Python
    const url = `${ENDPOINTS.UPDATE_TICKET_LEVEL(ticketId)}&nivel=${encodeURIComponent(newLevel)}`;
    const response = await apiRequest(url, {
      method: "PATCH",
    });
    
    console.log("✅ Backend response:", response);
    
    // El backend solo devuelve un mensaje, necesitamos recargar el ticket
    if (response && response.mensaje) {
      console.log("📥 Recargando ticket actualizado...");
      const updatedTicket = await getTicketById(ticketId);
      if (updatedTicket) {
        console.log("✅ Ticket recargado con nuevo nivel:", updatedTicket.nivel);
        return updatedTicket;
      }
    }
    
    throw new Error("No se pudo confirmar la actualización del ticket");
    
  } catch (error) {
    console.warn("Backend no disponible, usando datos locales:", error);
    // Fallback a datos locales
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      // Actualizar el ticket local
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        nivel: newLevel,
        fechaActualizacion: new Date().toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
      console.log("✅ Ticket actualizado localmente:", tickets[ticketIndex]);
      return tickets[ticketIndex];
    }

    throw new Error(`Ticket con ID ${ticketId} no encontrado`);
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
    // Convertir estado del frontend al formato del backend
    const backendEstado = formatEstadoToBackend(newStatus);
    
    // Construir URL con parámetros de query para PATCH
    const baseUrl = ENDPOINTS.UPDATE_TICKET_STATUS(ticketId);
    const params = new URLSearchParams({
      estado: backendEstado,
      ...(solution && { diagnostico: solution }),
    });
    const fullUrl = `${baseUrl}&${params.toString()}`;

    // Intentar backend primero
    const updatedTicket = await apiRequest(fullUrl, {
      method: "PATCH",
    });
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

// Escalar ticket
export const escalateTicket = async (
  ticketId: string,
  motivo: string
): Promise<{ mensaje: string } | null> => {
  // Validación: motivo es requerido
  if (!motivo?.trim()) {
    throw new Error("El motivo de escalación es requerido");
  }

  try {
    // Construir URL con parámetros de query para PATCH
    const baseUrl = ENDPOINTS.ESCALATE_TICKET(ticketId);
    const params = new URLSearchParams({
      motivo: motivo.trim(),
    });
    const fullUrl = `${baseUrl}&${params.toString()}`;

    // Intentar backend primero
    const response = await apiRequest(fullUrl, {
      method: "PATCH",
    });

    console.log("🔼 Ticket escalado:", response);
    return response;
  } catch (error) {
    console.warn("Error escalando ticket:", error);
    throw error;
  }
};

