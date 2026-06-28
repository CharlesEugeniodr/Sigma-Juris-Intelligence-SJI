"""
Modelo de Usuário.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, CheckConstraint
from sqlalchemy.orm import relationship

from server.database import Base
from server.models.mixins import ToDictMixin


class User(ToDictMixin, Base):
    """Tabela de usuários do sistema."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(50), default="analyst", nullable=False)
    avatar = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'analyst', 'viewer')", name="ck_user_role"),
    )

    # ORM relationships
    documents = relationship('Document', back_populates='user', cascade='all, delete-orphan')
    processes = relationship('Process', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
