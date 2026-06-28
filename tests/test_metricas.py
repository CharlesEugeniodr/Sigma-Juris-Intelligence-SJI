"""
Tests for MIJCalculator — Métricas de Inteligência Judicial.

Covers: calcular_set, calcular_ipt, calcular_tr, calcular_iaj,
and edge cases (empty list, all favorable, all unfavorable).
"""

import math
import pytest
from datetime import datetime, timezone, timedelta

from server.mij.calculators.metricas import MIJCalculator, _score_for_resultado


# ---------------------------------------------------------------------------
# Fixtures / Sample data
# ---------------------------------------------------------------------------

@pytest.fixture
def calc():
    """Shared MIJCalculator instance."""
    return MIJCalculator()


def _iso_days_ago(n: int) -> str:
    """Return an ISO-8601 date string for *n* days ago."""
    return (datetime.now(timezone.utc) - timedelta(days=n)).strftime("%Y-%m-%d")


# Convenience helpers to build decisão dicts
def _decisao(resultado: str, days_ago: int = 30, materia: str = "consumidor"):
    return {
        "resultado": resultado,
        "data_julgamento": _iso_days_ago(days_ago),
        "materia": materia,
    }


def _decisao_reforma(r1: str, r2: str):
    return {
        "resultado_1a_instancia": r1,
        "resultado_2a_instancia": r2,
    }


# A realistic mixed sample set
SAMPLE_DECISOES = [
    _decisao("procedente", 10),
    _decisao("procedente", 30),
    _decisao("improcedente", 60),
    _decisao("parcialmente_procedente", 90),
    _decisao("desprovido", 120),
    _decisao("provido", 20),
]


# ---------------------------------------------------------------------------
# Helper function tests
# ---------------------------------------------------------------------------

class TestScoreForResultado:
    """Validate the resultado → numeric score mapping."""

    @pytest.mark.parametrize("resultado,expected", [
        ("procedente", 1.0),
        ("provido", 1.0),
        ("parcialmente_procedente", 0.5),
        ("parcial_provimento", 0.5),
        ("parcial", 0.5),
        ("improcedente", 0.0),
        ("desprovido", 0.0),
        ("não_conhecido", 0.0),
        ("nao_conhecido", 0.0),
    ])
    def test_known_results(self, resultado, expected):
        assert _score_for_resultado(resultado) == expected

    def test_unknown_result_defaults_to_zero(self):
        assert _score_for_resultado("algo_desconhecido") == 0.0

    def test_case_insensitive(self):
        assert _score_for_resultado("PROCEDENTE") == 1.0
        assert _score_for_resultado("  Provido  ") == 1.0


# ---------------------------------------------------------------------------
# SET — Score de Êxito por Tese
# ---------------------------------------------------------------------------

class TestCalcularSET:
    """Tests for MIJCalculator.calcular_set()"""

    def test_returns_float_between_0_and_100(self, calc):
        result = calc.calcular_set(SAMPLE_DECISOES)
        assert 0.0 <= result <= 100.0

    def test_all_favorable_gives_100(self, calc):
        decisoes = [_decisao("procedente", d) for d in (10, 30, 60)]
        assert calc.calcular_set(decisoes) == pytest.approx(100.0)

    def test_all_unfavorable_gives_0(self, calc):
        decisoes = [_decisao("improcedente", d) for d in (10, 30, 60)]
        assert calc.calcular_set(decisoes) == pytest.approx(0.0)

    def test_empty_list_returns_0(self, calc):
        assert calc.calcular_set([]) == 0.0

    def test_single_decision(self, calc):
        assert calc.calcular_set([_decisao("procedente", 0)]) == pytest.approx(100.0)

    def test_recent_decisions_weigh_more(self, calc):
        """A recent favorable + old unfavorable should score > 50."""
        decisoes = [
            _decisao("procedente", 1),      # very recent — high weight
            _decisao("improcedente", 3650),  # ~10 years ago — near-zero weight
        ]
        score = calc.calcular_set(decisoes)
        assert score > 50.0

    def test_mixed_results(self, calc):
        """50/50 procedente/improcedente same age ≈ 50."""
        decisoes = [
            _decisao("procedente", 30),
            _decisao("improcedente", 30),
        ]
        score = calc.calcular_set(decisoes)
        assert score == pytest.approx(50.0)

    def test_custom_decay(self, calc):
        """Higher decay punishes older decisions more heavily."""
        decisoes = [
            _decisao("procedente", 1),
            _decisao("improcedente", 365),
        ]
        score_low_decay = calc.calcular_set(decisoes, decay=0.0001)
        score_high_decay = calc.calcular_set(decisoes, decay=0.01)
        # With high decay the old unfavorable decision matters less → higher score
        assert score_high_decay > score_low_decay

    def test_partial_result_scores_half(self, calc):
        """A single parcialmente_procedente should yield ~50."""
        decisoes = [_decisao("parcialmente_procedente", 30)]
        assert calc.calcular_set(decisoes) == pytest.approx(50.0)


# ---------------------------------------------------------------------------
# IPT — Índice de Previsibilidade do Tribunal
# ---------------------------------------------------------------------------

class TestCalcularIPT:
    """Tests for MIJCalculator.calcular_ipt()"""

    def test_returns_float_between_0_and_1(self, calc):
        result = calc.calcular_ipt(SAMPLE_DECISOES)
        assert 0.0 <= result <= 1.0

    def test_uniform_results_give_high_ipt(self, calc):
        """All-same results → std=0 → IPT=1.0."""
        decisoes = [_decisao("procedente", d) for d in range(10, 60, 10)]
        assert calc.calcular_ipt(decisoes) == pytest.approx(1.0)

    def test_empty_list_returns_0(self, calc):
        assert calc.calcular_ipt([]) == 0.0

    def test_single_decision_returns_0(self, calc):
        """Need ≥ 2 decisions for std; single → 0.0."""
        assert calc.calcular_ipt([_decisao("procedente", 10)]) == 0.0

    def test_mixed_results_lower_ipt(self, calc):
        """Mixed procedente/improcedente → higher variability → lower IPT."""
        uniform = [_decisao("procedente", d) for d in (10, 20, 30, 40)]
        mixed = [
            _decisao("procedente", 10),
            _decisao("improcedente", 20),
            _decisao("procedente", 30),
            _decisao("improcedente", 40),
        ]
        assert calc.calcular_ipt(uniform) > calc.calcular_ipt(mixed)

    def test_all_unfavorable_with_same_zero_score(self, calc):
        """All scores = 0 → mean = 0 → early return 0.0 (avoid div-by-zero)."""
        decisoes = [_decisao("improcedente", d) for d in (10, 20, 30)]
        assert calc.calcular_ipt(decisoes) == 0.0


# ---------------------------------------------------------------------------
# TR — Taxa de Reforma
# ---------------------------------------------------------------------------

class TestCalcularTR:
    """Tests for MIJCalculator.calcular_tr()"""

    def test_no_reforms(self, calc):
        """All same outcome in both instances → 0% reform."""
        decisoes = [
            _decisao_reforma("procedente", "procedente"),
            _decisao_reforma("improcedente", "improcedente"),
        ]
        assert calc.calcular_tr(decisoes) == pytest.approx(0.0)

    def test_all_reformed(self, calc):
        """All outcomes changed → 100% reform."""
        decisoes = [
            _decisao_reforma("procedente", "improcedente"),
            _decisao_reforma("improcedente", "procedente"),
        ]
        assert calc.calcular_tr(decisoes) == pytest.approx(100.0)

    def test_half_reformed(self, calc):
        decisoes = [
            _decisao_reforma("procedente", "improcedente"),
            _decisao_reforma("procedente", "procedente"),
        ]
        assert calc.calcular_tr(decisoes) == pytest.approx(50.0)

    def test_empty_list_returns_0(self, calc):
        assert calc.calcular_tr([]) == 0.0

    def test_missing_second_instance_ignored(self, calc):
        """Entries without resultado_2a_instancia are skipped."""
        decisoes = [
            {"resultado_1a_instancia": "procedente", "resultado_2a_instancia": ""},
            _decisao_reforma("procedente", "improcedente"),
        ]
        # Only 1 valid appeal, and it was reformed → 100%
        assert calc.calcular_tr(decisoes) == pytest.approx(100.0)

    def test_returns_percentage_between_0_and_100(self, calc):
        decisoes = [
            _decisao_reforma("procedente", "improcedente"),
            _decisao_reforma("procedente", "procedente"),
            _decisao_reforma("improcedente", "procedente"),
        ]
        result = calc.calcular_tr(decisoes)
        assert 0.0 <= result <= 100.0


# ---------------------------------------------------------------------------
# IAJ — Índice de Alinhamento Jurisprudencial
# ---------------------------------------------------------------------------

class TestCalcularIAJ:
    """Tests for MIJCalculator.calcular_iaj()"""

    def test_fully_aligned(self, calc):
        """All decisions match superior court → 100%."""
        decisoes = [
            _decisao("procedente", 10, "consumidor"),
            _decisao("procedente", 20, "consumidor"),
        ]
        jurisprudencia_superior = [
            _decisao("procedente", 5, "consumidor"),
            _decisao("procedente", 15, "consumidor"),
        ]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        assert result == pytest.approx(100.0)

    def test_fully_misaligned(self, calc):
        """All decisions differ from superior court → 0%."""
        decisoes = [
            _decisao("improcedente", 10, "consumidor"),
            _decisao("improcedente", 20, "consumidor"),
        ]
        jurisprudencia_superior = [
            _decisao("procedente", 5, "consumidor"),
            _decisao("procedente", 15, "consumidor"),
        ]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        assert result == pytest.approx(0.0)

    def test_partial_alignment(self, calc):
        """Partial alignment scores between 0 and 100."""
        decisoes = [
            _decisao("procedente", 10, "consumidor"),
            _decisao("improcedente", 20, "consumidor"),
        ]
        jurisprudencia_superior = [
            _decisao("procedente", 5, "consumidor"),
        ]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        assert 0.0 < result < 100.0

    def test_partial_result_half_aligned(self, calc):
        """parcialmente_procedente vs procedente → 0.5 alignment."""
        decisoes = [
            _decisao("parcialmente_procedente", 10, "consumidor"),
        ]
        jurisprudencia_superior = [
            _decisao("procedente", 5, "consumidor"),
        ]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        assert result == pytest.approx(50.0)

    def test_empty_decisoes_returns_0(self, calc):
        assert calc.calcular_iaj([], [_decisao("procedente", 5)]) == 0.0

    def test_empty_jurisprudencia_returns_0(self, calc):
        assert calc.calcular_iaj([_decisao("procedente", 5)], []) == 0.0

    def test_no_matching_materia_returns_0(self, calc):
        """If matérias don't overlap, nothing to compare → 0%."""
        decisoes = [_decisao("procedente", 10, "tributário")]
        jurisprudencia_superior = [_decisao("procedente", 5, "trabalhista")]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        assert result == pytest.approx(0.0)

    def test_multiple_materias(self, calc):
        """IAJ works across several distinct matérias."""
        decisoes = [
            _decisao("procedente", 10, "consumidor"),
            _decisao("procedente", 20, "tributário"),
        ]
        jurisprudencia_superior = [
            _decisao("procedente", 5, "consumidor"),
            _decisao("improcedente", 5, "tributário"),
        ]
        result = calc.calcular_iaj(decisoes, jurisprudencia_superior)
        # consumidor aligned (1), tributário misaligned (0) → 50%
        assert result == pytest.approx(50.0)


# ---------------------------------------------------------------------------
# Edge-case: comprehensive scenarios
# ---------------------------------------------------------------------------

class TestEdgeCases:
    """Cross-cutting edge cases."""

    def test_all_methods_handle_empty_list(self, calc):
        assert calc.calcular_set([]) == 0.0
        assert calc.calcular_ipt([]) == 0.0
        assert calc.calcular_tr([]) == 0.0
        assert calc.calcular_iaj([], []) == 0.0

    def test_all_favorable_decisions(self, calc):
        decisoes = [_decisao("procedente", d) for d in (5, 15, 25, 35, 45)]
        assert calc.calcular_set(decisoes) == pytest.approx(100.0)
        assert calc.calcular_ipt(decisoes) == pytest.approx(1.0)

    def test_all_unfavorable_decisions(self, calc):
        decisoes = [_decisao("improcedente", d) for d in (5, 15, 25, 35, 45)]
        assert calc.calcular_set(decisoes) == pytest.approx(0.0)
        # IPT with all-zero scores → mean 0 → returns 0
        assert calc.calcular_ipt(decisoes) == 0.0

    def test_missing_resultado_field_treated_as_zero(self, calc):
        decisoes = [{"data_julgamento": _iso_days_ago(10)}]  # no 'resultado'
        assert calc.calcular_set(decisoes) == pytest.approx(0.0)

    def test_missing_date_uses_fallback(self, calc):
        decisoes = [{"resultado": "procedente"}]  # no date
        score = calc.calcular_set(decisoes)
        # Should still compute a valid score (fallback = 365 days)
        assert 0.0 <= score <= 100.0
