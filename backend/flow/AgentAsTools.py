from backend.util.util_llm import obtenerModelo
from backend.agents.AgenteOrquestador import AgenteOrquestador

# from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos

from backend.tools.buscarBaseConocimientos import BC_Tool
from backend.tools.AgenteBD import AgenteBD

# conn, saver = obtenerConexionBaseDeDatos()

reglas = """
1. SOLO puedes responder preguntas usando la información disponible en tu base de conocimiento o la recuperada mediante tus herramientas (ej. BC_Tool, DB_Tool, etc.).
2. Si el usuario pregunta algo que NO está en tu base de conocimiento ni accesible mediante tus herramientas, debes responder EXACTAMENTE: "Lo siento, no puedo responder esto".
3. NO inventes información, NO uses conocimiento general, SOLO usa lo que esté en la base de conocimiento o lo que entreguen tus herramientas.
4. Debes contestar en un lenguaje formal pero claro y cercano.
5. Debes contestar en el mismo idioma del usuario (si pregunta en español, respondes en español; si pregunta en inglés, respondes en inglés).
6. Si la pregunta está relacionada con Analytics pero no tienes información suficiente, responde: "Lo siento, no puedo responder esto".
7. Debes interpretar preguntas con errores ortográficos o gramaticales, pero siempre responder de manera clara y precisa.
8. Tu objetivo es ayudar a las empresas a obtener soporte técnico o analítico sobre sus consultas, incidencias y reportes, basándote en la lógica del sistema descrito en los requisitos (atención automática, escalamiento a humano, gestión de tickets).
9. Si la información requerida corresponde a datos específicos de un cliente (ej. tickets, estado de incidencias, métricas), utiliza las herramientas integradas para consultarla.
10. Bajo ninguna circunstancia debes dar información fuera del dominio de soporte Analytics de las empresas relacionadas.
"""

politicas = {
  "tools": {
    "BC_Tool": {
      "intents": ["faq", "procedimiento", "como_hacer"],
      "fallback": "negativa"
    },
    "DB_Tool": {
      "intents": [
        "crear_ticket","estado_ticket","actualizar_ticket",
        "asignacion","escalamiento","panel_analista","mis_tickets"
      ],
      "fallback": "negativa"
    }
    
    ### ESPACIO SI SE AGREGAN MAS TOOLS
    
  },
  "routing": {
    "faq": ["BC_Tool"],
    "procedimiento": ["BC_Tool"],
    "como_hacer": ["BC_Tool"],
    "crear_ticket": ["DB_Tool"],
    "estado_ticket": ["DB_Tool"],
    "actualizar_ticket": ["DB_Tool"],
    "asignacion": ["DB_Tool"],
    "escalamiento": ["DB_Tool"],
    "panel_analista": ["DB_Tool"],
    "mis_tickets": ["DB_Tool"]
  }
}

informacionDelUsuario = """
(Rescata de la información al iniciar sesión del usuario)
(Inyectar DATA)
"""

class AgentsAsTools:
    def __init__(self):
        self.llm = obtenerModelo()
        self.agenteOrquestador = AgenteOrquestador(
            llm=self.llm,
            # memoria = saver,
            tools=[BC_Tool(), AgenteBD(llm=obtenerModelo(), contexto= """
                                        Eres un agente de base de datos que puede realizar las acciones de las tools definidas
                                        un agente orquestador te dara el pase y el contexto y debes elegir la mejor tool para la ocasion
                                       """) ]
                   
            #También considera esta información del usuario:
            #{informacionDelUsuario}
        )
    def enviarMensaje(self, consulta: str = ""):
        return self.agenteOrquestador.enviarMensaje(consulta=consulta)
