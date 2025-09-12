from backend.db.database import get_session, Ticket
from datetime import datetime, timezone
from uuid import UUID
def obtener_tickets():
    session = get_session()
    tickets = session.query(Ticket).all()
    session.close()
    return tickets

def crear_ticket(data):
    session = get_session()
    nuevo = Ticket(**data)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    session.close()
    return nuevo

def obtener_ticket_especifico(id_ticket : int, ) :
    session = get_session()
    ticket = session.query(Ticket).filter(Ticket.id_ticket == id_ticket).first()
    session.close()
    return ticket

def actualizar_ticket(id_ticket: int, estado: str | None, nivel: str | None = None, id_analista: UUID | None = None) -> Ticket | None:
    with get_session() as session:
        ticket = session.query(Ticket).filter(Ticket.id_ticket == id_ticket).first()
        
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
        
        session.commit()
        session.refresh(ticket)  # opcional: recargar con lo último de la BD
        return ticket

"""
from enum import Enum

estado_column = Ticket.__table__.c.estado
EstadoTicket = Enum("EstadoTicket", {val.upper(): val for val in estado_column.type.enums})

# Ahora puedes usarlo así:
print(EstadoTicket.ABIERTO.value)   # "abierto"
print(EstadoTicket.CERRADO.value)   # "cerrado"""