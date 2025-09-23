from langchain_core.messages import AIMessage, HumanMessage

def formatearMensaje(conversacion: list) -> list[dict]:
    formateado = []
    for msg in conversacion:
        if isinstance(msg, HumanMessage):
            role = "user"
        elif isinstance(msg, AIMessage):
            role = "agent"
        else:
            continue
        formateado.append({"role": role, "content": msg.content})
    return formateado

def formatearTicket(ticket) -> str:
    detalles = (
        f"- *ID: * #{ticket.id_ticket}\n"
        f"- *Asunto:* {ticket.asunto}\n"
        f"- *Estado:* {ticket.estado}\n"
        f"- *Nivel:* {ticket.nivel}\n"
        f"- *Tipo:* {ticket.tipo}\n"
        f"- *Empresa:* {ticket.cliente_nombre}\n"
        f"- *Servicio:* {ticket.servicio_nombre}\n"
        f"- *Analista:* {ticket.analista_nombre}\n"
        f"- *Fecha de creacion:* {ticket.created_at.strftime('%d/%m/%Y') if ticket.created_at else 'No especificada'}\n"
    )
    
    if ticket.estado == 'en atención':
        detalles += f"- *Fecha de actualización:* {ticket.updated_at.strftime('%d/%m/%Y') if ticket.updated_at else 'No especificada'}\n"
    
    if ticket.estado == 'finalizado' or ticket.estado == 'cancelado':
        detalles += f"- *Diagnostico:* {ticket.diagnostico}\n"
        detalles += f"- *Fecha de cierre:* {ticket.closed_at.strftime('%d/%m/%Y') if ticket.closed_at else 'No especificada'}\n"
        
    return detalles

def formatearTickets(ticket) -> dict:
    return {
        "id": ticket.id_ticket,
        "asunto": ticket.asunto,
        "estado": getattr(ticket, "estado", None),
        "nivel": getattr(ticket, "nivel", None),
        "tipo": getattr(ticket, "tipo", None),
    }