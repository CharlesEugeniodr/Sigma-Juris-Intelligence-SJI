"""
Modelo de Magistrado.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, UniqueConstraint

from server.database import Base


class Magistrado(Base):
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

    def __repr__(self) -> str:
        return f"<Magistrado(id={self.id}, nome='{self.nome}', tribunal='{self.tribunal}')>"

    def to_dict(self) -> dict:
        """Converte o modelo para dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "tribunal": self.tribunal,
            "vara": self.vara,
            "comarca": self.comarca,
            "total_decisoes": self.total_decisoes,
            "taxa_procedencia": self.taxa_procedencia,
            "taxa_reforma": self.taxa_reforma,
            "tempo_medio_dias": self.tempo_medio_dias,
            "metricas_json": self.metricas_json,
            "atualizado_em": self.atualizado_em.isoformat() if self.atualizado_em else None,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }
