"""
Sigma—Juris Intelligence API
Ponto de entrada da aplicação FastAPI.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from server.config import settings
from server.database import init_db, async_session
from server.api.auth import router as auth_router, seed_default_users
from server.api.documents import router as documents_router
from server.api.processes import router as processes_router
from server.api.mij import router as mij_router
from server.mij.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação."""
    # Startup
    await init_db()
    scheduler.start()

    async with async_session() as db:
        await seed_default_users(db)

    print("[OK] Banco de dados inicializado")
    print("[OK] Usuarios padrao verificados")
    print("[OK] Scheduler iniciado")
    print("[OK] Sigma-Juris Intelligence API pronta!")

    yield

    # Shutdown
    print("[STOP] Encerrando Sigma-Juris Intelligence API...")
    scheduler.shutdown()


app = FastAPI(
    title="Sigma Juris Intelligence Framework API",
    description="API do Motor de Inteligência Judicial (MIJ) e Sistema de Análise Documental. Documentação completa dos endpoints para integração.",
    version="3.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Autenticação", "description": "Login, registro, logout e gestão de conta"},
        {"name": "Documentos", "description": "Upload, análise e gestão de documentos jurídicos"},
        {"name": "Processos", "description": "CRUD de processos judiciais"},
        {"name": "MIJ", "description": "Motor de Inteligência Judicial — julgadores, simulador, scrapers"},
    ],
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


# ─── Security Headers ──────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response


app.add_middleware(SecurityHeadersMiddleware)

# ─── Routers ────────────────────────────────────────────────────────
app.include_router(auth_router, tags=["Autenticação"])
app.include_router(documents_router, tags=["Documentos"])
app.include_router(processes_router, tags=["Processos"])
app.include_router(mij_router, tags=["MIJ"])

# ─── Static Files (Frontend) ───────────────────────────────────────
app_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app")
if os.path.isdir(app_dir):
    app.mount("/app", StaticFiles(directory=app_dir, html=True), name="frontend")


# ─── Root ───────────────────────────────────────────────────────────
@app.get("/", tags=["Status"])
async def root():
    """Informações da API."""
    return {
        "nome": "Sigma Juris Intelligence Framework API",
        "versão": "3.3.0",
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
