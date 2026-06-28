"""
Modelo de Documento.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey

from server.database import Base


class Document(Base):
    """Tabela de documentos jurídicos."""

    __tablename__ = "documents"

    id = Column(String(36), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
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

    def __repr__(self) -> str:
        return f"<Document(id='{self.id}', name='{self.name}')>"

    def to_dict(self) -> dict:
        """Converte o modelo para dicionário."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "content": self.content,
            "type_code": self.type_code,
            "type_name": self.type_name,
            "category": self.category,
            "score": self.score,
            "status": self.status,
            "analysis_json": self.analysis_json,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
            "analyzed_at": self.analyzed_at.isoformat() if self.analyzed_at else None,
        }
