
from backend.util.util_crear_ticket import crear_ticket_BD
from backend.util.util_estado_ticket import estado_ticket_BD
from backend.util.util_actualizar_ticket import actualizar_ticket_BD
from backend.util.util_asignacion import asignacion_BD
from backend.util.util_escalamiento import escalamiento_BD
from backend.util.util_panel_analista import panel_analista_BD
from backend.util.util_mis_tickets import mis_tickets_BD
from langchain_core.tools import tool
from backend.db.crud import crud_ticket
from sqlalchemy.exc import SQLAlchemyError
import json

class BD_tools:
    def __init__(self):
        pass

    def devolver_tools(self):
        """
        Devuelve la lista de todas las herramientas (tools) disponibles
        para ser pasadas al agente.
        """
        return [
            self.tool_crear_ticket(),
            self.tool_estado_ticket(),
            self.tool_actualizar_ticket(),
        ]
        
    def tool_crear_ticket(self):
        @tool
        def tool_crear_ticket(input: dict) -> str:
            """
            Crea un nuevo ticket en la base de datos.
            Espera un diccionario con las claves:
            id_colaborador, id_cliente_servicio, id_analista, asunto, estado, nivel, tipo.
            """
            try:
                nuevo = crud_ticket.crear_ticket(input)
                return f"✅ Ticket creado con ID {nuevo.id_ticket}"
            except SQLAlchemyError as e:
                return f"❌ Error al insertar ticket en BD: {str(e)}"
            except Exception as e:
                return f"❌ Error desconocido: {str(e)}"
        return tool_crear_ticket

    def tool_estado_ticket(self):
        @tool
        def tool_estado_ticket(input: int) -> str:
            """
            Obtiene el estado de un ticket dado su id_ticket.
            """
            try:
                ticket = crud_ticket.obtener_ticket_especifico(input)
                if not ticket:
                    return f"⚠️ No existe un ticket con ID {input}"
                return f"📌 Ticket {ticket.id_ticket} está en estado '{ticket.estado}'"
            except Exception as e:
                return f"❌ Error al obtener estado del ticket: {str(e)}"
        return tool_estado_ticket
        
    
    def tool_actualizar_ticket(self):
        @tool
        def tool_actualizar_ticket(input: dict | str) -> str:
            """
            Actualiza un ticket en la base de datos.

            Posibles combinaciones de parámetros:
            - {"id_ticket": INT, "estado": "nuevo estado"}
            - {"id_ticket": 4, "id_analista": "<uuid>", "nivel": "medio"}
            """
            try:
                # Si el input es string, intentar parsearlo
                if isinstance(input, str):
                    try:
                        input = json.loads(input)
                    except json.JSONDecodeError:
                        return "❌ Error: se esperaba un JSON válido con los parámetros del ticket"

                # Validar que input sea un dict con claves str
                if not isinstance(input, dict) or not all(isinstance(k, str) for k in input.keys()):
                    return "❌ Error: el input debe ser un diccionario con claves de tipo str"

                # Validar que los parámetros requeridos estén presentes
                if "id_ticket" not in input or "estado" not in input:
                    return "❌ Error: faltan los parámetros requeridos 'id_ticket' y/o 'estado'"

                ticket = crud_ticket.actualizar_ticket(**input)  # <- kwargs
                if not ticket:
                    return f"⚠️ No existe un ticket con ID {input.get('id_ticket')}"
                return (
                    f"🔄 Ticket {ticket.id_ticket} actualizado. "
                    f"Estado: {ticket.estado}, Nivel: {ticket.nivel}, Analista: {ticket.id_analista}"
                )
            except Exception as e:
                return f"❌ Error al actualizar ticket: {str(e)}"

        return tool_actualizar_ticket
  
    def tool_asignacion(self):
        @tool
        def tool_asignacion(input: str) -> str:
            """
            #Asigna un ticket a un analista (dummy).
            """
            return asignacion_BD()
        
        return tool_asignacion

    def tool_escalamiento(self):
        @tool
        def tool_escalamiento(input: str) -> str:
            """
            #Escala un ticket al nivel superior (dummy).
            """
            return escalamiento_BD()
        return tool_escalamiento 

    def tool_panel_analista(self):
        @tool
        def tool_panel_analista(input: str) -> str:
            """
            #Muestra el panel del analista con sus tickets asignados (dummy).
            """
            return panel_analista_BD()
        return tool_panel_analista
        
    def tool_mis_tickets(self) :
        @tool
        def tool_mis_tickets(input: str) -> str:
            """
            #Lista todos los tickets del usuario (dummy).
            """
            return mis_tickets_BD()
        return tool_mis_tickets