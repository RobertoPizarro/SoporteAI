from backend.util.util_key import obtenerAPI
from backend.util.util_sincronizacion import cargarArchivoDeCarpeta

print ("La API es: " + obtenerAPI("CONF-OPENAI-API-KEY"))

cargarArchivoDeCarpeta("D:/Repos/SoporteAI/SoporteAI/backend/files", tags=["test", "prueba"], carpetaErrores="D:/Repos/SoporteAI/SoporteAI/backend/files/_errores")