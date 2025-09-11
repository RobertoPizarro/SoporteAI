export enum TicketStatus {
  NUEVO = "Nuevo",
  EN_PROGRESO = "En Progreso",
  RESUELTO = "Finalizado",
  RECHAZADO = "Rechazado",
}

export const CLOSING_STATUSES = [TicketStatus.RESUELTO, TicketStatus.RECHAZADO];

export type Ticket = {
  id: string;
  tipo: TicketStatus;
  usuario: string;
  analista: string;
  asunto: string;
  servicio: string;
  nivel: number;
  estado: string;
  fechaCreacion: string;
  actualizacion: string;
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
