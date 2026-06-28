"""Initial schema — all 5 tables

Revision ID: 001_initial_schema
Revises: None
Create Date: 2026-06-28

Creates tables: users, documents, processes, magistrados, decisoes
matching the SQLAlchemy models in server/models/.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("email", sa.String(length=200), nullable=False),
        sa.Column("password_hash", sa.String(length=500), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="analyst"),
        sa.Column("avatar", sa.String(length=10), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.CheckConstraint("role IN ('admin', 'analyst', 'viewer')", name="ck_user_role"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    # --- documents ---
    op.create_table(
        "documents",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=500), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("type_code", sa.String(length=20), nullable=True),
        sa.Column("type_name", sa.String(length=200), nullable=True),
        sa.Column("category", sa.String(length=50), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="uploaded"),
        sa.Column("analysis_json", sa.Text(), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
        sa.Column("analyzed_at", sa.DateTime(), nullable=True),
        sa.CheckConstraint("status IN ('pending', 'analyzed', 'error')", name="ck_document_status"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- processes ---
    op.create_table(
        "processes",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("number", sa.String(length=50), nullable=False),
        sa.Column("area", sa.String(length=50), nullable=True),
        sa.Column("court", sa.String(length=200), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="Ativo"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- magistrados ---
    op.create_table(
        "magistrados",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.String(length=300), nullable=False),
        sa.Column("tribunal", sa.String(length=20), nullable=False),
        sa.Column("vara", sa.String(length=300), nullable=True),
        sa.Column("comarca", sa.String(length=200), nullable=True),
        sa.Column("total_decisoes", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("taxa_procedencia", sa.Float(), nullable=True),
        sa.Column("taxa_reforma", sa.Float(), nullable=True),
        sa.Column("tempo_medio_dias", sa.Float(), nullable=True),
        sa.Column("metricas_json", sa.Text(), nullable=True),
        sa.Column("atualizado_em", sa.DateTime(), nullable=True),
        sa.Column("criado_em", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nome", "tribunal", "vara", name="uq_magistrado_nome_tribunal_vara"),
    )
    op.create_index(op.f("ix_magistrados_nome"), "magistrados", ["nome"])
    op.create_index(op.f("ix_magistrados_tribunal"), "magistrados", ["tribunal"])

    # --- decisoes ---
    op.create_table(
        "decisoes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("magistrado_id", sa.Integer(), nullable=False),
        sa.Column("processo_numero", sa.String(length=50), nullable=False),
        sa.Column("tipo", sa.String(length=100), nullable=False),
        sa.Column("resultado", sa.String(length=50), nullable=False),
        sa.Column("materia", sa.String(length=100), nullable=False),
        sa.Column("area", sa.String(length=50), nullable=True),
        sa.Column("tribunal", sa.String(length=20), nullable=False),
        sa.Column("ementa", sa.Text(), nullable=True),
        sa.Column("data_decisao", sa.Date(), nullable=False),
        sa.Column("data_publicacao", sa.Date(), nullable=True),
        sa.Column("fonte", sa.String(length=50), nullable=True),
        sa.Column("url", sa.String(length=500), nullable=True),
        sa.Column("criado_em", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["magistrado_id"], ["magistrados.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_decisoes_magistrado_id"), "decisoes", ["magistrado_id"])
    op.create_index(op.f("ix_decisoes_processo_numero"), "decisoes", ["processo_numero"])
    op.create_index(op.f("ix_decisoes_materia"), "decisoes", ["materia"])
    op.create_index(op.f("ix_decisoes_tribunal"), "decisoes", ["tribunal"])


def downgrade() -> None:
    op.drop_table("decisoes")
    op.drop_table("magistrados")
    op.drop_table("processes")
    op.drop_table("documents")
    op.drop_table("users")
