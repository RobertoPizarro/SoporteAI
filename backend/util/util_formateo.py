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
