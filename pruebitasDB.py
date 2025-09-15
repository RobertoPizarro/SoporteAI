from backend.db.crud import crud_cliente_servicio,crud_colaborador,crud_analista,crud_ticket
from sqlalchemy.exc import SQLAlchemyError
from backend.db.models import Ticket, Colaborador
from backend.util.util_conectar_orm import conectarORM
from uuid import UUID
from sqlalchemy import select, func

user = {'email': 'nick.salcedo@unmsm.edu.pe', 'name': 'NICK EMANUEL SALCEDO ALFARO', 'persona_id': '36a06c49-d9c6-f958-5fe1-3cfa73a0905b', 'cliente_id': '3c7fc393-880f-1e80-4c17-538b57570b40', 'colaborador_id': '74feb05e-647f-fd67-ea47-c83a7c8aab7a', 'rol': 'colaborador', 'cliente_nombre': 'UNMSM', 'servicios': [{'id': 'd50bf689-bfca-809b-5a7a-7c7bd8f42d1f', 'nombre': 'DATA SCIENCE'}]}

'70aba8a0-93aa-8801-9762-d2c60fa0ca6b'
'7e23e386-b3cf-109a-4494-5e924c8d45d3'
"""

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


def revisarUsuario(user):
    rol = ""
    try:
        if user["rol"] == "analista":
            rol = "analista_id"
        elif user["rol"] == "colaborador":
            rol = "colaborador_id"
        return rol
    except Exception as e:
        print(f"Error al revisar usuario: {str(e)}")
        raise ValueError(f"Error al revisar usuario: {str(e)}")

def obtener_tickets_abiertos(db, user):
    try:
        rol = revisarUsuario(user)
        user_rol = user[rol]
        print ("User role ID:", user_rol)
    except Exception as e:
        print (f"Error al revisar usuario: {str(e)}")
        raise ValueError(f"Error al revisar usuario: {str(e)}")
    try:
        # Aseguramos que el comparador de UUID use el tipo correcto
        try:
            user_uuid = UUID(str(user_rol)) if user_rol is not None else None
        except Exception:
            user_uuid = user_rol  # como fallback, usar el valor como viene

        # Verificar si existe el colaborador con ese ID
        try:
            col = db.execute(select(Colaborador).where(Colaborador.id == user_uuid)).scalar_one_or_none()
            print("Colaborador existe?:", col is not None)
            if col:
                print("Colaborador:", col)
        except Exception as e:
            print("Error al verificar colaborador:", str(e))

        # Contar tickets totales y mostrar una muestra para comparar IDs
        try:
            total_tickets = db.execute(select(func.count()).select_from(Ticket)).scalar() or 0
            print("Total tickets en BD:", total_tickets)
            muestra = db.execute(select(Ticket).order_by(Ticket.id_ticket.desc()).limit(5)).scalars().all()
            print("Muestra 5 tickets recientes:", [
                {"id": t.id_ticket, "id_colaborador": str(t.id_colaborador), "estado": t.estado}
                for t in muestra
            ])
        except Exception as e:
            print("Error al obtener muestra de tickets:", str(e))

        # Tickets del colaborador (sin filtrar por estado)
        query = select(Ticket).where(Ticket.id_colaborador == user_uuid)
        tickets = db.execute(query).scalars().all()
        print(f"Tickets del colaborador encontrados: {len(tickets)}")
        print ("Tickets details (colaborador):", tickets)
    except Exception as e:
        print (f"Error al obtener tickets abiertos: {str(e)}")
        raise ValueError(f"Error al obtener tickets abiertos: {str(e)}")
    return tickets

with conectarORM() as db:
    tickets = obtener_tickets_abiertos(db, user)
    print(f"Total tickets abiertos: {len(tickets)}")
    for t in tickets:
        print(t.id_ticket, t.asunto, t.estado, t.created_at, t.updated_at)

