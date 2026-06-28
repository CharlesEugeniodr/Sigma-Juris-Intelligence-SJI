"""
Modelo de Decisão.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey

from server.database import Base


class Decisao(Base):
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

    def __repr__(self) -> str:
        return f"<Decisao(id={self.id}, processo='{self.processo_numero}', resultado='{self.resultado}')>"

    def to_dict(self) -> dict:
        """Converte o modelo para dicionário."""
        return {
            "id": self.id,
            "magistrado_id": self.magistrado_id,
            "processo_numero": self.processo_numero,
            "tipo": self.tipo,
            "resultado": self.resultado,
            "materia": self.materia,
            "area": self.area,
            "tribunal": self.tribunal,
            "ementa": self.ementa,
            "data_decisao": self.data_decisao.isoformat() if self.data_decisao else None,
            "data_publicacao": self.data_publicacao.isoformat() if self.data_publicacao else None,
            "fonte": self.fonte,
            "url": self.url,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }
