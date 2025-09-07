from langchain_core.tools import Tool, BaseTool
from langchain_openai import AzureChatOpenAI
from backend.util.util_agente import crearAgente, ejecutar
from .BD_tools import BD_tools

class AgenteBD(BaseTool) :
    
    name: str = "agente_bd"
    description: str = (
        """Agente especializado en operaciones de base de datos para tickets: 
        crear, consultar estado, actualizar, asignar, escalar, obtener panel de analista y mis tickets.
        Usar cuando se te pida usar alguna de esas operaciones para tickets
        """
    )
    
    def __init__(self, llm : AzureChatOpenAI, contexto = None ):
        super().__init__()
        self.llm = llm,
        self.tools = BD_tools.devolver_tools(),
        self.contexto = contexto
        self.agente = crearAgente(
            llm = self.llm,
            tools = self.tools,
            contexto = contexto
        )
    def _run(self, input: str) -> str:
        # Aquí invocas el agente interno y devuelves su respuesta
        return ejecutar(self.agente, consulta=input)