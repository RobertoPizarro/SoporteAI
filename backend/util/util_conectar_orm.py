# db.py
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.util.util_key import obtenerAPI
from flask import session
from backend.db.crud.crud_cliente import obtener_cliente_nombre


DATABASE_URL = obtenerAPI("CONF-DATABASE-ANALYTICS-URL")

engine = create_engine(DATABASE_URL, future=True, echo=False)  # echo=True si quieres logs SQL
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

@contextmanager
def conectarORM():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


def obtenerSesion():
    user = session.get("user")
    if user:
        cliente_id = user.get("cliente_id")
        user["cliente_nombre"] = obtener_cliente_nombre(cliente_id)
        session["user"] = user
    return session.get("user")
    
        