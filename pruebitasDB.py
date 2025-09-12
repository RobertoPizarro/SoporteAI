from backend.db.crud import crud_cliente_servicio,crud_colaborador,crud_analista,crud_ticket
from sqlalchemy.exc import SQLAlchemyError
#for t in crud_ticket.obtener_tickets():
#    print(t.id_ticket, t.asunto)
    
# Insertar ticket
"""try:
    nuevo = crud_ticket.crear_ticket({
        "id_colaborador": "5a9760a5-3f9d-2141-7ca6-81362eef7cfd",
        "id_cliente_servicio": "d50bf689-bfca-809b-5a7a-7c7bd8f42d1f",
        "id_analista": "f36c6de9-5abd-7258-bf3f-19533740fd1b",
        "asunto": "Problema de red",
        "estado": "en atención",
        "nivel": "medio",
        "tipo" : "incidencia"
    })
    print("Ticket creado:", nuevo.id_ticket)
except SQLAlchemyError as e :
    print(f"Ha habido un error insertando, {e}" )
except Exception as e:
    print(f"ERROR DESCONOCIDO , {e}")"""

#for t in crud_colaborador.obtener_colaboradores():
#    print(t.id_colaborador)

#for t in crud_analista.obtener_analistas():
#    print(t.id_analista, t.nivel)

#for t in crud_cliente_servicio.obtener_clientes_servicios():
#     print(t.id_cliente_servicio)

#ticket = crud_ticket.obtener_ticket_especifico(2)
#print(ticket.id_ticket, ticket.estado,ticket.updated_at )
ticket =crud_ticket.actualizar_ticket(id_ticket=2, estado="finalizado")
#ticket = crud_ticket.obtener_ticket_especifico(2)
print(ticket.id_ticket, ticket.estado, ticket.updated_at)