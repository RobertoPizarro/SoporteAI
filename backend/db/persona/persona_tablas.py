# models.py
from __future__ import annotations
import uuid
from typing import Optional, List

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, UniqueConstraint, Index, Integer, text
from sqlalchemy.dialects.postgresql import UUID


# ---------------------------
# Base declarativa
# ---------------------------
class Base(DeclarativeBase):
    pass


# ---------------------------
# Entidades principales
# ---------------------------

class Persona(Base):
    __tablename__ = "persona"

    id_persona: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),   # generado en Postgres
    )

    # Relaciones (opcionales pero útiles)
    externals: Mapped[List[External]] = relationship(back_populates="persona", cascade="all, delete-orphan")
    colaboradores: Mapped[List[Colaborador]] = relationship(back_populates="persona", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Persona id={self.id_persona}>"


class Cliente(Base):
    __tablename__ = "cliente"

    id_cliente: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),
    )
    nombre: Mapped[str] = mapped_column(Text, nullable=False)

    dominios: Mapped[List[ClienteDominio]] = relationship(back_populates="cliente", cascade="all, delete-orphan")
    colaboradores: Mapped[List[Colaborador]] = relationship(back_populates="cliente", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Cliente id={self.id_cliente} nombre={self.nombre!r}>"


class Servicio(Base):
    __tablename__ = "servicio"

    id_servicio: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),
    )
    nombre: Mapped[str] = mapped_column(Text, nullable=False)

    def __repr__(self) -> str:
        return f"<Servicio id={self.id_servicio} nombre={self.nombre!r}>"


# ---------------------------
# Soporte de identidades externas
# ---------------------------

class External(Base):
    __tablename__ = "external"
    __table_args__ = (
        UniqueConstraint("provider", "id_provider", name="uq_external_provider"),
        Index("idx_external_correo", "correo"),
        Index("idx_external_provider", "provider", "id_provider"),
    )

    id_external: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),
    )
    id_persona: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("persona.id_persona", ondelete="RESTRICT"),
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(Text, nullable=False)      # ej: "google"
    id_provider: Mapped[str] = mapped_column(Text, nullable=False)    # el "sub" del id_token
    correo: Mapped[Optional[str]] = mapped_column(Text)
    nombre: Mapped[Optional[str]] = mapped_column(Text)
    hd: Mapped[Optional[str]] = mapped_column(Text)                   # dominio org (si viene)
    created_at: Mapped[Optional[str]] = mapped_column(                # si prefieres timestamptz, añade Column(TIMESTAMP(timezone=True), server_default=func.now())
        Text, nullable=True
    )

    persona: Mapped[Persona] = relationship(back_populates="externals")

    def __repr__(self) -> str:
        return f"<External provider={self.provider!r} id_provider={self.id_provider!r} persona={self.id_persona}>"


# ---------------------------
# Vínculos persona/cliente
# ---------------------------

class Colaborador(Base):
    __tablename__ = "colaborador"
    __table_args__ = (
        Index("idx_colaborador_cliente", "id_cliente"),
        Index("idx_colaborador_persona", "id_persona"),
    )

    id_colaborador: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),
    )
    id_persona: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("persona.id_persona", ondelete="RESTRICT"),
        nullable=False,
    )
    id_cliente: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cliente.id_cliente", ondelete="RESTRICT"),
        nullable=False,
    )

    persona: Mapped[Persona] = relationship(back_populates="colaboradores")
    cliente: Mapped[Cliente] = relationship(back_populates="colaboradores")

    def __repr__(self) -> str:
        return f"<Colaborador id={self.id_colaborador} persona={self.id_persona} cliente={self.id_cliente}>"


class Analista(Base):
    __tablename__ = "analista"

    id_analista: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_uuid()"),
    )
    id_persona: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("persona.id_persona", ondelete="RESTRICT"),
        nullable=False,
    )
    nivel: Mapped[int] = mapped_column(Integer, nullable=False)

    persona: Mapped[Persona] = relationship()

    def __repr__(self) -> str:
        return f"<Analista id={self.id_analista} persona={self.id_persona} nivel={self.nivel}>"


class ClienteDominio(Base):
    __tablename__ = "cliente_dominio"
    __table_args__ = (
        Index("idx_cliente_dominio_cliente", "id_cliente"),
    )

    dominio: Mapped[str] = mapped_column(Text, primary_key=True)  # p.ej. "unmsm.edu.pe"
    id_cliente: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cliente.id_cliente", ondelete="RESTRICT"),
        nullable=False,
    )

    cliente: Mapped[Cliente] = relationship(back_populates="dominios")

    def __repr__(self) -> str:
        return f"<ClienteDominio dominio={self.dominio!r} id_cliente={self.id_cliente}>"
