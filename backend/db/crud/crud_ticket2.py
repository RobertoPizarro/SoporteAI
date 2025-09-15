from backend.db.database import Ticket
import uuid
from sqlalchemy import select
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

def obtener_tickets(db, user:dict):
    try:
        rol = revisarUsuario(user)
        user_rol = uuid.UUID(user[rol])
        print(f'user: {user}')
        ticket = db.execute(select(Ticket).filter(Ticket.id_colaborador == user_rol)).scalars().all()
        print(f"Tickets encontrados: {len(ticket)}")
        return ticket

    except Exception as e:
        print(f"Error during query execution: {str(e)}")
        raise ValueError(f"Error al obtener tickets: {str(e)}")
    
def obtener_tickets_abiertos(db, user:dict) -> list[Ticket]:
    try:
        user_rol = uuid.UUID(user["colaborador_id"])
        print("User role ID:", user_rol)
        print(f'user: {user}')
        try:
            ticket = db.execute(select(Ticket).filter(Ticket.id_colaborador == user_rol, Ticket.estado != "finalizado")).scalars(). all()
        except Exception as e:
            print(f"Error during query execution: {str(e)}")
            raise    
        print(f"Tickets abiertos encontrados: {len(ticket)}")
        return ticket

    except Exception as e:
        raise ValueError(f"Error al obtener tickets abiertos: {str(e)}")

def obtener_ticket_especifico(db, id_ticket : int, user:dict) -> Ticket:
    try:
        rol = revisarUsuario(user)
        print(f'user: {user}')
        user_rol = uuid.UUID(user[rol])
        ticket = db.execute(select(Ticket).filter(Ticket.id_ticket == id_ticket, Ticket.id_colaborador == user_rol)).first()
        return ticket
    except Exception as e:
        print (f"Error during query execution: {str(e)}")
        raise ValueError(f"Error al obtener ticket específico: {str(e)}")
    
def obtener_ticket_asunto(db, asunto : str, user:dict):
    try:
        rol = revisarUsuario(user)
        user_rol = uuid.UUID(user[rol])
        ticket = db.execute(select(Ticket).filter(Ticket.asunto.ilike(f"%{asunto}%"), Ticket.id_colaborador == user_rol)).scalars().all()
        return ticket
    except Exception as e:
        print (f"Error during query execution: {str(e)}")
        raise ValueError(f"Error al obtener ticket por asunto: {str(e)}")