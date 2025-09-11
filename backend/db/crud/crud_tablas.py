from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base() #para que la clase herede de aqui y el orm lo tenga en su catalogo

class Escalado(Base):
    __tablename__ = "Escalado"
    
    id_escalado = Column(Integer, primary_key=True, autoincrement= True)
    id_ticket = Column(Integer, primary_key=True, autoincrement= True)
    id_escalado = Column(Integer, primary_key=True, autoincrement= True)
    id_escalado = Column(Integer, primary_key=True, autoincrement= True)
    id_escalado = Column(Integer, primary_key=True, autoincrement= True)
    