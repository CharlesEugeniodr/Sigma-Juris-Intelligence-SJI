"""
Router de processos — CRUD.
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.database import get_db
from server.models.process import Process
from server.models.user import User
from server.services.auth_service import get_current_user

router = APIRouter(prefix="/api/processes", tags=["Processos"])


# ─── Schemas ────────────────────────────────────────────────────────
class ProcessCreate(BaseModel):
    number: str
    area: str | None = None
    court: str | None = None
    status: str = "Ativo"


class ProcessUpdate(BaseModel):
    number: str | None = None
    area: str | None = None
    court: str | None = None
    status: str | None = None


class ProcessResponse(BaseModel):
    id: str
    user_id: int
    number: str
    area: str | None
    court: str | None
    status: str
    created_at: str | None


class ProcessListResponse(BaseModel):
    processes: list[ProcessResponse]
    total: int


# ─── Endpoints ──────────────────────────────────────────────────────
@router.get("/", response_model=ProcessListResponse)
async def list_processes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todos os processos do usuário."""
    result = await db.execute(
        select(Process)
        .where(Process.user_id == current_user.id)
        .order_by(Process.created_at.desc())
    )
    procs = result.scalars().all()

    return ProcessListResponse(
        processes=[ProcessResponse(**p.to_dict()) for p in procs],
        total=len(procs),
    )


@router.get("/{proc_id}", response_model=ProcessResponse)
async def get_process(
    proc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retorna um processo pelo ID."""
    result = await db.execute(
        select(Process).where(
            Process.id == proc_id, Process.user_id == current_user.id
        )
    )
    proc = result.scalars().first()

    if not proc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado",
        )

    return ProcessResponse(**proc.to_dict())


@router.post("/", response_model=ProcessResponse, status_code=status.HTTP_201_CREATED)
async def create_process(
    body: ProcessCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo processo."""
    proc = Process(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        number=body.number,
        area=body.area,
        court=body.court,
        status=body.status,
    )
    db.add(proc)
    await db.flush()
    await db.refresh(proc)

    return ProcessResponse(**proc.to_dict())


@router.put("/{proc_id}", response_model=ProcessResponse)
async def update_process(
    proc_id: str,
    body: ProcessUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um processo existente."""
    result = await db.execute(
        select(Process).where(
            Process.id == proc_id, Process.user_id == current_user.id
        )
    )
    proc = result.scalars().first()

    if not proc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado",
        )

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(proc, field, value)

    await db.flush()
    await db.refresh(proc)

    return ProcessResponse(**proc.to_dict())


@router.delete("/{proc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_process(
    proc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove um processo."""
    result = await db.execute(
        select(Process).where(
            Process.id == proc_id, Process.user_id == current_user.id
        )
    )
    proc = result.scalars().first()

    if not proc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado",
        )

    await db.delete(proc)
