"""
Router de documentos — CRUD + análise.
"""
import json
import uuid
import random
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from server.database import get_db
from server.models.document import Document
from server.models.user import User
from server.services.auth_service import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documentos"])


# ─── Schemas ────────────────────────────────────────────────────────
class DocumentCreate(BaseModel):
    name: str
    content: str | None = None
    type_code: str | None = None
    type_name: str | None = None
    category: str | None = None


class DocumentUpdate(BaseModel):
    name: str | None = None
    content: str | None = None
    type_code: str | None = None
    type_name: str | None = None
    category: str | None = None
    status: str | None = None
    score: float | None = None


class DocumentResponse(BaseModel):
    id: str
    user_id: int
    name: str
    content: str | None
    type_code: str | None
    type_name: str | None
    category: str | None
    score: float | None
    status: str
    analysis_json: str | None
    uploaded_at: str | None
    analyzed_at: str | None


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    total: int
    skip: int
    limit: int


class DocumentStats(BaseModel):
    total: int
    by_type: dict
    by_category: dict
    average_score: float | None
    analyzed_count: int


# ─── Endpoints ──────────────────────────────────────────────────────
@router.get("/stats/summary", response_model=DocumentStats)
async def stats_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Estatísticas resumidas dos documentos do usuário."""
    base = select(Document).where(Document.user_id == current_user.id)

    # Total
    total_result = await db.execute(
        select(func.count(Document.id)).where(Document.user_id == current_user.id)
    )
    total = total_result.scalar() or 0

    # By type
    type_result = await db.execute(
        select(Document.type_code, func.count(Document.id))
        .where(Document.user_id == current_user.id)
        .group_by(Document.type_code)
    )
    by_type = {row[0] or "sem_tipo": row[1] for row in type_result.all()}

    # By category
    cat_result = await db.execute(
        select(Document.category, func.count(Document.id))
        .where(Document.user_id == current_user.id)
        .group_by(Document.category)
    )
    by_category = {row[0] or "sem_categoria": row[1] for row in cat_result.all()}

    # Average score
    avg_result = await db.execute(
        select(func.avg(Document.score)).where(
            Document.user_id == current_user.id, Document.score.isnot(None)
        )
    )
    average_score = avg_result.scalar()

    # Analyzed count
    analyzed_result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == current_user.id,
            Document.status == "analyzed",
        )
    )
    analyzed_count = analyzed_result.scalar() or 0

    return DocumentStats(
        total=total,
        by_type=by_type,
        by_category=by_category,
        average_score=round(average_score, 2) if average_score else None,
        analyzed_count=analyzed_count,
    )


@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista documentos do usuário com paginação."""
    total_result = await db.execute(
        select(func.count(Document.id)).where(Document.user_id == current_user.id)
    )
    total = total_result.scalar() or 0

    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .offset(skip)
        .limit(limit)
    )
    docs = result.scalars().all()

    return DocumentListResponse(
        documents=[
            DocumentResponse(**d.to_dict()) for d in docs
        ],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retorna um documento pelo ID."""
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id, Document.user_id == current_user.id
        )
    )
    doc = result.scalars().first()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado",
        )

    return DocumentResponse(**doc.to_dict())


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    body: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo documento."""
    doc = Document(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=body.name,
        content=body.content,
        type_code=body.type_code,
        type_name=body.type_name,
        category=body.category,
    )
    db.add(doc)
    await db.flush()
    await db.refresh(doc)

    return DocumentResponse(**doc.to_dict())


@router.put("/{doc_id}", response_model=DocumentResponse)
async def update_document(
    doc_id: str,
    body: DocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um documento existente."""
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id, Document.user_id == current_user.id
        )
    )
    doc = result.scalars().first()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado",
        )

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doc, field, value)

    await db.flush()
    await db.refresh(doc)

    return DocumentResponse(**doc.to_dict())


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove um documento."""
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id, Document.user_id == current_user.id
        )
    )
    doc = result.scalars().first()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado",
        )

    await db.delete(doc)


@router.post("/{doc_id}/analyze", response_model=DocumentResponse)
async def analyze_document(
    doc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Executa análise do documento (placeholder com score mock)."""
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id, Document.user_id == current_user.id
        )
    )
    doc = result.scalars().first()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado",
        )

    # Mock analysis
    mock_score = round(random.uniform(60.0, 98.0), 1)
    mock_analysis = {
        "score": mock_score,
        "risco": "baixo" if mock_score >= 80 else "médio" if mock_score >= 60 else "alto",
        "conformidade": round(random.uniform(70.0, 100.0), 1),
        "completude": round(random.uniform(65.0, 100.0), 1),
        "sugestoes": [
            "Verificar cláusulas de rescisão",
            "Incluir previsão de multa contratual",
            "Revisar prazos processuais",
        ],
        "analisado_em": datetime.now(timezone.utc).isoformat(),
    }

    doc.score = mock_score
    doc.status = "analyzed"
    doc.analysis_json = json.dumps(mock_analysis, ensure_ascii=False)
    doc.analyzed_at = datetime.now(timezone.utc)

    await db.flush()
    await db.refresh(doc)

    return DocumentResponse(**doc.to_dict())
