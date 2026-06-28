"""
Configurações do servidor SJIF.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configurações da aplicação Sigma-Juris Intelligence."""

    DATABASE_URL: str = "sqlite+aiosqlite:///./sjif.db"
    # MUST be overridden via SJIF_SECRET_KEY env var in production
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION-use-env-SJIF_SECRET_KEY"
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
        "http://localhost:5000",
        "http://127.0.0.1:5000",
    ]

    class Config:
        env_prefix = "SJIF_"


settings = Settings()
