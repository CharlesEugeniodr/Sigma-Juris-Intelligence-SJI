"""
Configurações do servidor SJIF.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configurações da aplicação Sigma-Juris Intelligence."""

    DATABASE_URL: str = "sqlite+aiosqlite:///./sjif.db"
    SECRET_KEY: str = "sjif-sigma-juris-2026-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    CORS_ORIGINS: List[str] = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "http://localhost:9000",
        "http://127.0.0.1:9000",
        "http://localhost:3000",
        "*",
    ]

    class Config:
        env_prefix = "SJIF_"


settings = Settings()
