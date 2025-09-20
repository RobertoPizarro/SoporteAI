from sqlalchemy import select
from backend.db.models import Escalado
from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from backend.db.crud.crud_analista import obtener_analista_nivel
import enum
from sqlalchemy.orm import Session
import uuid 

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
