from langchain_core.tools import tool
from backend.db.crud.crud_ticket import crear_ticket, TicketCreatePublic, TicketNivelEnum, TicketTipoEnum
from backend.util.util_conectar_orm import conectarORM


def make_crear_ticket_Tool(get_session_user):
    @tool(
        "CrearTicket",
        description=(
            "Eres CrearTicket. Sólo puedes crear un nuevo ticket en el sistema de soporte."
            "Usa esta herramienta sólo si el usuario te lo pide explícitamente."
            "Debes esperar un diccionario con las claves: asunto, nivel, tipo, servicio."
            "El nivel puede ser 'bajo', 'medio', 'alto' o 'crítico'."
            "El tipo puede ser 'incidencia' o 'solicitud'."
            "Devuelve un mensaje de confirmación con el ID del ticket creado o un mensaje de error."
        ),
        args_schema=TicketCreatePublic,
        return_direct=True,
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
            return {"error": f"Error en los datos proporcionados: {str(e)}", "type": "error"}

        try:
            with conectarORM() as db:
                nuevo_ticket = crear_ticket(db, payload, user)
                
                if nuevo_ticket:
                    # ✅ ACCEDER A LOS DATOS DENTRO DEL CONTEXTO DE LA SESIÓN
                    ticket_data = {
                        "id": nuevo_ticket.id_ticket,
                        "asunto": nuevo_ticket.asunto,
                        "tipo": nuevo_ticket.tipo.value,
                        "nivel": nuevo_ticket.nivel.value,
                        "servicio": payload.servicio,  # ← USAR EL SERVICIO DEL PAYLOAD
                        "estado": "Nuevo",
                        "usuario": user.nombre if hasattr(user, 'nombre') else str(user),
                        "fechaCreacion": nuevo_ticket.created_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'created_at') else "",
                        "fechaActualizacion": nuevo_ticket.updated_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'updated_at') else "",
                        "diagnostico": "",
                        "cliente": getattr(user, 'cliente', ''),
                        "fechaCierre": ""
                    }
                    
                    ticket_response = {
                        "type": "ticket",
                        "message": f"He generado el ticket {nuevo_ticket.id_ticket} con su solicitud. Nuestro equipo de soporte se pondrá en contacto con usted a través de su correo. A partir de ahora, la atención continuará por ese medio. Gracias por su paciencia.",
                        "ticket": ticket_data
                    }
                    print(f"[DEBUG] CrearTicket_Tool returning OBJECT: {ticket_response}")
                    print(f"[DEBUG] Type of response: {type(ticket_response)}")
                    return ticket_response
                else:
                    return {"error": "No se pudo crear el ticket. Por favor, inténtelo de nuevo más tarde.", "type": "error"}
        except Exception as e:
            return {"error": f"Error al crear el ticket: {str(e)}", "type": "error"}
        
    return crearTicket_Tool