from fastapi import APIRouter, Request, HTTPException
from backend.db.crud.crud_ticket import obtener_tickets, obtener_ticket_especifico, actualizar_ticket_estado
from backend.util.util_conectar_orm import conectarORM
analista_router = APIRouter()

@analista_router.get("/analista/tickets")
def obtenerTickets(req: Request):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            tickets = obtener_tickets(db, analista)
            return {"tickets": tickets}
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
    # Lógica para el chat del ticket
    return {"mensaje": f"Funcionalidad de chat para el ticket {ticket}"}  

@analista_router.get("/analista/ticket")
def obtenerTicket(req: Request, ticket: int):
    analista = req.session.get("user")
    if not analista or analista.get("rol") != "analista":
        raise HTTPException(401, "unauthorized")
    try:
        with conectarORM() as db:
            ticket = obtener_ticket_especifico(db, ticket, analista)
            if not ticket:
                raise HTTPException(404, f"Ticket {ticket} no encontrado o no autorizado")
    except Exception as e:
        raise HTTPException(500, f"Error interno: {e}")
    return {"ticket": {"id": ticket, "asunto": "Asunto del ticket", "estado": "abierto"}}

