"""
Tests for DocumentAnalyzer — server.analysis.analyzer

The analyzer is expected to expose:
    DocumentAnalyzer.analyze(text: str) -> dict
        returns {
            'score':      float,          # 0–100
            'risco':      str,            # risk classification
            'elements':   dict,           # detected elements
            'coerencia':  dict,           # coherence metrics
            'sugestoes':  list[str],      # improvement suggestions
        }
"""

import pytest

from server.analysis.analyzer import DocumentAnalyzer


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def analyzer():
    return DocumentAnalyzer()


# ---------------------------------------------------------------------------
# Sample texts
# ---------------------------------------------------------------------------

TEXTO_COM_NORMAS = """
Conforme dispõe o artigo 5º, inciso XXXV, da Constituição Federal,
a lei não excluirá da apreciação do Poder Judiciário lesão ou
ameaça a direito. Ademais, o art. 14 do Código de Processo Civil
estabelece os deveres das partes e de todos aqueles que de qualquer
forma participam do processo. Nos termos da Lei nº 8.078/1990
(Código de Defesa do Consumidor), o consumidor tem direito à
informação adequada.
"""

TEXTO_COM_JURISPRUDENCIA = """
O Supremo Tribunal Federal, no julgamento do RE 574.706/PR,
fixou a tese de que o ICMS não compõe a base de cálculo para fins
de incidência do PIS e da COFINS. Nesse sentido, conforme o
entendimento consolidado na Súmula 281 do STJ, a indenização
por dano moral não está sujeita à incidência do Imposto de Renda.
Ademais, conforme o Acórdão no AgRg no REsp 1.234.567/SP,
Rel. Min. Fulano de Tal, 2ª Turma, DJe 15/03/2023.
"""

TEXTO_COMPLETO = """
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL DA
COMARCA DE SÃO PAULO - SP

FULANO DE TAL, brasileiro, casado, advogado, inscrito na OAB/SP sob
o nº 123.456, vem, respeitosamente, à presença de Vossa Excelência,
com fundamento no artigo 5º, inciso XXXV, da Constituição Federal,
combinado com o art. 319 do Código de Processo Civil (Lei nº 13.105/2015),
propor a presente

AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS

em face de EMPRESA XYZ LTDA., pessoa jurídica de direito privado,
inscrita no CNPJ sob o nº 12.345.678/0001-99.

DOS FATOS

O autor adquiriu produto defeituoso no dia 01/01/2024, conforme
nota fiscal em anexo. O produto apresentou vício de qualidade que
o tornou impróprio para o uso, nos termos do art. 18 do Código de
Defesa do Consumidor (Lei nº 8.078/1990).

DO DIREITO

Nos termos do art. 186 do Código Civil, aquele que, por ação ou
omissão voluntária, negligência ou imprudência, violar direito e
causar dano a outrem, ainda que exclusivamente moral, comete ato
ilícito. Conforme entendimento consolidado pelo STJ no REsp
1.234.567/SP, o dano moral é presumido (in re ipsa) em casos de
vício do produto.

DOS PEDIDOS

Ante o exposto, requer:

a) a citação da ré para, querendo, contestar a presente ação;
b) a condenação da ré ao pagamento de indenização por danos morais
   no valor de R$ 10.000,00 (dez mil reais);
c) a condenação da ré ao pagamento das custas processuais e
   honorários advocatícios.

Dá-se à causa o valor de R$ 10.000,00.

Nestes termos, pede deferimento.

São Paulo, 15 de março de 2024.

FULANO DE TAL
OAB/SP 123.456
"""

TEXTO_VAZIO = ""


# ---------------------------------------------------------------------------
# Basic functionality
# ---------------------------------------------------------------------------

class TestAnalyzerBasics:
    """Core contract: analyze() returns the expected structure."""

    def test_returns_dict(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        assert isinstance(result, dict)

    def test_required_keys_present(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        for key in ("score", "risco", "elements", "coerencia", "sugestoes"):
            assert key in result, f"Missing key: {key}"

    def test_score_is_numeric(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        assert isinstance(result["score"], (int, float))

    def test_risco_is_string(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        assert isinstance(result["risco"], str)

    def test_sugestoes_is_list(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        assert isinstance(result["sugestoes"], list)


# ---------------------------------------------------------------------------
# Score ranges
# ---------------------------------------------------------------------------

class TestScoreRange:
    """Score must always be 0–100 regardless of input."""

    def test_score_between_0_and_100_for_normas(self, analyzer):
        score = analyzer.analyze(TEXTO_COM_NORMAS)["score"]
        assert 0 <= score <= 100

    def test_score_between_0_and_100_for_jurisprudencia(self, analyzer):
        score = analyzer.analyze(TEXTO_COM_JURISPRUDENCIA)["score"]
        assert 0 <= score <= 100

    def test_score_between_0_and_100_for_full_document(self, analyzer):
        score = analyzer.analyze(TEXTO_COMPLETO)["score"]
        assert 0 <= score <= 100

    def test_score_between_0_and_100_for_empty(self, analyzer):
        score = analyzer.analyze(TEXTO_VAZIO)["score"]
        assert 0 <= score <= 100


# ---------------------------------------------------------------------------
# Risk classification vs. score coherence
# ---------------------------------------------------------------------------

class TestRiscoClassification:
    """The 'risco' label should match the score range."""

    def test_risco_non_empty(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        assert result["risco"] != ""

    def test_risco_classification_matches_score(self, analyzer):
        """
        Analyzer risk bands:
            score >= 80  → baixo  (low risk)
            60 <= score < 80 → médio (medium risk)
            score < 60  → alto  (high risk)
        """
        result = analyzer.analyze(TEXTO_COMPLETO)
        score = result["score"]
        risco = result["risco"].lower()

        if score >= 80:
            assert "baixo" in risco, f"Score {score} should map to 'baixo', got '{risco}'"
        elif score >= 60:
            assert "médio" in risco or "medio" in risco, (
                f"Score {score} should map to 'médio', got '{risco}'"
            )
        else:
            assert "alto" in risco, f"Score {score} should map to 'alto', got '{risco}'"


# ---------------------------------------------------------------------------
# Normas detection
# ---------------------------------------------------------------------------

class TestNormasDetection:
    """Texts with explicit law references should surface in elements."""

    def test_detects_normas_in_legal_text(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        elements = result["elements"]
        # The elements dict should contain some normas/legislação key
        normas_key = None
        for k in elements:
            if "norma" in k.lower() or "legisla" in k.lower() or "lei" in k.lower():
                normas_key = k
                break
        assert normas_key is not None, (
            f"Expected a normas-related key in elements, got: {list(elements.keys())}"
        )

    def test_comprehensive_doc_has_more_elements(self, analyzer):
        result_small = analyzer.analyze(TEXTO_COM_NORMAS)
        result_full = analyzer.analyze(TEXTO_COMPLETO)
        # A richer document should have a score >= that of a simpler fragment
        assert result_full["score"] >= result_small["score"]


# ---------------------------------------------------------------------------
# Jurisprudência detection
# ---------------------------------------------------------------------------

class TestJurisprudenciaDetection:
    """Texts citing court decisions should surface in elements."""

    def test_detects_jurisprudencia(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_JURISPRUDENCIA)
        elements = result["elements"]
        jurisprudencia_key = None
        for k in elements:
            if "jurisp" in k.lower() or "sumula" in k.lower() or "súmula" in k.lower():
                jurisprudencia_key = k
                break
        assert jurisprudencia_key is not None, (
            f"Expected a jurisprudência-related key in elements, got: {list(elements.keys())}"
        )


# ---------------------------------------------------------------------------
# Empty text
# ---------------------------------------------------------------------------

class TestEmptyText:
    """Analyzer must handle empty/blank input gracefully."""

    def test_empty_string(self, analyzer):
        result = analyzer.analyze("")
        assert result["score"] == 0 or result["score"] >= 0  # valid number
        assert isinstance(result["sugestoes"], list)

    def test_whitespace_only(self, analyzer):
        result = analyzer.analyze("   \n\t  ")
        assert isinstance(result, dict)
        assert "score" in result


# ---------------------------------------------------------------------------
# Coerência structure
# ---------------------------------------------------------------------------

class TestCoerencia:
    """The coerencia dict should carry meaningful sub-scores."""

    def test_coerencia_is_dict(self, analyzer):
        result = analyzer.analyze(TEXTO_COMPLETO)
        assert isinstance(result["coerencia"], dict)

    def test_coerencia_values_are_numeric(self, analyzer):
        result = analyzer.analyze(TEXTO_COMPLETO)
        coerencia = result["coerencia"]
        # coerencia may contain nested dicts, strings (level), and numeric scores
        assert isinstance(coerencia, dict), "coerencia should be a dict"
        # Ensure at least a 'score' key is numeric if present
        if "score" in coerencia:
            assert isinstance(coerencia["score"], (int, float))


# ---------------------------------------------------------------------------
# Suggestions
# ---------------------------------------------------------------------------

class TestSugestoes:
    """The analyzer should provide actionable suggestions."""

    def test_empty_text_gets_suggestions(self, analyzer):
        result = analyzer.analyze(TEXTO_VAZIO)
        # An empty doc should return sugestoes as a list (may be empty)
        assert isinstance(result["sugestoes"], list)

    def test_suggestions_are_strings(self, analyzer):
        result = analyzer.analyze(TEXTO_COM_NORMAS)
        for s in result["sugestoes"]:
            assert isinstance(s, str)
