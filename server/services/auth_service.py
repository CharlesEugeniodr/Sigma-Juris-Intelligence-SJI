"""
Serviço de autenticação — hashing, JWT, e dependências de segurança.
"""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.config import settings
from server.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

_HASH_SALT = "sjif-sigma-2026-salt"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto corresponde ao hash."""
    return get_password_hash(plain_password) == hashed_password


def get_password_hash(password: str) -> str:
    """Gera hash SHA256 da senha com salt."""
    salted = f"{_HASH_SALT}:{password}"
    return hashlib.sha256(salted.encode()).hexdigest()


def create_access_token(
    data: dict, expires_delta: Optional[timedelta] = None
) -> str:
    """Cria token JWT com os dados fornecidos."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict:
    """Decodifica e valida o token JWT. Retorna o payload."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Dependência FastAPI que retorna o usuário autenticado."""
    from server.models.user import User

    payload = verify_token(token)
    user_email: Optional[str] = payload.get("sub")
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido — campo 'sub' ausente",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(User).where(User.email == user_email))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário desativado",
        )

    return user
