from backend.db.models import Analista, Ticket
from sqlalchemy import func, literal_column
from sqlalchemy import select
def obtener_analistas(db) :
    analistas = db.execute(select(Analista)).scalars().all()
    return analistas 


def obtener_analista_nivel(db, nivel: str):
    subq = (
        select(
            Ticket.id_analista.label("id_analista"),
            func.count(Ticket.id_ticket).label("abiertos")
        )
        .where(Ticket.estado != "cerrado")
        .group_by(Ticket.id_analista)
        .subquery()
    )

    query = (
        select(Analista)
        .outerjoin(subq, Analista.id == subq.c.id_analista)
        .where(Analista.nivel == nivel)
        .order_by(literal_column("abiertos").asc(), func.random())
        .limit(1)
    )
    return db.execute(query).scalars().first()