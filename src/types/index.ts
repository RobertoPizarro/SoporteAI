export enum TicketStatus {
  NUEVO = "Nuevo",
  EN_PROGRESO = "En Progreso",
  RESUELTO = "Finalizado",
  RECHAZADO = "Rechazado",
}

export const CLOSING_STATUSES = [TicketStatus.RESUELTO, TicketStatus.RECHAZADO];

// Lista de clientes disponibles
export const CLIENTES = [
  "Entel",
  "Claro", 
  "BCP",
  "Movistar",
  "Izipay",
  "Ripley"
] as const;

// Lista de servicios disponibles  
export const SERVICIOS = [
  "Data Science",
  "Big Data",
  "Cloud+Apps", 
  "Geo Solutions",
] as const;

export type Cliente = typeof CLIENTES[number];
export type Servicio = typeof SERVICIOS[number];

export type Ticket = {
  id: string;
  usuario: string; // Colaborador
  analista: string; // Analista asignado
  cliente: string; // Cliente asociado
  servicio: string; // Servicio del cliente asociado
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaCierre: string;
  asunto: string;
  nivel: number;
  estado: string;
  diagnostico: string;
  tipo: string;
  email: string;
};

export type Message = {
  id?: number;
  type: "bot" | "user" | "ticket";
  content: string | Ticket;
  delay?: number;
};

export type Colaborador = {
  id: number;
  cliente_id: number;
  nombre: string;
  correo: string;
};

export type UserAnalista = {
  email: string;
  name: string;
  persona_id: string;
  analista_id: string;
  rol: "analista";
  nivel?: number;
};

export type UserData = UserAnalista | {
  email: string;
  name: string;
  persona_id: string;
  colaborador_id: string;
  rol: "colaborador";
  cliente_id?: string;
};
