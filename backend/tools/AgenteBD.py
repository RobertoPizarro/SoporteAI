from langchain_core.tools import Tool, BaseTool
from langchain_openai import AzureChatOpenAI
from backend.util.util_agente import crearAgente, ejecutar
from backend.tools.BD_tools import BD_tools
from typing import Optional,Any
from langgraph.checkpoint.memory import InMemorySaver

class AgenteBD(BaseTool) :
    thread: str = "",
    checkpoint_ns: str = "soporte",
    name: str = "agente_bd"
    description: str = (
        """Agente especializado en operaciones de base de datos para tickets: 
        crear, consultar estado, actualizar, asignar, escalar, obtener panel de analista y mis tickets.
        Usar cuando se te pida usar alguna de esas operaciones para tickets
        """
    )
    
    llm: Optional[AzureChatOpenAI] = None
    tools: Optional[list] = None
    contexto: Optional[str] = None
    agente : Optional[Any] = None
    
    def __init__(self, llm : AzureChatOpenAI, contexto: str = "" ):
        super().__init__()
        self.llm = llm
        self.tools = BD_tools().devolver_tools()
        self.contexto = contexto
        self.agente = crearAgente(
            llm = self.llm,
            tools = self.tools,
            contexto = contexto,
            memoria= InMemorySaver()
        )
    def _run(self, input: str) -> str:
        # Aquí invocas el agente interno y devuelves su respuesta
        return ejecutar(self.agente, consulta=input,config={
                "configurable": {
                    "thread_id": f"{self.thread}",
                    "checkpoint_ns": f"{self.checkpoint_ns}",
                }
            },)