from backend.db.models import ClienteServicio, Servicio
from sqlalchemy import select

def obtener_clientes_servicios(db):
    filas = db.execute(select(ClienteServicio)).scalars().all()
    return filas

def obtener_servicios_clientes(db, id_cliente: str):
    q = (
        select(ClienteServicio.id, Servicio.nombre)
        .join(Servicio, Servicio.id == ClienteServicio.id_servicio)
        .where(ClienteServicio.id_cliente == id_cliente)
        .order_by(Servicio.nombre.asc())
    )
    return db.execute(q).all()
