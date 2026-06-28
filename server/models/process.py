"""
Modelo de Processo.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from server.database import Base


class Process(Base):
    """Tabela de processos judiciais."""

    __tablename__ = "processes"

    id = Column(String(36), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    number = Column(String(50), nullable=False)
    area = Column(String(50), nullable=True)
    court = Column(String(200), nullable=True)
    status = Column(String(50), default="Ativo", nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self) -> str:
        return f"<Process(id='{self.id}', number='{self.number}')>"

    def to_dict(self) -> dict:
        """Converte o modelo para dicionário."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "number": self.number,
            "area": self.area,
            "court": self.court,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
