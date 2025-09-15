# Utilitario para crear y ejecutar agentes
from langgraph.prebuilt import create_react_agent
# Utilitario para el modelo de lenguaje
from langchain_openai import AzureChatOpenAI

# Manejo de memoria del agente
from langgraph.checkpoint.memory import InMemorySaver

# Para extraer el contenido de la respuesta 
from langchain.schema import AIMessage

def _extraerContenido(respuesta):
    if isinstance(respuesta, dict) and "output" in respuesta:
        return respuesta["AIMessage"]
    return respuesta

def crearAgente(
    llm: AzureChatOpenAI, tools: list | None = None, contexto: str = "", memoria=None
):
    if tools is None:
        tools = []
    if memoria is None:
        memoria = InMemorySaver()
    agente = create_react_agent(
        model=llm, tools=tools, checkpointer=memoria, prompt=contexto,
    )
    return agente



def ejecutar(agente, consulta: str = "", config=None, verbose: bool = True):
    try:
        respuesta = agente.invoke(
                {"messages": [{"role": "user", "content": consulta}]}, config=config
            )
        if not verbose:            
            return respuesta
        else:
            mensajes = respuesta.get("messages", [])
            
            # Buscar si hay resultados de herramientas con objetos ticket
            ticket_data = None
            for m in mensajes:
                # Buscar mensajes de herramientas (ToolMessage)
                if hasattr(m, 'type') and m.type == 'tool':
                    try:
                        # Intentar parsear el contenido como JSON
                        import json
                        tool_result = json.loads(m.content) if isinstance(m.content, str) else m.content
                        
                        if isinstance(tool_result, dict) and tool_result.get('type') == 'ticket':
                            ticket_data = tool_result
                            print(f"[DEBUG] TICKET DATA FOUND IN TOOL RESULT: {ticket_data}")
                            break
                    except:
                        continue

            # Buscar la respuesta final del agente
            agent_message = None
            for m in reversed(mensajes):
                if isinstance(m, AIMessage):
                    tool_calls = (m.additional_kwargs or {}).get("tool_calls") or []
                    if not tool_calls:
                        agent_message = (m.content or "").strip()
                        break

            if not agent_message:
                for m in reversed(mensajes):
                    if isinstance(m, AIMessage):
                        agent_message = (m.content or "").strip()
                        break
            
            # Si encontramos datos de ticket, devolver estructura completa
            if ticket_data and agent_message:
                result = {
                    'type': 'ticket',
                    'message': agent_message,
                    'ticket': ticket_data.get('ticket', {})
                }
                print(f"[DEBUG] RETURNING TICKET STRUCTURE: {result}")
                return result
            
            # Si no hay ticket, devolver solo el mensaje
            return agent_message or "No se pudo obtener respuesta del agente"
            
    except Exception as e:
        print("Error en la ejecución del agente: ", e)
        return None
