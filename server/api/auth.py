"""
Router de autenticação — login, registro e perfil.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.database import get_db
from server.models.user import User
from server.security.rate_limit import login_limiter
from server.security.token_blacklist import token_blacklist
from server.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    verify_token,
    oauth2_scheme,
)

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


# ─── Schemas ────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "analyst"
    avatar: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str | None
    is_active: bool
    created_at: str | None


# ─── Endpoints ──────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Autentica o usuário e retorna token JWT."""
    login_limiter.check(request)

    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalars().first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário desativado",
        )

    login_limiter.reset(request)
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return TokenResponse(access_token=token, user=user.to_dict())


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Registra novo usuário no sistema."""
    result = await db.execute(select(User).where(User.email == body.email))
    existing = result.scalars().first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado",
        )

    if body.role not in ('analyst', 'viewer'):
        raise HTTPException(status_code=403, detail='Cannot self-register as admin')

    if len(body.password) < 8:
        raise HTTPException(status_code=422, detail='Senha deve ter pelo menos 8 caracteres')

    avatar = body.avatar
    if not avatar:
        parts = body.name.strip().split()
        avatar = (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper()

    user = User(
        name=body.name,
        email=body.email,
        password_hash=get_password_hash(body.password),
        role=body.role,
        avatar=avatar,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        is_active=user.is_active,
        created_at=user.created_at.isoformat() if user.created_at else None,
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Retorna perfil do usuário autenticado."""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        avatar=current_user.avatar,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
    )


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """Revoga o token atual (logout)."""
    payload = verify_token(token)
    exp = payload.get("exp", 0)
    token_blacklist.add(token, exp)
    return {"message": "Logout realizado com sucesso"}


@router.delete("/me", summary="Direito ao esquecimento (LGPD)")
async def delete_my_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # This deletes the user. Due to CASCADE in the DB schema, their documents/processes should be deleted.
    await db.delete(current_user)
    return {"message": "Sua conta e todos os seus dados foram apagados permanentemente."}


# ─── Seed ───────────────────────────────────────────────────────────
async def seed_default_users(db: AsyncSession) -> None:
    """Cria usuários padrão caso não existam."""
    defaults = [
        {
            "name": "Charles Eugênio",
            "email": "admin@sigma.juris",
            "password": "Sigma2026!",
            "role": "admin",
            "avatar": "CE",
        },
        {
            "name": "Ana Silva",
            "email": "analista@sigma.juris",
            "password": "Analista2026!",
            "role": "analyst",
            "avatar": "AS",
        },
    ]

    for data in defaults:
        result = await db.execute(select(User).where(User.email == data["email"]))
        if result.scalars().first() is None:
            user = User(
                name=data["name"],
                email=data["email"],
                password_hash=get_password_hash(data["password"]),
                role=data["role"],
                avatar=data["avatar"],
            )
            db.add(user)

    await db.commit()
