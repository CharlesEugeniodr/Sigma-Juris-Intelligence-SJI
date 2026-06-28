"""
Modelo de Documento.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from server.database import Base
from server.models.mixins import ToDictMixin


class Document(ToDictMixin, Base):
    """Tabela de documentos jurídicos."""

    __tablename__ = "documents"

    id = Column(String(36), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    type_code = Column(String(20), nullable=True)
    type_name = Column(String(200), nullable=True)
    category = Column(String(50), nullable=True)
    score = Column(Float, nullable=True)
    status = Column(String(50), default="uploaded", nullable=False)
    analysis_json = Column(Text, nullable=True)
    uploaded_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    analyzed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("status IN ('pending', 'analyzed', 'error')", name="ck_document_status"),
    )

    # ORM relationships
    user = relationship('User', back_populates='documents')

    def __repr__(self) -> str:
        return f"<Document(id='{self.id}', name='{self.name}')>"
