from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from backend.util.util_key import obtenerAPI

# Crear engine (solo aquí)
engine = create_engine(obtenerAPI("CONF-DATABASE-ANALYTICS-URL"))

# Automap
Base = automap_base()
Base.prepare(autoload_with=engine)

# Exponer clases de la BD
Ticket = Base.classes.ticket
Colaborador = Base.classes.colaborador
ClienteServicio = Base.classes.cliente_servicio
ClienteDominio = Base.classes.cliente_dominio
Extermnal = Base.classes.external
Analista = Base.classes.analista
Persona = Base.classes.persona
Cliente = Base.classes.cliente
Servicio = Base.classes.servicio
Conversacion = Base.classes.conversacion
Escalado = Base.classes.escalado

# Función para obtener sesión
def get_session():
    return Session(engine)
