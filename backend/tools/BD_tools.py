
from backend.util.util_crear_ticket import crear_ticket_BD
from backend.util.util_estado_ticket import estado_ticket_BD
from backend.util.util_actualizar_ticket import actualizar_ticket_BD
from backend.util.util_asignacion import asignacion_BD
from backend.util.util_escalamiento import escalamiento_BD
from backend.util.util_panel_analista import panel_analista_BD
from backend.util.util_mis_tickets import mis_tickets_BD
from langchain_core.tools import tool

class BD_tools:
    def __init__(self):
        # Si necesitas estado u otras inicializaciones internas, puedes agregarlas aquí
        pass

    def devolver_tools(self):
        """
        Devuelve una lista de todas las herramientas (tools) disponibles,
        para ser pasadas al agente.
        """
        return [
            self.tool_crear_ticket(),
            self.tool_estado_ticket(),
            self.tool_actualizar_ticket(),
            self.tool_asignacion(),
            self.tool_escalamiento(),
            self.tool_panel_analista(),
            self.tool_mis_tickets(),
        ]
        
    def tool_crear_ticket(self):
        @tool
        def tool_crear_ticket(input: str) -> str:
            """
            Crea un nuevo ticket en la base de datos (dummy).
            """
            return crear_ticket_BD()
        return tool_crear_ticket

    def tool_estado_ticket(self):
        @tool
        def tool_estado_ticket(input: str) -> str:
            """
            Obtiene el estado de un ticket (dummy).
            """
            return estado_ticket_BD()
        return tool_estado_ticket
        
    def tool_actualizar_ticket(self):
        @tool
        def tool_actualizar_ticket(input: str) -> str:
            """
            Actualiza un ticket en la base de datos (dummy).
            """
            return actualizar_ticket_BD()
        return tool_actualizar_ticket

    def tool_asignacion(self):
        @tool
        def tool_asignacion(input: str) -> str:
            """
            Asigna un ticket a un analista (dummy).
            """
            return asignacion_BD()
        
        return tool_asignacion

    def tool_escalamiento(self):
        @tool
        def tool_escalamiento(input: str) -> str:
            """
            Escala un ticket al nivel superior (dummy).
            """
            return escalamiento_BD()
        return tool_escalamiento 

    def tool_panel_analista(self):
        @tool
        def tool_panel_analista(input: str) -> str:
            """
            Muestra el panel del analista con sus tickets asignados (dummy).
            """
            return panel_analista_BD()
        return tool_panel_analista
        
    def tool_mis_tickets(self) :
        @tool
        def tool_mis_tickets(input: str) -> str:
            """
            Lista todos los tickets del usuario (dummy).
            """
            return mis_tickets_BD()
        return tool_mis_tickets