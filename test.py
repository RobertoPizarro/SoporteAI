from backend.util.util_key import obtenerAPI
from backend.util.util_sincronizacion import cargarArchivoDeCarpeta
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos
from backend.flow.AgentAsTools import AgentsAsTools

orq = AgentsAsTools()

# FastAPI - Flask

# Dentro de las comillas agregar el prompt
print(orq.enviarMensaje(""))

