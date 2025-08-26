export type Ticket = {
  id: string;
  tipo: string;
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
    id?: number
    type: "bot" | "user" | "ticket"
    content: string | Ticket
    delay?: number
}
