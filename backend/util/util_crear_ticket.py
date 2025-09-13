from backend.db.crud import crud_ticket
def crear_ticket_BD(kwargs : dict =None):
    """
    Stub para el intent 'crear_ticket'.
    """
    
    ticket = crud_ticket.crear_ticket(kwargs)
    return f"Ticker creado con id : {ticket.id_ticket}"