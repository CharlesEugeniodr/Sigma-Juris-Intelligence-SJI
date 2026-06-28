"""
MIJ Calculators - Métricas de Inteligência Judicial

Calcula as métricas centrais do Motor de Inteligência Judicial:
  - SET  (Score de Êxito por Tese)
  - IPT  (Índice de Previsibilidade do Tribunal)
  - TR   (Taxa de Reforma)
  - IAJ  (Índice de Alinhamento Jurisprudencial)
  - Perfil de Magistrado
  - Simulação de Recurso
"""

import logging
import math
import statistics
from collections import defaultdict
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constantes
# ---------------------------------------------------------------------------

# Mapeamento de resultados para scores numéricos
RESULTADO_SCORES = {
    "procedente": 1.0,
    "provido": 1.0,
    "parcialmente_procedente": 0.5,
    "parcial_provimento": 0.5,
    "parcial": 0.5,
    "improcedente": 0.0,
    "desprovido": 0.0,
    "não_conhecido": 0.0,
    "nao_conhecido": 0.0,
}

# Resultados favoráveis e desfavoráveis (para contagem rápida)
RESULTADOS_FAVORAVEIS = {"procedente", "provido"}
RESULTADOS_PARCIAIS = {"parcialmente_procedente", "parcial_provimento", "parcial"}
RESULTADOS_DESFAVORAVEIS = {"improcedente", "desprovido", "não_conhecido", "nao_conhecido"}

# Decay para ponderação temporal (SET)
DEFAULT_DECAY = 0.001

# Limites de confiança
CONFIANCA_THRESHOLDS = {
    "alta": 50,
    "media": 20,
}


def _score_for_resultado(resultado: str) -> float:
    """Retorna o score numérico para um resultado textual."""
    return RESULTADO_SCORES.get(resultado.lower().strip(), 0.0)


def _days_since(data_str: str) -> float:
    """Calcula dias desde uma data (string ISO ou DD/MM/YYYY) até hoje."""
    if not data_str:
        return 365.0  # Fallback: 1 ano

    now = datetime.now(timezone.utc)

    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            dt = datetime.strptime(data_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            delta = (now - dt).days
            return max(delta, 0)
        except ValueError:
            continue

    return 365.0


class MIJCalculator:
    """
    Calculadora central de métricas do Motor de Inteligência Judicial (MIJ).

    Fornece métodos para computar os principais indicadores analíticos
    sobre decisões judiciais, perfis de magistrados e simulações.
    """

    # ------------------------------------------------------------------
    # SET — Score de Êxito por Tese
    # ------------------------------------------------------------------

    def calcular_set(self, decisoes: list[dict], decay: float = DEFAULT_DECAY) -> float:
        """
        Calcula o Score de Êxito por Tese (SET).

        SET = Σ(wi × Ri) / Σ(wi) × 100

        Onde:
            Ri = score numérico do resultado (1.0 / 0.5 / 0.0)
            wi = exp(-decay × days_since)  — peso temporal exponencial

        Args:
            decisoes: Lista de dicts com 'resultado' e 'data_julgamento'.
            decay: Fator de decaimento temporal (padrão: 0.001).

        Returns:
            Score entre 0.0 e 100.0. Retorna 0.0 se não houver decisões.
        """
        if not decisoes:
            return 0.0

        soma_wi_ri = 0.0
        soma_wi = 0.0

        for d in decisoes:
            resultado = d.get("resultado", "")
            data = d.get("data_julgamento", "")

            ri = _score_for_resultado(resultado)
            days = _days_since(data)
            wi = math.exp(-decay * days)

            soma_wi_ri += wi * ri
            soma_wi += wi

        if soma_wi == 0:
            return 0.0

        return (soma_wi_ri / soma_wi) * 100.0

    # ------------------------------------------------------------------
    # IPT — Índice de Previsibilidade do Tribunal
    # ------------------------------------------------------------------

    def calcular_ipt(self, decisoes: list[dict]) -> float:
        """
        Calcula o Índice de Previsibilidade do Tribunal (IPT).

        IPT = 1 - (std_dev(scores) / mean(scores))

        Quanto mais próximo de 1, mais previsível o tribunal.
        Quanto mais próximo de 0, maior a variabilidade.

        Args:
            decisoes: Lista de dicts com campo 'resultado'.

        Returns:
            Valor entre 0.0 e 1.0. Retorna 0.0 se dados insuficientes.
        """
        if len(decisoes) < 2:
            return 0.0

        scores = [
            _score_for_resultado(d.get("resultado", ""))
            for d in decisoes
        ]

        mean_score = statistics.mean(scores)
        if mean_score == 0:
            return 0.0

        std_score = statistics.stdev(scores)
        coef_variacao = std_score / mean_score

        ipt = 1.0 - coef_variacao
        return max(0.0, min(1.0, ipt))

    # ------------------------------------------------------------------
    # TR — Taxa de Reforma
    # ------------------------------------------------------------------

    def calcular_tr(self, magistrado_decisoes: list[dict]) -> float:
        """
        Calcula a Taxa de Reforma (TR).

        TR = reformadas / total_apeladas × 100

        Uma decisão é considerada "reformada" quando o resultado em 2ª instância
        difere do resultado em 1ª instância.

        Args:
            magistrado_decisoes: Lista de dicts com campos
                'resultado_1a_instancia' e 'resultado_2a_instancia'.

        Returns:
            Taxa entre 0.0 e 100.0. Retorna 0.0 se não houver apelações.
        """
        if not magistrado_decisoes:
            return 0.0

        total_apeladas = 0
        reformadas = 0

        for d in magistrado_decisoes:
            r1 = d.get("resultado_1a_instancia", "").lower().strip()
            r2 = d.get("resultado_2a_instancia", "").lower().strip()

            # Apenas considerar decisões que têm ambos os resultados
            if r1 and r2:
                total_apeladas += 1
                if r1 != r2:
                    reformadas += 1

        if total_apeladas == 0:
            return 0.0

        return (reformadas / total_apeladas) * 100.0

    # ------------------------------------------------------------------
    # IAJ — Índice de Alinhamento Jurisprudencial
    # ------------------------------------------------------------------

    def calcular_iaj(
        self,
        decisoes: list[dict],
        jurisprudencia_superior: list[dict],
    ) -> float:
        """
        Calcula o Índice de Alinhamento Jurisprudencial (IAJ).

        Compara os resultados das decisões com a posição predominante
        dos tribunais superiores (STF/STJ) na mesma matéria.

        IAJ = aligned / total × 100

        Args:
            decisoes: Lista de decisões do tribunal/magistrado.
            jurisprudencia_superior: Lista de decisões de tribunais
                superiores para comparação.

        Returns:
            Percentual de alinhamento entre 0.0 e 100.0.
        """
        if not decisoes or not jurisprudencia_superior:
            return 0.0

        # Determinar posição predominante por matéria nos tribunais superiores
        posicao_superior: dict[str, str] = self._posicao_predominante(
            jurisprudencia_superior
        )

        if not posicao_superior:
            return 0.0

        total = 0
        aligned = 0

        for d in decisoes:
            materia = d.get("materia", d.get("assunto", "")).lower().strip()
            resultado = d.get("resultado", "").lower().strip()

            if not materia or not resultado:
                continue

            posicao = posicao_superior.get(materia)
            if posicao is None:
                continue

            total += 1
            resultado_score = _score_for_resultado(resultado)
            posicao_score = _score_for_resultado(posicao)

            # Alinhado se os scores são iguais ou ambos favoráveis/desfavoráveis
            if resultado_score == posicao_score:
                aligned += 1
            elif abs(resultado_score - posicao_score) <= 0.5:
                aligned += 0.5  # Parcialmente alinhado

        if total == 0:
            return 0.0

        return (aligned / total) * 100.0

    def _posicao_predominante(self, decisoes: list[dict]) -> dict[str, str]:
        """
        Determina a posição predominante por matéria em um conjunto de decisões.

        Returns:
            Dict {materia: resultado_predominante}
        """
        contagem: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))

        for d in decisoes:
            materia = d.get("materia", d.get("assunto", "")).lower().strip()
            resultado = d.get("resultado", "").lower().strip()
            if materia and resultado:
                contagem[materia][resultado] += 1

        posicao: dict[str, str] = {}
        for materia, resultados in contagem.items():
            if resultados:
                posicao[materia] = max(resultados, key=resultados.get)

        return posicao

    # ------------------------------------------------------------------
    # Perfil do Magistrado
    # ------------------------------------------------------------------

    def gerar_perfil_magistrado(
        self,
        magistrado_nome: str,
        decisoes: list[dict],
    ) -> dict:
        """
        Gera um perfil analítico completo de um magistrado.

        Args:
            magistrado_nome: Nome do magistrado.
            decisoes: Lista de decisões associadas ao magistrado.

        Returns:
            Dicionário com o perfil completo do magistrado.
        """
        if not decisoes:
            return {
                "nome": magistrado_nome,
                "total_decisoes": 0,
                "taxa_procedencia": 0.0,
                "taxa_improcedencia": 0.0,
                "taxa_parcial": 0.0,
                "tempo_medio_dias": 0.0,
                "materias": {},
                "tendencias": {},
                "set_global": 0.0,
                "ipt": 0.0,
            }

        total = len(decisoes)
        favoraveis = 0
        desfavoraveis = 0
        parciais = 0

        # Agrupar por matéria
        por_materia: dict[str, list[dict]] = defaultdict(list)

        # Tempo médio de tramitação
        tempos: list[float] = []

        for d in decisoes:
            resultado = d.get("resultado", "").lower().strip()

            if resultado in RESULTADOS_FAVORAVEIS:
                favoraveis += 1
            elif resultado in RESULTADOS_DESFAVORAVEIS:
                desfavoraveis += 1
            elif resultado in RESULTADOS_PARCIAIS:
                parciais += 1

            materia = d.get("materia", d.get("assunto", "Outros"))
            por_materia[materia].append(d)

            # Tempo de tramitação
            tempo = d.get("tempo_tramitacao_dias")
            if tempo and isinstance(tempo, (int, float)):
                tempos.append(float(tempo))

        # Taxas globais
        taxa_procedencia = (favoraveis / total) * 100.0 if total > 0 else 0.0
        taxa_improcedencia = (desfavoraveis / total) * 100.0 if total > 0 else 0.0
        taxa_parcial = (parciais / total) * 100.0 if total > 0 else 0.0

        # Tempo médio
        tempo_medio = statistics.mean(tempos) if tempos else 0.0

        # Análise por matéria
        materias_analise: dict[str, dict] = {}
        tendencias: dict[str, str] = {}

        for materia, mat_decisoes in por_materia.items():
            mat_total = len(mat_decisoes)
            mat_fav = sum(
                1
                for d in mat_decisoes
                if d.get("resultado", "").lower().strip() in RESULTADOS_FAVORAVEIS
            )
            mat_desf = sum(
                1
                for d in mat_decisoes
                if d.get("resultado", "").lower().strip() in RESULTADOS_DESFAVORAVEIS
            )
            mat_parc = sum(
                1
                for d in mat_decisoes
                if d.get("resultado", "").lower().strip() in RESULTADOS_PARCIAIS
            )

            procedencia_pct = (mat_fav / mat_total) * 100.0 if mat_total > 0 else 0.0

            materias_analise[materia] = {
                "total": mat_total,
                "procedencia": round(procedencia_pct, 1),
                "improcedencia": round(
                    (mat_desf / mat_total) * 100.0 if mat_total > 0 else 0.0, 1
                ),
                "parcial": round(
                    (mat_parc / mat_total) * 100.0 if mat_total > 0 else 0.0, 1
                ),
            }

            # Tendência do magistrado por matéria
            if procedencia_pct >= 65:
                tendencias[materia] = "liberal"
            elif procedencia_pct <= 35:
                tendencias[materia] = "conservador"
            else:
                tendencias[materia] = "moderado"

        return {
            "nome": magistrado_nome,
            "total_decisoes": total,
            "taxa_procedencia": round(taxa_procedencia, 1),
            "taxa_improcedencia": round(taxa_improcedencia, 1),
            "taxa_parcial": round(taxa_parcial, 1),
            "tempo_medio_dias": round(tempo_medio, 1),
            "materias": materias_analise,
            "tendencias": tendencias,
            "set_global": round(self.calcular_set(decisoes), 1),
            "ipt": round(self.calcular_ipt(decisoes), 3),
        }

    # ------------------------------------------------------------------
    # Simulação de Recurso
    # ------------------------------------------------------------------

    def simular_recurso(
        self,
        tipo_acao: str,
        materia: str,
        tribunal: str,
        decisoes: list[dict],
        magistrado_id: Optional[str] = None,
    ) -> dict:
        """
        Simula a probabilidade de êxito em um recurso judicial.

        Combina múltiplas métricas (SET, IPT, IAJ) com a análise de
        padrões em decisões históricas para estimar o score de êxito.

        Args:
            tipo_acao: Tipo da ação (ex.: 'apelação', 'recurso_especial').
            materia: Matéria do processo (ex.: 'Consumidor', 'Tributário').
            tribunal: Código do tribunal.
            decisoes: Lista de decisões históricas relevantes.
            magistrado_id: ID do magistrado (opcional, para análise direcionada).

        Returns:
            Dicionário com análise completa da simulação.
        """
        if not decisoes:
            return {
                "score_exito": 0.0,
                "confianca": "Baixa",
                "total_casos_analisados": 0,
                "teses_recomendadas": [],
                "pontos_favoraveis": [],
                "pontos_atencao": [],
                "jurisprudencia_relevante": [],
            }

        # Filtrar decisões relevantes por matéria
        decisoes_materia = [
            d
            for d in decisoes
            if materia.lower() in (d.get("materia", "") + d.get("assunto", "")).lower()
        ]

        if not decisoes_materia:
            decisoes_materia = decisoes  # Fallback: usar todas

        # Filtrar por magistrado se especificado
        if magistrado_id:
            decisoes_magistrado = [
                d
                for d in decisoes_materia
                if d.get("magistrado_id") == magistrado_id
                or d.get("relator_id") == magistrado_id
            ]
            if decisoes_magistrado:
                decisoes_materia = decisoes_magistrado

        total_analisados = len(decisoes_materia)

        # Calcular SET para a matéria
        set_score = self.calcular_set(decisoes_materia)

        # Calcular IPT
        ipt = self.calcular_ipt(decisoes_materia)

        # Score composto
        score_exito = set_score * 0.7 + (ipt * 100) * 0.3

        # Nível de confiança baseado na quantidade de dados
        if total_analisados >= CONFIANCA_THRESHOLDS["alta"]:
            confianca = "Alta"
        elif total_analisados >= CONFIANCA_THRESHOLDS["media"]:
            confianca = "Média"
        else:
            confianca = "Baixa"

        # Análise de pontos favoráveis e de atenção
        pontos_favoraveis = []
        pontos_atencao = []

        taxa_favoravel = sum(
            1
            for d in decisoes_materia
            if d.get("resultado", "").lower().strip() in RESULTADOS_FAVORAVEIS
        ) / max(total_analisados, 1) * 100

        if taxa_favoravel >= 60:
            pontos_favoraveis.append(
                f"Jurisprudência majoritariamente favorável ({taxa_favoravel:.0f}% de procedência)"
            )
        elif taxa_favoravel <= 30:
            pontos_atencao.append(
                f"Jurisprudência majoritariamente desfavorável ({taxa_favoravel:.0f}% de procedência)"
            )

        if ipt >= 0.7:
            pontos_favoraveis.append(
                f"Tribunal com alta previsibilidade (IPT={ipt:.2f})"
            )
        elif ipt <= 0.3:
            pontos_atencao.append(
                f"Tribunal com alta variabilidade decisória (IPT={ipt:.2f})"
            )

        if total_analisados < 10:
            pontos_atencao.append(
                f"Base de dados limitada ({total_analisados} decisões). "
                "Recomenda-se ampliar a pesquisa."
            )

        # Teses recomendadas (baseadas nos padrões de sucesso)
        teses_recomendadas = self._extrair_teses_recomendadas(decisoes_materia)

        # Jurisprudência relevante (últimas decisões favoráveis)
        jurisprudencia_relevante = self._selecionar_jurisprudencia_relevante(
            decisoes_materia
        )

        return {
            "score_exito": round(score_exito, 1),
            "confianca": confianca,
            "total_casos_analisados": total_analisados,
            "teses_recomendadas": teses_recomendadas,
            "pontos_favoraveis": pontos_favoraveis,
            "pontos_atencao": pontos_atencao,
            "jurisprudencia_relevante": jurisprudencia_relevante,
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _extrair_teses_recomendadas(self, decisoes: list[dict]) -> list[str]:
        """
        Extrai teses recomendadas com base nos padrões de decisões favoráveis.

        Agrupa as decisões favoráveis por temas recorrentes e sugere
        as teses com maior taxa de sucesso.
        """
        teses: dict[str, int] = defaultdict(int)

        for d in decisoes:
            resultado = d.get("resultado", "").lower().strip()
            if resultado in RESULTADOS_FAVORAVEIS or resultado in RESULTADOS_PARCIAIS:
                # Usar assunto/matéria como proxy de tese
                tese = d.get("tese", d.get("assunto", d.get("materia", "")))
                if tese:
                    teses[tese] += 1

        # Ordenar por frequência e retornar as top 5
        sorted_teses = sorted(teses.items(), key=lambda x: x[1], reverse=True)
        return [
            f"{tese} ({count} decisões favoráveis)"
            for tese, count in sorted_teses[:5]
        ]

    def _selecionar_jurisprudencia_relevante(
        self, decisoes: list[dict], max_items: int = 5
    ) -> list[dict]:
        """
        Seleciona as decisões mais relevantes como referência jurisprudencial.

        Prioriza decisões recentes e favoráveis.
        """
        # Ordenar por data (mais recentes primeiro)
        ordenadas = sorted(
            decisoes,
            key=lambda d: d.get("data_julgamento", ""),
            reverse=True,
        )

        # Priorizar favoráveis
        favoraveis = [
            d
            for d in ordenadas
            if d.get("resultado", "").lower().strip() in RESULTADOS_FAVORAVEIS
        ]

        selecionadas = favoraveis[:max_items]

        # Complementar com outras se necessário
        if len(selecionadas) < max_items:
            outros = [d for d in ordenadas if d not in selecionadas]
            selecionadas.extend(outros[: max_items - len(selecionadas)])

        return [
            {
                "processo": d.get("numero_processo", d.get("processo_numero", "")),
                "tribunal": d.get("tribunal", ""),
                "data": d.get("data_julgamento", ""),
                "resultado": d.get("resultado", ""),
                "ementa_resumo": (d.get("ementa", ""))[:200],
            }
            for d in selecionadas
        ]
