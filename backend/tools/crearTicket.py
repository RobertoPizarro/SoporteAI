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
            return {"error": f"Error en los datos proporcionados: {str(e)}", "type": "error"}

        try:
            with conectarORM() as db:
                nuevo_ticket = crear_ticket(db, payload, user)
                
                if nuevo_ticket:
                    ticket_data = {
                        "id": nuevo_ticket.id_ticket,
                        "asunto": nuevo_ticket.asunto,
                        "tipo": nuevo_ticket.tipo, 
                        "nivel": nuevo_ticket.nivel, 
                        "servicio": payload.servicio,  # ← USAR EL SERVICIO DEL PAYLOAD
                        "estado": "Nuevo",
                        "usuario": user.get("name"),
                        "fechaCreacion": nuevo_ticket.created_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'created_at') else None,
                        "fechaActualizacion": nuevo_ticket.updated_at.strftime('%d/%m/%Y') if hasattr(nuevo_ticket, 'updated_at') else None,
                        "cliente": user.get("cliente_nombre"),
                    }
                    
                    base_msg = (
                        f"He generado el ticket {nuevo_ticket.id_ticket} con su solicitud. "
                        "Nuestro equipo de soporte se pondrá en contacto con usted a través de su correo."
                    )

                    try:
                        nivel_enum = nuevo_ticket.nivel if isinstance(nuevo_ticket.nivel, TicketNivelEnum) else TicketNivelEnum(nuevo_ticket.nivel)
                    except Exception:
                        nivel_enum = None
                        
                    nivel_msg_map = {
                        TicketNivelEnum.bajo: "El horario estimado de atención es dentro de 24 horas.",
                        TicketNivelEnum.medio: "El horario estimado de atención es dentro de 12 horas.",
                        TicketNivelEnum.alto: "El horario estimado de atención es dentro de 4 horas.",
                        TicketNivelEnum.critico: "Nos contactaremos con usted lo más pronto posible.",
                    }
                    extra_msg = nivel_msg_map.get(
                        nivel_enum,  # type: ignore[arg-type]
                        "Nos contactaremos con usted lo más pronto posible."
                    )
                    message = f"{base_msg} {extra_msg}".strip()

                    return {
                        "type": "ticket",
                        "message": message,
                        "ticket": ticket_data
                    }
                else:
                    return {"error": "No se pudo crear el ticket. Por favor, inténtelo de nuevo más tarde.", "type": "error"}
        except Exception as e:
            return {"error": f"Error al crear el ticket: {str(e)}", "type": "error"}
        
    return crearTicket_Tool