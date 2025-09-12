from backend.db.database import get_session, ClienteServicio

def obtener_clientes_servicios():
    session = get_session()
    filas = session.query(ClienteServicio).all()
    session.close()
    return filas