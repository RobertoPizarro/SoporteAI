from langchain_core.tools import tool
from backend.db.crud.crud_ticket import crear_ticket, TicketCreatePublic, TicketNivelEnum, TicketTipoEnum
from backend.util.util_conectar_orm import conectarORM


def make_crear_ticket_Tool(get_session_user):
    @tool(
        "CrearTicket",
        description=(
            "Eres CrearTicket. Sólo puedes crear un nuevo ticket en el sistema de soporte."\
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."\
            "Debes esperar un diccionario con las claves: asunto, nivel, tipo, servicio."\
            "El nivel puede ser 'bajo', 'medio', 'alto' o 'crítico'."\
            "El tipo puede ser 'incidencia' o 'solicitud'."\
            "Devuelve un mensaje de confirmación con el ID del ticket creado o un mensaje de error."
        ),
        args_schema=TicketCreatePublic,
    )
    def crearTicket_Tool(asunto: str, nivel: str, tipo: str, servicio: str) -> dict:
        user = get_session_user()
        if not user:
            return {"error": "Usuario no autenticado.", "type": "error"}
        try:
            payload = TicketCreatePublic(
                asunto=asunto,
                nivel=TicketNivelEnum(nivel),
                tipo=TicketTipoEnum(tipo),
                servicio=servicio
            )
        except Exception as e:
            raise Exception(f"Error en los datos proporcionados: {str(e)}")

        try:
            with conectarORM() as db:
                nuevo_ticket = crear_ticket(db, payload, user)
                
                if nuevo_ticket:
                    ticket_data = {
                        "id": nuevo_ticket.id_ticket,
                        "asunto": nuevo_ticket.asunto,
                        "tipo": nuevo_ticket.tipo, 
                        "nivel": nuevo_ticket.nivel, 
                        "servicio": payload.servicio,
                        "estado": "Aceptado",
                        "usuario": user.get("name"),
                        "fechaCreacion": nuevo_ticket.created_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'created_at') else None,
                        "fechaActualizacion": nuevo_ticket.updated_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'updated_at') else None,
                        "cliente": user.get("cliente_nombre"),
                    }
                    
                    return {
                        "type": "ticket_created",
                        "ticket": ticket_data,
                        "message": f"Ticket creado con éxito. ID del ticket: {nuevo_ticket.id_ticket}."
                    }
                else:
                    raise Exception("No se pudo crear el ticket. Por favor, inténtelo de nuevo más tarde.")
        except Exception as e:
            raise Exception(f'Error al crear el ticket: {str(e)}')

    return crearTicket_Tool