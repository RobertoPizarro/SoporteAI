from fastapi import APIRouter, Request, HTTPException
from backend.db.crud.crud_ticket import obtener_tickets_analista, obtener_ticket_especifico_analista, actualizar_ticket_estado
from backend.db.crud.crud_conversacion import traer_conversacion
from backend.db.models import Colaborador
from backend.util.util_conectar_orm import conectarORM
from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid

analista_router = APIRouter()

class TicketRead(BaseModel):
    id_ticket: int
    asunto: str
    estado: str
    nivel: str
    tipo: str # Nombre colaborador # Nombre servicio
    id_colaborador: str | None = None
    id_analista: int | None = None
    id_cliente_servicio: int | None = None
    diagnostico: str | None = None
    created_at: datetime | None = None
    closed_at: datetime | None = None
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
            tickets = obtener_tickets_analista(db, analista)
            data = [TicketRead.model_validate(t).model_dump() for t in tickets]
            return {"tickets": data}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")


@analista_router.get("/analista/escalar")
def escalarTicket(req: Request, ticket: int, motivo: str):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            from backend.db.crud.crud_ticket import escalar_ticket
            nivel_destino = escalar_ticket(db, ticket, motivo)
            return {"mensaje": f"Ticket {ticket} escalado correctamente a nivel {nivel_destino} por el motivo: {motivo}"}
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")


@analista_router.get("/analista/estado")
def cambiarEstadoTicket(req: Request, ticket: int, estado: str, diagnostico: str | None = ""):
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
            ticket = obtener_ticket_especifico_analista(db, ticket, analista)
            if not ticket:
                raise HTTPException(404, f"Ticket {ticket} no encontrado o no autorizado")
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")
    return {"ticket": TicketRead.model_validate(ticket).model_dump()}

