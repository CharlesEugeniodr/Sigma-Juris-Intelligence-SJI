"""
Modelos SQLAlchemy do SJIF.
"""
from server.models.user import User
from server.models.document import Document
from server.models.process import Process
from server.models.magistrado import Magistrado
from server.models.decisao import Decisao

__all__ = ["User", "Document", "Process", "Magistrado", "Decisao"]
