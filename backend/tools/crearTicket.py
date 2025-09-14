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
    def crearTicket_Tool(asunto: str, nivel: str, tipo: str, servicio: str) -> str:
        user = get_session_user()
        if not user:
            return "Error: Usuario no autenticado."
        try:
            payload = TicketCreatePublic(
                asunto=asunto,
                nivel=TicketNivelEnum(nivel),
                tipo=TicketTipoEnum(tipo),
                servicio=servicio
            )
        except Exception as e:
            return f"Error en los datos proporcionados: {str(e)}"

        try:
            with conectarORM() as db:
                nuevo_ticket = crear_ticket(db, payload, user)
            if nuevo_ticket:
                return f"He generado el ticket {nuevo_ticket.id_ticket} con su solicitud. Nuestro equipo de soporte se pondrá en contacto con usted a través de su correo. A partir de ahora, la atención continuará por ese medio. Gracias por su paciencia."
            else:
                return "No se pudo crear el ticket. Por favor, inténtelo de nuevo más tarde."
        except Exception as e:
            return f"Error al crear el ticket: {str(e)}"
        
    return crearTicket_Tool