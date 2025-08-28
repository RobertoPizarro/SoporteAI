from langgraph.graph import StateGraph, END

from backend.util.util_llm import obtenerModelo

from backend.util.util_base_de_conocimientos import obtenerBaseDeConocimientos

from backend.agents.agenteDeChatbot import AgenteDeChatbot

# Esto va a morir en un corto plazo de tiempo :D

class FlujoMultiAgente:
    """
    
    """
    
    def __init__(self, baseDeConocimiento=None):
        self.crearObjetos(baseDeConocimiento)
        self.implementarNodos()
        self.dibujadoDeGrafo()
        