from backend.db.models import Escalado
from sqlalchemy.orm import Session

def crear_escalado(bd: Session, idTicket: int, id_analista_der, id_analista_soli, motivo: str) -> Escalado:
    try:
        new_escalado = Escalado(
            id_ticket = idTicket,
            id_analista_solicitante = id_analista_soli,
            id_analista_derivado = id_analista_der,
            motivo = motivo,
        )
        
        bd.add(new_escalado)
        bd.flush()
        print(f"Escalado creado: {new_escalado}")
        print(f"ID asignado: {new_escalado.id_escalado}")
        return new_escalado
    except Exception as e:
        raise ValueError(f"Error al crear escalado: {str(e)}")
