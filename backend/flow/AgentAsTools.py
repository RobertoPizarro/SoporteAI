from backend.util.util_llm import obtenerModelo
from backend.agents.agenteOrquestador import AgenteOrquestador
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos
condiciones = ""


class AgentsAsTools:
    def __init__(self):
        self.llm = obtenerModelo()
        self.agenteOrquestador = AgenteOrquestador(
            llm=self.llm, 
            memoria = obtenerConexionBaseDeDatos(),
            tools = [],
            contexto=f"Eres un asistente de . {condiciones}"
        )
