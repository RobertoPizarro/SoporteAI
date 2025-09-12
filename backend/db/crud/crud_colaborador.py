from backend.db.database import get_session, Colaborador

def obtener_colaboradores() :
    session = get_session()
    colaboradores = session.query(Colaborador).all()
    session.close()
    return colaboradores