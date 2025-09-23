# Rutas API para analistas
from fastapi import APIRouter, Request, HTTPException

# CRUD
from backend.db.crud.crud_ticket import obtener_tickets, obtener_ticket_especifico, actualizar_ticket_estado, escalar_ticket
from backend.db.crud.crud_conversacion import traer_conversacion

# ORM
from backend.util.util_conectar_orm import conectarORM

# Modelos
from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid

analista_router = APIRouter()

class TicketRead(BaseModel):
    id_ticket: int
    asunto: str
    estado: str
    nivel: str
    email: str
    tipo: str # Nombre colaborador # Nombre servicio
    id_colaborador: uuid.UUID | None = None
    id_analista: uuid.UUID | None = None
    id_cliente_servicio: uuid.UUID | None = None
    diagnostico: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    closed_at: datetime | None = None
    cliente_nombre: str | None = None
    colaborador_nombre: str | None = None
    servicio_nombre: str | None = None
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)

class TicketResponse(BaseModel):
    tickets: list[TicketRead]

@analista_router.get("/analista/tickets")
def obtenerTickets(req: Request):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            tickets = obtener_tickets(db, analista)
            data = [TicketRead.model_validate(t).model_dump() for t in tickets]
            return {"tickets": data}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")


@analista_router.patch("/analista/escalar")
def escalarTicket(req: Request, ticket: int, motivo: str):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            nivel_destino = escalar_ticket(db, ticket, motivo)
            return {"mensaje": f"Ticket {ticket} escalado correctamente a nivel {nivel_destino} por el motivo: {motivo}"}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")


@analista_router.patch("/analista/estado")
def cambiarEstadoTicket(ticket: int, estado: str, diagnostico: str | None = ""):
    with conectarORM() as db:
        try:
            ticket_actualizado = actualizar_ticket_estado(db, ticket, estado, diagnostico)
        except ValueError as ve:
            raise HTTPException(400, str(ve))
        except Exception as e:
            raise HTTPException(500, f"Error interno: {e}")
        if not ticket_actualizado:
            raise HTTPException(404, f"Ticket {ticket} no encontrado")
    return {"mensaje": f"Estado del ticket {ticket} cambiado a: {estado}"}

@analista_router.get("/analista/chat")
def chatAnalista(ticket: int):
    try:
        with conectarORM() as db:
            contenido = traer_conversacion(db, ticket)
            return {"chat": contenido}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")
    
@analista_router.get("/analista/ticket")
def obtenerTicket(req: Request, ticket: int):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            ticket_obj = obtener_ticket_especifico(db, ticket, analista)
            if not ticket_obj:
                raise HTTPException(404, f"Ticket {ticket} no encontrado o no autorizado")
            
            ticket_data = TicketRead.model_validate(ticket_obj).model_dump()
        return {"ticket": ticket_data}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")

