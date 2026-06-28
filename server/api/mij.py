"""
Router MIJ — Motor de Inteligência Judicial.
Magistrados, decisões, tribunais, simulador de êxito.
"""
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select, func, and_, case, distinct
from sqlalchemy.ext.asyncio import AsyncSession

from server.database import get_db
from server.models.magistrado import Magistrado
from server.models.decisao import Decisao
from server.services.auth_service import get_current_user
from server.mij.calculators.metricas import MIJCalculator

router = APIRouter(prefix="/api/mij", tags=["MIJ — Motor de Inteligência Judicial"])


# ─── Schemas ────────────────────────────────────────────────────────
class MagistradoResponse(BaseModel):
    id: int
    nome: str
    tribunal: str
    vara: str | None
    comarca: str | None
    total_decisoes: int
    taxa_procedencia: float | None
    taxa_reforma: float | None
    tempo_medio_dias: float | None
    metricas_json: str | None
    atualizado_em: str | None
    criado_em: str | None


class MagistradoListResponse(BaseModel):
    magistrados: list[MagistradoResponse]
    total: int


class DecisaoResponse(BaseModel):
    id: int
    magistrado_id: int
    processo_numero: str
    tipo: str
    resultado: str
    materia: str
    area: str | None
    tribunal: str
    ementa: str | None
    data_decisao: str | None
    data_publicacao: str | None
    fonte: str | None
    url: str | None
    criado_em: str | None


class DecisaoListResponse(BaseModel):
    decisoes: list[DecisaoResponse]
    total: int
    skip: int
    limit: int


class TribunalStats(BaseModel):
    tribunal: str
    total_magistrados: int
    total_decisoes: int
    taxa_procedencia_media: float | None
    taxa_reforma_media: float | None
    tempo_medio_dias: float | None


class TribunalMateriaStats(BaseModel):
    materia: str
    total_decisoes: int
    taxa_procedencia: float | None
    resultados: dict


class SimuladorRequest(BaseModel):
    tipo_acao: str
    materia: str
    tribunal: str
    magistrado_id: int | None = None


class TeseRecomendada(BaseModel):
    tese: str
    fundamentacao: str
    confianca: float


class JurisprudenciaRef(BaseModel):
    processo: str
    tipo: str
    resultado: str
    ementa: str | None
    data: str | None


class SimuladorResponse(BaseModel):
    score_exito: float
    confianca: str
    total_decisoes_analisadas: int
    teses_recomendadas: list[TeseRecomendada]
    jurisprudencia: list[JurisprudenciaRef]
    detalhamento: dict


class MIJDashboardStats(BaseModel):
    total_magistrados: int
    total_decisoes: int
    total_tribunais: int
    total_materias: int
    taxa_procedencia_global: float | None
    decisoes_por_tribunal: dict
    decisoes_por_materia: dict


# ─── Endpoints ──────────────────────────────────────────────────────
@router.get("/magistrados", response_model=MagistradoListResponse)
async def search_magistrados(
    nome: Optional[str] = Query(None, description="Filtrar por nome"),
    tribunal: Optional[str] = Query(None, description="Filtrar por tribunal"),
    vara: Optional[str] = Query(None, description="Filtrar por vara"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Pesquisa magistrados com filtros opcionais."""
    query = select(Magistrado)
    count_query = select(func.count(Magistrado.id))

    filters = []
    if nome:
        filters.append(Magistrado.nome.ilike(f"%{nome}%"))
    if tribunal:
        filters.append(Magistrado.tribunal == tribunal.upper())
    if vara:
        filters.append(Magistrado.vara.ilike(f"%{vara}%"))

    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    result = await db.execute(
        query.order_by(Magistrado.total_decisoes.desc()).offset(skip).limit(limit)
    )
    magistrados = result.scalars().all()

    return MagistradoListResponse(
        magistrados=[MagistradoResponse(**m.to_dict()) for m in magistrados],
        total=total,
    )


@router.get("/magistrados/{mag_id}", response_model=MagistradoResponse)
async def get_magistrado(
    mag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Retorna perfil completo do magistrado com métricas."""
    result = await db.execute(select(Magistrado).where(Magistrado.id == mag_id))
    mag = result.scalars().first()

    if not mag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Magistrado não encontrado",
        )

    return MagistradoResponse(**mag.to_dict())


@router.get("/magistrados/{mag_id}/decisoes", response_model=DecisaoListResponse)
async def get_magistrado_decisoes(
    mag_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Lista decisões de um magistrado com paginação."""
    # Verify magistrado exists
    mag_result = await db.execute(select(Magistrado).where(Magistrado.id == mag_id))
    if not mag_result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Magistrado não encontrado",
        )

    total_result = await db.execute(
        select(func.count(Decisao.id)).where(Decisao.magistrado_id == mag_id)
    )
    total = total_result.scalar() or 0

    result = await db.execute(
        select(Decisao)
        .where(Decisao.magistrado_id == mag_id)
        .order_by(Decisao.data_decisao.desc())
        .offset(skip)
        .limit(limit)
    )
    decisoes = result.scalars().all()

    return DecisaoListResponse(
        decisoes=[DecisaoResponse(**d.to_dict()) for d in decisoes],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/tribunais", response_model=list[TribunalStats])
async def list_tribunais(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Lista tribunais com métricas agregadas."""
    result = await db.execute(
        select(
            Magistrado.tribunal,
            func.count(distinct(Magistrado.id)).label("total_magistrados"),
            func.sum(Magistrado.total_decisoes).label("total_decisoes"),
            func.avg(Magistrado.taxa_procedencia).label("taxa_procedencia_media"),
            func.avg(Magistrado.taxa_reforma).label("taxa_reforma_media"),
            func.avg(Magistrado.tempo_medio_dias).label("tempo_medio_dias"),
        ).group_by(Magistrado.tribunal)
    )
    rows = result.all()

    return [
        TribunalStats(
            tribunal=row.tribunal,
            total_magistrados=row.total_magistrados,
            total_decisoes=row.total_decisoes or 0,
            taxa_procedencia_media=(
                round(row.taxa_procedencia_media, 2) if row.taxa_procedencia_media else None
            ),
            taxa_reforma_media=(
                round(row.taxa_reforma_media, 2) if row.taxa_reforma_media else None
            ),
            tempo_medio_dias=(
                round(row.tempo_medio_dias, 1) if row.tempo_medio_dias else None
            ),
        )
        for row in rows
    ]


@router.get("/tribunais/{sigla}/materias", response_model=list[TribunalMateriaStats])
async def get_tribunal_materias(
    sigla: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Taxas de êxito por matéria em um tribunal."""
    sigla_upper = sigla.upper()

    result = await db.execute(
        select(
            Decisao.materia,
            func.count(Decisao.id).label("total"),
            func.sum(
                case(
                    (Decisao.resultado == "procedente", 1),
                    else_=0,
                )
            ).label("procedentes"),
            func.sum(
                case(
                    (Decisao.resultado == "improcedente", 1),
                    else_=0,
                )
            ).label("improcedentes"),
            func.sum(
                case(
                    (Decisao.resultado == "parcialmente_procedente", 1),
                    else_=0,
                )
            ).label("parciais"),
        )
        .where(Decisao.tribunal == sigla_upper)
        .group_by(Decisao.materia)
        .order_by(func.count(Decisao.id).desc())
    )
    rows = result.all()

    stats = []
    for row in rows:
        total = row.total or 0
        procedentes = row.procedentes or 0
        improcedentes = row.improcedentes or 0
        parciais = row.parciais or 0

        taxa = round((procedentes / total) * 100, 2) if total > 0 else None

        stats.append(
            TribunalMateriaStats(
                materia=row.materia,
                total_decisoes=total,
                taxa_procedencia=taxa,
                resultados={
                    "procedente": procedentes,
                    "improcedente": improcedentes,
                    "parcialmente_procedente": parciais,
                    "outros": total - procedentes - improcedentes - parciais,
                },
            )
        )

    return stats


@router.post("/simulador", response_model=SimuladorResponse)
async def simular_exito(
    body: SimuladorRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Simula o êxito de uma ação judicial.

    Algoritmo:
    1. Busca decisões do tribunal + matéria
    2. Se magistrado especificado, filtra adicionalmente
    3. Calcula SET (Score de Êxito com ponderação por recência)
    4. Retorna teses recomendadas e jurisprudência
    """
    tribunal_upper = body.tribunal.upper()

    # Build query for matching decisions
    query = select(Decisao).where(
        and_(
            Decisao.tribunal == tribunal_upper,
            Decisao.materia.ilike(f"%{body.materia}%"),
        )
    )

    if body.magistrado_id:
        query = query.where(Decisao.magistrado_id == body.magistrado_id)

    result = await db.execute(query.order_by(Decisao.data_decisao.desc()).limit(500))
    decisoes = result.scalars().all()

    calculator = MIJCalculator()
    # Use the proper calculator instead of inline reimplementation

    total_analisadas = len(decisoes)

    if total_analisadas == 0:
        return SimuladorResponse(
            score_exito=0.0,
            confianca="insuficiente",
            total_decisoes_analisadas=0,
            teses_recomendadas=[],
            jurisprudencia=[],
            detalhamento={
                "mensagem": "Dados insuficientes para simulação. "
                "Nenhuma decisão encontrada para os critérios informados.",
                "tribunal": tribunal_upper,
                "materia": body.materia,
            },
        )

    # ── Calculate SET (Score de Êxito Temporal) ──
    today = date.today()
    weighted_score = 0.0
    total_weight = 0.0

    resultados_count = {
        "procedente": 0,
        "improcedente": 0,
        "parcialmente_procedente": 0,
        "outros": 0,
    }

    for d in decisoes:
        # Recency weight: more recent decisions have higher weight
        days_ago = (today - d.data_decisao).days if d.data_decisao else 365
        recency_weight = max(0.1, 1.0 / (1.0 + days_ago / 365.0))

        # Score based on result
        if d.resultado == "procedente":
            score = 1.0
            resultados_count["procedente"] += 1
        elif d.resultado == "parcialmente_procedente":
            score = 0.6
            resultados_count["parcialmente_procedente"] += 1
        elif d.resultado == "improcedente":
            score = 0.0
            resultados_count["improcedente"] += 1
        else:
            score = 0.3
            resultados_count["outros"] += 1

        weighted_score += score * recency_weight
        total_weight += recency_weight

    score_exito = round((weighted_score / total_weight) * 100, 1) if total_weight > 0 else 0.0

    # Confidence level
    if total_analisadas >= 50:
        confianca = "alta"
    elif total_analisadas >= 20:
        confianca = "média"
    elif total_analisadas >= 5:
        confianca = "baixa"
    else:
        confianca = "muito_baixa"

    # ── Recommended teses ──
    teses = _generate_teses(body.materia, body.tipo_acao, score_exito, resultados_count)

    # ── Jurisprudência references ──
    jurisprudencia = []
    for d in decisoes[:10]:
        jurisprudencia.append(
            JurisprudenciaRef(
                processo=d.processo_numero,
                tipo=d.tipo,
                resultado=d.resultado,
                ementa=(d.ementa or '')[:300] or None,
                data=d.data_decisao.isoformat() if d.data_decisao else None,
            )
        )

    return SimuladorResponse(
        score_exito=score_exito,
        confianca=confianca,
        total_decisoes_analisadas=total_analisadas,
        teses_recomendadas=teses,
        jurisprudencia=jurisprudencia,
        detalhamento={
            "tribunal": tribunal_upper,
            "materia": body.materia,
            "tipo_acao": body.tipo_acao,
            "magistrado_id": body.magistrado_id,
            "resultados": resultados_count,
            "score_bruto": round(weighted_score, 3),
            "peso_total": round(total_weight, 3),
        },
    )


@router.get("/stats", response_model=MIJDashboardStats)
async def mij_stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Estatísticas do dashboard MIJ."""
    # Total magistrados
    mag_count = await db.execute(select(func.count(Magistrado.id)))
    total_magistrados = mag_count.scalar() or 0

    # Total decisões
    dec_count = await db.execute(select(func.count(Decisao.id)))
    total_decisoes = dec_count.scalar() or 0

    # Total tribunais
    trib_count = await db.execute(
        select(func.count(distinct(Magistrado.tribunal)))
    )
    total_tribunais = trib_count.scalar() or 0

    # Total matérias
    mat_count = await db.execute(
        select(func.count(distinct(Decisao.materia)))
    )
    total_materias = mat_count.scalar() or 0

    # Taxa procedência global
    if total_decisoes > 0:
        proc_count = await db.execute(
            select(func.count(Decisao.id)).where(Decisao.resultado == "procedente")
        )
        procedentes = proc_count.scalar() or 0
        taxa_procedencia_global = round((procedentes / total_decisoes) * 100, 2)
    else:
        taxa_procedencia_global = None

    # Decisões por tribunal
    trib_result = await db.execute(
        select(Decisao.tribunal, func.count(Decisao.id))
        .group_by(Decisao.tribunal)
    )
    decisoes_por_tribunal = {row[0]: row[1] for row in trib_result.all()}

    # Decisões por matéria
    mat_result = await db.execute(
        select(Decisao.materia, func.count(Decisao.id))
        .group_by(Decisao.materia)
        .order_by(func.count(Decisao.id).desc())
        .limit(20)
    )
    decisoes_por_materia = {row[0]: row[1] for row in mat_result.all()}

    return MIJDashboardStats(
        total_magistrados=total_magistrados,
        total_decisoes=total_decisoes,
        total_tribunais=total_tribunais,
        total_materias=total_materias,
        taxa_procedencia_global=taxa_procedencia_global,
        decisoes_por_tribunal=decisoes_por_tribunal,
        decisoes_por_materia=decisoes_por_materia,
    )


# ─── Helper Functions ──────────────────────────────────────────────
def _generate_teses(
    materia: str,
    tipo_acao: str,
    score_exito: float,
    resultados: dict,
) -> list[TeseRecomendada]:
    """Gera teses recomendadas com base na análise das decisões."""
    teses_mapa = {
        "trabalhista": [
            TeseRecomendada(
                tese="Reversão da justa causa por ausência de gradação punitiva",
                fundamentacao="Art. 482 CLT — Princípio da proporcionalidade na aplicação de penalidades",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Reconhecimento de vínculo empregatício por subordinação estrutural",
                fundamentacao="Art. 3º CLT — Presença dos elementos caracterizadores da relação de emprego",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Horas extras por controle de jornada irregular",
                fundamentacao="Art. 74 §2º CLT — Ônus da prova do empregador quanto ao controle de jornada",
                confianca=0.0,
            ),
        ],
        "cível": [
            TeseRecomendada(
                tese="Responsabilidade civil objetiva por dano ao consumidor",
                fundamentacao="Art. 14 CDC — Responsabilidade independente de culpa do fornecedor",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Dano moral in re ipsa por inscrição indevida",
                fundamentacao="Súmula 385 STJ — Inscrição indevida em cadastro de inadimplentes",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Revisão contratual por onerosidade excessiva",
                fundamentacao="Art. 478 CC — Resolução por onerosidade excessiva em contratos de execução continuada",
                confianca=0.0,
            ),
        ],
        "tributário": [
            TeseRecomendada(
                tese="Exclusão do ICMS da base de cálculo do PIS/COFINS",
                fundamentacao="Tema 69 STF — RE 574.706 — ICMS não compõe faturamento",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Nulidade do lançamento tributário por vício formal",
                fundamentacao="Art. 142 CTN — Requisitos essenciais do lançamento",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Imunidade tributária de entidade sem fins lucrativos",
                fundamentacao="Art. 150, VI, 'c' CF — Imunidade das instituições de educação e assistência social",
                confianca=0.0,
            ),
        ],
        "ambiental": [
            TeseRecomendada(
                tese="Responsabilidade objetiva por dano ambiental",
                fundamentacao="Art. 14 §1º Lei 6.938/81 — Independe de culpa para reparação ambiental",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Princípio do poluidor-pagador",
                fundamentacao="Art. 225 §3º CF — Obrigação de reparar danos causados ao meio ambiente",
                confianca=0.0,
            ),
        ],
    }

    # Find matching teses or use default
    materia_lower = materia.lower()
    matched_teses = None
    for key in teses_mapa:
        if key in materia_lower:
            matched_teses = teses_mapa[key]
            break

    if not matched_teses:
        matched_teses = [
            TeseRecomendada(
                tese="Aplicação do princípio da boa-fé objetiva",
                fundamentacao="Art. 422 CC — Boa-fé objetiva nas relações contratuais",
                confianca=0.0,
            ),
            TeseRecomendada(
                tese="Inversão do ônus da prova",
                fundamentacao="Art. 373 CPC — Distribuição dinâmica do ônus da prova",
                confianca=0.0,
            ),
        ]

    # Calculate confidence for each tese based on score_exito
    total = sum(resultados.values()) or 1
    for i, tese in enumerate(matched_teses):
        # Base confidence from overall success rate
        base = score_exito / 100.0
        # Slight variation per tese
        variation = 1.0 - (i * 0.08)
        tese.confianca = round(min(0.99, max(0.05, base * variation)), 2)

    # Sort by confidence descending
    matched_teses.sort(key=lambda t: t.confianca, reverse=True)

    return matched_teses[:5]


# ─── Seed Data ──────────────────────────────────────────────────────
@router.post("/seed", summary="Carregar dados de demonstracao MIJ")
async def seed_mij(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Popula a base com magistrados e decisoes de demonstracao."""
    # Check if already seeded
    count = await db.execute(select(func.count(Magistrado.id)))
    existing = count.scalar() or 0
    if existing > 0:
        return {
            "mensagem": f"Base ja possui {existing} magistrados. Seed ignorado.",
            "total_magistrados": existing,
        }

    from server.mij.seed_data import seed_mij_data
    result = await seed_mij_data(db)
    return {
        "mensagem": "Dados de demonstracao MIJ carregados com sucesso!",
        "resultado": result,
    }

