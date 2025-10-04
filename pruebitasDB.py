from backend.db.crud import crud_cliente_servicio,crud_colaborador,crud_analista,crud_ticket
from sqlalchemy.exc import SQLAlchemyError
from backend.db.models import Ticket, Colaborador
from backend.util.util_conectar_orm import conectarORM
from uuid import UUID
from sqlalchemy import select, func
from backend.db.crud.crud_escalado import obtener_escalado_por_ticket


user = {'email': 'nick.salcedo@unmsm.edu.pe', 'name': 'NICK EMANUEL SALCEDO ALFARO', 'persona_id': '36a06c49-d9c6-f958-5fe1-3cfa73a0905b', 'cliente_id': '3c7fc393-880f-1e80-4c17-538b57570b40', 'colaborador_id': '69b94e6e-57c4-2f05-b57f-1b55b05249fd', 'rol': 'colaborador', 'cliente_nombre': 'UNMSM', 'servicios': [{'id': 'd50bf689-bfca-809b-5a7a-7c7bd8f42d1f', 'nombre': 'DATA SCIENCE'}]}



"""
ESTOS SON TODOS LOS MODELOS RELACIONADOS A TICKETS MAPEADOS

TicketEstadoEnum = PGEnum(
    "aceptado", "cancelado", "en atención", "finalizado",
    name="ticket_estado",
    create_type=False
)
TicketNivelEnum = PGEnum(
    "bajo", "medio", "alto", "crítico",
    name="ticket_nivel",
    create_type=False
)

TicketTipoEnum = PGEnum(
    "incidencia", "solicitud",
    name="ticket_tipo",
    create_type=False
)

class Ticket(Base, CreateTimestampMixin, UpdateTimestampMixin):
    __tablename__ = "ticket"
    __table_args__ = (
        Index("idx_ticket_estado", "estado"),
        Index("idx_ticket_nivel", "nivel"),
        Index("idx_ticket_created_at", "created_at"),
        Index("idx_ticket_updated_at", "updated_at"),
    )
    id_ticket: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, autoincrement=True
    )
    id_colaborador: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("colaborador.id_colaborador", ondelete="RESTRICT"), nullable=False
    )
    id_cliente_servicio: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cliente_servicio.id_cliente_servicio", ondelete="RESTRICT"), nullable=False
    )
    id_analista: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("analista.id_analista", ondelete="SET NULL")
    )
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    asunto: Mapped[str] = mapped_column(Text, nullable=False)
    nivel: Mapped[str] = mapped_column(TicketNivelEnum, nullable=False)
    estado: Mapped[str] = mapped_column(TicketEstadoEnum, nullable=False, server_default="'aceptado'")
    diagnostico: Mapped[Optional[str]] = mapped_column(Text)
    colaborador: Mapped["Colaborador"] = relationship(back_populates="tickets")
    cliente_servicio: Mapped["ClienteServicio"] = relationship(back_populates="tickets")
    analista: Mapped[Optional["Analista"]] = relationship(back_populates="tickets")
    conversaciones: Mapped[List["Conversacion"]] = relationship(
        back_populates="ticket", cascade="all, delete-orphan"
    )
    escalados: Mapped[List["Escalado"]] = relationship(
        back_populates="ticket", cascade="all, delete-orphan"
    )
    tipo: Mapped[str] = mapped_column(TicketTipoEnum, nullable=False)
    def __repr__(self) -> str:
        return f"<Ticket id={self.id_ticket} estado={self.estado} nivel={self.nivel}>"

"""

"""
def revisarUsuario(user):
    rol = ""
    try:
        if user["rol"] == "analista":
            rol = "analista_id"
        elif user["rol"] == "colaborador":
            rol = "colaborador_id"
        return user[rol]
    except Exception as e:
        raise ValueError(f"Error al revisar usuario: {str(e)}")

from backend.db.crud.crud_ticket import obtener_tickets

with conectarORM() as db:
    tickets = obtener_tickets(db, user)
    for ticket in tickets:
        print("Ticket encontrado:")
        print(ticket.id_ticket, ticket.asunto, ticket.estado, ticket.created_at, ticket.updated_at)
    else:
        if not tickets:
            print("Ticket no encontrado.")
"""
#with conectarORM() as db :
#    crud_ticket.escalar_ticket(db, 20, "f36c6de9-5abd-7258-bf3f-19533740fd1b", "jajaja", "jajajaja")

with conectarORM() as db :
    escalado = obtener_escalado_por_ticket(db, 132)
    print (escalado)