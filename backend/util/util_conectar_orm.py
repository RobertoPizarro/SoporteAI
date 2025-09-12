# db.py
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.util.util_key import obtenerAPI

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
