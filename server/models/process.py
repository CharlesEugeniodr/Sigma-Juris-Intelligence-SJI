"""
Modelo de Processo.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from server.database import Base
from server.models.mixins import ToDictMixin


class Process(ToDictMixin, Base):
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

    # ORM relationships
    user = relationship('User', back_populates='processes')

    def __repr__(self) -> str:
        return f"<Process(id='{self.id}', number='{self.number}')>"
