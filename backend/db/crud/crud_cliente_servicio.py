from backend.db.database import ClienteServicio
from sqlalchemy import select

def obtener_clientes_servicios(db):
    filas = db.execute(select(ClienteServicio)).scalars().all()
    return filas

def obtener_clientes_servicios_cliente(db, id_cliente: str):
    filas = db.execute(
        select(ClienteServicio).where(
            ClienteServicio.id_cliente == id_cliente
        )
    ).scalars().all()
    return filas