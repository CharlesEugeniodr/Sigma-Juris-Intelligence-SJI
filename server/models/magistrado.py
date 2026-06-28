"""
Modelo de Magistrado.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship

from server.database import Base
from server.models.mixins import ToDictMixin


class Magistrado(ToDictMixin, Base):
    """Tabela de magistrados do sistema MIJ."""

    __tablename__ = "magistrados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(300), index=True, nullable=False)
    tribunal = Column(String(20), index=True, nullable=False)
    vara = Column(String(300), nullable=True)
    comarca = Column(String(200), nullable=True)
    total_decisoes = Column(Integer, default=0, nullable=False)
    taxa_procedencia = Column(Float, nullable=True)
    taxa_reforma = Column(Float, nullable=True)
    tempo_medio_dias = Column(Float, nullable=True)
    metricas_json = Column(Text, nullable=True)
    atualizado_em = Column(DateTime, nullable=True)
    criado_em = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("nome", "tribunal", "vara", name="uq_magistrado_nome_tribunal_vara"),
    )

    # ORM relationships
    decisoes = relationship('Decisao', back_populates='magistrado', cascade='all, delete-orphan')

    def __repr__(self) -> str:
        return f"<Magistrado(id={self.id}, nome='{self.nome}', tribunal='{self.tribunal}')>"
