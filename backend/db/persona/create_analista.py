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

    if ext:
        # actualizar datos no críticos
        ext.correo = email
        ext.nombre = name
        ext.hd = hd
        persona_id = ext.id_persona
    else:
        # crear persona
        persona = Persona()
        db.add(persona); db.flush()              # ahora persona.id_persona existe
        persona_id = persona.id_persona

        # crear external
        ext = External(
            id_persona=persona_id,
            provider="google",
            id_provider=sub,
            correo=email,
            nombre=name,
            hd=hd
        )
        db.add(ext)
    
    # 2) Crear analista si no existe
    from backend.db.database import Analista  # Importar aquí para evitar ciclos

    analista = db.execute(
        select(Analista).where(Analista.id_persona == persona_id)
    ).scalars().first()

    if not analista:
        analista = Analista(id_persona=persona_id)
        db.add(analista); db.flush()
    
    analista_id = str(analista.id_analista)

    # No olvides: commit lo maneja quien llama (session_scope)
    return {
        "persona_id": str(persona_id),
        "analista_id": analista_id
    }