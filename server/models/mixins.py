"""
Mixins reutilizáveis para modelos SQLAlchemy.
"""
from datetime import date, datetime


class ToDictMixin:
    """Converte automaticamente qualquer modelo para dicionário,
    serializando campos date/datetime para ISO-8601."""

    def to_dict(self) -> dict:
        return {
            c.name: (
                getattr(self, c.name).isoformat()
                if isinstance(getattr(self, c.name), (datetime, date))
                else getattr(self, c.name)
            )
            for c in self.__table__.columns
        }
