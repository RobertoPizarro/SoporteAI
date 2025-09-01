"""Agente orquestador que crea y ejecuta un agente LangGraph."""
# Utilitario para crear un agente conversacional
from backend.util.util_agente import crearAgente, ejecutar

# Utilitario para manejar la memoria del agente
from langgraph.checkpoint.memory import InMemorySaver

# Utilitario para el modelo de lenguaje
from langchain_openai import AzureChatOpenAI

import uuid


class AgenteOrquestador:

    def __init__(
        self,
        llm: AzureChatOpenAI,
        contexto: str = "",
        thread: str = "",
        checkpoint_ns: str = "soporte",
        tools: list | None = None,
        memoria=None,
    ):
        self.llm = llm
        self.contexto = contexto
        self.memoria = memoria or InMemorySaver()
        self.tools = tools
        self.checkpoint_ns = checkpoint_ns
        self.thread = thread
        self.agente = crearAgente(
            llm=self.llm, contexto=self.contexto, memoria=self.memoria, tools=self.tools
        )

    def enviarMensaje(self, consulta: str = ""):
        return ejecutar(
            self.agente,
            consulta=consulta,
            config={
                "configurable": {
                    "thread_id": f"{self.thread}",
                    "checkpoint_ns": f"{self.checkpoint_ns}",
                }
            },
        )

    def reiniciarMemoria(self) -> bool:
        """
        Si es InMemorySaver: reinstancia y reconstruye el agente.
        Si es PostgresSaver: abre un nuevo thread.
        """
        if isinstance(self.memoria, InMemorySaver):
            # Reinicia la memoria en RAM y reconstruye el agente
            self.memoria = InMemorySaver()
            self.agente = crearAgente(
                llm=self.llm, contexto=self.contexto, memoria=self.memoria, tools=self.tools
            )
        else:
            # Para almacenes persistentes, cambia a un nuevo hilo
            self.thread = f"temp-{uuid.uuid4().hex}"
        return True

    def definirHilo(self, thread: str = "", checkpoint_ns=None) -> bool:
        """
        Define el ID del hilo (thread) y el namespace del checkpoint para la memoria del agente.
        Args:
            thread (str, optional): ID del hilo.
            checkpoint_ns (str, optional): Namespace del checkpoint. Si no se proporciona, no se cambia.
        Returns:
            bool: True si se actualizó correctamente.
        """
        self.thread = thread
        if checkpoint_ns:
            self.checkpoint_ns = checkpoint_ns
        return True
