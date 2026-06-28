/**
 * SJIF Classifier - Legal Document Classification Engine
 * Sigma Juris Intelligence Framework
 *
 * Classifies Brazilian legal documents by analyzing text content
 * against a comprehensive taxonomy of document types.
 *
 * Attaches to window.SJIFClassifier
 */
(function () {
  'use strict';

  // ─── Pattern Definitions ────────────────────────────────────────────
  // Each pattern set defines headers, keywords, structures, and optional
  // legal references that characterize a specific document type.

  var PATTERNS = {
    // ── Petições ─────────────────────────────────────────────────────
    peticao_inicial: {
      headers: ['excelentíssimo', 'excelentissimo', 'meritíssimo', 'meritissimo', 'douta', 'egrégio', 'egregio'],
      keywords: ['requer', 'postula', 'pleiteia', 'autor', 'réu', 'reu', 'citação', 'citacao', 'tutela', 'antecipada', 'liminar', 'juntada', 'procuração', 'valor da causa', 'distribuição', 'distribuicao'],
      structures: ['dos fatos', 'do direito', 'dos pedidos', 'do pedido', 'valor da causa', 'das provas', 'da fundamentação', 'da fundamentacao'],
      legalRefs: ['art. 319', 'art. 320', 'cpc']
    },

    contestacao: {
      headers: ['contestação', 'contestacao', 'defesa', 'peça de defesa', 'peca de defesa'],
      keywords: ['contestar', 'impugna', 'impugnação', 'impugnacao', 'réu', 'reu', 'preliminar', 'mérito', 'merito', 'improcedência', 'improcedencia', 'inépcia', 'inepcia', 'ilegitimidade'],
      structures: ['preliminarmente', 'no mérito', 'no merito', 'dos pedidos', 'da improcedência', 'da improcedencia', 'da preliminar'],
      legalRefs: ['art. 335', 'art. 336', 'art. 337']
    },

    reconvencao: {
      headers: ['reconvenção', 'reconvencao', 'pedido reconvencional'],
      keywords: ['reconvinte', 'reconvindo', 'pedido reconvencional', 'reconvir'],
      structures: ['do pedido reconvencional', 'da reconvenção', 'da reconvencao'],
      legalRefs: ['art. 343']
    },

    replica: {
      headers: ['réplica', 'replica', 'impugnação à contestação', 'impugnacao a contestacao'],
      keywords: ['réplica', 'replica', 'impugnar', 'refutar', 'rebater', 'contra-argumentar'],
      structures: ['da réplica', 'da replica', 'das preliminares'],
      legalRefs: ['art. 350', 'art. 351']
    },

    // ── Recursos ─────────────────────────────────────────────────────
    apelacao: {
      headers: ['apelação', 'apelacao', 'recurso de apelação', 'recurso de apelacao'],
      keywords: ['apelante', 'apelado', 'sentença', 'sentenca', 'reforma', 'provimento', 'anulação', 'anulacao', 'inconformismo', 'recursal'],
      structures: ['razões', 'razoes', 'contrarrazões', 'contrarrazoes', 'tempestividade', 'do cabimento', 'da tempestividade'],
      legalRefs: ['art. 1.009', 'art. 1009', 'art. 1.010', 'art. 1010']
    },

    recurso_especial: {
      headers: ['recurso especial', 'resp'],
      keywords: ['lei federal', 'art. 105', 'superior tribunal', 'stj', 'prequestionamento', 'negativa de vigência', 'divergência jurisprudencial', 'divergencia jurisprudencial'],
      structures: ['cabimento', 'dissídio jurisprudencial', 'dissidio jurisprudencial', 'do prequestionamento'],
      legalRefs: ['art. 105', 'iii', 'cf/88']
    },

    recurso_extraordinario: {
      headers: ['recurso extraordinário', 'recurso extraordinario', 'rext', 're '],
      keywords: ['constituição', 'constituicao', 'art. 102', 'supremo tribunal', 'stf', 'repercussão geral', 'repercussao geral', 'violação constitucional', 'violacao constitucional'],
      structures: ['repercussão geral', 'repercussao geral', 'violação constitucional', 'violacao constitucional', 'do cabimento'],
      legalRefs: ['art. 102', 'iii', 'cf/88']
    },

    agravo_instrumento: {
      headers: ['agravo de instrumento'],
      keywords: ['agravante', 'agravado', 'decisão interlocutória', 'decisao interlocutoria', 'efeito suspensivo', 'tutela recursal', 'perigo de dano'],
      structures: ['da decisão agravada', 'da decisao agravada', 'do fumus boni iuris', 'do periculum in mora'],
      legalRefs: ['art. 1.015', 'art. 1015', 'art. 1.019', 'art. 1019']
    },

    agravo_interno: {
      headers: ['agravo interno', 'agravo regimental'],
      keywords: ['agravante', 'decisão monocrática', 'decisao monocratica', 'relator', 'reconsideração', 'reconsideracao'],
      structures: ['da decisão monocrática', 'da decisao monocratica', 'do cabimento'],
      legalRefs: ['art. 1.021', 'art. 1021']
    },

    embargos_declaracao: {
      headers: ['embargos de declaração', 'embargos de declaracao', 'embargos declaratórios', 'embargos declaratorios'],
      keywords: ['omissão', 'omissao', 'contradição', 'contradicao', 'obscuridade', 'erro material', 'aclaratórios', 'aclaratorios'],
      structures: ['da omissão', 'da omissao', 'da contradição', 'da contradicao', 'da obscuridade'],
      legalRefs: ['art. 1.022', 'art. 1022', 'art. 1.023', 'art. 1023']
    },

    recurso_ordinario: {
      headers: ['recurso ordinário', 'recurso ordinario'],
      keywords: ['ordinário', 'ordinario', 'mandado de segurança', 'mandado de seguranca', 'habeas corpus', 'habeas data'],
      structures: ['do cabimento', 'das razões', 'das razoes'],
      legalRefs: ['art. 102', 'ii', 'art. 105', 'ii']
    },

    embargos_divergencia: {
      headers: ['embargos de divergência', 'embargos de divergencia'],
      keywords: ['divergência', 'divergencia', 'turma', 'seção', 'secao', 'dissenso', 'paradigma'],
      structures: ['do dissenso', 'do paradigma'],
      legalRefs: ['art. 1.043', 'art. 1043']
    },

    // ── Execução ─────────────────────────────────────────────────────
    embargos_execucao: {
      headers: ['embargos à execução', 'embargos a execucao', 'embargos do executado'],
      keywords: ['executado', 'título executivo', 'titulo executivo', 'excesso', 'nulidade da execução', 'nulidade da execucao', 'penhora', 'impenhorabilidade'],
      structures: ['da execução', 'da execucao', 'do excesso', 'da nulidade'],
      legalRefs: ['art. 914', 'art. 915', 'art. 917']
    },

    impugnacao_cumprimento_sentenca: {
      headers: ['impugnação ao cumprimento de sentença', 'impugnacao ao cumprimento de sentenca'],
      keywords: ['cumprimento', 'sentença', 'sentenca', 'excesso', 'pagamento', 'inexigibilidade', 'prescrição', 'prescricao'],
      structures: ['do excesso de execução', 'da inexigibilidade'],
      legalRefs: ['art. 525']
    },

    execucao_titulo_extrajudicial: {
      headers: ['execução de título extrajudicial', 'execucao de titulo extrajudicial', 'ação de execução', 'acao de execucao'],
      keywords: ['executar', 'credor', 'devedor', 'título extrajudicial', 'titulo extrajudicial', 'cheque', 'nota promissória', 'nota promissoria', 'duplicata'],
      structures: ['do título', 'do titulo', 'do débito', 'do debito'],
      legalRefs: ['art. 784', 'art. 786', 'art. 824']
    },

    // ── Ações Constitucionais ────────────────────────────────────────
    mandado_seguranca: {
      headers: ['mandado de segurança', 'mandado de seguranca', 'mandamus'],
      keywords: ['direito líquido', 'direito liquido', 'certo', 'autoridade coatora', 'liminar', 'ato ilegal', 'abuso de poder', 'ilegalidade'],
      structures: ['da autoridade coatora', 'do direito líquido e certo', 'do direito liquido e certo', 'do ato coator'],
      legalRefs: ['lei 12.016', 'art. 5º', 'lxix', 'cf/88']
    },

    habeas_corpus: {
      headers: ['habeas corpus', 'hc'],
      keywords: ['liberdade', 'locomoção', 'locomocao', 'paciente', 'coação ilegal', 'coacao ilegal', 'constrangimento', 'preso', 'prisão', 'prisao', 'detenção', 'detencao'],
      structures: ['do paciente', 'da autoridade coatora', 'do constrangimento ilegal'],
      legalRefs: ['art. 5º', 'lxviii', 'art. 647', 'art. 648', 'cpp']
    },

    habeas_data: {
      headers: ['habeas data'],
      keywords: ['informações', 'informacoes', 'registro', 'banco de dados', 'retificação', 'retificacao', 'dados pessoais'],
      structures: ['do direito à informação', 'da retificação', 'da retificacao'],
      legalRefs: ['lei 9.507', 'art. 5º', 'lxxii']
    },

    acao_popular: {
      headers: ['ação popular', 'acao popular'],
      keywords: ['cidadão', 'cidadao', 'patrimônio público', 'patrimonio publico', 'moralidade administrativa', 'lesivo', 'anulação', 'anulacao', 'eleitor'],
      structures: ['da lesividade', 'do ato lesivo', 'da moralidade'],
      legalRefs: ['lei 4.717', 'art. 5º', 'lxxiii']
    },

    acao_civil_publica: {
      headers: ['ação civil pública', 'acao civil publica', 'acp'],
      keywords: ['ministério público', 'ministerio publico', 'meio ambiente', 'consumidor', 'patrimônio', 'patrimonio', 'difusos', 'coletivos', 'interesse público', 'interesse publico'],
      structures: ['do interesse coletivo', 'da tutela coletiva', 'dos interesses difusos'],
      legalRefs: ['lei 7.347', 'art. 1º', 'art. 5º']
    },

    mandado_injuncao: {
      headers: ['mandado de injunção', 'mandado de injuncao'],
      keywords: ['norma regulamentadora', 'omissão legislativa', 'omissao legislativa', 'direito constitucional', 'exercício', 'exercicio'],
      structures: ['da omissão legislativa', 'da omissao legislativa', 'do direito inviabilizado'],
      legalRefs: ['art. 5º', 'lxxi', 'lei 13.300']
    },

    adin: {
      headers: ['ação direta de inconstitucionalidade', 'acao direta de inconstitucionalidade', 'adi', 'adin'],
      keywords: ['inconstitucionalidade', 'norma inconstitucional', 'controle concentrado', 'supremo tribunal federal', 'stf'],
      structures: ['da inconstitucionalidade', 'do cabimento', 'da legitimidade'],
      legalRefs: ['art. 102', 'i', 'a', 'lei 9.868']
    },

    adpf: {
      headers: ['arguição de descumprimento de preceito fundamental', 'arguicao de descumprimento de preceito fundamental', 'adpf'],
      keywords: ['preceito fundamental', 'descumprimento', 'subsidiariedade', 'ato do poder público', 'ato do poder publico'],
      structures: ['do preceito fundamental', 'do descumprimento', 'da subsidiariedade'],
      legalRefs: ['lei 9.882', 'art. 102', '§ 1º']
    },

    // ── Ações Tributárias ────────────────────────────────────────────
    acao_anulatoria_tributaria: {
      headers: ['ação anulatória', 'acao anulatoria', 'anulatória de débito fiscal', 'anulatoria de debito fiscal'],
      keywords: ['tributo', 'lançamento', 'lancamento', 'auto de infração', 'auto de infracao', 'nulidade', 'anulação', 'anulacao', 'fisco', 'fazenda'],
      structures: ['do lançamento', 'do lancamento', 'da nulidade', 'do auto de infração', 'do auto de infracao'],
      legalRefs: ['ctn', 'art. 145', 'art. 150', 'art. 156']
    },

    mandado_seguranca_tributario: {
      headers: ['mandado de segurança', 'mandado de seguranca'],
      keywords: ['tributo', 'imposição tributária', 'imposicao tributaria', 'cobrança ilegal', 'cobranca ilegal', 'compensação', 'compensacao', 'imunidade', 'isenção', 'isencao'],
      structures: ['da ilegalidade tributária', 'da ilegalidade tributaria', 'da compensação', 'da compensacao'],
      legalRefs: ['ctn', 'lei 12.016', 'art. 151']
    },

    execucao_fiscal: {
      headers: ['execução fiscal', 'execucao fiscal'],
      keywords: ['fazenda pública', 'fazenda publica', 'certidão de dívida ativa', 'certidao de divida ativa', 'cda', 'executado', 'penhora', 'arresto'],
      structures: ['da dívida ativa', 'da divida ativa', 'do título executivo', 'do titulo executivo'],
      legalRefs: ['lei 6.830', 'art. 2º', 'art. 3º']
    },

    acao_declaratoria_tributaria: {
      headers: ['ação declaratória', 'acao declaratoria'],
      keywords: ['relação jurídico-tributária', 'relacao juridico-tributaria', 'inexistência', 'inexistencia', 'declarar', 'obrigação tributária', 'obrigacao tributaria'],
      structures: ['da relação tributária', 'da relacao tributaria', 'da inexistência', 'da inexistencia'],
      legalRefs: ['ctn', 'art. 19', 'cpc']
    },

    acao_repeticao_indebito: {
      headers: ['repetição de indébito', 'repeticao de indebito', 'restituição', 'restituicao'],
      keywords: ['restituição', 'restituicao', 'pagamento indevido', 'tributo', 'indébito', 'indebito', 'repetir'],
      structures: ['do pagamento indevido', 'da restituição', 'da restituicao'],
      legalRefs: ['art. 165', 'ctn', 'art. 168']
    },

    // ── Ações Ambientais ─────────────────────────────────────────────
    acao_ambiental: {
      headers: ['ação ambiental', 'acao ambiental', 'ação de reparação ambiental', 'acao de reparacao ambiental'],
      keywords: ['meio ambiente', 'dano ambiental', 'reparação', 'reparacao', 'degradação', 'degradacao', 'poluição', 'poluicao', 'flora', 'fauna', 'desmatamento', 'licenciamento'],
      structures: ['do dano ambiental', 'da reparação', 'da reparacao', 'do licenciamento'],
      legalRefs: ['lei 6.938', 'lei 9.605', 'art. 225', 'cf/88']
    },

    // ── Ações Minerárias ─────────────────────────────────────────────
    acao_mineraria: {
      headers: ['ação minerária', 'acao mineraria', 'direito minerário', 'direito minerario'],
      keywords: ['mineração', 'mineracao', 'lavra', 'pesquisa mineral', 'concessão', 'concessao', 'anm', 'dnpm', 'royalties', 'cfem'],
      structures: ['da concessão de lavra', 'da concessao de lavra', 'do direito de pesquisa'],
      legalRefs: ['código de mineração', 'codigo de mineracao', 'decreto-lei 227', 'lei 13.540']
    },

    // ── Administrativo ───────────────────────────────────────────────
    acao_administrativa: {
      headers: ['ação administrativa', 'acao administrativa'],
      keywords: ['administração pública', 'administracao publica', 'servidor', 'concurso', 'licitação', 'licitacao', 'improbidade', 'ato administrativo'],
      structures: ['do ato administrativo', 'da ilegalidade', 'da nulidade'],
      legalRefs: ['lei 8.666', 'lei 14.133', 'lei 8.112', 'lei 8.429']
    },

    acao_improbidade: {
      headers: ['ação de improbidade', 'acao de improbidade', 'improbidade administrativa'],
      keywords: ['improbidade', 'enriquecimento ilícito', 'enriquecimento ilicito', 'lesão ao erário', 'lesao ao erario', 'princípios administrativos', 'principios administrativos', 'agente público', 'agente publico'],
      structures: ['do ato de improbidade', 'das sanções', 'das sancoes', 'do enriquecimento'],
      legalRefs: ['lei 8.429', 'art. 9', 'art. 10', 'art. 11']
    },

    // ── Trabalhista ──────────────────────────────────────────────────
    reclamacao_trabalhista: {
      headers: ['reclamação trabalhista', 'reclamacao trabalhista', 'reclamatória', 'reclamatoria'],
      keywords: ['empregado', 'empregador', 'clt', 'verbas rescisórias', 'verbas rescisorias', 'fgts', 'aviso prévio', 'aviso previo', 'horas extras', 'salário', 'salario', 'justa causa'],
      structures: ['do contrato de trabalho', 'das verbas', 'dos pedidos', 'da rescisão', 'da rescisao'],
      legalRefs: ['clt', 'art. 7º', 'cf/88', 'art. 468', 'art. 477']
    },

    recurso_revista: {
      headers: ['recurso de revista'],
      keywords: ['tst', 'tribunal superior do trabalho', 'violação', 'violacao', 'divergência', 'divergencia', 'súmula', 'sumula'],
      structures: ['do cabimento', 'da violação', 'da violacao', 'do prequestionamento'],
      legalRefs: ['art. 896', 'clt']
    },

    // ── Penal ────────────────────────────────────────────────────────
    denuncia: {
      headers: ['denúncia', 'denuncia'],
      keywords: ['ministério público', 'ministerio publico', 'crime', 'delito', 'acusado', 'indiciado', 'pena', 'reclusão', 'reclusao', 'detenção', 'detencao'],
      structures: ['dos fatos', 'do crime', 'da autoria', 'da materialidade'],
      legalRefs: ['cp', 'cpp', 'art. 41', 'art. 395']
    },

    defesa_previa: {
      headers: ['defesa prévia', 'defesa previa', 'resposta à acusação', 'resposta a acusacao'],
      keywords: ['absolvição', 'absolvicao', 'inocência', 'inocencia', 'acusado', 'atipicidade', 'excludente'],
      structures: ['da defesa', 'das testemunhas', 'das provas'],
      legalRefs: ['art. 396', 'art. 396-a', 'cpp']
    },

    alegacoes_finais: {
      headers: ['alegações finais', 'alegacoes finais', 'memoriais'],
      keywords: ['absolvição', 'absolvicao', 'condenação', 'condenacao', 'prova', 'instrução', 'instrucao', 'debate'],
      structures: ['dos fatos provados', 'do direito', 'do pedido'],
      legalRefs: ['art. 403', 'cpp']
    },

    // ── Sentenças e Decisões ─────────────────────────────────────────
    sentenca: {
      headers: ['sentença', 'sentenca'],
      keywords: ['julgo', 'procedente', 'improcedente', 'parcialmente procedente', 'condeno', 'absolvo', 'dispositivo', 'relatório', 'relatorio', 'fundamentação', 'fundamentacao'],
      structures: ['relatório', 'relatorio', 'fundamentação', 'fundamentacao', 'dispositivo', 'ante o exposto', 'diante do exposto'],
      legalRefs: ['art. 489', 'cpc', 'art. 381', 'cpp']
    },

    acordao: {
      headers: ['acórdão', 'acordao', 'acordam'],
      keywords: ['acordam', 'turma', 'câmara', 'camara', 'relator', 'voto', 'ementa', 'unanimidade', 'maioria'],
      structures: ['ementa', 'acórdão', 'acordao', 'voto do relator', 'dispositivo'],
      legalRefs: ['art. 941', 'cpc']
    },

    // ── Contratos e Pareceres ────────────────────────────────────────
    parecer: {
      headers: ['parecer', 'parecer jurídico', 'parecer juridico'],
      keywords: ['opina', 'parecer', 'consulta', 'consulente', 'análise', 'analise', 'entendimento', 'conclusão', 'conclusao'],
      structures: ['do objeto', 'da consulta', 'da análise', 'da analise', 'da conclusão', 'da conclusao'],
      legalRefs: []
    },

    contrato: {
      headers: ['contrato', 'instrumento particular', 'instrumento público', 'instrumento publico'],
      keywords: ['contratante', 'contratado', 'cláusula', 'clausula', 'objeto', 'vigência', 'vigencia', 'rescisão', 'rescisao', 'multa', 'foro'],
      structures: ['do objeto', 'do preço', 'do preco', 'das obrigações', 'das obrigacoes', 'da vigência', 'da vigencia', 'do foro'],
      legalRefs: ['código civil', 'codigo civil', 'art. 421', 'art. 422']
    }
  };

  // ─── SJIFClassifier Class ───────────────────────────────────────────

  function SJIFClassifier() {
    this.taxonomy = (typeof window !== 'undefined' && window.SJIF_TAXONOMY) || null;
    this._patterns = PATTERNS;
    this._accentMap = {
      'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
      'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
      'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
      'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
      'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
      'ç': 'c', 'ñ': 'n'
    };
  }

  /**
   * Normalize text for comparison: lowercase and remove accents.
   * @param {string} text
   * @returns {string}
   */
  SJIFClassifier.prototype._normalize = function (text) {
    if (!text) return '';
    var lower = text.toLowerCase();
    var map = this._accentMap;
    return lower.replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, function (ch) {
      return map[ch] || ch;
    });
  };

  /**
   * Count how many keywords from a list appear in the text.
   * Returns { count, matched } where matched is the list of matched terms.
   */
  SJIFClassifier.prototype._countMatches = function (normalizedText, terms) {
    var count = 0;
    var matched = [];
    for (var i = 0; i < terms.length; i++) {
      var term = this._normalize(terms[i]);
      if (normalizedText.indexOf(term) !== -1) {
        count++;
        matched.push(terms[i]);
      }
    }
    return { count: count, matched: matched };
  };

  /**
   * Check for strong structural patterns at the beginning of the document.
   * These are high-confidence signals.
   */
  SJIFClassifier.prototype._checkStrongPatterns = function (normalizedText) {
    var first500 = normalizedText.substring(0, 500);
    var strongSignals = [];

    // ACORDAM at beginning → acórdão
    if (/\bacordam\b/.test(first500)) {
      strongSignals.push({ type: 'acordao', boost: 40, signal: 'ACORDAM header' });
    }

    // EXCELENTÍSSIMO → petição
    if (/\bexcelentissimo\b/.test(first500) || /\bexcelentissim[oa]\b/.test(first500)) {
      strongSignals.push({ type: 'peticao_inicial', boost: 30, signal: 'EXCELENTÍSSIMO header' });
    }

    // SENTENÇA / JULGO → sentença
    if (/\bjulgo\s+(procedente|improcedente|parcialmente)/.test(normalizedText)) {
      strongSignals.push({ type: 'sentenca', boost: 35, signal: 'JULGO + dispositivo' });
    }

    // EMENTA → acórdão
    if (/\bementa\b/.test(first500) && /\bacordao\b|\bacordam\b/.test(normalizedText)) {
      strongSignals.push({ type: 'acordao', boost: 25, signal: 'EMENTA + ACÓRDÃO' });
    }

    // DENÚNCIA do MP → denúncia penal
    if (/\bdenuncia\b/.test(first500) && /\bministerio publico\b/.test(normalizedText)) {
      strongSignals.push({ type: 'denuncia', boost: 30, signal: 'DENÚNCIA + Ministério Público' });
    }

    // HABEAS CORPUS
    if (/\bhabeas\s+corpus\b/.test(first500)) {
      strongSignals.push({ type: 'habeas_corpus', boost: 35, signal: 'HABEAS CORPUS header' });
    }

    // MANDADO DE SEGURANÇA
    if (/\bmandado\s+de\s+seguranca\b/.test(first500)) {
      strongSignals.push({ type: 'mandado_seguranca', boost: 35, signal: 'MANDADO DE SEGURANÇA header' });
    }

    // EMBARGOS DE DECLARAÇÃO
    if (/\bembargos\s+de\s+declarac(ao|oes)\b/.test(first500)) {
      strongSignals.push({ type: 'embargos_declaracao', boost: 35, signal: 'EMBARGOS DE DECLARAÇÃO header' });
    }

    // AGRAVO DE INSTRUMENTO
    if (/\bagravo\s+de\s+instrumento\b/.test(first500)) {
      strongSignals.push({ type: 'agravo_instrumento', boost: 35, signal: 'AGRAVO DE INSTRUMENTO header' });
    }

    // RECURSO ESPECIAL
    if (/\brecurso\s+especial\b/.test(first500)) {
      strongSignals.push({ type: 'recurso_especial', boost: 35, signal: 'RECURSO ESPECIAL header' });
    }

    // RECURSO EXTRAORDINÁRIO
    if (/\brecurso\s+extraordinario\b/.test(first500)) {
      strongSignals.push({ type: 'recurso_extraordinario', boost: 35, signal: 'RECURSO EXTRAORDINÁRIO header' });
    }

    // CONTESTAÇÃO
    if (/\bcontestac(ao|oes)\b/.test(first500)) {
      strongSignals.push({ type: 'contestacao', boost: 30, signal: 'CONTESTAÇÃO header' });
    }

    // APELAÇÃO
    if (/\bapelac(ao|oes)\b/.test(first500)) {
      strongSignals.push({ type: 'apelacao', boost: 30, signal: 'APELAÇÃO header' });
    }

    // AÇÃO CIVIL PÚBLICA
    if (/\bacao\s+civil\s+publica\b/.test(first500)) {
      strongSignals.push({ type: 'acao_civil_publica', boost: 35, signal: 'AÇÃO CIVIL PÚBLICA header' });
    }

    // RECLAMAÇÃO TRABALHISTA
    if (/\breclamac(ao|oes)\s+trabalhista\b/.test(first500) || /\breclamatoria\b/.test(first500)) {
      strongSignals.push({ type: 'reclamacao_trabalhista', boost: 35, signal: 'RECLAMAÇÃO TRABALHISTA header' });
    }

    // PARECER
    if (/\bparecer\s*(juridico|n[.ºo°])\b/.test(first500)) {
      strongSignals.push({ type: 'parecer', boost: 30, signal: 'PARECER header' });
    }

    // CONTRATO
    if (/\b(contrato|instrumento\s+particular)\b/.test(first500) && /\bclausula\b/.test(normalizedText)) {
      strongSignals.push({ type: 'contrato', boost: 30, signal: 'CONTRATO + cláusulas' });
    }

    return strongSignals;
  };

  /**
   * Map type codes to human-readable names and categories.
   */
  SJIFClassifier.prototype._typeInfo = {
    peticao_inicial:                { name: 'Petição Inicial', category: 'Petições' },
    contestacao:                    { name: 'Contestação', category: 'Petições' },
    reconvencao:                    { name: 'Reconvenção', category: 'Petições' },
    replica:                        { name: 'Réplica', category: 'Petições' },
    apelacao:                       { name: 'Apelação', category: 'Recursos' },
    recurso_especial:               { name: 'Recurso Especial', category: 'Recursos' },
    recurso_extraordinario:         { name: 'Recurso Extraordinário', category: 'Recursos' },
    agravo_instrumento:             { name: 'Agravo de Instrumento', category: 'Recursos' },
    agravo_interno:                 { name: 'Agravo Interno', category: 'Recursos' },
    embargos_declaracao:            { name: 'Embargos de Declaração', category: 'Recursos' },
    recurso_ordinario:              { name: 'Recurso Ordinário', category: 'Recursos' },
    embargos_divergencia:           { name: 'Embargos de Divergência', category: 'Recursos' },
    embargos_execucao:              { name: 'Embargos à Execução', category: 'Execução' },
    impugnacao_cumprimento_sentenca:{ name: 'Impugnação ao Cumprimento de Sentença', category: 'Execução' },
    execucao_titulo_extrajudicial:  { name: 'Execução de Título Extrajudicial', category: 'Execução' },
    mandado_seguranca:              { name: 'Mandado de Segurança', category: 'Ações Constitucionais' },
    habeas_corpus:                  { name: 'Habeas Corpus', category: 'Ações Constitucionais' },
    habeas_data:                    { name: 'Habeas Data', category: 'Ações Constitucionais' },
    acao_popular:                   { name: 'Ação Popular', category: 'Ações Constitucionais' },
    acao_civil_publica:             { name: 'Ação Civil Pública', category: 'Ações Constitucionais' },
    mandado_injuncao:               { name: 'Mandado de Injunção', category: 'Ações Constitucionais' },
    adin:                           { name: 'Ação Direta de Inconstitucionalidade', category: 'Ações Constitucionais' },
    adpf:                           { name: 'ADPF', category: 'Ações Constitucionais' },
    acao_anulatoria_tributaria:     { name: 'Ação Anulatória Tributária', category: 'Tributário' },
    mandado_seguranca_tributario:   { name: 'Mandado de Segurança Tributário', category: 'Tributário' },
    execucao_fiscal:                { name: 'Execução Fiscal', category: 'Tributário' },
    acao_declaratoria_tributaria:   { name: 'Ação Declaratória Tributária', category: 'Tributário' },
    acao_repeticao_indebito:        { name: 'Repetição de Indébito', category: 'Tributário' },
    acao_ambiental:                 { name: 'Ação Ambiental', category: 'Ambiental' },
    acao_mineraria:                 { name: 'Ação Minerária', category: 'Minerário' },
    acao_administrativa:            { name: 'Ação Administrativa', category: 'Administrativo' },
    acao_improbidade:               { name: 'Ação de Improbidade Administrativa', category: 'Administrativo' },
    reclamacao_trabalhista:         { name: 'Reclamação Trabalhista', category: 'Trabalhista' },
    recurso_revista:                { name: 'Recurso de Revista', category: 'Trabalhista' },
    denuncia:                       { name: 'Denúncia', category: 'Penal' },
    defesa_previa:                  { name: 'Defesa Prévia', category: 'Penal' },
    alegacoes_finais:               { name: 'Alegações Finais', category: 'Penal' },
    sentenca:                       { name: 'Sentença', category: 'Decisões' },
    acordao:                        { name: 'Acórdão', category: 'Decisões' },
    parecer:                        { name: 'Parecer Jurídico', category: 'Pareceres' },
    contrato:                       { name: 'Contrato', category: 'Contratos' }
  };

  /**
   * Classify a legal document text.
   *
   * @param {string} text - The document text to classify.
   * @returns {Object} Classification result with typeCode, typeName, category, confidence, and matches.
   */
  SJIFClassifier.prototype.classify = function (text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        typeCode: 'desconhecido',
        typeName: 'Documento Não Identificado',
        category: 'Outros',
        confidence: 0,
        matches: [],
        allScores: []
      };
    }

    var normalizedText = this._normalize(text);
    var scores = {};
    var matchDetails = {};
    var self = this;

    // Step 1: Score each pattern set based on keyword matches
    var typeKeys = Object.keys(this._patterns);
    for (var i = 0; i < typeKeys.length; i++) {
      var typeCode = typeKeys[i];
      var pattern = this._patterns[typeCode];
      var score = 0;
      var matches = [];

      // Headers (high weight = 5 per match)
      var headerResult = this._countMatches(normalizedText, pattern.headers);
      score += headerResult.count * 5;
      matches = matches.concat(headerResult.matched.map(function (m) { return { type: 'header', term: m }; }));

      // Keywords (medium weight = 2 per match)
      var keywordResult = this._countMatches(normalizedText, pattern.keywords);
      score += keywordResult.count * 2;
      matches = matches.concat(keywordResult.matched.map(function (m) { return { type: 'keyword', term: m }; }));

      // Structures (high weight = 4 per match)
      var structureResult = this._countMatches(normalizedText, pattern.structures);
      score += structureResult.count * 4;
      matches = matches.concat(structureResult.matched.map(function (m) { return { type: 'structure', term: m }; }));

      // Legal references (medium weight = 3 per match)
      if (pattern.legalRefs && pattern.legalRefs.length > 0) {
        var legalResult = this._countMatches(normalizedText, pattern.legalRefs);
        score += legalResult.count * 3;
        matches = matches.concat(legalResult.matched.map(function (m) { return { type: 'legalRef', term: m }; }));
      }

      scores[typeCode] = score;
      matchDetails[typeCode] = matches;
    }

    // Step 2: Apply strong structural pattern boosts
    var strongPatterns = this._checkStrongPatterns(normalizedText);
    for (var j = 0; j < strongPatterns.length; j++) {
      var sp = strongPatterns[j];
      if (scores[sp.type] !== undefined) {
        scores[sp.type] += sp.boost;
        matchDetails[sp.type].push({ type: 'strongPattern', term: sp.signal });
      }
    }

    // Step 3: Find the maximum score and convert to confidence
    var maxScore = 0;
    var bestType = 'desconhecido';
    var allScores = [];

    for (var k = 0; k < typeKeys.length; k++) {
      var tc = typeKeys[k];
      var s = scores[tc];
      allScores.push({ typeCode: tc, score: s });
      if (s > maxScore) {
        maxScore = s;
        bestType = tc;
      }
    }

    // Sort all scores descending
    allScores.sort(function (a, b) { return b.score - a.score; });

    // Compute confidence as a percentage (cap at 100)
    // Scale: 40+ points = 100% confidence, 0 = 0%
    var confidence = Math.min(100, Math.round((maxScore / 40) * 100));

    // If best score is 0, return unknown
    if (maxScore === 0) {
      return {
        typeCode: 'desconhecido',
        typeName: 'Documento Não Identificado',
        category: 'Outros',
        confidence: 0,
        matches: [],
        allScores: allScores
      };
    }

    var info = this._typeInfo[bestType] || { name: bestType, category: 'Outros' };

    return {
      typeCode: bestType,
      typeName: info.name,
      category: info.category,
      confidence: confidence,
      matches: matchDetails[bestType] || [],
      allScores: allScores.slice(0, 5) // Top 5
    };
  };

  /**
   * Get a human-readable confidence label.
   * @param {number} confidence - 0 to 100
   * @returns {string} 'Alta', 'Média', or 'Baixa'
   */
  SJIFClassifier.prototype.getConfidenceLabel = function (confidence) {
    if (confidence >= 70) return 'Alta';
    if (confidence >= 40) return 'Média';
    return 'Baixa';
  };

  /**
   * Get the top N suggested document types for the given text.
   * @param {string} text
   * @param {number} [limit=5]
   * @returns {Array<Object>} Array of { typeCode, typeName, category, score, confidence }
   */
  SJIFClassifier.prototype.getSuggestedTypes = function (text, limit) {
    limit = limit || 5;

    if (!text || typeof text !== 'string') return [];

    var normalizedText = this._normalize(text);
    var scores = [];
    var self = this;
    var typeKeys = Object.keys(this._patterns);

    for (var i = 0; i < typeKeys.length; i++) {
      var typeCode = typeKeys[i];
      var pattern = this._patterns[typeCode];
      var score = 0;

      score += this._countMatches(normalizedText, pattern.headers).count * 5;
      score += this._countMatches(normalizedText, pattern.keywords).count * 2;
      score += this._countMatches(normalizedText, pattern.structures).count * 4;
      if (pattern.legalRefs) {
        score += this._countMatches(normalizedText, pattern.legalRefs).count * 3;
      }

      if (score > 0) {
        var info = this._typeInfo[typeCode] || { name: typeCode, category: 'Outros' };
        scores.push({
          typeCode: typeCode,
          typeName: info.name,
          category: info.category,
          score: score,
          confidence: Math.min(100, Math.round((score / 40) * 100))
        });
      }
    }

    // Apply strong pattern boosts
    var strongPatterns = this._checkStrongPatterns(normalizedText);
    for (var j = 0; j < strongPatterns.length; j++) {
      var sp = strongPatterns[j];
      for (var k = 0; k < scores.length; k++) {
        if (scores[k].typeCode === sp.type) {
          scores[k].score += sp.boost;
          scores[k].confidence = Math.min(100, Math.round((scores[k].score / 40) * 100));
          break;
        }
      }
    }

    scores.sort(function (a, b) { return b.score - a.score; });
    return scores.slice(0, limit);
  };

  // Expose static patterns
  SJIFClassifier.PATTERNS = PATTERNS;

  // Attach to window
  window.SJIFClassifier = SJIFClassifier;

})();
