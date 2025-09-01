from backend.util.util_key import obtenerAPI
from backend.util.util_sincronizacion import cargarArchivoDeCarpeta
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos

print ("La API es: " + obtenerAPI("CONF-DATABASE-URL"))

obtenerConexionBaseDeDatos()

