from sqlalchemy import select
from backend.db.models import Ticket
from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from backend.db.crud.crud_analista import obtener_analista_nivel
import enum

# Estados considerados "abiertos" en la BD (valores literales del ENUM en Postgres)
OPEN_STATUS = ("aceptado", "en atención")
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

def revisarUsuario(user):
    rol = ""
    try:
        if user["rol"] == "analista":
            rol = "analista_id"
        elif user["rol"] == "colaborador":
            rol = "colaborador_id"
        return rol
    except Exception as e:
        print(f"Error al revisar usuario: {str(e)}")
        raise ValueError(f"Error al revisar usuario: {str(e)}")

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

def obtener_tickets(db, user):
    try:
        print ("Entrando en obtener_tickets")
        rol = revisarUsuario(user)
        print("Rol determined:", rol)
        user_rol = user.get(rol)
        print("User role ID:", user_rol)
        return db.execute(select(Ticket).where(Ticket.id_colaborador == user_rol)).scalars().all()

    except Exception as e:
        raise ValueError(f"Error al obtener tickets: {str(e)}")

def obtener_ticket_especifico(db, id_ticket : int, user):
    try:
        rol = revisarUsuario(user)
        print("Rol determined:", rol)
        user_rol = user.get(rol)
        print("User role ID:", user_rol)
        ticket = db.execute(select(Ticket).where(Ticket.id_ticket == id_ticket, Ticket.id_colaborador == user_rol)).first()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener ticket específico: {str(e)}")

def obtener_ticket_asunto(db, asunto : str, user):
    try:
        rol = revisarUsuario(user)
        ticket = db.execute(select(Ticket)).filter(Ticket.asunto.ilike(f"%{asunto}%"), Ticket.id_colaborador == user[rol]).scalars().all()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener ticket por asunto: {str(e)}")

def obtener_tickets_abiertos(db, user):
    try:
        rol = revisarUsuario(user)
        user_rol = user[rol]
        print ("User role ID:", user_rol)
    except Exception as e:
        print (f"Error al revisar usuario: {str(e)}")
        raise ValueError(f"Error al revisar usuario: {str(e)}")
    try:
        # Aseguramos que el comparador de UUID use el tipo correcto
        try:
            user_uuid = UUID(str(user_rol)) if user_rol is not None else None
        except Exception:
            user_uuid = user_rol  # como fallback, usar el valor como viene

        query = (
            select(Ticket)
            .where(
                Ticket.id_colaborador == user_uuid,
                Ticket.estado.in_(OPEN_STATUS),
            )
        )
        tickets = db.execute(query).scalars().all()
        print(f"Tickets abiertos encontrados: {len(tickets)}")
        print ("Tickets details:", tickets)
    except Exception as e:
        print (f"Error al obtener tickets abiertos: {str(e)}")
        raise ValueError(f"Error al obtener tickets abiertos: {str(e)}")
    return tickets
    
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