"""
MIJ Scraper - DataJud API (CNJ - Conselho Nacional de Justiça)

Coleta decisões judiciais da API pública do DataJud usando queries Elasticsearch.
Endpoint: https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search

Tribunais suportados: TJMG, TJPA, TJMA, STJ
"""

import logging
import os
from datetime import datetime
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

# Códigos de tribunais suportados e seus endpoints
TRIBUNAIS_SUPORTADOS = {
    "tjmg": "api_publica_tjmg",
    "tjpa": "api_publica_tjpa",
    "tjma": "api_publica_tjma",
    "stj": "api_publica_stj",
}

BASE_URL = "https://api-publica.datajud.cnj.jus.br"

API_KEY = os.environ.get("SJIF_DATAJUD_API_KEY", "")

DEFAULT_HEADERS = {
    "Authorization": f"APIKey {API_KEY}",
    "Content-Type": "application/json",
}


class DataJudScraper:
    """
    Scraper para a API pública do DataJud (CNJ).

    Utiliza queries Elasticsearch para buscar processos judiciais
    nos diversos tribunais brasileiros.
    """

    def __init__(self, tribunal: str = "tjmg"):
        """
        Inicializa o scraper para um tribunal específico.

        Args:
            tribunal: Código do tribunal (tjmg, tjpa, tjma, stj).
                      Padrão: 'tjmg'.
        """
        tribunal_lower = tribunal.lower()
        if tribunal_lower not in TRIBUNAIS_SUPORTADOS:
            raise ValueError(
                f"Tribunal '{tribunal}' não suportado. "
                f"Use: {', '.join(TRIBUNAIS_SUPORTADOS.keys())}"
            )

        self.tribunal = tribunal_lower
        endpoint = TRIBUNAIS_SUPORTADOS[tribunal_lower]
        self.api_url = f"{BASE_URL}/{endpoint}/_search"
        self.headers = DEFAULT_HEADERS.copy()

        logger.info(
            "DataJudScraper inicializado para tribunal=%s url=%s",
            self.tribunal,
            self.api_url,
        )

    # ------------------------------------------------------------------
    # Query builder
    # ------------------------------------------------------------------

    def _build_query(
        self,
        materia: Optional[str] = None,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None,
        size: int = 100,
        search_after: Optional[list] = None,
    ) -> dict:
        """
        Constrói o body da query Elasticsearch para o DataJud.

        Args:
            materia: Filtro por matéria/assunto (ex.: 'Consumidor', 'Família').
            data_inicio: Data inicial no formato 'YYYY-MM-DD'.
            data_fim: Data final no formato 'YYYY-MM-DD'.
            size: Número máximo de resultados por página.
            search_after: Cursor de paginação (sort values do último hit).

        Returns:
            Dicionário com o body da query ES.
        """
        must_clauses: list[dict] = []
        filter_clauses: list[dict] = []

        # Filtro por matéria — busca em movimentos e classeProcessual
        if materia:
            must_clauses.append(
                {
                    "bool": {
                        "should": [
                            {
                                "match": {
                                    "movimentos.nome": {
                                        "query": materia,
                                        "operator": "AND",
                                    }
                                }
                            },
                            {
                                "match": {
                                    "classeProcessual": {
                                        "query": materia,
                                        "operator": "AND",
                                    }
                                }
                            },
                            {
                                "match": {
                                    "assuntos.nome": {
                                        "query": materia,
                                        "operator": "AND",
                                    }
                                }
                            },
                        ],
                        "minimum_should_match": 1,
                    }
                }
            )

        # Filtro por intervalo de datas
        if data_inicio or data_fim:
            range_filter: dict = {}
            if data_inicio:
                range_filter["gte"] = data_inicio
            if data_fim:
                range_filter["lte"] = data_fim
            filter_clauses.append(
                {"range": {"dataJulgamento": range_filter}}
            )

        # Montar query principal
        query_body: dict = {
            "size": size,
            "sort": [{"dataJulgamento": {"order": "desc"}}, "_score"],
            "query": {
                "bool": {
                    "must": must_clauses if must_clauses else [{"match_all": {}}],
                }
            },
        }

        if filter_clauses:
            query_body["query"]["bool"]["filter"] = filter_clauses

        if search_after:
            query_body["search_after"] = search_after

        return query_body

    # ------------------------------------------------------------------
    # Fetch
    # ------------------------------------------------------------------

    async def fetch_decisoes(
        self,
        materia: Optional[str] = None,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None,
        size: int = 100,
    ) -> list[dict]:
        """
        Busca decisões no DataJud.

        Args:
            materia: Filtro por matéria/assunto processual.
            data_inicio: Data inicial (YYYY-MM-DD).
            data_fim: Data final (YYYY-MM-DD).
            size: Quantidade máxima de resultados.

        Returns:
            Lista de dicionários brutos (hits) do Elasticsearch.
        """
        query_body = self._build_query(
            materia=materia,
            data_inicio=data_inicio,
            data_fim=data_fim,
            size=size,
        )

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    headers=self.headers,
                    json=query_body,
                )
                response.raise_for_status()
                data = response.json()

                hits = data.get("hits", {}).get("hits", [])
                logger.info(
                    "DataJud [%s] retornou %d resultados para materia=%s",
                    self.tribunal,
                    len(hits),
                    materia,
                )
                return hits

        except httpx.HTTPStatusError as exc:
            logger.error(
                "Erro HTTP ao consultar DataJud [%s]: %s — %s",
                self.tribunal,
                exc.response.status_code,
                exc.response.text[:500],
            )
            return []
        except httpx.RequestError as exc:
            logger.error(
                "Erro de conexão ao consultar DataJud [%s]: %s",
                self.tribunal,
                str(exc),
            )
            return []
        except Exception as exc:
            logger.error(
                "Erro inesperado ao consultar DataJud [%s]: %s",
                self.tribunal,
                str(exc),
            )
            return []

    # ------------------------------------------------------------------
    # Parser
    # ------------------------------------------------------------------

    def parse_decisao(self, raw: dict) -> dict:
        """
        Extrai campos relevantes de um hit bruto do DataJud.

        Args:
            raw: Dicionário bruto (_source) de um hit Elasticsearch.

        Returns:
            Dicionário normalizado com os campos da decisão.
        """
        source = raw.get("_source", raw)

        # Extrair assuntos concatenados
        assuntos_raw = source.get("assuntos", [])
        if isinstance(assuntos_raw, list):
            assuntos = "; ".join(
                a.get("nome", "") for a in assuntos_raw if isinstance(a, dict)
            )
        else:
            assuntos = str(assuntos_raw)

        # Extrair órgão julgador
        orgao = source.get("orgaoJulgador", {})
        if isinstance(orgao, dict):
            orgao_nome = orgao.get("nome", "")
        else:
            orgao_nome = str(orgao)

        # Data de julgamento
        data_julg = source.get("dataJulgamento", source.get("dataAjuizamento", ""))
        if data_julg:
            try:
                data_julg = datetime.fromisoformat(
                    data_julg.replace("Z", "+00:00")
                ).strftime("%Y-%m-%d")
            except (ValueError, AttributeError):
                pass

        # Grau
        grau = source.get("grau", source.get("nivelSigilo", ""))

        # Município
        municipio_raw = source.get("tribunal", {})
        if isinstance(municipio_raw, dict):
            municipio = municipio_raw.get("municipio", "")
        else:
            municipio = source.get("municipioIBGE", "")

        return {
            "processo_numero": source.get("numeroProcesso", ""),
            "classe": source.get("classeProcessual", ""),
            "assunto": assuntos,
            "orgao_julgador": orgao_nome,
            "data_julgamento": data_julg,
            "grau": grau,
            "municipio": municipio,
            "tribunal": self.tribunal.upper(),
            "fonte": "datajud",
        }

    # ------------------------------------------------------------------
    # Batch collection
    # ------------------------------------------------------------------

    async def coletar_lote(
        self,
        tribunal: str,
        materias: list[str],
        data_inicio: str,
        data_fim: str,
        max_por_materia: int = 200,
    ) -> list[dict]:
        """
        Coleta um lote de decisões de múltiplas matérias, com paginação.

        Args:
            tribunal: Código do tribunal.
            materias: Lista de matérias para buscar.
            data_inicio: Data inicial (YYYY-MM-DD).
            data_fim: Data final (YYYY-MM-DD).
            max_por_materia: Máximo de decisões por matéria.

        Returns:
            Lista de decisões parseadas de todas as matérias.
        """
        # Re-inicializar para o tribunal correto se necessário
        if tribunal.lower() != self.tribunal:
            self.__init__(tribunal=tribunal)

        todas_decisoes: list[dict] = []

        for materia in materias:
            logger.info(
                "Coletando decisões: tribunal=%s materia=%s período=%s a %s",
                tribunal,
                materia,
                data_inicio,
                data_fim,
            )

            decisoes_materia: list[dict] = []
            coletadas = 0
            page_size = min(100, max_por_materia)
            search_after: Optional[list] = None

            while coletadas < max_por_materia:
                query_body = self._build_query(
                    materia=materia,
                    data_inicio=data_inicio,
                    data_fim=data_fim,
                    size=page_size,
                    search_after=search_after,
                )

                try:
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        response = await client.post(
                            self.api_url,
                            headers=self.headers,
                            json=query_body,
                        )
                        response.raise_for_status()
                        data = response.json()

                    hits = data.get("hits", {}).get("hits", [])
                    if not hits:
                        break

                    for hit in hits:
                        parsed = self.parse_decisao(hit)
                        parsed["materia_busca"] = materia
                        decisoes_materia.append(parsed)

                    coletadas += len(hits)

                    # Atualizar cursor de paginação (search_after)
                    last_hit = hits[-1]
                    search_after = last_hit.get("sort")
                    if not search_after:
                        break

                    logger.debug(
                        "Página coletada: %d decisões (total=%d) para %s",
                        len(hits),
                        coletadas,
                        materia,
                    )

                except httpx.HTTPStatusError as exc:
                    logger.error(
                        "Erro HTTP na paginação [%s/%s]: %s",
                        tribunal,
                        materia,
                        exc.response.status_code,
                    )
                    break
                except httpx.RequestError as exc:
                    logger.error(
                        "Erro de conexão na paginação [%s/%s]: %s",
                        tribunal,
                        materia,
                        str(exc),
                    )
                    break
                except Exception as exc:
                    logger.error(
                        "Erro inesperado na paginação [%s/%s]: %s",
                        tribunal,
                        materia,
                        str(exc),
                    )
                    break

            logger.info(
                "Matéria '%s' em %s: %d decisões coletadas",
                materia,
                tribunal,
                len(decisoes_materia),
            )
            todas_decisoes.extend(decisoes_materia)

        logger.info(
            "Lote finalizado para %s: %d decisões totais de %d matérias",
            tribunal,
            len(todas_decisoes),
            len(materias),
        )
        return todas_decisoes
