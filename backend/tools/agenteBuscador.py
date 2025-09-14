from langchain_core.tools import tool
from backend.agents.AgenteBuscador import AgenteBuscador

def make_agente_buscador(llm, user: dict = {}):
    
    @tool (
        "AgenteBuscador",
        description="Útil para buscar tickets en el sistema de soporte. "
        "Puedes buscar por ID, listar tickets abiertos o buscar por asunto. "
        "Devuelve los detalles del ticket o un mensaje indicando que no se encontró el ticket.",
        return_direct=True,
    )
    def agente_buscador(consulta: str):
        print ("AgenteBuscador - consulta:", consulta)
        agente = AgenteBuscador(llm=llm, user=user)
        respuesta = agente.enviarMensaje(consulta=consulta)
        return respuesta
    return agente_buscador