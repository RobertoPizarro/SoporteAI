from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from backend.db.models import Ticket, Colaborador, ClienteServicio, Persona, External, Servicio
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from backend.db.crud.crud_analista import obtener_analista_nivel, nivel_numero
import enum
from backend.db.crud.crud_escalado import crear_escalado

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

# ---------------------------------------------
# Utilidades
# ----------------------------------------------

def numero_a_nivel(numero: int) -> TicketNivelEnum:
    """Convierte un número (1-4) a un valor del Enum TicketNivelEnum."""
    mapa = {
        1: TicketNivelEnum.bajo,
        2: TicketNivelEnum.medio,
        3: TicketNivelEnum.alto,
        4: TicketNivelEnum.critico
    }
    if numero not in mapa:
        raise ValueError(f"Nivel inválido: {numero}. Debe estar entre 1 y 4.")
    return mapa[numero]

def revisarUsuario(user):
    rol = ""
    try:
        if user["rol"] == "analista":
            rol = "analista_id"
        elif user["rol"] == "colaborador":
            rol = "colaborador_id"
        return user[rol]
    except Exception as e:
        raise ValueError(f"Error al revisar usuario: {str(e)}")

# ---------------------------------------------
# CRUD de Ticket
# ----------------------------------------------

def crear_ticket(db, payload: TicketCreatePublic, user: dict):
    try:
        servicios = user.get("servicios", [])
        analista = obtener_analista_nivel(db, str(payload.nivel))
        id_cliente_servicio = next((s.get("id_cliente_servicio") or s.get("id") for s in servicios if s.get("nombre") == payload.servicio), None)
        
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
    except Exception as e:
        raise Exception(f'Error al crear ticket: {str(e)}')

def obtener_tickets_analista(db, user):
    rol = revisarUsuario(user)
    try:
        ext = (
        select(External.nombre)
        .join(Persona, Persona.id == External.id_persona)
        .join(Colaborador, Colaborador.id_persona == Persona.id)
        .where(Colaborador.id == Ticket.id_colaborador)
        .limit(1).correlate(Ticket).scalar_subquery()
        )
        query = (
        select(ext.label("colaborador_nombre"), Servicio.nombre.label("servicio_nombre"),)
        .join(ClienteServicio, ClienteServicio.id == Ticket.id_cliente_servicio, isouter=True)
        .join(Servicio, Servicio.id == ClienteServicio.id_servicio, isouter=True)
        .where(Ticket.id_analista == rol)
        )
        ticket = db.execute(query).scalars().all()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener tickets del analista: {str(e)}")

def obtener_tickets(db, user):
    rol = revisarUsuario(user)
    try:
        campo = Ticket.id_analista if user["rol"] == "analista" else Ticket.id_colaborador
        query = select(Ticket).where(campo == rol)
        ticket = db.execute(query).scalars().all()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener tickets: {str(e)}")
    
def obtener_ticket_especifico(db, id_ticket : int, user):
    rol = revisarUsuario(user)
    try:
        campo = Ticket.id_analista if user["rol"] == "analista" else Ticket.id_colaborador
        query = select(Ticket).where(Ticket.id_ticket == id_ticket, campo == rol)
        ticket = db.execute(query).scalars().first()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener ticket específico: {str(e)}")

def obtener_ticket_especifico_analista(db, id_ticket : int, user):
    rol = revisarUsuario(user)
    try:
        ext = (
        select(External.nombre)
        .join(Persona, Persona.id == External.id_persona)
        .join(Colaborador, Colaborador.id == Persona.id)
        .where(Colaborador.id == Ticket.id_colaborador)
        .limit(1)
        .correlate(Ticket)
        .scalar_subquery()
        )
        query = (
        select(Ticket, ext.label("colaborador_nombre"), Servicio.nombre.label("servicio_nombre"))
        .join(ClienteServicio, ClienteServicio.id == Ticket.id_cliente_servicio, isouter=True)
        .join(Servicio, Servicio.id == ClienteServicio.id_servicio, isouter=True)
        .where(Ticket.id_ticket == id_ticket, Ticket.id_analista == rol)
        )
        ticket = db.execute(query).scalars().first()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener ticket específico del analista: {str(e)}")

def obtener_ticket_asunto(db, asunto : str, user):
    rol = revisarUsuario(user)
    try:
        query = select(Ticket).filter(Ticket.asunto.ilike(f"%{asunto}%"), Ticket.id_colaborador == rol)
        ticket = db.execute(query).scalars().all()
        return ticket
    except Exception as e:
        raise ValueError(f"Error al obtener ticket por asunto: {str(e)}")

def obtener_tickets_abiertos(db, user):
    rol = revisarUsuario(user)
    try:
        query = select(Ticket).where(
            Ticket.id_colaborador == rol,
            Ticket.estado.in_(("aceptado", "en atención"))
        )
        tickets = db.execute(query).scalars().all()
    except Exception as e:
        raise ValueError(f"Error al obtener tickets abiertos: {str(e)}")
    return tickets

def actualizar_ticket_estado(db, id_ticket: int, estado: str, diagnostico: str | None = ""):
        ticket = db.execute(select(Ticket).filter(Ticket.id_ticket == id_ticket).with_for_update()).scalar_one_or_none()
        
        if not ticket:
            raise ValueError(f"Ticket {id_ticket} no encontrado")

        if estado == "finalizado" or estado == "cancelado":
            ticket.estado = estado
            ticket.closed_at = datetime.now(timezone.utc)
            if diagnostico:
                ticket.diagnostico = diagnostico
                
        elif estado:
            ticket.estado = estado

        db.flush()
        return ticket

def escalar_ticket(bd, idTicket : int, motivo: str):
    query_ticket = select(Ticket).where(Ticket.id_ticket == idTicket)
    try:
        ticket: Ticket | None = bd.execute(query_ticket).scalar_one_or_none()
    except Exception as e:
        raise ValueError(f"Error al obtener ticket {idTicket}: {str(e)}")
    if not ticket:
        raise ValueError(f"Ticket {idTicket} no encontrado")
    ticket_nivel = nivel_numero(ticket.nivel)
    if ticket_nivel >= 4:
        raise ValueError(f"El ticket {idTicket} ya está en el nivel máximo (crítico). No se puede escalar más.")
    nivel_destino = numero_a_nivel(ticket_nivel + 1)
    try:
        analista_destino = obtener_analista_nivel(bd, nivel_destino)
    except Exception as e:
        raise ValueError(f"Error al obtener analista para el nivel {nivel_destino}: {str(e)}")
    if not analista_destino:
        raise ValueError(f"No hay analistas disponibles para el nivel {nivel_destino}.")
    id_analista_destino = analista_destino.id if analista_destino else None

    crear_escalado(bd, idTicket, id_analista_destino, ticket.id_analista, motivo)

    bd.execute(update(Ticket).where(Ticket.id_ticket == idTicket).values(
        id_analista = id_analista_destino,
        nivel = nivel_destino,
        estado = "en atención",
    ))
    bd.flush()
    return nivel_destino