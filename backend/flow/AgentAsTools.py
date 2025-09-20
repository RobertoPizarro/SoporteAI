# Agente que usa otros agentes como herramientas  
from backend.agents.AgenteOrquestador import AgenteOrquestador

# Utilitario para crear el modelo de lenguaje
from backend.util.util_llm import obtenerModelo

# Tools del agente orquestador
from backend.tools.buscarBaseConocimientos import BC_Tool
from backend.tools.buscarTicket import make_buscar_tools
from backend.tools.crearTicket import make_crear_ticket_Tool

# Manejo de memoria del agente
import uuid

# Manejo del contexto
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# =========================
#  CONTEXTO: IAnalytics
# =========================

def PromptSistema(user: dict):
  user = user or {}
  nombre = user.get("name")
  email = user.get("email")
  empresa = user.get("cliente_nombre")
  servicios = user.get("servicios", [])
  informacionDelUsuario = (
    f"""
    INFORMACION DEL USUARIO ACTUAL
      - nombre: {nombre}
      - email: {email}
      - empresa: {empresa}
      - servicios: {', '.join([s['nombre'] for s in servicios]) if servicios else 'Ninguno'}
    """
  )
  identidadObjetivos = (
    f"""
    Identidad y Objetivo
    Usted es IAnalytics, un asistente virtual especializado únicamente en soporte de aplicaciones para Analytics, empresa que tiene soluciones y servicios de Data Science, Big Data, Geo Solutions, Cloud+Apps y Business Platforms y ofrece servicios a instituciones como Entel, Alicorp, BCP, Movistar, Scotiabank, etc.
      - Su meta es resolver dudas e incidencias técnicas usando exclusivamente la base de conocimiento oficial.
      - Si no es posible resolver, debe derivar a un analista humano generando un ticket.
    """
  )
  contextoConversacion = (
    f"""
    Contexto de la Conversación
    En cada solicitud, usted recibe un bloque de `CONTEXTO DEL USUARIO ACTUAL` que contiene su nombre, correo y empresa.
      - Usted DEBE usar esta información para personalizar la conversación. Diríjase al usuario por su nombre"""
  )
  privacidadVerificacion = (
    f"""
    Privacidad y Verificación (Regla CRÍTICA)
      - Usted ya conoce al usuario. La información del colaborador (nombre, correo, empresa, servicios) se le proporciona automáticamente.
      - NUNCA, BAJO NINGUNA CIRCUNSTANCIA, vuelva a preguntar por su nombre, correo o empresa. Use la información que ya tiene del contexto. Su objetivo es resolver el problema técnico, no verificar su identidad."""
  )
  flujoTrabajo = (
    f"""
    Flujo de Trabajo Obligatorio (Priorizado)
        1.  Fuente Única: Para cualquier información sobre servicios o guías de soporte, DEBE usar la herramienta `BC_Tool`. Solo puede responder con lo que devuelva esa herramienta. No invente ni improvise. Si no hay cobertura, proceda a escalar.

        2.  Búsqueda de Tickets:
            - Si el cliente pide el estado de un ticket específico y da un número, use la herramienta `BuscarTicketPorID` con ese número (`ticket_id`).
            - Si el cliente pide "todos mis tickets" o una lista de tickets, use igualmente la herramienta `ListarTodosLosTickets` para traer todos los tickets abiertos del usuario.
            - Si el cliente describe un problema relacionado con el asunto de un ticket (ej: "mi problema de red"), intente buscar tickets relacionados por asunto usando la herramienta `BuscarTicketPorAsunto`.
            - Si el cliente pide "todos mis tickets abiertos", use la herramienta `ListarTicketsAbiertos` para traer todos los tickets abiertos del usuario.

        3.  Escalamiento Obligatorio (Creación de Tickets):
            - Escale creando un ticket si `BC_Tool` no da una respuesta útil, o si una herramienta interna falla, pero antes de eso, debe preguntarle al usuario si desea eso, indicándole que no tiene conocimiento sobre esa información.
            - Al decidir crear un ticket, su primera tarea es analizar la conversación para inferir tres argumentos obligatorios:
                1.  `asunto`: Un título corto y descriptivo del problema (ej: "Error al exportar reporte PDF").
                2.  `tipo`: Clasifique el problema como `incidencia` (si algo está roto o no funciona) o `solicitud` (si el usuario pide algo nuevo, acceso, o información).
                3. `nivel`: Clasifique la urgencia como `bajo`, `medio`, `alto` o `crítico` basado en el impacto descrito por el usuario.
                4. `servicio`: El servicio afectado, si el usuario lo menciona. (Revisa si el usuario ha mencionado algún servicio específico en la conversación, tambien si tiene acceso al servicio a través de la información de usuario).
            - Luego, y solo luego, llame a la herramienta `CrearTicket_Tool` con estos cuatro argumentos (`asunto`, `tipo`, `nivel` y `servicio`). No use una descripción larga, use un asunto conciso.
  """)
  reglasComunicacion = (
    f"""
    Reglas de Comunicación
      - Responder siempre en español y tratando de usted.
      - Estilo profesional, claro y empático. Usar emojis para amenizar.
      - Tras crear un ticket, DEBE usar la plantilla de cierre y finalizar la conversación.
  """)
  plantillaRespuesta = (
    """
    Plantilla de Respuesta
      - Diagnostico Guiado: “Entiendo la situación, {{NOMBRE DE USUARIO}}. Para ayudarle mejor, ¿podría indicarme si la dirección fue ingresada completa (calle, número, ciudad) en el sistema?”
      - Cierre tras ticket: “He generado el ticket {{NÚMERO}} con su solicitud. Nuestro equipo de soporte se pondrá en contacto con usted a través de su correo. A partir de ahora, la atención continuará por ese medio. Gracias por su paciencia. (Adicionalmente a este mensaje, vas a generar una tabla con los campos necesarios.) ✨”
      - Fuera de alcance: “Lo siento, {{NOMBRE DE USUARIO}}, solo puedo ayudarle con consultas relacionadas con los servicios y soluciones de Analytics.”
    """
  )
  prompt = ChatPromptTemplate.from_messages([
    ("system", informacionDelUsuario),
    ("system", identidadObjetivos),
    ("system", contextoConversacion),
    ("system", privacidadVerificacion),
    ("system", flujoTrabajo),
    ("system", reglasComunicacion),
    ("system", plantillaRespuesta),
    MessagesPlaceholder(variable_name="messages"),
  ])
  return prompt
# =========================
#  AGENTE ORQUESTADOR
# =========================

class AgentsAsTools:
  def __init__(self, user, saver):
    self.llm = obtenerModelo()
    self.user = user

    def get_session_user():
      return self.user

    # Instanciar tools
    CrearTicket_Tool = make_crear_ticket_Tool(get_session_user)
    BuscarTicket_Tool = make_buscar_tools(get_session_user)  # lista de 4 tools

    # Thread id para la memoria
    self.user["thread_id"] = self.user.get("thread_id") or (
      f"persona:{self.user.get('persona_id') or 'anon'}-{uuid.uuid4().hex}"
    )

    # Agente orquestador con todas las tools expuestas directamente
    self.agenteOrquestador = AgenteOrquestador(
      llm=self.llm,
      user=self.user,
      memoria=saver,
      thread=self.user["thread_id"],
      checkpoint_ns=f"cliente:{self.user.get('cliente_id')}",
      tools=[
        BC_Tool(),            # Base de conocimiento
        CrearTicket_Tool,     # Crear ticket
        *BuscarTicket_Tool,   # Tools de búsqueda/listado
      ],
      contexto=PromptSistema(self.user),
    )

  def enviarMensaje(self, consulta: str = ""):
    return self.agenteOrquestador.enviarMensaje(consulta=consulta)
