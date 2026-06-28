"""
Modelo de Decisão.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from server.database import Base
from server.models.mixins import ToDictMixin


class Decisao(ToDictMixin, Base):
    """Tabela de decisões judiciais vinculadas a magistrados."""

    __tablename__ = "decisoes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    magistrado_id = Column(Integer, ForeignKey("magistrados.id", ondelete="CASCADE"), index=True, nullable=False)
    processo_numero = Column(String(50), index=True, nullable=False)
    tipo = Column(String(100), nullable=False)
    resultado = Column(String(50), nullable=False)
    materia = Column(String(100), index=True, nullable=False)
    area = Column(String(50), nullable=True)
    tribunal = Column(String(20), index=True, nullable=False)
    ementa = Column(Text, nullable=True)
    data_decisao = Column(Date, nullable=False)
    data_publicacao = Column(Date, nullable=True)
    fonte = Column(String(50), nullable=True)
    url = Column(String(500), nullable=True)
    criado_em = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ORM relationships
    magistrado = relationship('Magistrado', back_populates='decisoes')

    def __repr__(self) -> str:
        return f"<Decisao(id={self.id}, processo='{self.processo_numero}', resultado='{self.resultado}')>"
