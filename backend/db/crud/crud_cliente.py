from backend.db.database import get_session, Cliente

def obtener_cliente_nombre(id_cliente: str):
    session = get_session()
    try: 
        fila = session.query(Cliente).filter(Cliente.id_cliente == id_cliente).first()
        return fila.nombre if fila else None
    finally:
        session.close()