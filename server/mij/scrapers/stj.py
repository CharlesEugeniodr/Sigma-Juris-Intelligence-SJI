"""
MIJ Scraper - STJ (Superior Tribunal de Justiça)

Coleta jurisprudência do STJ via sua interface pública de pesquisa.
Endpoint principal: https://scon.stj.jus.br/SCON/pesquisar.jsp
Endpoint REST alternativo: https://scon.stj.jus.br/SCON/jt/toc.jsp
"""

import logging
import re
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

STJ_SEARCH_URL = "https://scon.stj.jus.br/SCON/pesquisar.jsp"
STJ_TOC_URL = "https://scon.stj.jus.br/SCON/jt/toc.jsp"

# Padrões para classificação de resultados no STJ
RESULTADO_PATTERNS_STJ = {
    "provido": [
        r"\bdeu\s+provimento\b",
        r"\bprovimento\s+ao\s+recurso\b",
        r"\brecurso\s+(?:especial\s+)?provido\b",
        r"\bderam\s+provimento\b",
        r"\bacolheram\b.*\brecurso\b",
    ],
    "desprovido": [
        r"\bnegou\s+provimento\b",
        r"\brecurso\s+(?:especial\s+)?desprovido\b",
        r"\bnegaram\s+provimento\b",
        r"\bdesprovimento\b",
        r"\bnão\s+provido\b",
        r"\brecurso\s+(?:especial\s+)?(?:não|nao)\s+provido\b",
    ],
    "parcial_provimento": [
        r"\bparcial\s+provimento\b",
        r"\bprovimento\s+parcial\b",
        r"\bderam\s+parcial\s+provimento\b",
        r"\bdeu\s+parcial\s+provimento\b",
        r"\bprovido\s+em\s+parte\b",
    ],
    "não_conhecido": [
        r"\bnão\s+conh?ecido\b",
        r"\bnao\s+conh?ecido\b",
        r"\brecurso\s+não\s+conhecido\b",
        r"\bnão\s+conheceram\b",
        r"\bnão\s+conheceu\b",
        r"\binadmitido\b",
        r"\binadmissível\b",
    ],
}

# Padrões para identificar tipo de decisão STJ
TIPO_PATTERNS = {
    "acordao": [
        r"\bacórdão\b",
        r"\bacordao\b",
        r"\bturma\b.*\bpor\s+(?:unanimidade|maioria)\b",
    ],
    "monocratica": [
        r"\bdecisão\s+monocrática\b",
        r"\bmonocrática\b",
        r"\bmonocraticamente\b",
        r"\bministro\s+relator\s+decid[iu]\b",
    ],
    "sumula": [
        r"\bsúmula\b",
        r"\bsumula\b",
        r"\benunciado\s+de\s+súmula\b",
    ],
}

# Padrões para extração de nomes de ministros
MINISTRO_PATTERNS = [
    r"(?:Rel(?:ator)?[.:]?\s*(?:Ministro|Min\.?)\s*)([\w\s\.]+?)(?:\s*[-–,]|\s*$)",
    r"(?:Ministro|Min\.?)\s+([\w\s\.]+?)(?:\s*[-–,]|\s*\(|\s*$)",
    r"(?:RELATOR[:\s]+(?:MINISTRO|MIN\.?)\s+)([\w\s\.]+?)(?:\s*[-–]|\s*\n|\s*$)",
]


class STJScraper:
    """
    Scraper para jurisprudência do Superior Tribunal de Justiça (STJ).

    Utiliza a interface pública de pesquisa do STJ (SCON) para buscar
    acórdãos, decisões monocráticas e súmulas.
    """

    def __init__(self):
        """Inicializa o scraper do STJ."""
        self.search_url = STJ_SEARCH_URL
        self.toc_url = STJ_TOC_URL
        self.timeout = 30.0
        logger.info("STJScraper inicializado — search_url=%s", self.search_url)

    # ------------------------------------------------------------------
    # Busca principal
    # ------------------------------------------------------------------

    async def buscar_jurisprudencia(
        self,
        termo: str,
        pagina: int = 1,
    ) -> list[dict]:
        """
        Busca jurisprudência no STJ.

        Args:
            termo: Termo de busca (palavras-chave, matéria, etc.).
            pagina: Número da página de resultados.

        Returns:
            Lista de dicionários com campos padronizados de cada decisão.
        """
        params = {
            "livre": termo,
            "pesquisar": "Pesquisar",
            "b": "ACOR",  # Base: Acórdãos
            "p": "true",
            "l": 20,  # Resultados por página
            "i": ((pagina - 1) * 20) + 1,  # Offset
        }

        # Tentar primeiro o endpoint REST (toc.jsp), com fallback para pesquisar.jsp
        for url in [self.toc_url, self.search_url]:
            try:
                async with httpx.AsyncClient(
                    timeout=self.timeout,
                    follow_redirects=True,
                ) as client:
                    response = await client.get(
                        url,
                        params=params,
                        headers={
                            "User-Agent": (
                                "Mozilla/5.0 (compatible; MIJ-Scraper/1.0; "
                                "+https://github.com/sigma-juris)"
                            ),
                            "Accept": "text/html,application/xhtml+xml,application/json",
                        },
                    )
                    response.raise_for_status()

                    content_type = response.headers.get("content-type", "")

                    if "application/json" in content_type:
                        data = response.json()
                        resultados = (
                            data
                            if isinstance(data, list)
                            else data.get("resultados", data.get("documentos", []))
                        )
                        return [self._parse_json_resultado(r) for r in resultados]
                    else:
                        parsed = self._parse_html_resultados(response.text)
                        if parsed:
                            return parsed

            except httpx.HTTPStatusError as exc:
                logger.error(
                    "Erro HTTP ao consultar STJ (%s): %s — %s",
                    url,
                    exc.response.status_code,
                    exc.response.text[:300],
                )
            except httpx.RequestError as exc:
                logger.warning(
                    "STJ endpoint indisponível (%s): %s",
                    url,
                    str(exc),
                )
            except Exception as exc:
                logger.error(
                    "Erro inesperado ao consultar STJ (%s): %s",
                    url,
                    str(exc),
                )

        logger.warning(
            "Nenhum endpoint do STJ retornou resultados para termo='%s'. "
            "Retornando lista vazia.",
            termo,
        )
        return []

    # ------------------------------------------------------------------
    # Parsers
    # ------------------------------------------------------------------

    def parse_acordao(self, data: dict) -> dict:
        """
        Parseia dados de um acórdão do STJ.

        Args:
            data: Dicionário com dados brutos do acórdão.

        Returns:
            Dicionário padronizado com os campos da decisão.
        """
        ementa = data.get("ementa", data.get("textoEmenta", ""))
        relator = data.get("relator", data.get("ministroRelator", ""))

        # Extrair turma do órgão julgador
        orgao = data.get("orgaoJulgador", data.get("turma", ""))
        turma = self._extrair_turma(orgao)

        return {
            "numero_processo": data.get("numeroProcesso", data.get("numero", "")),
            "relator": relator,
            "turma": turma,
            "orgao_julgador": orgao,
            "data_julgamento": data.get(
                "dataJulgamento", data.get("dtJulgamento", "")
            ),
            "ementa": ementa,
            "tipo": self._classificar_tipo(data, ementa),
            "resultado": self.extrair_resultado(ementa),
            "tribunal": "STJ",
            "fonte": "stj_scon",
        }

    def _parse_json_resultado(self, data: dict) -> dict:
        """Parseia um resultado JSON do STJ."""
        return self.parse_acordao(data)

    def _parse_html_resultados(self, html: str) -> list[dict]:
        """Parseia a página HTML de resultados do STJ."""
        resultados: list[dict] = []

        # Separar blocos de resultado
        blocos = re.split(
            r'<div\s+class="[^"]*(?:documento|resultado|clsTextoJurisprudencia)[^"]*"',
            html,
            flags=re.IGNORECASE,
        )

        if len(blocos) <= 1:
            # Separação alternativa
            blocos = re.split(r"(?:<hr\s*/?>|<div\s+class=\"divDocumento\")", html)

        for bloco in blocos[1:]:
            parsed = self._parse_html_single(bloco)
            if parsed.get("numero_processo") or parsed.get("ementa"):
                resultados.append(parsed)

        return resultados

    def _parse_html_single(self, html: str) -> dict:
        """Parseia um bloco HTML individual de resultado do STJ."""
        resultado: dict = {
            "numero_processo": "",
            "relator": "",
            "turma": "",
            "orgao_julgador": "",
            "data_julgamento": "",
            "ementa": "",
            "tipo": "",
            "resultado": "",
            "tribunal": "STJ",
            "fonte": "stj_scon",
        }

        # Número do processo
        proc_match = re.search(
            r"(?:REsp|AgInt|AgRg|HC|RMS|AREsp|EDcl)\s*([\d/.]+)",
            html,
            re.IGNORECASE,
        )
        if not proc_match:
            proc_match = re.search(
                r"(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})", html
            )
        if proc_match:
            resultado["numero_processo"] = proc_match.group(0).strip()

        # Relator
        for pattern in MINISTRO_PATTERNS:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                nome = re.sub(r"\s+", " ", match.group(1)).strip(" .,;:-–")
                if len(nome) > 3:
                    resultado["relator"] = nome
                    break

        # Turma / Órgão julgador
        turma_match = re.search(
            r"(\d[ªa]\s*(?:Turma|Seção|TURMA|SEÇÃO))", html, re.IGNORECASE
        )
        if turma_match:
            resultado["turma"] = turma_match.group(1).strip()
            resultado["orgao_julgador"] = resultado["turma"]

        # Data de julgamento
        data_match = re.search(
            r"(?:Julgad[oa]\s*em|Data\s*(?:do\s*)?Julgamento)[:\s]*(\d{2}/\d{2}/\d{4})",
            html,
            re.IGNORECASE,
        )
        if data_match:
            resultado["data_julgamento"] = data_match.group(1)

        # Ementa
        ementa_match = re.search(
            r"(?:EMENTA|Ementa)[:\s]*(.+?)(?=(?:ACÓRDÃO|VOTO|RELATOR|$))",
            html,
            re.DOTALL | re.IGNORECASE,
        )
        if ementa_match:
            ementa = re.sub(r"\s+", " ", ementa_match.group(1)).strip()
            resultado["ementa"] = ementa
            resultado["resultado"] = self.extrair_resultado(ementa)

        # Tipo da decisão
        resultado["tipo"] = self._classificar_tipo_from_text(html)

        return resultado

    # ------------------------------------------------------------------
    # Extratores auxiliares
    # ------------------------------------------------------------------

    def extrair_resultado(self, ementa: str) -> str:
        """
        Determina o resultado da decisão do STJ a partir da ementa.

        Args:
            ementa: Texto da ementa da decisão.

        Returns:
            Resultado padronizado: 'provido', 'desprovido',
            'parcial_provimento', 'não_conhecido' ou '' se não identificado.
        """
        if not ementa:
            return ""

        ementa_lower = ementa.lower()

        # Ordem de verificação: mais específico primeiro
        # 1. Não conhecido (mais restritivo, evita falsos positivos)
        for pattern in RESULTADO_PATTERNS_STJ["não_conhecido"]:
            if re.search(pattern, ementa_lower):
                return "não_conhecido"

        # 2. Parcial provimento
        for pattern in RESULTADO_PATTERNS_STJ["parcial_provimento"]:
            if re.search(pattern, ementa_lower):
                return "parcial_provimento"

        # 3. Provido
        for pattern in RESULTADO_PATTERNS_STJ["provido"]:
            if re.search(pattern, ementa_lower):
                return "provido"

        # 4. Desprovido
        for pattern in RESULTADO_PATTERNS_STJ["desprovido"]:
            if re.search(pattern, ementa_lower):
                return "desprovido"

        return ""

    def _classificar_tipo(self, data: dict, ementa: str) -> str:
        """Classifica o tipo de decisão a partir dos dados estruturados."""
        tipo = data.get("tipo", data.get("classe", "")).lower()

        if "súmula" in tipo or "sumula" in tipo:
            return "sumula"
        elif "monocrática" in tipo or "monocratica" in tipo:
            return "monocratica"
        elif "acórdão" in tipo or "acordao" in tipo:
            return "acordao"

        return self._classificar_tipo_from_text(ementa)

    def _classificar_tipo_from_text(self, texto: str) -> str:
        """Classifica o tipo de decisão a partir do texto."""
        if not texto:
            return ""

        texto_lower = texto.lower()

        for tipo, patterns in TIPO_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, texto_lower):
                    return tipo

        return "acordao"  # Default para STJ

    @staticmethod
    def _extrair_turma(orgao: str) -> str:
        """Extrai a turma do órgão julgador."""
        if not orgao:
            return ""

        match = re.search(
            r"(\d[ªa]?\s*(?:Turma|Seção|T\.))", orgao, re.IGNORECASE
        )
        if match:
            return match.group(1).strip()

        return orgao
