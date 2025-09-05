from backend.util.util_key import obtenerAPI
from backend.util.util_sincronizacion import cargarArchivoDeCarpeta
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos
from backend.flow.AgentAsTools import AgentsAsTools

orq = AgentsAsTools()

print(orq.enviarMensaje("¿Cómo puedo crear un ticket?"))

