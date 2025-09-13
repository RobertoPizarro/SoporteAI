from backend.db.persona.persona_tablas import Persona, External
from sqlalchemy import select

def insertar_analista(db, sub: str, email: str | None, name: str | None, hd: str | None):
    # 1) Buscar external por (provider, id_provider)
    ext = db.execute(
        select(External).where(
            External.provider == "google",
            External.id_provider == sub
        )
    ).scalars().first()

    persona_id = ext.id_persona
    # 2) Crear analista si no existe
    from backend.db.database import Analista  # Importar aquí para evitar ciclos

    analista = db.execute(
        select(Analista).where(Analista.id_persona == persona_id)
    ).scalars().first()
    
    analista_id = str(analista.id_analista)

    return {
        "persona_id": str(persona_id),
        "analista_id": str(analista_id) if analista_id else None,
    }