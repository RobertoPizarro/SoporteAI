export enum TicketStatus {
  NUEVO = "Nuevo",
  EN_PROGRESO = "En Progreso",
  RESUELTO = "Finalizado",
  RECHAZADO = "Rechazado",
}

export const CLOSING_STATUSES = [TicketStatus.RESUELTO, TicketStatus.RECHAZADO];

export type Ticket = {
  id: string;
  usuario: string; // Colaborador
  analista: string; // Analista asignado
  servicio: string; // Cliente servicio asociado
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaCierre: string;
  asunto: string;
  nivel: number;
  estado: string;
  diagnostico: string;
  tipo: string;
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
