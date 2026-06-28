"""
Sigma—Juris Intelligence API
Ponto de entrada da aplicação FastAPI.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from server.config import settings
from server.database import init_db, async_session
from server.api.auth import router as auth_router, seed_default_users
from server.api.documents import router as documents_router
from server.api.processes import router as processes_router
from server.api.mij import router as mij_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação."""
    # Startup
    await init_db()

    async with async_session() as db:
        await seed_default_users(db)

    print("[OK] Banco de dados inicializado")
    print("[OK] Usuarios padrao verificados")
    print("[OK] Sigma-Juris Intelligence API pronta!")

    yield

    # Shutdown
    print("[STOP] Encerrando Sigma-Juris Intelligence API...")


app = FastAPI(
    title="Sigma—Juris Intelligence API",
    version="3.1.0",
    description="API do Motor de Inteligência Judicial (MIJ) — "
    "Plataforma de inteligência jurídica para análise de documentos, "
    "processos e magistrados.",
    lifespan=lifespan,
)

# ─── CORS ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(processes_router)
app.include_router(mij_router)

# ─── Static Files (Frontend) ───────────────────────────────────────
app_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app")
if os.path.isdir(app_dir):
    app.mount("/app", StaticFiles(directory=app_dir, html=True), name="frontend")


# ─── Root ───────────────────────────────────────────────────────────
@app.get("/", tags=["Status"])
async def root():
    """Informações da API."""
    return {
        "nome": "Sigma—Juris Intelligence API",
        "versão": "3.1.0",
        "descrição": "Motor de Inteligência Judicial (MIJ)",
        "status": "operacional",
        "endpoints": {
            "autenticação": "/api/auth",
            "documentos": "/api/documents",
            "processos": "/api/processes",
            "mij": "/api/mij",
            "docs": "/docs",
            "redoc": "/redoc",
        },
    }


@app.get("/health", tags=["Status"])
async def health_check():
    """Verificação de saúde da API."""
    return {"status": "healthy", "service": "sjif-api"}
