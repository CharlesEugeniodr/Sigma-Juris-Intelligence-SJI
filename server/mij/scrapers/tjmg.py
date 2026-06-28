"""
MIJ Scraper - TJMG (Tribunal de Justiça de Minas Gerais)

Coleta jurisprudência do TJMG via sua interface pública de pesquisa.
Endpoint: https://www5.tjmg.jus.br/jurisprudencia/
"""

import logging
import re
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

TJMG_BASE_URL = "https://www5.tjmg.jus.br/jurisprudencia"

# Mapeamento de padrões textuais para resultados padronizados
RESULTADO_PATTERNS = {
    "procedente": [
        r"\bjulgou\s+procedente\b",
        r"\bdeclaro\s+procedente\b",
        r"\bprocedente\s+o\s+pedido\b",
        r"\bjulgo\s+procedente\b",
        r"\bprocedência\s+d[oa]\b",
    ],
    "improcedente": [
        r"\bjulgou\s+improcedente\b",
        r"\bimprocedente\s+o\s+pedido\b",
        r"\bjulgo\s+improcedente\b",
        r"\bimprocedência\s+d[oa]\b",
    ],
    "parcial": [
        r"\bparcialmente\s+procedente\b",
        r"\bprocedência\s+parcial\b",
        r"\bprocedente\s+em\s+parte\b",
        r"\bjulgou\s+parcialmente\b",
    ],
    "provido": [
        r"\bdeu\s+provimento\b",
        r"\bprovimento\s+ao\s+recurso\b",
        r"\brecurso\s+provido\b",
        r"\bderam\s+provimento\b",
    ],
    "desprovido": [
        r"\bnegou\s+provimento\b",
        r"\brecurso\s+desprovido\b",
        r"\bnegaram\s+provimento\b",
        r"\bdesprovimento\b",
        r"\bnão\s+provido\b",
    ],
    "parcial_provimento": [
        r"\bparcial\s+provimento\b",
        r"\bprovimento\s+parcial\b",
        r"\bderam\s+parcial\s+provimento\b",
        r"\bdeu\s+parcial\s+provimento\b",
    ],
}

# Padrões para extração de nomes de magistrados
MAGISTRADO_PATTERNS = [
    r"(?:Rel(?:ator)?[.:]?\s*(?:Des(?:embargador)?[.]?\s*)?)([\w\s\.]+?)(?:\s*[-–]|\s*$)",
    r"(?:Des(?:embargador)?[.]?\s*)([\w\s\.]+?)(?:\s*[-–]|\s*,|\s*$)",
    r"(?:Juiz(?:a)?\s*(?:de\s*Direito)?\s*)([\w\s\.]+?)(?:\s*[-–]|\s*,|\s*$)",
    r"(?:RELATOR[:\s]+)([\w\s\.]+?)(?:\s*[-–]|\s*\n|\s*$)",
]


class TJMGScraper:
    """
    Scraper para jurisprudência do Tribunal de Justiça de Minas Gerais (TJMG).

    Utiliza a interface pública de pesquisa de jurisprudência do TJMG
    para buscar e parsear decisões judiciais.
    """

    def __init__(self):
        """Inicializa o scraper do TJMG."""
        self.base_url = TJMG_BASE_URL
        self.timeout = 30.0
        logger.info("TJMGScraper inicializado — base_url=%s", self.base_url)

    # ------------------------------------------------------------------
    # Busca principal
    # ------------------------------------------------------------------

    async def buscar_jurisprudencia(
        self,
        termo: str,
        pagina: int = 1,
        resultados_por_pagina: int = 20,
    ) -> list[dict]:
        """
        Busca jurisprudência no TJMG.

        Args:
            termo: Termo de busca (palavras-chave, número do processo, etc.).
            pagina: Número da página de resultados (1-indexed).
            resultados_por_pagina: Quantidade de resultados por página.

        Returns:
            Lista de dicionários com campos padronizados de cada decisão.
        """
        params = {
            "palavrasConsulta": termo,
            "pesquisaPalavras": "Pesquisar",
            "pesquisar": "Pesquisar",
            "paginaNumero": pagina,
            "linhasPorPagina": resultados_por_pagina,
            "resultadosPorPagina": resultados_por_pagina,
        }

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
            ) as client:
                response = await client.get(
                    f"{self.base_url}/pesquisaPalavrasEspelho.do",
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
                    resultados = data if isinstance(data, list) else data.get("resultados", [])
                    return [self.parse_resultado(r) for r in resultados]
                else:
                    # HTML — parsear do conteúdo
                    return self._parse_html_resultados(response.text)

        except httpx.HTTPStatusError as exc:
            logger.error(
                "Erro HTTP ao consultar TJMG: %s — %s",
                exc.response.status_code,
                exc.response.text[:300],
            )
            return []
        except httpx.RequestError as exc:
            logger.warning(
                "TJMG API indisponível (%s). Retornando resultados vazios.",
                str(exc),
            )
            return []
        except Exception as exc:
            logger.error(
                "Erro inesperado ao consultar TJMG: %s",
                str(exc),
            )
            return []

    # ------------------------------------------------------------------
    # Parsers
    # ------------------------------------------------------------------

    def parse_resultado(self, html_or_json) -> dict:
        """
        Parseia um resultado de busca (JSON ou fragmento HTML).

        Args:
            html_or_json: Dicionário JSON ou string HTML de um resultado individual.

        Returns:
            Dicionário padronizado da decisão.
        """
        if isinstance(html_or_json, dict):
            return self._parse_json_resultado(html_or_json)
        elif isinstance(html_or_json, str):
            return self._parse_html_single(html_or_json)
        else:
            logger.warning("Tipo inesperado para parse_resultado: %s", type(html_or_json))
            return self._empty_resultado()

    def _parse_json_resultado(self, data: dict) -> dict:
        """Parseia resultado em formato JSON."""
        ementa = data.get("ementa", data.get("textoEmenta", ""))
        relator = data.get("relator", data.get("nomeRelator", ""))

        return {
            "numero_processo": data.get("numeroProcesso", data.get("numero", "")),
            "relator": relator,
            "orgao_julgador": data.get("orgaoJulgador", data.get("nomeOrgaoJulgador", "")),
            "data_julgamento": data.get("dataJulgamento", data.get("dtJulgamento", "")),
            "ementa": ementa,
            "tipo_decisao": data.get("tipoDecisao", data.get("classe", "")),
            "resultado": self.extrair_resultado(ementa),
            "tribunal": "TJMG",
            "fonte": "tjmg_jurisprudencia",
        }

    def _parse_html_single(self, html: str) -> dict:
        """Parseia um resultado individual de HTML."""
        resultado = self._empty_resultado()

        # Extrair número do processo
        proc_match = re.search(
            r"(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})", html
        )
        if proc_match:
            resultado["numero_processo"] = proc_match.group(1)

        # Extrair relator
        resultado["relator"] = self.extrair_magistrado(html)

        # Extrair ementa (entre tags ou após label)
        ementa_match = re.search(
            r"(?:EMENTA|Ementa)[:\s]*(.+?)(?=(?:ACÓRDÃO|Acórdão|RELATOR|$))",
            html,
            re.DOTALL | re.IGNORECASE,
        )
        if ementa_match:
            ementa = re.sub(r"\s+", " ", ementa_match.group(1)).strip()
            resultado["ementa"] = ementa
            resultado["resultado"] = self.extrair_resultado(ementa)

        # Extrair data de julgamento
        data_match = re.search(
            r"(?:Data\s*(?:do\s*)?Julgamento|Julgado\s*em)[:\s]*(\d{2}/\d{2}/\d{4})",
            html,
            re.IGNORECASE,
        )
        if data_match:
            resultado["data_julgamento"] = data_match.group(1)

        # Extrair órgão julgador
        orgao_match = re.search(
            r"(?:Órgão\s*Julgador|Câmara|Turma)[:\s]*([\w\sªº]+?)(?:\s*[-–]|\s*$)",
            html,
            re.IGNORECASE,
        )
        if orgao_match:
            resultado["orgao_julgador"] = orgao_match.group(1).strip()

        resultado["tribunal"] = "TJMG"
        resultado["fonte"] = "tjmg_jurisprudencia"
        return resultado

    def _parse_html_resultados(self, html: str) -> list[dict]:
        """Parseia a página inteira de resultados HTML do TJMG."""
        resultados: list[dict] = []

        # Tentar separar por blocos de resultado
        blocos = re.split(
            r'<div\s+class="[^"]*resultado[^"]*"',
            html,
            flags=re.IGNORECASE,
        )

        if len(blocos) <= 1:
            # Tentar separação alternativa por <hr> ou padrão de processo
            blocos = re.split(r"<hr\s*/?>", html)

        for bloco in blocos[1:]:  # Pular o primeiro (header)
            parsed = self._parse_html_single(bloco)
            if parsed.get("numero_processo") or parsed.get("ementa"):
                resultados.append(parsed)

        if not resultados:
            logger.info(
                "Nenhum resultado parseado do HTML do TJMG (pode ser página vazia)."
            )

        return resultados

    @staticmethod
    def _empty_resultado() -> dict:
        """Retorna um dicionário de resultado vazio."""
        return {
            "numero_processo": "",
            "relator": "",
            "orgao_julgador": "",
            "data_julgamento": "",
            "ementa": "",
            "tipo_decisao": "",
            "resultado": "",
            "tribunal": "TJMG",
            "fonte": "tjmg_jurisprudencia",
        }

    # ------------------------------------------------------------------
    # Extratores auxiliares
    # ------------------------------------------------------------------

    def extrair_magistrado(self, texto: str) -> str:
        """
        Extrai o nome do magistrado (relator) a partir do texto da decisão.

        Args:
            texto: Texto contendo informações sobre o relator/julgador.

        Returns:
            Nome do magistrado ou string vazia se não encontrado.
        """
        if not texto:
            return ""

        for pattern in MAGISTRADO_PATTERNS:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                nome = match.group(1).strip()
                # Limpar artefatos
                nome = re.sub(r"\s+", " ", nome)
                nome = nome.strip(" .,;:-–")
                if len(nome) > 3 and " " in nome:
                    return nome

        return ""

    def extrair_resultado(self, ementa: str) -> str:
        """
        Determina o resultado da decisão a partir do texto da ementa.

        Analisa a ementa buscando padrões textuais que indiquem o
        resultado do julgamento.

        Args:
            ementa: Texto da ementa da decisão.

        Returns:
            Resultado padronizado: 'procedente', 'improcedente', 'parcial',
            'provido', 'desprovido', 'parcial_provimento' ou '' se não
            identificado.
        """
        if not ementa:
            return ""

        ementa_lower = ementa.lower()

        # Verificar parcial_provimento primeiro (mais específico)
        for pattern in RESULTADO_PATTERNS["parcial_provimento"]:
            if re.search(pattern, ementa_lower):
                return "parcial_provimento"

        # Verificar parcial (parcialmente procedente)
        for pattern in RESULTADO_PATTERNS["parcial"]:
            if re.search(pattern, ementa_lower):
                return "parcial"

        # Verificar provido (antes de desprovido para evitar falso positivo)
        for pattern in RESULTADO_PATTERNS["provido"]:
            if re.search(pattern, ementa_lower):
                return "provido"

        # Verificar desprovido
        for pattern in RESULTADO_PATTERNS["desprovido"]:
            if re.search(pattern, ementa_lower):
                return "desprovido"

        # Verificar procedente
        for pattern in RESULTADO_PATTERNS["procedente"]:
            if re.search(pattern, ementa_lower):
                return "procedente"

        # Verificar improcedente
        for pattern in RESULTADO_PATTERNS["improcedente"]:
            if re.search(pattern, ementa_lower):
                return "improcedente"

        return ""
