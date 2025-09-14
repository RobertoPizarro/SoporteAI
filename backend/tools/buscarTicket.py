from backend.db.crud.crud_ticket import obtener_ticket_asunto, obtener_ticket_especifico, obtener_tickets, obtener_tickets_abiertos
from backend.util.util_conectar_orm import conectarORM
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class BuscarPorAsuntoInput(BaseModel):
    asunto: str = Field(..., description="Asunto o frase para buscar tickets.")

class BuscarPorIdInput(BaseModel):
    id_ticket: int = Field(..., description="ID del ticket a consultar.")

def make_buscar_tools(get_session_user):
    
    @tool (
        "BuscarTicketPorAsunto",
        description=(
            "Eres BuscarTicketPorAsunto. Sólo puedes buscar tickets por su asunto en el sistema de soporte."
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."
            "Debes esperar un diccionario con la clave 'asunto' que contiene una cadena de texto."
            "Devuelve los detalles de los tickets encontrados o un mensaje indicando que no se encontraron tickets."
        ),
        args_schema=BuscarPorAsuntoInput,
        return_direct=True,
    )
    def buscar_ticket_por_asunto(asunto: str):
        user = get_session_user()
        with conectarORM() as db:
            ticket = obtener_ticket_asunto(db, asunto, user)
        if ticket:
            return f"""Se encontraron {len(ticket)} tickets relacionados al asunto "{asunto}". Detalles:
            {', '.join([f'ID: {t.id_ticket}, Asunto: {t.asunto}, Estado: {t.estado}, Nivel: {t.nivel}, Tipo: {t.tipo}' for t in ticket])}
        """
        return f'No se encontraron tickets relacionados al asunto "{asunto}".'
    
    @tool (
        "BuscarTicketPorID",
        description=(
            "Eres BuscarTicketPorID. Sólo puedes buscar un ticket por su ID en el sistema de soporte."
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."
            "Debes esperar un diccionario con la clave 'id_ticket' que contiene un entero."
            "Devuelve los detalles del ticket encontrado o un mensaje indicando que no se encontró el ticket."
        ),
        args_schema=BuscarPorIdInput,
        return_direct=True,
    )
    def buscar_ticket_por_id(id_ticket: int):
        user = get_session_user()
        with conectarORM() as db:
            ticket = obtener_ticket_especifico(db, id_ticket, user)
        if ticket:
            return f'Se encontró el ticket con ID {id_ticket}. Detalles: Asunto - {ticket.Ticket.asunto}, Estado - {ticket.Ticket.estado}, Nivel - {ticket.Ticket.nivel}, Tipo - {ticket.Ticket.tipo}.'
        return f'No se encontró el ticket con ID {id_ticket}.'

    @tool  (
        "ListarTicketsAbiertos",
        description=(
            "Eres ListarTicketsAbiertos. Sólo puedes listar todos los tickets abiertos en el sistema de soporte."
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."
            "No necesitas argumentos para esta herramienta."
            "Devuelve los detalles de los tickets abiertos o un mensaje indicando que no hay tickets abiertos."
        ),
    )
    def listar_tickets_abiertos():
        user = get_session_user()
        with conectarORM() as db:
            tickets = obtener_tickets_abiertos(db, user)
        if tickets:
            return f"""Se encontraron {len(tickets)} tickets abiertos. Detalles:
            {', '.join([f'ID: {t.id_ticket}, Asunto: {t.asunto}, Estado: {t.estado}, Nivel: {t.nivel}, Tipo: {t.tipo}' for t in tickets])}
        """
        return 'No se encontraron tickets abiertos.'

    @tool (
        "ListarTodosLosTickets",
        description=(
            "Eres ListarTodosLosTickets. Sólo puedes listar todos los tickets en el sistema de soporte."
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."
            "No necesitas argumentos para esta herramienta."
            "Devuelve los detalles de todos los tickets o un mensaje indicando que no hay tickets en el sistema."
        ),
    )
    def listar_todos_los_tickets():
        user = get_session_user()
        with conectarORM() as db:
            tickets = obtener_tickets(db, user)
        if tickets:
            return f"""Se encontraron {len(tickets)} tickets en total. Detalles:
            {', '.join([f'ID: {t.id_ticket}, Asunto: {t.asunto}, Estado: {t.estado}, Nivel: {t.nivel}, Tipo: {t.tipo}' for t in tickets])}
        """
        return 'No se encontraron tickets en el sistema.'
    
    return [buscar_ticket_por_asunto, buscar_ticket_por_id, listar_tickets_abiertos, listar_todos_los_tickets]