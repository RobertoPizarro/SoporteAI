from sqlalchemy import select
from backend.db.models import Ticket
from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
import enum
from backend.db.crud.crud_analista import obtener_analista_nivel

class TicketNivelEnum(str, enum.Enum):
    bajo = "bajo"
    medio = "medio"
    alto = "alto"
    critico = "crítico" 
class TicketTipoEnum(str, enum.Enum):
    incidencia = "incidencia"
    solicitud = "solicitud"
class TicketCreatePublic(BaseModel):
    asunto: str = Field(min_length=3, max_length=200)
    nivel: TicketNivelEnum
    tipo: TicketTipoEnum
    servicio: str

def obtener_tickets(db):
    tickets = db.execute(select(Ticket)).scalars().all()
    return tickets

def crear_ticket(db, payload: TicketCreatePublic, user: dict):
    servicios = user.get("servicios", [])
    analista = obtener_analista_nivel(db, str(payload.nivel))
    id_cliente_servicio = next((s.get("id_cliente_servicio") or s.get("id") for s in servicios if s.get("nombre") == payload.servicio),None)
    
    nuevo = Ticket(
        id_colaborador=user["colaborador_id"],
        id_analista= analista.id if analista else None,
        id_cliente_servicio=id_cliente_servicio,
        asunto=payload.asunto,
        nivel=payload.nivel,
        tipo=payload.tipo,
        )
    db.add(nuevo)
    db.flush()
    return nuevo

def obtener_ticket_especifico(db, id_ticket : int,) :
    ticket = db.query(Ticket).filter(Ticket.id_ticket == id_ticket).first()
    db.close()
    return ticket

def actualizar_ticket(db, id_ticket: int, estado: str | None, nivel: str | None = None, id_analista: UUID | None = None) -> Ticket | None:
        ticket = db.query(Ticket).filter(Ticket.id_ticket == id_ticket).first()
        
        if not ticket:
            return None
        
        now = datetime.now(timezone.utc)

        if estado == "finalizado":
            ticket.estado = estado
            ticket.closed_at = now
            ticket.updated_at = now
        elif id_analista and nivel:
            ticket.id_analista = id_analista
            ticket.nivel = nivel
            ticket.updated_at = now
        elif estado:
            ticket.estado = estado
            ticket.updated_at = now
        
        db.commit()
        db.refresh(ticket)  # opcional: recargar con lo último de la BD
        return ticket

"""
from enum import Enum

estado_column = Ticket.__table__.c.estado
EstadoTicket = Enum("EstadoTicket", {val.upper(): val for val in estado_column.type.enums})

# Ahora puedes usarlo así:
print(EstadoTicket.ABIERTO.value)   # "abierto"
print(EstadoTicket.CERRADO.value)   # "cerrado"""