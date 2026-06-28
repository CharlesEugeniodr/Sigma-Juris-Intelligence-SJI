"""
SJIF Document Analyzer — Backend Analysis Engine
=================================================
Python port of the frontend SJIFAnalyzer (app/js/analyzer.js).

Extracts 9 legal-document elements (Diretiva Mestra), calculates
MCJ (Motor de Coerência Jurídica) coherence scores, and generates
actionable recommendations.

Element extraction uses regex patterns ported 1-to-1 from the JS
version so that frontend and backend produce consistent results.
"""

from __future__ import annotations

import re
import unicodedata
from datetime import datetime, timezone
from typing import Any


# ─── Accent Removal Utility ─────────────────────────────────────────

_ACCENT_MAP = str.maketrans(
    "áàâãäéèêëíìîïóòôõöúùûüçñ",
    "aaaaaeeeeiiiiooooouuuucn",
)


def _remove_accents(text: str) -> str:
    return text.translate(_ACCENT_MAP)


def _normalize(text: str) -> str:
    """Lower-case + strip accents (mirrors JS ``normalize``)."""
    if not text:
        return ""
    return _remove_accents(text.lower())


# ─── Known Brazilian Legal Scholars ──────────────────────────────────

_SCHOLARS = [
    "Pontes de Miranda", "Clóvis Beviláqua", "Rui Barbosa",
    "Hely Lopes Meirelles", "Celso Antônio Bandeira de Mello",
    "Maria Sylvia Zanella Di Pietro", "José Afonso da Silva",
    "Caio Mário", "Orlando Gomes", "Silvio Rodrigues",
    "Washington de Barros Monteiro", "Flávio Tartuce",
    "Nelson Nery", "Fredie Didier", "Humberto Theodoro Júnior",
    "Cândido Rangel Dinamarco", "Ada Pellegrini Grinover",
    "Luiz Guilherme Marinoni", "Daniel Amorim Assumpção Neves",
    "Alexandre de Moraes", "Gilmar Mendes", "Paulo Bonavides",
    "Luís Roberto Barroso", "Ingo Wolfgang Sarlet",
    "Cezar Roberto Bitencourt", "Rogério Greco",
    "Fernando Capez", "Julio Fabbrini Mirabete",
    "Sérgio Pinto Martins", "Maurício Godinho Delgado",
    "Vólia Bomfim Cassar", "Renato Saraiva",
    "Hugo de Brito Machado", "Eduardo Sabbag",
    "Paulo de Barros Carvalho", "Luiz Felipe Silveira Difini",
]


# ─── DocumentAnalyzer ───────────────────────────────────────────────

class DocumentAnalyzer:
    """
    Full SJIF analysis engine.

    Usage::

        analyzer = DocumentAnalyzer()
        result   = analyzer.analyze(document_text)
    """

    # MCJ criteria weights (must sum to 1.0)
    _MCJ_WEIGHTS: dict[str, float] = {
        "consistenciaLogica":          0.20,
        "adequacaoNormativa":          0.20,
        "suficienciaProbatoria":       0.15,
        "coerenciaArgumentativa":      0.20,
        "pertinenciaJurisprudencial":  0.10,
        "clarezaRedacional":           0.15,
    }

    # Element weights for overall score (must sum to 1.0)
    _ELEMENT_WEIGHTS: dict[str, float] = {
        "fatos":           0.15,
        "provas":          0.12,
        "hipoteses":       0.08,
        "inferencias":     0.10,
        "normas":          0.18,
        "jurisprudencia":  0.12,
        "doutrina":        0.05,
        "conclusao":       0.12,
        "recomendacao":    0.08,
    }

    # ── public API ──────────────────────────────────────────────────

    def analyze(self, text: str) -> dict[str, Any]:
        """
        Run the full 9-element + MCJ analysis.

        Returns a dict with keys:
            score, risco, elements, coerencia, sugestoes,
            strengths, weaknesses, analisado_em
        """
        if not text or not isinstance(text, str):
            return self._empty_result()

        normalized = _normalize(text)

        # 1. Extract 9 elements
        elements: dict[str, dict] = {
            "fatos":           self._extract_fatos(text, normalized),
            "provas":          self._extract_provas(text, normalized),
            "hipoteses":       self._extract_hipoteses(text, normalized),
            "inferencias":     self._extract_inferencias(text, normalized),
            "normas":          self._extract_normas(text, normalized),
            "jurisprudencia":  self._extract_jurisprudencia(text, normalized),
            "doutrina":        self._extract_doutrina(text, normalized),
            "conclusao":       self._extract_conclusao(text, normalized),
            "recomendacao":    self._extract_recomendacao(text, normalized),
        }

        # 2. Extract entities (used by MCJ scoring)
        entities = self._extract_entities(text)

        # 3. MCJ coherence
        coerencia = self._calculate_coerencia(elements, entities, normalized)

        # 4. Overall score = elementScore * 0.6 + coerenciaScore * 0.4
        element_score = self._calculate_element_score(elements)
        overall_score = round(element_score * 0.6 + coerencia["score"] * 0.4)

        # 5. Risk level
        risco = self._risk_level(overall_score)

        # 6. Recommendations / strengths / weaknesses
        sugestoes  = self._generate_recommendations(elements, coerencia)
        strengths  = self._generate_strengths(elements, coerencia)
        weaknesses = self._generate_weaknesses(elements, coerencia)

        return {
            "score":       overall_score,
            "risco":       risco,
            "elements":    elements,
            "coerencia":   coerencia,
            "sugestoes":   [s["text"] for s in sugestoes],
            "strengths":   strengths,
            "weaknesses":  weaknesses,
            "analisado_em": datetime.now(timezone.utc).isoformat(),
        }

    # ── Empty / fallback result ─────────────────────────────────────

    @staticmethod
    def _empty_result() -> dict[str, Any]:
        empty_elem = {"found": False, "count": 0, "items": [], "score": 0}
        return {
            "score": 0,
            "risco": "alto",
            "elements": {k: dict(empty_elem) for k in [
                "fatos", "provas", "hipoteses", "inferencias", "normas",
                "jurisprudencia", "doutrina", "conclusao", "recomendacao",
            ]},
            "coerencia": {
                "score": 0,
                "criteria": {
                    "consistenciaLogica": 0,
                    "adequacaoNormativa": 0,
                    "suficienciaProbatoria": 0,
                    "coerenciaArgumentativa": 0,
                    "pertinenciaJurisprudencial": 0,
                    "clarezaRedacional": 0,
                },
                "level": "Crítico",
            },
            "sugestoes": [],
            "strengths": [],
            "weaknesses": [],
            "analisado_em": datetime.now(timezone.utc).isoformat(),
        }

    # ── Risk level helper ───────────────────────────────────────────

    @staticmethod
    def _risk_level(score: int) -> str:
        if score >= 80:
            return "baixo"
        if score >= 60:
            return "médio"
        return "alto"

    # ── Score label (mirrors JS _getScoreLabel) ─────────────────────

    @staticmethod
    def _score_label(score: int) -> str:
        if score >= 85:
            return "Excelente"
        if score >= 70:
            return "Bom"
        if score >= 50:
            return "Satisfatório"
        if score >= 30:
            return "Insuficiente"
        return "Crítico"

    # ─── Helper: collect regex matches ──────────────────────────────

    @staticmethod
    def _collect(
        patterns: list[re.Pattern],
        text: str,
        item_type: str,
        *,
        max_per_pattern: int = 5,
    ) -> list[dict[str, str]]:
        """Run *patterns* against *text*, return list of item dicts."""
        items: list[dict[str, str]] = []
        for pat in patterns:
            for i, m in enumerate(pat.finditer(text)):
                if i >= max_per_pattern:
                    break
                items.append({"text": m.group(0).strip(), "type": item_type})
        return items

    @staticmethod
    def _element_result(items: list[dict], multiplier: int) -> dict:
        """Build standard element dict from items list."""
        score = min(100, len(items) * multiplier)
        return {
            "found": len(items) > 0,
            "count": len(items),
            "items": items,
            "score": score,
        }

    # ═══════════════════════════════════════════════════════════════
    #  ELEMENT EXTRACTION (9 elements)
    # ═══════════════════════════════════════════════════════════════

    # 1. FATOS ────────────────────────────────────────────────────────

    def _extract_fatos(self, text: str, normalized: str) -> dict:
        items: list[dict] = []

        # Date-anchored factual statements
        date_fact = re.compile(
            r'(?:em|no dia|na data de|desde)\s+\d{1,2}[/.]\d{1,2}[/.]\d{2,4}[^.;]*[.;]',
            re.IGNORECASE,
        )
        for m in date_fact.finditer(text):
            items.append({"text": m.group(0).strip(), "type": "fato_temporal"})

        # Narrative fact indicators
        fact_patterns = [
            re.compile(
                r'(?:ocorreu que|o fato [eé] que|verificou-se que|constatou-se que|sucede que|acontece que)[^.;]+[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:o autor|a autora|o requerente|a requerente|o impetrante|a impetrante)\s+[^.;]{10,}[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:o r[eé]u|a r[eé]|o requerido|a requerida|o impetrado|a impetrada)\s+[^.;]{10,}[.;]',
                re.IGNORECASE,
            ),
        ]
        for pat in fact_patterns:
            for i, m in enumerate(pat.finditer(text)):
                if i >= 5:
                    break
                items.append({"text": m.group(0).strip(), "type": "fato_narrativo"})

        # Section header
        if re.search(r'dos?\s+fatos', text, re.IGNORECASE):
            items.append({"text": 'Seção "DOS FATOS" identificada', "type": "secao"})

        return self._element_result(items, 15)

    # 2. PROVAS ───────────────────────────────────────────────────────

    def _extract_provas(self, text: str, normalized: str) -> dict:
        items: list[dict] = []

        # Documentary evidence
        doc_patterns = [
            re.compile(
                r'(?:documento|doc\.|docs?\s*\d|anexo|fls?\.?\s*\d|p[aá]g(?:ina)?\.?\s*\d)[^.;]*[.;]?',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:prova\s+(?:documental|testemunhal|pericial|emprestada))[^.;]*[.;]?',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:conforme|consoante|segundo|de acordo com)\s+(?:documento|doc\.|prova|laudo|perícia|pericia)[^.;]*[.;]?',
                re.IGNORECASE,
            ),
            re.compile(r'(?:juntada|acostada|anexada)\s+[^.;]*[.;]?', re.IGNORECASE),
        ]
        for pat in doc_patterns:
            for i, m in enumerate(pat.finditer(text)):
                if i >= 5:
                    break
                items.append({"text": m.group(0).strip(), "type": "prova_documental"})

        # Witness references
        witness_pat = re.compile(
            r'(?:testemunha|depoimento|oitiva|inquirição|inquiricao)[^.;]*[.;]?',
            re.IGNORECASE,
        )
        for i, m in enumerate(witness_pat.finditer(text)):
            if i >= 3:
                break
            items.append({"text": m.group(0).strip(), "type": "prova_testemunhal"})

        # Expert evidence
        expert_pat = re.compile(
            r'(?:per[ií]cia|laudo\s+(?:pericial|t[eé]cnico)|assistente\s+t[eé]cnico|perito)[^.;]*[.;]?',
            re.IGNORECASE,
        )
        for i, m in enumerate(expert_pat.finditer(text)):
            if i >= 3:
                break
            items.append({"text": m.group(0).strip(), "type": "prova_pericial"})

        # Section header
        if re.search(r'das?\s+provas', text, re.IGNORECASE):
            items.append({"text": 'Seção "DAS PROVAS" identificada', "type": "secao"})

        return self._element_result(items, 12)

    # 3. HIPÓTESES ────────────────────────────────────────────────────

    def _extract_hipoteses(self, text: str, normalized: str) -> dict:
        patterns = [
            re.compile(
                r'(?:hip[oó]tese|supondo|caso\s+seja|se\s+for\s+o\s+caso|eventualmente|subsidiariamente|alternativamente)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:na\s+hip[oó]tese\s+de|em\s+caso\s+de|acaso|porventura)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:ad\s+argumentandum|ainda\s+que|mesmo\s+que|caso\s+se\s+entenda)[^.;]*[.;]',
                re.IGNORECASE,
            ),
        ]
        items = self._collect(patterns, text, "hipotese")
        return self._element_result(items, 20)

    # 4. INFERÊNCIAS ──────────────────────────────────────────────────

    def _extract_inferencias(self, text: str, normalized: str) -> dict:
        patterns = [
            re.compile(
                r'(?:portanto|logo|destarte|dessarte|por conseguinte|consequentemente|assim sendo|desse modo|nesse sentido)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:conclui-se|infere-se|depreende-se|verifica-se|resta\s+(?:claro|evidente|demonstrado))[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:diante\s+(?:do\s+exposto|disso)|ante\s+o\s+exposto|[àa]\s+luz\s+d[oa]s?\s+fatos)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:razão\s+pela\s+qual|motivo\s+pelo\s+qual|é\s+por\s+isso\s+que)[^.;]*[.;]',
                re.IGNORECASE,
            ),
        ]
        items = self._collect(patterns, text, "inferencia")
        return self._element_result(items, 18)

    # 5. NORMAS ───────────────────────────────────────────────────────

    def _extract_normas(self, text: str, normalized: str) -> dict:
        items: list[dict] = []
        seen: set[str] = set()

        def _add_unique(match_text: str, item_type: str) -> None:
            key = match_text.strip().lower()
            if key not in seen:
                seen.add(key)
                items.append({"text": match_text.strip(), "type": item_type})

        # Art. NN patterns
        art_pat = re.compile(
            r'art(?:igo)?\.?\s*\d[\d.]*[º°]?'
            r'(?:\s*,?\s*(?:§|par[aá]grafo)\s*(?:[úu]nico|\d+[º°]?))?'
            r'(?:\s*,?\s*(?:inciso\s+)?[IVXLCDM]+)?'
            r'(?:\s*,?\s*(?:al[ií]nea\s+)?["\']?[a-z]["\']?)?',
            re.IGNORECASE,
        )
        for m in art_pat.finditer(text):
            _add_unique(m.group(0), "artigo")

        # Lei nº patterns
        lei_pat = re.compile(
            r'lei\s+(?:n[º°.]?\s*)?[\d.]+(?:/\d{2,4})?',
            re.IGNORECASE,
        )
        for m in lei_pat.finditer(text):
            _add_unique(m.group(0), "lei")

        # Constitution references
        cf_pat = re.compile(
            r'(?:constitui[çc][ãa]o\s+(?:federal|da\s+rep[úu]blica)?|cf/?(?:88|1988)?)',
            re.IGNORECASE,
        )
        for m in cf_pat.finditer(text):
            _add_unique(m.group(0), "constituicao")

        # Codes (CPC, CPP, CC, CP, CLT, CTN, CDC, ECA, etc.)
        code_pat = re.compile(
            r'\b(?:c[oó]digo\s+(?:de\s+)?(?:processo\s+civil|processo\s+penal|civil|penal'
            r'|tribut[aá]rio\s+nacional|defesa\s+do\s+consumidor|trabalho)'
            r'|cpc(?:/\d{2,4})?|cpp|cc(?:/\d{2,4})?|cp\b|clt|ctn|cdc|eca)\b',
            re.IGNORECASE,
        )
        for m in code_pat.finditer(text):
            _add_unique(m.group(0), "codigo")

        # Decreto patterns
        decreto_pat = re.compile(
            r'decreto(?:-lei)?\s+(?:n[º°.]?\s*)?[\d.]+(?:/\d{2,4})?',
            re.IGNORECASE,
        )
        for m in decreto_pat.finditer(text):
            _add_unique(m.group(0), "decreto")

        # Resolução, Portaria, Instrução Normativa, Súmula Vinculante, MP, EC
        admin_pat = re.compile(
            r'(?:resolu[çc][ãa]o|portaria|instru[çc][ãa]o\s+normativa'
            r'|s[úu]mula\s+vinculante|medida\s+provis[oó]ria'
            r'|emenda\s+constitucional)\s+(?:n[º°.]?\s*)?[\d.]+(?:/\d{2,4})?',
            re.IGNORECASE,
        )
        for m in admin_pat.finditer(text):
            _add_unique(m.group(0), "norma_administrativa")

        # Section header
        if re.search(r'd[oa]s?\s+direito', text, re.IGNORECASE) or \
           re.search(r'd[oa]\s+fundamenta[çc][ãa]o\s+jur[ií]dica', text, re.IGNORECASE):
            items.append({"text": "Seção de fundamentação jurídica identificada", "type": "secao"})

        return self._element_result(items, 8)

    # 6. JURISPRUDÊNCIA ───────────────────────────────────────────────

    def _extract_jurisprudencia(self, text: str, normalized: str) -> dict:
        items: list[dict] = []
        seen: set[str] = set()

        # Court abbreviations + case numbers
        court_pat = re.compile(
            r'(?:STF|STJ|TST|TSE|STM|TJ[A-Z]{0,2}|TRF[\s-]?\d|TRT[\s-]?\d{1,2}|TRE[\s-]?[A-Z]{2})'
            r'\s*[,.]?\s*(?:[\w\s]*?\d[\d./\-]*)?',
        )
        for m in court_pat.finditer(text):
            key = m.group(0).strip()
            if len(key) > 3 and key.lower() not in seen:
                items.append({"text": key, "type": "jurisprudencia_tribunal"})
                seen.add(key.lower())

        # Súmula references
        sumula_pat = re.compile(
            r's[úu]mula\s+(?:vinculante\s+)?(?:n[º°.]?\s*)?\d+(?:\s+d[oa]\s+\w+)?',
            re.IGNORECASE,
        )
        for m in sumula_pat.finditer(text):
            key = m.group(0).strip().lower()
            if key not in seen:
                items.append({"text": m.group(0).strip(), "type": "sumula"})
                seen.add(key)

        # Specific action types (ADI, ADPF, RE, REsp, etc.)
        action_pat = re.compile(
            r'\b(?:ADI|ADPF|ADC|RE|REsp|AgRg|AgInt|RMS|RHC|HC|MS|MC|AC|AI|RCL|ED|EDiv)'
            r'\s+(?:n[º°.]?\s*)?[\d./\-]+',
        )
        for m in action_pat.finditer(text):
            key = m.group(0).strip().lower()
            if key not in seen:
                items.append({"text": m.group(0).strip(), "type": "acao_jurisprudencial"})
                seen.add(key)

        # Relator (Judge/Reporter references)
        relator_pat = re.compile(
            r'(?:rel(?:ator)?\.?\s*:?\s*min(?:istro)?\.?\s*'
            r'|rel(?:ator)?\.?\s*:?\s*des(?:embargador)?\.?\s*)[^,;.\n]+',
            re.IGNORECASE,
        )
        for i, m in enumerate(relator_pat.finditer(text)):
            if i >= 5:
                break
            items.append({"text": m.group(0).strip(), "type": "relator"})

        # Published case references (DJe, DJU)
        dj_pat = re.compile(
            r'(?:DJe?|DJ[Uu])\s+(?:de\s+)?\d{1,2}[/.]\d{1,2}[/.]\d{2,4}',
            re.IGNORECASE,
        )
        for m in dj_pat.finditer(text):
            items.append({"text": m.group(0).strip(), "type": "publicacao"})

        return self._element_result(items, 10)

    # 7. DOUTRINA ─────────────────────────────────────────────────────

    def _extract_doutrina(self, text: str, normalized: str) -> dict:
        items: list[dict] = []

        # Known scholars
        for scholar in _SCHOLARS:
            if scholar in text or _normalize(scholar) in normalized:
                items.append({"text": scholar, "type": "doutrinador"})

        # Academic citations: (SURNAME, year) or (SURNAME, year, p. N)
        citation_pat = re.compile(
            r'\(\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ]+'
            r'(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)?'
            r',\s*\d{4}'
            r'(?:\s*,\s*p\.?\s*\d+(?:-\d+)?)?'
            r'\s*\)',
        )
        for m in citation_pat.finditer(text):
            items.append({"text": m.group(0).strip(), "type": "citacao_academica"})

        # Book/work references
        book_pat = re.compile(
            r'(?:in|apud|cf\.)\s+[^.;,]{5,}(?:\.\s*\d+[ªaº]?\s*ed)',
            re.IGNORECASE,
        )
        for i, m in enumerate(book_pat.finditer(text)):
            if i >= 5:
                break
            items.append({"text": m.group(0).strip(), "type": "obra"})

        # Doctrine references
        doctrine_ref_pat = re.compile(
            r'(?:segundo\s+a\s+doutrina'
            r'|a\s+doutrina\s+(?:ensina|maj?orit[aá]ria|minorit[aá]ria|moderna|cl[aá]ssica)'
            r'|na\s+li[çc][ãa]o\s+de|nas\s+palavras\s+de|conforme\s+ensina)[^.;]*[.;]',
            re.IGNORECASE,
        )
        for i, m in enumerate(doctrine_ref_pat.finditer(text)):
            if i >= 5:
                break
            items.append({"text": m.group(0).strip(), "type": "referencia_doutrinaria"})

        return self._element_result(items, 15)

    # 8. CONCLUSÃO ────────────────────────────────────────────────────

    def _extract_conclusao(self, text: str, normalized: str) -> dict:
        items: list[dict] = []

        conclusao_patterns = [
            re.compile(
                r'(?:ante\s+o\s+exposto|diante\s+do\s+exposto|ex\s+positis'
                r'|por\s+todo\s+o\s+exposto|face\s+ao\s+exposto'
                r'|pelo\s+exposto|em\s+face\s+do\s+exposto)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:requer(?:-se)?|pugna|postula|pleiteia)\s+[^.;]*'
                r'(?:proced[eê]ncia|improced[eê]ncia|deferimento|provimento'
                r'|concess[ãa]o|condenação|condenacao)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:termos\s+em\s+que|nestes\s+termos)\s*[,.]?\s*(?:pede\s+)?deferimento',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:isto\s+posto|por\s+tudo\s+isso|em\s+conclus[ãa]o|em\s+suma|em\s+s[ií]ntese)[^.;]*[.;]',
                re.IGNORECASE,
            ),
        ]
        for pat in conclusao_patterns:
            for i, m in enumerate(pat.finditer(text)):
                if i >= 5:
                    break
                items.append({"text": m.group(0).strip(), "type": "conclusao"})

        # Pedido section
        pedido_pat = re.compile(
            r'(?:dos?\s+pedidos?|requer(?:-se)?(?:\s+a\s+este\s+ju[ií]zo)?)\s*:?\s*\n([\s\S]*?)(?:\n\s*\n|\Z)',
            re.IGNORECASE,
        )
        for i, m in enumerate(pedido_pat.finditer(text)):
            if i >= 3:
                break
            items.append({"text": m.group(0).strip()[:200], "type": "pedido"})

        return self._element_result(items, 20)

    # 9. RECOMENDAÇÃO ─────────────────────────────────────────────────

    def _extract_recomendacao(self, text: str, normalized: str) -> dict:
        patterns = [
            re.compile(
                r'(?:recomenda-se|sugere-se|aconselha-se|orienta-se|prop[oõ]e-se)[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:o\s+parecer\s+[eé]\s+(?:pelo|pela|no\s+sentido)|opina-se\s+(?:pelo|pela|no\s+sentido))[^.;]*[.;]',
                re.IGNORECASE,
            ),
            re.compile(
                r'(?:deve(?:-se)?|dever[aá]|convém|cabe|cumpre|impõe-se|faz-se\s+necess[aá]rio)[^.;]*[.;]',
                re.IGNORECASE,
            ),
        ]
        items = self._collect(patterns, text, "recomendacao")
        return self._element_result(items, 25)

    # ═══════════════════════════════════════════════════════════════
    #  ENTITY EXTRACTION (used by MCJ)
    # ═══════════════════════════════════════════════════════════════

    def _extract_entities(self, text: str) -> dict:
        return {
            "tribunais": self._extract_tribunais(text),
        }

    def _extract_tribunais(self, text: str) -> list[str]:
        """Extract court names referenced in the text."""
        tribunais: list[str] = []
        seen: set[str] = set()

        named_courts = [
            (re.compile(r'\bSTF\b|Supremo\s+Tribunal\s+Federal', re.IGNORECASE), "STF"),
            (re.compile(r'\bSTJ\b|Superior\s+Tribunal\s+de\s+Justi[çc]a', re.IGNORECASE), "STJ"),
            (re.compile(r'\bTST\b|Tribunal\s+Superior\s+do\s+Trabalho', re.IGNORECASE), "TST"),
            (re.compile(r'\bTSE\b|Tribunal\s+Superior\s+Eleitoral', re.IGNORECASE), "TSE"),
            (re.compile(r'\bSTM\b|Superior\s+Tribunal\s+Militar', re.IGNORECASE), "STM"),
            (re.compile(r'\bCNJ\b|Conselho\s+Nacional\s+de\s+Justi[çc]a', re.IGNORECASE), "CNJ"),
        ]
        for pat, name in named_courts:
            if pat.search(text) and name not in seen:
                tribunais.append(name)
                seen.add(name)

        # State / regional courts
        generic_courts = [
            re.compile(r'TJ[A-Z]{2}'),
            re.compile(r'TRF[\s-]?\d'),
            re.compile(r'TRT[\s-]?\d{1,2}'),
            re.compile(r'TRE[\s-]?[A-Z]{2}'),
        ]
        for pat in generic_courts:
            for m in pat.finditer(text):
                court = m.group(0).strip()
                if court not in seen:
                    tribunais.append(court)
                    seen.add(court)

        return tribunais

    # ═══════════════════════════════════════════════════════════════
    #  MCJ COHERENCE SCORING
    # ═══════════════════════════════════════════════════════════════

    def _calculate_coerencia(
        self,
        elements: dict[str, dict],
        entities: dict,
        normalized: str,
    ) -> dict:
        criteria: dict[str, int] = {}

        # 1. Consistência Lógica
        logic = 0
        if elements["fatos"]["found"]:
            logic += 30
        if elements["inferencias"]["found"]:
            logic += 30
        if elements["conclusao"]["found"]:
            logic += 25
        if elements["fatos"]["found"] and elements["inferencias"]["found"]:
            logic += 15
        criteria["consistenciaLogica"] = min(100, logic)

        # 2. Adequação Normativa
        norm = 0
        if elements["normas"]["found"]:
            norm += min(50, elements["normas"]["count"] * 8)
            norm_types = {it["type"] for it in elements["normas"]["items"]}
            norm += min(30, len(norm_types) * 10)
            has_cf = any(it["type"] == "constituicao" for it in elements["normas"]["items"])
            if has_cf:
                norm += 20
        criteria["adequacaoNormativa"] = min(100, norm)

        # 3. Suficiência Probatória
        proof = 0
        if elements["provas"]["found"]:
            proof += min(60, elements["provas"]["count"] * 12)
            proof_types = {it["type"] for it in elements["provas"]["items"]}
            proof += min(40, len(proof_types) * 15)
        criteria["suficienciaProbatoria"] = min(100, proof)

        # 4. Coerência Argumentativa
        arg = 0
        if elements["hipoteses"]["found"]:
            arg += 20
        if elements["inferencias"]["found"]:
            arg += 25
        if elements["fatos"]["found"] and elements["normas"]["found"]:
            arg += 25
        if elements["conclusao"]["found"]:
            arg += 15
        connectors = [
            "portanto", "logo", "destarte", "consequentemente",
            "assim", "nesse sentido", "desse modo",
        ]
        connector_count = sum(1 for c in connectors if c in normalized)
        arg += min(15, connector_count * 5)
        criteria["coerenciaArgumentativa"] = min(100, arg)

        # 5. Pertinência Jurisprudencial
        jurisp = 0
        if elements["jurisprudencia"]["found"]:
            jurisp += min(60, elements["jurisprudencia"]["count"] * 10)
            has_major = any(t in ("STF", "STJ", "TST") for t in entities.get("tribunais", []))
            if has_major:
                jurisp += 25
            has_sumula = any(it["type"] == "sumula" for it in elements["jurisprudencia"]["items"])
            if has_sumula:
                jurisp += 15
        criteria["pertinenciaJurisprudencial"] = min(100, jurisp)

        # 6. Clareza Redacional
        clarity = 50  # baseline
        paragraphs = len(re.split(r'\n\s*\n', normalized))
        if paragraphs >= 3:
            clarity += 15
        if paragraphs >= 6:
            clarity += 10

        sentences = [s for s in re.split(r'[.!?]+', normalized) if len(s.strip()) > 10]
        if sentences:
            avg_len = len(normalized) / len(sentences)
            if avg_len < 200:
                clarity += 15
            elif avg_len > 400:
                clarity -= 15

        headers_found = len(re.findall(r'\n\s*(?:d[oa]s?\s|da\s|no\s|das?\s)[a-z]', normalized))
        clarity += min(10, headers_found * 3)

        criteria["clarezaRedacional"] = max(0, min(100, clarity))

        # Weighted MCJ score
        total = sum(criteria[k] * w for k, w in self._MCJ_WEIGHTS.items())
        overall_mcj = round(total)

        return {
            "score": overall_mcj,
            "criteria": criteria,
            "level": self._score_label(overall_mcj),
        }

    # ═══════════════════════════════════════════════════════════════
    #  SCORING HELPERS
    # ═══════════════════════════════════════════════════════════════

    def _calculate_element_score(self, elements: dict[str, dict]) -> int:
        total = 0.0
        for key, weight in self._ELEMENT_WEIGHTS.items():
            elem = elements.get(key)
            if elem:
                total += elem["score"] * weight
        return round(total)

    # ═══════════════════════════════════════════════════════════════
    #  RECOMMENDATION / STRENGTH / WEAKNESS GENERATION
    # ═══════════════════════════════════════════════════════════════

    def _generate_recommendations(
        self, elements: dict, coerencia: dict
    ) -> list[dict[str, str]]:
        recs: list[dict[str, str]] = []
        crit = coerencia["criteria"]

        if not elements["fatos"]["found"] or elements["fatos"]["score"] < 40:
            recs.append({
                "priority": "alta", "area": "Fatos",
                "text": "Desenvolver melhor a seção de fatos. Inclua datas, "
                        "circunstâncias e detalhes específicos dos eventos narrados.",
            })
        if not elements["provas"]["found"] or elements["provas"]["score"] < 30:
            recs.append({
                "priority": "alta", "area": "Provas",
                "text": "Incluir referências a provas documentais, testemunhais "
                        "ou periciais que sustentem as alegações apresentadas.",
            })
        if not elements["normas"]["found"] or elements["normas"]["score"] < 40:
            recs.append({
                "priority": "alta", "area": "Fundamentação Legal",
                "text": "Fortalecer a fundamentação jurídica com citação de "
                        "dispositivos legais específicos (artigos, leis, códigos).",
            })
        if not elements["jurisprudencia"]["found"] or elements["jurisprudencia"]["score"] < 30:
            recs.append({
                "priority": "media", "area": "Jurisprudência",
                "text": "Incluir citações jurisprudenciais relevantes de tribunais "
                        "superiores (STF, STJ) ou súmulas aplicáveis ao caso.",
            })
        if not elements["conclusao"]["found"] or elements["conclusao"]["score"] < 40:
            recs.append({
                "priority": "alta", "area": "Conclusão/Pedidos",
                "text": 'Estruturar melhor a conclusão e pedidos, utilizando expressões '
                        'como "Ante o exposto" e listando pedidos de forma clara e objetiva.',
            })
        if not elements["inferencias"]["found"] or elements["inferencias"]["score"] < 30:
            recs.append({
                "priority": "media", "area": "Argumentação",
                "text": "Desenvolver o encadeamento lógico entre fatos e direito, "
                        "utilizando conectores argumentativos para fortalecer a tese.",
            })
        if not elements["doutrina"]["found"]:
            recs.append({
                "priority": "baixa", "area": "Doutrina",
                "text": "Considerar a inclusão de referências doutrinárias de "
                        "autores reconhecidos para reforçar a fundamentação teórica.",
            })
        if crit["clarezaRedacional"] < 60:
            recs.append({
                "priority": "media", "area": "Redação",
                "text": "Melhorar a organização do texto com parágrafos mais "
                        "curtos, seções bem definidas e uso de subtítulos.",
            })
        if crit["coerenciaArgumentativa"] < 50:
            recs.append({
                "priority": "alta", "area": "Coerência",
                "text": "Revisar a coerência argumentativa, assegurando que cada "
                        "argumento esteja logicamente conectado aos fatos e à "
                        "fundamentação jurídica.",
            })

        priority_order = {"alta": 0, "media": 1, "baixa": 2}
        recs.sort(key=lambda r: priority_order.get(r["priority"], 2))
        return recs[:5]

    def _generate_strengths(
        self, elements: dict, coerencia: dict
    ) -> list[dict[str, str]]:
        strengths: list[dict[str, str]] = []
        crit = coerencia["criteria"]

        if elements["normas"]["score"] >= 60:
            strengths.append({
                "area": "Fundamentação Legal",
                "text": "Boa fundamentação jurídica com citação adequada de dispositivos legais.",
            })
        if elements["jurisprudencia"]["score"] >= 50:
            strengths.append({
                "area": "Jurisprudência",
                "text": "Utilização pertinente de jurisprudência para sustentar os argumentos.",
            })
        if elements["fatos"]["score"] >= 60:
            strengths.append({
                "area": "Narrativa Fática",
                "text": "Exposição clara e detalhada dos fatos relevantes ao caso.",
            })
        if elements["provas"]["score"] >= 50:
            strengths.append({
                "area": "Base Probatória",
                "text": "Referências adequadas a elementos probatórios documentais.",
            })
        if crit["coerenciaArgumentativa"] >= 70:
            strengths.append({
                "area": "Argumentação",
                "text": "Encadeamento lógico bem construído entre premissas e conclusões.",
            })
        if crit["clarezaRedacional"] >= 70:
            strengths.append({
                "area": "Clareza Redacional",
                "text": "Texto bem organizado com estrutura clara e linguagem precisa.",
            })
        if elements["doutrina"]["score"] >= 40:
            strengths.append({
                "area": "Referências Doutrinárias",
                "text": "Bom uso de doutrina para embasar os argumentos apresentados.",
            })
        if elements["conclusao"]["score"] >= 60:
            strengths.append({
                "area": "Conclusão",
                "text": "Pedidos e conclusão bem estruturados e claramente formulados.",
            })

        if not strengths:
            strengths.append({
                "area": "Estrutura",
                "text": "O documento apresenta estrutura básica reconhecível de peça jurídica.",
            })

        return strengths[:3]

    def _generate_weaknesses(
        self, elements: dict, coerencia: dict
    ) -> list[dict[str, str]]:
        weaknesses: list[dict[str, str]] = []
        crit = coerencia["criteria"]

        if elements["normas"]["score"] < 40:
            weaknesses.append({
                "area": "Fundamentação Legal",
                "text": "Fundamentação jurídica insuficiente. Poucos dispositivos legais citados.",
                "severity": "alta",
            })
        if elements["fatos"]["score"] < 40:
            weaknesses.append({
                "area": "Narrativa Fática",
                "text": "Exposição dos fatos carece de detalhamento e objetividade.",
                "severity": "alta",
            })
        if elements["provas"]["score"] < 30:
            weaknesses.append({
                "area": "Base Probatória",
                "text": "Ausência ou insuficiência de referências probatórias.",
                "severity": "alta",
            })
        if not elements["jurisprudencia"]["found"]:
            weaknesses.append({
                "area": "Jurisprudência",
                "text": "Nenhuma referência jurisprudencial identificada no documento.",
                "severity": "media",
            })
        if crit["consistenciaLogica"] < 50:
            weaknesses.append({
                "area": "Consistência Lógica",
                "text": "Falta de conexão lógica entre os elementos do documento.",
                "severity": "alta",
            })
        if crit["clarezaRedacional"] < 50:
            weaknesses.append({
                "area": "Clareza Redacional",
                "text": "Organização textual deficiente. Parágrafos longos e sem divisão clara.",
                "severity": "media",
            })
        if not elements["conclusao"]["found"]:
            weaknesses.append({
                "area": "Conclusão",
                "text": "Ausência de conclusão ou pedidos claramente formulados.",
                "severity": "alta",
            })
        if not elements["doutrina"]["found"] and not elements["jurisprudencia"]["found"]:
            weaknesses.append({
                "area": "Suporte Teórico",
                "text": "Ausência de referências doutrinárias e jurisprudenciais.",
                "severity": "media",
            })

        severity_order = {"alta": 0, "media": 1, "baixa": 2}
        weaknesses.sort(key=lambda w: severity_order.get(w.get("severity", ""), 2))
        return weaknesses[:3]
