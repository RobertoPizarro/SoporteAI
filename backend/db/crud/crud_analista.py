from backend.db.database import get_session, Analista
 
def obtener_analistas() :
    session = get_session()
    analistas = session.query(Analista).all()
    session.close()
    return analistas 