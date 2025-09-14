# Utilitario para el modelo de lenguaje
from langchain_openai import AzureChatOpenAI
from backend.util.util_llm import obtenerModelo
from backend.util.util_agente import crearAgente, ejecutar
from backend.tools.buscarTicket import make_buscar_tools

class AgenteBuscador:
    def __init__(self, llm: AzureChatOpenAI, user: dict = {}):
        self.llm = llm
        self.user = user
        def get_user():
            return self.user
        buscar_tools = make_buscar_tools(get_user)
        self.tools = buscar_tools
        self.contexto = """
        Eres un asistente especializado en búsqueda de tickets.
        Debes decidir si el usuario quiere:
        1. Consultar un ticket por ID (ej: "ticket 5").
        2. Listar todos los tickets abiertos.
        3. Buscar tickets relacionados a un asunto.
        Siempre responde en español, claro y conciso.
        """
        self.agente = crearAgente(
            llm=self.llm, tools=self.tools, contexto=self.contexto
        )
        
    def enviarMensaje(self, consulta: str = ""):
        return ejecutar(self.agente, consulta=consulta, verbose=False)