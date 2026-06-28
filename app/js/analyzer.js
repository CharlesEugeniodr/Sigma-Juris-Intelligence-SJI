/**
 * SJIF Analyzer - Legal Document Analysis Engine
 * Sigma Juris Intelligence Framework
 *
 * Performs full SJIF analysis applying the 9 elements from the Diretiva Mestra,
 * MCJ (Motor de Coerência Jurídica) scoring, entity extraction, and
 * recommendation generation.
 *
 * Attaches to window.SJIFAnalyzer
 */
(function () {
  'use strict';

  // ─── ID Generator (delegated to SJIFUtils) ────────────────────────

  // ─── Accent Removal Utility ─────────────────────────────────────────
  var ACCENT_MAP = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c', 'ñ': 'n'
  };

  function removeAccents(str) {
    return str.replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, function (ch) {
      return ACCENT_MAP[ch] || ch;
    });
  }

  function normalize(text) {
    if (!text) return '';
    return removeAccents(text.toLowerCase());
  }

  // ─── SJIFAnalyzer Class ─────────────────────────────────────────────

  function SJIFAnalyzer() {
    // MCJ criteria weights (total should equal 100 when averaged)
    this._mcjWeights = {
      consistenciaLogica: 0.20,
      adequacaoNormativa: 0.20,
      suficienciaProbatoria: 0.15,
      coerenciaArgumentativa: 0.20,
      pertinenciaJurisprudencial: 0.10,
      clarezaRedacional: 0.15
    };

    // Element weights for overall score
    this._elementWeights = {
      fatos: 0.15,
      provas: 0.12,
      hipoteses: 0.08,
      inferencias: 0.10,
      normas: 0.18,
      jurisprudencia: 0.12,
      doutrina: 0.05,
      conclusao: 0.12,
      recomendacao: 0.08
    };
  }

  // ─── Core Analysis Method ───────────────────────────────────────────

  /**
   * Perform full SJIF analysis on a legal document.
   *
   * @param {string} text - Document text to analyze.
   * @param {Object} documentType - Classification result from SJIFClassifier.
   * @returns {Object} Complete analysis result.
   */
  SJIFAnalyzer.prototype.analyze = function (text, documentType) {
    if (!text || typeof text !== 'string') {
      throw new Error('SJIFAnalyzer.analyze: text must be a non-empty string');
    }

    var normalizedText = normalize(text);

    // Extract 9 elements
    var elements = {
      fatos: this._extractFatos(text, normalizedText),
      provas: this._extractProvas(text, normalizedText),
      hipoteses: this._extractHipoteses(text, normalizedText),
      inferencias: this._extractInferencias(text, normalizedText),
      normas: this._extractNormas(text, normalizedText),
      jurisprudencia: this._extractJurisprudencia(text, normalizedText),
      doutrina: this._extractDoutrina(text, normalizedText),
      conclusao: this._extractConclusao(text, normalizedText),
      recomendacao: this._extractRecomendacao(text, normalizedText)
    };

    // Extract entities
    var entities = this._extractEntities(text);

    // Calculate MCJ coherence
    var coerencia = this._calculateCoerencia(elements, entities, normalizedText);

    // Calculate overall score (weighted blend of elements and MCJ)
    var elementScore = this._calculateElementScore(elements);
    var overallScore = Math.round(elementScore * 0.6 + coerencia.score * 0.4);

    // Generate recommendations, strengths, weaknesses
    var recommendations = this._generateRecommendations(elements, coerencia, documentType);
    var strengths = this._generateStrengths(elements, coerencia);
    var weaknesses = this._generateWeaknesses(elements, coerencia);

    return {
      id: window.SJIFUtils.generateId(),
      timestamp: new Date().toISOString(),
      documentType: documentType || { typeCode: 'desconhecido', typeName: 'Não classificado' },
      elements: elements,
      coerencia: coerencia,
      entities: entities,
      overallScore: overallScore,
      scoreLabel: this._getScoreLabel(overallScore),
      recommendations: recommendations,
      strengths: strengths,
      weaknesses: weaknesses
    };
  };

  // ─── Element Extraction Methods ─────────────────────────────────────

  /**
   * Extract factual statements (fatos).
   * Looks for narrative paragraphs, date references, event descriptions.
   */
  SJIFAnalyzer.prototype._extractFatos = function (text, normalized) {
    var items = [];

    // Match date-anchored factual statements
    var dateFactPattern = /(?:em|no dia|na data de|desde)\s+\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}[^.;]*[.;]/gi;
    var dateMatches = text.match(dateFactPattern) || [];
    for (var i = 0; i < dateMatches.length; i++) {
      items.push({ text: dateMatches[i].trim(), type: 'fato_temporal' });
    }

    // Match common factual indicators
    var factIndicators = [
      /(?:ocorreu que|o fato [eé] que|verificou-se que|constatou-se que|sucede que|acontece que)[^.;]+[.;]/gi,
      /(?:o autor|a autora|o requerente|a requerente|o impetrante|a impetrante)\s+[^.;]{10,}[.;]/gi,
      /(?:o r[eé]u|a r[eé]|o requerido|a requerida|o impetrado|a impetrada)\s+[^.;]{10,}[.;]/gi
    ];

    for (var j = 0; j < factIndicators.length; j++) {
      var matches = text.match(factIndicators[j]) || [];
      for (var k = 0; k < Math.min(matches.length, 5); k++) {
        items.push({ text: matches[k].trim(), type: 'fato_narrativo' });
      }
    }

    // Check for "DOS FATOS" section
    if (/dos?\s+fatos/i.test(text)) {
      items.push({ text: 'Seção "DOS FATOS" identificada', type: 'secao' });
    }

    var score = Math.min(100, items.length * 15);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract evidence references (provas).
   */
  SJIFAnalyzer.prototype._extractProvas = function (text, normalized) {
    var items = [];

    // Documentary evidence
    var docPatterns = [
      /(?:documento|doc\.|docs?\s*\d|anexo|fls?\.\s*\d|p[aá]g(?:ina)?\.?\s*\d)[^.;]*[.;]?/gi,
      /(?:prova\s+(?:documental|testemunhal|pericial|emprestada))[^.;]*[.;]?/gi,
      /(?:conforme|consoante|segundo|de acordo com)\s+(?:documento|doc\.|prova|laudo|perícia|pericia)[^.;]*[.;]?/gi,
      /(?:juntada|acostada|anexada)\s+[^.;]*[.;]?/gi
    ];

    for (var i = 0; i < docPatterns.length; i++) {
      var matches = text.match(docPatterns[i]) || [];
      for (var j = 0; j < Math.min(matches.length, 5); j++) {
        items.push({ text: matches[j].trim(), type: 'prova_documental' });
      }
    }

    // Witness references
    var witnessPattern = /(?:testemunha|depoimento|oitiva|inquirição|inquiricao)[^.;]*[.;]?/gi;
    var witnesses = text.match(witnessPattern) || [];
    for (var k = 0; k < Math.min(witnesses.length, 3); k++) {
      items.push({ text: witnesses[k].trim(), type: 'prova_testemunhal' });
    }

    // Expert evidence
    var expertPattern = /(?:per[ií]cia|laudo\s+(?:pericial|t[eé]cnico)|assistente\s+t[eé]cnico|perito)[^.;]*[.;]?/gi;
    var experts = text.match(expertPattern) || [];
    for (var l = 0; l < Math.min(experts.length, 3); l++) {
      items.push({ text: experts[l].trim(), type: 'prova_pericial' });
    }

    // Check for "DAS PROVAS" section
    if (/das?\s+provas/i.test(text)) {
      items.push({ text: 'Seção "DAS PROVAS" identificada', type: 'secao' });
    }

    var score = Math.min(100, items.length * 12);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract hypotheses (hipóteses).
   */
  SJIFAnalyzer.prototype._extractHipoteses = function (text, normalized) {
    var items = [];

    var patterns = [
      /(?:hip[oó]tese|supondo|caso\s+seja|se\s+for\s+o\s+caso|eventualmente|subsidiariamente|alternativamente)[^.;]*[.;]/gi,
      /(?:na\s+hip[oó]tese\s+de|em\s+caso\s+de|acaso|porventura)[^.;]*[.;]/gi,
      /(?:ad\s+argumentandum|ainda\s+que|mesmo\s+que|caso\s+se\s+entenda)[^.;]*[.;]/gi
    ];

    for (var i = 0; i < patterns.length; i++) {
      var matches = text.match(patterns[i]) || [];
      for (var j = 0; j < Math.min(matches.length, 5); j++) {
        items.push({ text: matches[j].trim(), type: 'hipotese' });
      }
    }

    var score = Math.min(100, items.length * 20);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract inferences (inferências).
   */
  SJIFAnalyzer.prototype._extractInferencias = function (text, normalized) {
    var items = [];

    var patterns = [
      /(?:portanto|logo|destarte|dessarte|por conseguinte|consequentemente|assim sendo|desse modo|nesse sentido)[^.;]*[.;]/gi,
      /(?:conclui-se|infere-se|depreende-se|verifica-se|resta\s+(?:claro|evidente|demonstrado))[^.;]*[.;]/gi,
      /(?:diante\s+(?:do\s+exposto|disso)|ante\s+o\s+exposto|[àa]\s+luz\s+d[oa]s?\s+fatos)[^.;]*[.;]/gi,
      /(?:razão\s+pela\s+qual|motivo\s+pelo\s+qual|é\s+por\s+isso\s+que)[^.;]*[.;]/gi
    ];

    for (var i = 0; i < patterns.length; i++) {
      var matches = text.match(patterns[i]) || [];
      for (var j = 0; j < Math.min(matches.length, 5); j++) {
        items.push({ text: matches[j].trim(), type: 'inferencia' });
      }
    }

    var score = Math.min(100, items.length * 18);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract legal norms (normas).
   * Matches articles, laws, constitutional provisions, codes, decrees, etc.
   */
  SJIFAnalyzer.prototype._extractNormas = function (text, normalized) {
    var items = [];
    var seen = {};

    // Art. NN patterns (e.g., Art. 5º, art. 319, art. 1.015)
    var artPattern = /art(?:igo)?\.?\s*\d+[\d.]*[º°]?(?:\s*,?\s*(?:§|par[aá]grafo)\s*(?:[úu]nico|\d+[º°]?))?(?:\s*,?\s*(?:inciso\s+)?[IVXLCDM]+)?(?:\s*,?\s*(?:al[ií]nea\s+)?["']?[a-z]["']?)?/gi;
    var artMatches = text.match(artPattern) || [];
    for (var a = 0; a < artMatches.length; a++) {
      var artKey = artMatches[a].trim().toLowerCase();
      if (!seen[artKey]) {
        items.push({ text: artMatches[a].trim(), type: 'artigo' });
        seen[artKey] = true;
      }
    }

    // Lei nº patterns
    var leiPattern = /lei\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi;
    var leiMatches = text.match(leiPattern) || [];
    for (var b = 0; b < leiMatches.length; b++) {
      var leiKey = leiMatches[b].trim().toLowerCase();
      if (!seen[leiKey]) {
        items.push({ text: leiMatches[b].trim(), type: 'lei' });
        seen[leiKey] = true;
      }
    }

    // Constitution references
    var cfPattern = /(?:constitui[çc][ãa]o\s+(?:federal|da\s+rep[úu]blica)?|cf\/?(?:88|1988)?)/gi;
    var cfMatches = text.match(cfPattern) || [];
    for (var c = 0; c < cfMatches.length; c++) {
      var cfKey = cfMatches[c].trim().toLowerCase();
      if (!seen[cfKey]) {
        items.push({ text: cfMatches[c].trim(), type: 'constituicao' });
        seen[cfKey] = true;
      }
    }

    // Codes (CPC, CPP, CC, CP, CLT, CTN, CDC, ECA, etc.)
    var codePattern = /\b(?:c[oó]digo\s+(?:de\s+)?(?:processo\s+civil|processo\s+penal|civil|penal|tribut[aá]rio\s+nacional|defesa\s+do\s+consumidor|trabalho)|cpc(?:\/\d{2,4})?|cpp|cc(?:\/\d{2,4})?|cp\b|clt|ctn|cdc|eca)\b/gi;
    var codeMatches = text.match(codePattern) || [];
    for (var d = 0; d < codeMatches.length; d++) {
      var codeKey = codeMatches[d].trim().toLowerCase();
      if (!seen[codeKey]) {
        items.push({ text: codeMatches[d].trim(), type: 'codigo' });
        seen[codeKey] = true;
      }
    }

    // Decreto patterns
    var decretoPattern = /decreto(?:-lei)?\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi;
    var decretoMatches = text.match(decretoPattern) || [];
    for (var e = 0; e < decretoMatches.length; e++) {
      var decKey = decretoMatches[e].trim().toLowerCase();
      if (!seen[decKey]) {
        items.push({ text: decretoMatches[e].trim(), type: 'decreto' });
        seen[decKey] = true;
      }
    }

    // Resolução, Portaria, Instrução Normativa
    var adminPattern = /(?:resolu[çc][ãa]o|portaria|instru[çc][ãa]o\s+normativa|s[úu]mula\s+vinculante|medida\s+provis[oó]ria|emenda\s+constitucional)\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi;
    var adminMatches = text.match(adminPattern) || [];
    for (var f = 0; f < adminMatches.length; f++) {
      var adminKey = adminMatches[f].trim().toLowerCase();
      if (!seen[adminKey]) {
        items.push({ text: adminMatches[f].trim(), type: 'norma_administrativa' });
        seen[adminKey] = true;
      }
    }

    // Check for "DO DIREITO" section
    if (/d[oa]s?\s+direito/i.test(text) || /d[oa]\s+fundamenta[çc][ãa]o\s+jur[ií]dica/i.test(text)) {
      items.push({ text: 'Seção de fundamentação jurídica identificada', type: 'secao' });
    }

    var score = Math.min(100, items.length * 8);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract jurisprudence references.
   * Matches court decisions, súmulas, case numbers.
   */
  SJIFAnalyzer.prototype._extractJurisprudencia = function (text, normalized) {
    var items = [];
    var seen = {};

    // Court abbreviations and decisions
    var courtPattern = /(?:STF|STJ|TST|TSE|STM|TJ[A-Z]{0,2}|TRF[\s-]?\d|TRT[\s-]?\d{1,2}|TRE[\s-]?[A-Z]{2})\s*[,.]?\s*(?:[\w\s]*?\d[\d.\/\-]*)?/g;
    var courtMatches = text.match(courtPattern) || [];
    for (var a = 0; a < courtMatches.length; a++) {
      var key = courtMatches[a].trim();
      if (key.length > 3 && !seen[key.toLowerCase()]) {
        items.push({ text: key, type: 'jurisprudencia_tribunal' });
        seen[key.toLowerCase()] = true;
      }
    }

    // Súmula references
    var sumulaPattern = /s[úu]mula\s+(?:vinculante\s+)?(?:n[º°.]?\s*)?\d+(?:\s+d[oa]\s+\w+)?/gi;
    var sumulaMatches = text.match(sumulaPattern) || [];
    for (var b = 0; b < sumulaMatches.length; b++) {
      var sk = sumulaMatches[b].trim().toLowerCase();
      if (!seen[sk]) {
        items.push({ text: sumulaMatches[b].trim(), type: 'sumula' });
        seen[sk] = true;
      }
    }

    // Specific action types (ADI, ADPF, RE, REsp, AgRg, etc.)
    var actionPattern = /\b(?:ADI|ADPF|ADC|RE|REsp|AgRg|AgInt|RMS|RHC|HC|MS|MC|AC|AI|RCL|ED|EDiv)\s+(?:n[º°.]?\s*)?[\d.\/\-]+/g;
    var actionMatches = text.match(actionPattern) || [];
    for (var c = 0; c < actionMatches.length; c++) {
      var ak = actionMatches[c].trim().toLowerCase();
      if (!seen[ak]) {
        items.push({ text: actionMatches[c].trim(), type: 'acao_jurisprudencial' });
        seen[ak] = true;
      }
    }

    // Relator (Judge/Reporter references)
    var relatorPattern = /(?:rel(?:ator)?\.?\s*:?\s*min(?:istro)?\.?\s*|rel(?:ator)?\.?\s*:?\s*des(?:embargador)?\.?\s*)[^,;.\n]+/gi;
    var relatorMatches = text.match(relatorPattern) || [];
    for (var d = 0; d < Math.min(relatorMatches.length, 5); d++) {
      items.push({ text: relatorMatches[d].trim(), type: 'relator' });
    }

    // Published case references
    var djPattern = /(?:DJe?|DJ[Uu])\s+(?:de\s+)?\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}/gi;
    var djMatches = text.match(djPattern) || [];
    for (var e = 0; e < djMatches.length; e++) {
      items.push({ text: djMatches[e].trim(), type: 'publicacao' });
    }

    var score = Math.min(100, items.length * 10);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract doctrinal references (doutrina).
   * Matches author names, book titles, doctrinal citations.
   */
  SJIFAnalyzer.prototype._extractDoutrina = function (text, normalized) {
    var items = [];

    // Known Brazilian legal scholars
    var scholars = [
      'Pontes de Miranda', 'Clóvis Beviláqua', 'Rui Barbosa',
      'Hely Lopes Meirelles', 'Celso Antônio Bandeira de Mello',
      'Maria Sylvia Zanella Di Pietro', 'José Afonso da Silva',
      'Caio Mário', 'Orlando Gomes', 'Silvio Rodrigues',
      'Washington de Barros Monteiro', 'Flávio Tartuce',
      'Nelson Nery', 'Fredie Didier', 'Humberto Theodoro Júnior',
      'Cândido Rangel Dinamarco', 'Ada Pellegrini Grinover',
      'Luiz Guilherme Marinoni', 'Daniel Amorim Assumpção Neves',
      'Alexandre de Moraes', 'Gilmar Mendes', 'Paulo Bonavides',
      'Luís Roberto Barroso', 'Ingo Wolfgang Sarlet',
      'Cezar Roberto Bitencourt', 'Rogério Greco',
      'Fernando Capez', 'Julio Fabbrini Mirabete',
      'Sérgio Pinto Martins', 'Maurício Godinho Delgado',
      'Vólia Bomfim Cassar', 'Renato Saraiva',
      'Hugo de Brito Machado', 'Eduardo Sabbag',
      'Paulo de Barros Carvalho', 'Luiz Felipe Silveira Difini'
    ];

    for (var i = 0; i < scholars.length; i++) {
      if (text.indexOf(scholars[i]) !== -1 || normalize(text).indexOf(normalize(scholars[i])) !== -1) {
        items.push({ text: scholars[i], type: 'doutrinador' });
      }
    }

    // Generic citation patterns: (SURNAME, year) or (SURNAME, year, p. N)
    var citationPattern = /\(\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)?,\s*\d{4}(?:\s*,\s*p\.?\s*\d+(?:-\d+)?)?\s*\)/g;
    var citationMatches = text.match(citationPattern) || [];
    for (var j = 0; j < citationMatches.length; j++) {
      items.push({ text: citationMatches[j].trim(), type: 'citacao_academica' });
    }

    // Book/work references
    var bookPattern = /(?:in|apud|cf\.)\s+[^.;,]{5,}(?:\.\s*\d+[ªaº]?\s*ed)/gi;
    var bookMatches = text.match(bookPattern) || [];
    for (var k = 0; k < Math.min(bookMatches.length, 5); k++) {
      items.push({ text: bookMatches[k].trim(), type: 'obra' });
    }

    // "segundo a doutrina", "a doutrina ensina", etc.
    var doctrineRefPattern = /(?:segundo\s+a\s+doutrina|a\s+doutrina\s+(?:ensina|maj?orit[aá]ria|minorit[aá]ria|moderna|cl[aá]ssica)|na\s+li[çc][ãa]o\s+de|nas\s+palavras\s+de|conforme\s+ensina)[^.;]*[.;]/gi;
    var doctrineMatches = text.match(doctrineRefPattern) || [];
    for (var l = 0; l < Math.min(doctrineMatches.length, 5); l++) {
      items.push({ text: doctrineMatches[l].trim(), type: 'referencia_doutrinaria' });
    }

    var score = Math.min(100, items.length * 15);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract conclusion elements (conclusão).
   */
  SJIFAnalyzer.prototype._extractConclusao = function (text, normalized) {
    var items = [];

    var patterns = [
      /(?:ante\s+o\s+exposto|diante\s+do\s+exposto|ex\s+positis|por\s+todo\s+o\s+exposto|face\s+ao\s+exposto|pelo\s+exposto|em\s+face\s+do\s+exposto)[^.;]*[.;]/gi,
      /(?:requer(?:-se)?|pugna|postula|pleiteia)\s+[^.;]*(?:proced[eê]ncia|improced[eê]ncia|deferimento|provimento|concess[ãa]o|condenação|condenacao)[^.;]*[.;]/gi,
      /(?:termos\s+em\s+que|nestes\s+termos)\s*[,.]?\s*(?:pede\s+)?deferimento/gi,
      /(?:isto\s+posto|por\s+tudo\s+isso|em\s+conclus[ãa]o|em\s+suma|em\s+s[ií]ntese)[^.;]*[.;]/gi
    ];

    for (var i = 0; i < patterns.length; i++) {
      var matches = text.match(patterns[i]) || [];
      for (var j = 0; j < Math.min(matches.length, 5); j++) {
        items.push({ text: matches[j].trim(), type: 'conclusao' });
      }
    }

    // Pedido section
    var pedidoPattern = /(?:dos?\s+pedidos?|requer(?:-se)?(?:\s+a\s+este\s+ju[ií]zo)?)\s*:?\s*\n([^]*?)(?:\n\s*\n|\z)/gi;
    var pedidoMatches = text.match(pedidoPattern) || [];
    for (var k = 0; k < Math.min(pedidoMatches.length, 3); k++) {
      items.push({ text: pedidoMatches[k].trim().substring(0, 200), type: 'pedido' });
    }

    var score = Math.min(100, items.length * 20);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  /**
   * Extract recommendations (recomendação).
   */
  SJIFAnalyzer.prototype._extractRecomendacao = function (text, normalized) {
    var items = [];

    var patterns = [
      /(?:recomenda-se|sugere-se|aconselha-se|orienta-se|prop[oõ]e-se)[^.;]*[.;]/gi,
      /(?:o\s+parecer\s+[eé]\s+(?:pelo|pela|no\s+sentido)|opina-se\s+(?:pelo|pela|no\s+sentido))[^.;]*[.;]/gi,
      /(?:deve(?:-se)?|dever[aá]|convém|cabe|cumpre|impõe-se|faz-se\s+necess[aá]rio)[^.;]*[.;]/gi
    ];

    for (var i = 0; i < patterns.length; i++) {
      var matches = text.match(patterns[i]) || [];
      for (var j = 0; j < Math.min(matches.length, 5); j++) {
        items.push({ text: matches[j].trim(), type: 'recomendacao' });
      }
    }

    var score = Math.min(100, items.length * 25);
    return {
      found: items.length > 0,
      count: items.length,
      items: items,
      score: score
    };
  };

  // ─── Entity Extraction ──────────────────────────────────────────────

  /**
   * Extract named entities from text.
   * @param {string} text
   * @returns {Object}
   */
  SJIFAnalyzer.prototype._extractEntities = function (text) {
    return {
      partes: this._extractPartes(text),
      datas: this._extractDatas(text),
      valores: this._extractValores(text),
      leis: this._extractLeis(text),
      tribunais: this._extractTribunais(text),
      processos: this._extractProcessos(text)
    };
  };

  /**
   * Extract party names.
   */
  SJIFAnalyzer.prototype._extractPartes = function (text) {
    var parties = [];
    var seen = {};

    var partyLabels = [
      'AUTOR', 'AUTORA', 'AUTORES',
      'RÉU', 'RÉ', 'RÉUS', 'REU',
      'REQUERENTE', 'REQUERIDO', 'REQUERIDA',
      'IMPETRANTE', 'IMPETRADO', 'IMPETRADA',
      'RECLAMANTE', 'RECLAMADO', 'RECLAMADA',
      'APELANTE', 'APELADO', 'APELADA',
      'AGRAVANTE', 'AGRAVADO', 'AGRAVADA',
      'EMBARGANTE', 'EMBARGADO', 'EMBARGADA',
      'EXEQUENTE', 'EXECUTADO', 'EXECUTADA',
      'PACIENTE', 'COATOR', 'COATORA',
      'RECORRENTE', 'RECORRIDO', 'RECORRIDA',
      'DENUNCIANTE', 'DENUNCIADO', 'DENUNCIADA',
      'LITISCONSORTE'
    ];

    for (var i = 0; i < partyLabels.length; i++) {
      // Match LABEL: Name or LABEL - Name
      var labelRegex = new RegExp(partyLabels[i] + '\\s*[:–\\-]\\s*([^\\n,;]{3,80})', 'gi');
      var matches = text.match(labelRegex);
      if (matches) {
        for (var j = 0; j < matches.length; j++) {
          var colonIdx = matches[j].search(/[:–\-]/);
          if (colonIdx > -1) {
            var name = matches[j].substring(colonIdx + 1).trim();
            var cleanName = name.replace(/\s+/g, ' ').trim();
            if (cleanName.length > 2 && !seen[cleanName.toUpperCase()]) {
              parties.push({ role: partyLabels[i], name: cleanName });
              seen[cleanName.toUpperCase()] = true;
            }
          }
        }
      }
    }

    return parties;
  };

  /**
   * Extract dates.
   */
  SJIFAnalyzer.prototype._extractDatas = function (text) {
    var dates = [];
    var seen = {};

    // dd/MM/yyyy or dd.MM.yyyy
    var numericDatePattern = /\b(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})\b/g;
    var match;
    while ((match = numericDatePattern.exec(text)) !== null) {
      var dateStr = match[0];
      if (!seen[dateStr]) {
        dates.push({ text: dateStr, type: 'numerica' });
        seen[dateStr] = true;
      }
    }

    // Written dates: "10 de janeiro de 2024"
    var writtenDatePattern = /\b(\d{1,2})\s+de\s+(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})\b/gi;
    while ((match = writtenDatePattern.exec(text)) !== null) {
      var wDateStr = match[0];
      if (!seen[wDateStr.toLowerCase()]) {
        dates.push({ text: wDateStr, type: 'por_extenso' });
        seen[wDateStr.toLowerCase()] = true;
      }
    }

    return dates;
  };

  /**
   * Extract monetary values (R$ format).
   */
  SJIFAnalyzer.prototype._extractValores = function (text) {
    var values = [];
    var seen = {};

    // R$ 1.234,56 or R$ 1234.56 or R$1.234,56
    var valuePattern = /R\$\s*[\d.,]+(?:\s*\([^)]*\))?/g;
    var match;
    while ((match = valuePattern.exec(text)) !== null) {
      var valStr = match[0].trim();
      if (!seen[valStr]) {
        values.push({ text: valStr, type: 'monetario' });
        seen[valStr] = true;
      }
    }

    // Written value references
    var writtenValuePattern = /(?:no\s+valor\s+de|import[aâ]ncia\s+de|monta(?:nte)?\s+de|quantia\s+de)\s+[^.;]+/gi;
    var wvMatches = text.match(writtenValuePattern) || [];
    for (var i = 0; i < Math.min(wvMatches.length, 5); i++) {
      var wvStr = wvMatches[i].trim();
      if (!seen[wvStr]) {
        values.push({ text: wvStr, type: 'referencia_valor' });
        seen[wvStr] = true;
      }
    }

    return values;
  };

  /**
   * Extract law references.
   */
  SJIFAnalyzer.prototype._extractLeis = function (text) {
    var leis = [];
    var seen = {};

    var patterns = [
      /art(?:igo)?\.?\s*\d+[\d.]*[º°]?(?:\s*(?:da|do|,)\s*(?:CF|CPC|CPP|CC|CP|CLT|CTN|CDC|ECA|Lei\s+[\d.\/]+))?/gi,
      /lei\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi,
      /(?:CF|CPC|CPP|CC|CP|CLT|CTN|CDC|ECA)(?:\/(?:88|1988|2015|\d{2,4}))?/g,
      /decreto(?:-lei)?\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi,
      /(?:resolu[çc][ãa]o|portaria|instru[çc][ãa]o\s+normativa)\s+(?:n[º°.]?\s*)?[\d.]+(?:\/\d{2,4})?/gi
    ];

    for (var i = 0; i < patterns.length; i++) {
      var matches = text.match(patterns[i]) || [];
      for (var j = 0; j < matches.length; j++) {
        var leiStr = matches[j].trim();
        var leiKey = leiStr.toLowerCase();
        if (!seen[leiKey]) {
          leis.push(leiStr);
          seen[leiKey] = true;
        }
      }
    }

    return leis;
  };

  /**
   * Extract court references.
   */
  SJIFAnalyzer.prototype._extractTribunais = function (text) {
    var tribunais = [];
    var seen = {};

    var courtNames = [
      { pattern: /\bSTF\b|Supremo\s+Tribunal\s+Federal/gi, name: 'STF' },
      { pattern: /\bSTJ\b|Superior\s+Tribunal\s+de\s+Justi[çc]a/gi, name: 'STJ' },
      { pattern: /\bTST\b|Tribunal\s+Superior\s+do\s+Trabalho/gi, name: 'TST' },
      { pattern: /\bTSE\b|Tribunal\s+Superior\s+Eleitoral/gi, name: 'TSE' },
      { pattern: /\bSTM\b|Superior\s+Tribunal\s+Militar/gi, name: 'STM' },
      { pattern: /\bCNJ\b|Conselho\s+Nacional\s+de\s+Justi[çc]a/gi, name: 'CNJ' },
      { pattern: /TJ[A-Z]{2}/g, name: null }, // State courts
      { pattern: /TRF[\s-]?\d/g, name: null }, // Regional Federal courts
      { pattern: /TRT[\s-]?\d{1,2}/g, name: null }, // Regional Labor courts
      { pattern: /TRE[\s-]?[A-Z]{2}/g, name: null } // Regional Electoral courts
    ];

    for (var i = 0; i < courtNames.length; i++) {
      var matches = text.match(courtNames[i].pattern) || [];
      for (var j = 0; j < matches.length; j++) {
        var courtStr = courtNames[i].name || matches[j].trim();
        if (!seen[courtStr]) {
          tribunais.push(courtStr);
          seen[courtStr] = true;
        }
      }
    }

    return tribunais;
  };

  /**
   * Extract case/process numbers (CNJ format: NNNNNNN-NN.NNNN.N.NN.NNNN).
   */
  SJIFAnalyzer.prototype._extractProcessos = function (text) {
    var processos = [];
    var seen = {};

    // CNJ standard format: 0000000-00.0000.0.00.0000
    var cnjPattern = /\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g;
    var match;
    while ((match = cnjPattern.exec(text)) !== null) {
      var num = match[0];
      if (!seen[num]) {
        processos.push(num);
        seen[num] = true;
      }
    }

    // Legacy formats: Processo nº NNN/YYYY or nº NNNN.NNN
    var legacyPattern = /(?:processo|autos?|n[º°])\s*(?:n[º°.]?\s*)?([\d.\/\-]{5,})/gi;
    while ((match = legacyPattern.exec(text)) !== null) {
      var legNum = match[1] ? match[1].trim() : match[0].trim();
      if (legNum.length >= 5 && !seen[legNum] && !/\d{7}-\d{2}/.test(legNum)) {
        processos.push(legNum);
        seen[legNum] = true;
      }
    }

    return processos;
  };

  // ─── MCJ Coherence Scoring ──────────────────────────────────────────

  /**
   * Calculate Motor de Coerência Jurídica (MCJ) scores.
   */
  SJIFAnalyzer.prototype._calculateCoerencia = function (elements, entities, normalizedText) {
    var criteria = {};

    // 1. Consistência Lógica: Are fatos, inferências, and conclusão present and connected?
    var logicScore = 0;
    if (elements.fatos.found) logicScore += 30;
    if (elements.inferencias.found) logicScore += 30;
    if (elements.conclusao.found) logicScore += 25;
    // Bonus if inferências reference fatos
    if (elements.fatos.found && elements.inferencias.found) logicScore += 15;
    criteria.consistenciaLogica = Math.min(100, logicScore);

    // 2. Adequação Normativa: Are legal norms cited adequately?
    var normScore = 0;
    if (elements.normas.found) {
      normScore += Math.min(50, elements.normas.count * 8);
      // Check variety of norm types
      var normTypes = {};
      for (var n = 0; n < elements.normas.items.length; n++) {
        normTypes[elements.normas.items[n].type] = true;
      }
      normScore += Math.min(30, Object.keys(normTypes).length * 10);
      // Bonus for citing constitution
      var hasCF = elements.normas.items.some(function (item) { return item.type === 'constituicao'; });
      if (hasCF) normScore += 20;
    }
    criteria.adequacaoNormativa = Math.min(100, normScore);

    // 3. Suficiência Probatória: Is evidence adequate?
    var proofScore = 0;
    if (elements.provas.found) {
      proofScore += Math.min(60, elements.provas.count * 12);
      // Variety of evidence types
      var proofTypes = {};
      for (var p = 0; p < elements.provas.items.length; p++) {
        proofTypes[elements.provas.items[p].type] = true;
      }
      proofScore += Math.min(40, Object.keys(proofTypes).length * 15);
    }
    criteria.suficienciaProbatoria = Math.min(100, proofScore);

    // 4. Coerência Argumentativa: Quality of argumentation flow
    var argScore = 0;
    if (elements.hipoteses.found) argScore += 20;
    if (elements.inferencias.found) argScore += 25;
    if (elements.fatos.found && elements.normas.found) argScore += 25;
    if (elements.conclusao.found) argScore += 15;
    // Check for logical connectors
    var connectors = ['portanto', 'logo', 'destarte', 'consequentemente', 'assim', 'nesse sentido', 'desse modo'];
    var connectorCount = 0;
    for (var c = 0; c < connectors.length; c++) {
      if (normalizedText.indexOf(connectors[c]) !== -1) connectorCount++;
    }
    argScore += Math.min(15, connectorCount * 5);
    criteria.coerenciaArgumentativa = Math.min(100, argScore);

    // 5. Pertinência Jurisprudencial: Relevance of cited jurisprudence
    var jurispScore = 0;
    if (elements.jurisprudencia.found) {
      jurispScore += Math.min(60, elements.jurisprudencia.count * 10);
      // Bonus for citing major courts
      var hasMajorCourt = entities.tribunais.some(function (t) {
        return ['STF', 'STJ', 'TST'].indexOf(t) !== -1;
      });
      if (hasMajorCourt) jurispScore += 25;
      // Bonus for súmulas
      var hasSumula = elements.jurisprudencia.items.some(function (item) { return item.type === 'sumula'; });
      if (hasSumula) jurispScore += 15;
    }
    criteria.pertinenciaJurisprudencial = Math.min(100, jurispScore);

    // 6. Clareza Redacional: Writing clarity metrics
    var clarityScore = 50; // Start with baseline
    var textLength = normalizedText.length;

    // Paragraph structure (presence of double newlines)
    var paragraphs = normalizedText.split(/\n\s*\n/).length;
    if (paragraphs >= 3) clarityScore += 15;
    if (paragraphs >= 6) clarityScore += 10;

    // Sentence structure (avg sentence length check)
    var sentences = normalizedText.split(/[.!?]+/).filter(function (s) { return s.trim().length > 10; });
    if (sentences.length > 0) {
      var avgSentenceLen = textLength / sentences.length;
      if (avgSentenceLen < 200) clarityScore += 15;
      else if (avgSentenceLen > 400) clarityScore -= 15;
    }

    // Section headers (structural organization)
    var headersFound = (normalizedText.match(/\n\s*(?:d[oa]s?\s|da\s|no\s|das?\s)[a-z]/g) || []).length;
    clarityScore += Math.min(10, headersFound * 3);

    criteria.clarezaRedacional = Math.max(0, Math.min(100, clarityScore));

    // Calculate weighted overall MCJ score
    var weights = this._mcjWeights;
    var totalScore = 0;
    var weightKeys = Object.keys(weights);
    for (var w = 0; w < weightKeys.length; w++) {
      totalScore += criteria[weightKeys[w]] * weights[weightKeys[w]];
    }
    var overallMCJ = Math.round(totalScore);

    return {
      score: overallMCJ,
      criteria: criteria,
      level: this._getScoreLabel(overallMCJ)
    };
  };

  // ─── Scoring Helpers ────────────────────────────────────────────────

  /**
   * Calculate weighted element score.
   */
  SJIFAnalyzer.prototype._calculateElementScore = function (elements) {
    var weights = this._elementWeights;
    var total = 0;
    var elemKeys = Object.keys(weights);
    for (var i = 0; i < elemKeys.length; i++) {
      var elem = elements[elemKeys[i]];
      if (elem) {
        total += elem.score * weights[elemKeys[i]];
      }
    }
    return Math.round(total);
  };

  /**
   * Map a numeric score to a label.
   * @param {number} score - 0 to 100
   * @returns {string}
   */
  SJIFAnalyzer.prototype._getScoreLabel = function (score) {
    if (score >= 85) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Satisfatório';
    if (score >= 30) return 'Insuficiente';
    return 'Crítico';
  };

  // ─── Recommendation Generation ──────────────────────────────────────

  /**
   * Generate actionable improvement suggestions.
   */
  SJIFAnalyzer.prototype._generateRecommendations = function (elements, coerencia, documentType) {
    var recs = [];

    // Check missing elements
    if (!elements.fatos.found || elements.fatos.score < 40) {
      recs.push({
        priority: 'alta',
        area: 'Fatos',
        text: 'Desenvolver melhor a seção de fatos. Inclua datas, circunstâncias e detalhes específicos dos eventos narrados.'
      });
    }

    if (!elements.provas.found || elements.provas.score < 30) {
      recs.push({
        priority: 'alta',
        area: 'Provas',
        text: 'Incluir referências a provas documentais, testemunhais ou periciais que sustentem as alegações apresentadas.'
      });
    }

    if (!elements.normas.found || elements.normas.score < 40) {
      recs.push({
        priority: 'alta',
        area: 'Fundamentação Legal',
        text: 'Fortalecer a fundamentação jurídica com citação de dispositivos legais específicos (artigos, leis, códigos).'
      });
    }

    if (!elements.jurisprudencia.found || elements.jurisprudencia.score < 30) {
      recs.push({
        priority: 'media',
        area: 'Jurisprudência',
        text: 'Incluir citações jurisprudenciais relevantes de tribunais superiores (STF, STJ) ou súmulas aplicáveis ao caso.'
      });
    }

    if (!elements.conclusao.found || elements.conclusao.score < 40) {
      recs.push({
        priority: 'alta',
        area: 'Conclusão/Pedidos',
        text: 'Estruturar melhor a conclusão e pedidos, utilizando expressões como "Ante o exposto" e listando pedidos de forma clara e objetiva.'
      });
    }

    if (!elements.inferencias.found || elements.inferencias.score < 30) {
      recs.push({
        priority: 'media',
        area: 'Argumentação',
        text: 'Desenvolver o encadeamento lógico entre fatos e direito, utilizando conectores argumentativos para fortalecer a tese.'
      });
    }

    if (!elements.doutrina.found) {
      recs.push({
        priority: 'baixa',
        area: 'Doutrina',
        text: 'Considerar a inclusão de referências doutrinárias de autores reconhecidos para reforçar a fundamentação teórica.'
      });
    }

    if (coerencia.criteria.clarezaRedacional < 60) {
      recs.push({
        priority: 'media',
        area: 'Redação',
        text: 'Melhorar a organização do texto com parágrafos mais curtos, seções bem definidas e uso de subtítulos.'
      });
    }

    if (coerencia.criteria.coerenciaArgumentativa < 50) {
      recs.push({
        priority: 'alta',
        area: 'Coerência',
        text: 'Revisar a coerência argumentativa, assegurando que cada argumento esteja logicamente conectado aos fatos e à fundamentação jurídica.'
      });
    }

    // Sort by priority and limit
    var priorityOrder = { alta: 0, media: 1, baixa: 2 };
    recs.sort(function (a, b) {
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    });

    return recs.slice(0, 5);
  };

  /**
   * Generate identified strengths.
   */
  SJIFAnalyzer.prototype._generateStrengths = function (elements, coerencia) {
    var strengths = [];

    if (elements.normas.score >= 60) {
      strengths.push({
        area: 'Fundamentação Legal',
        text: 'Boa fundamentação jurídica com citação adequada de dispositivos legais.'
      });
    }

    if (elements.jurisprudencia.score >= 50) {
      strengths.push({
        area: 'Jurisprudência',
        text: 'Utilização pertinente de jurisprudência para sustentar os argumentos.'
      });
    }

    if (elements.fatos.score >= 60) {
      strengths.push({
        area: 'Narrativa Fática',
        text: 'Exposição clara e detalhada dos fatos relevantes ao caso.'
      });
    }

    if (elements.provas.score >= 50) {
      strengths.push({
        area: 'Base Probatória',
        text: 'Referências adequadas a elementos probatórios documentais.'
      });
    }

    if (coerencia.criteria.coerenciaArgumentativa >= 70) {
      strengths.push({
        area: 'Argumentação',
        text: 'Encadeamento lógico bem construído entre premissas e conclusões.'
      });
    }

    if (coerencia.criteria.clarezaRedacional >= 70) {
      strengths.push({
        area: 'Clareza Redacional',
        text: 'Texto bem organizado com estrutura clara e linguagem precisa.'
      });
    }

    if (elements.doutrina.score >= 40) {
      strengths.push({
        area: 'Referências Doutrinárias',
        text: 'Bom uso de doutrina para embasar os argumentos apresentados.'
      });
    }

    if (elements.conclusao.score >= 60) {
      strengths.push({
        area: 'Conclusão',
        text: 'Pedidos e conclusão bem estruturados e claramente formulados.'
      });
    }

    // If no strengths found, provide at least one generic
    if (strengths.length === 0) {
      strengths.push({
        area: 'Estrutura',
        text: 'O documento apresenta estrutura básica reconhecível de peça jurídica.'
      });
    }

    // Return top 3
    return strengths.slice(0, 3);
  };

  /**
   * Generate identified weaknesses.
   */
  SJIFAnalyzer.prototype._generateWeaknesses = function (elements, coerencia) {
    var weaknesses = [];

    if (elements.normas.score < 40) {
      weaknesses.push({
        area: 'Fundamentação Legal',
        text: 'Fundamentação jurídica insuficiente. Poucos dispositivos legais citados.',
        severity: 'alta'
      });
    }

    if (elements.fatos.score < 40) {
      weaknesses.push({
        area: 'Narrativa Fática',
        text: 'Exposição dos fatos carece de detalhamento e objetividade.',
        severity: 'alta'
      });
    }

    if (elements.provas.score < 30) {
      weaknesses.push({
        area: 'Base Probatória',
        text: 'Ausência ou insuficiência de referências probatórias.',
        severity: 'alta'
      });
    }

    if (!elements.jurisprudencia.found) {
      weaknesses.push({
        area: 'Jurisprudência',
        text: 'Nenhuma referência jurisprudencial identificada no documento.',
        severity: 'media'
      });
    }

    if (coerencia.criteria.consistenciaLogica < 50) {
      weaknesses.push({
        area: 'Consistência Lógica',
        text: 'Falta de conexão lógica entre os elementos do documento.',
        severity: 'alta'
      });
    }

    if (coerencia.criteria.clarezaRedacional < 50) {
      weaknesses.push({
        area: 'Clareza Redacional',
        text: 'Organização textual deficiente. Parágrafos longos e sem divisão clara.',
        severity: 'media'
      });
    }

    if (!elements.conclusao.found) {
      weaknesses.push({
        area: 'Conclusão',
        text: 'Ausência de conclusão ou pedidos claramente formulados.',
        severity: 'alta'
      });
    }

    if (!elements.doutrina.found && !elements.jurisprudencia.found) {
      weaknesses.push({
        area: 'Suporte Teórico',
        text: 'Ausência de referências doutrinárias e jurisprudenciais.',
        severity: 'media'
      });
    }

    // Sort by severity
    var severityOrder = { alta: 0, media: 1, baixa: 2 };
    weaknesses.sort(function (a, b) {
      return (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
    });

    // Return top 3
    return weaknesses.slice(0, 3);
  };

  // Attach to window
  window.SJIFAnalyzer = SJIFAnalyzer;

})();
