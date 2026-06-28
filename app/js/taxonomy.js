/**
 * SJIF Taxonomy Module
 * Contains all 80 legal document types organized by category
 * for the Brazilian legal system.
 *
 * Attaches to window.SJIF_TAXONOMY
 */
(function() {
  'use strict';

  window.SJIF_TAXONOMY = {

    // ========================================================================
    // CATEGORIES
    // ========================================================================
    categories: [
      { id: 'judicial', name: 'Processo Judicial', icon: '⚖️', color: '#3498DB' },
      { id: 'administrativo', name: 'Processo Administrativo', icon: '🏛️', color: '#9B59B6' },
      { id: 'tributario', name: 'Direito Tributário', icon: '💰', color: '#F39C12' },
      { id: 'ambiental', name: 'Direito Ambiental', icon: '🌿', color: '#27AE60' },
      { id: 'minerario', name: 'Direito Minerário', icon: '⛏️', color: '#E67E22' },
      { id: 'constitucional', name: 'Ações Constitucionais', icon: '📜', color: '#E74C3C' }
    ],

    // ========================================================================
    // TYPES (80 total)
    // ========================================================================
    types: [

      // ======================================================================
      // JUDICIAL — Petições (ids 1-6)
      // ======================================================================
      {
        id: 1, code: 'PET-INI', name: 'Petição Inicial', category: 'judicial', subcategory: 'peticoes',
        description: 'Peça processual que inaugura o processo judicial, apresentando a pretensão do autor perante o Poder Judiciário. Deve conter os fatos, fundamentos jurídicos e o pedido, conforme requisitos do CPC.',
        baseLegal: 'Art. 319, CPC', prazo: 'Variável',
        requisitos: ['Qualificação das partes', 'Causa de pedir', 'Pedido', 'Valor da causa', 'Provas que pretende produzir'],
        keywords: ['petição', 'inicial', 'ação', 'propositura', 'demanda', 'autor', 'réu']
      },
      {
        id: 2, code: 'PET-CONT', name: 'Contestação', category: 'judicial', subcategory: 'peticoes',
        description: 'Peça de defesa do réu em processo judicial, na qual impugna os fatos e fundamentos da petição inicial. É o principal instrumento de resposta do demandado no processo de conhecimento.',
        baseLegal: 'Art. 335, CPC', prazo: '15 dias',
        requisitos: ['Preliminares de mérito', 'Impugnação específica dos fatos', 'Fundamentos de defesa', 'Provas'],
        keywords: ['contestação', 'defesa', 'réu', 'resposta', 'impugnação', 'mérito']
      },
      {
        id: 3, code: 'PET-REPL', name: 'Réplica', category: 'judicial', subcategory: 'peticoes',
        description: 'Manifestação do autor em resposta à contestação do réu, especialmente quando são alegadas preliminares ou fatos novos. Permite ao autor rebater os argumentos defensivos apresentados.',
        baseLegal: 'Art. 351, CPC', prazo: '15 dias',
        requisitos: ['Impugnação das preliminares', 'Refutação dos fatos novos', 'Manutenção do pedido'],
        keywords: ['réplica', 'resposta', 'autor', 'contestação', 'impugnação', 'preliminares']
      },
      {
        id: 4, code: 'PET-RECON', name: 'Reconvenção', category: 'judicial', subcategory: 'peticoes',
        description: 'Ação proposta pelo réu contra o autor nos mesmos autos do processo principal. Permite ao réu formular pretensão própria, invertendo a posição processual das partes quanto ao pedido reconvencional.',
        baseLegal: 'Art. 343, CPC', prazo: '15 dias',
        requisitos: ['Conexão com a ação principal', 'Qualificação das partes', 'Pedido reconvencional', 'Causa de pedir'],
        keywords: ['reconvenção', 'contra-ação', 'réu', 'pedido', 'conexão', 'reconvinte']
      },
      {
        id: 5, code: 'PET-INTER', name: 'Petição Intercorrente', category: 'judicial', subcategory: 'peticoes',
        description: 'Petição apresentada no curso do processo para requerer providências, juntar documentos ou manifestar-se sobre questões incidentais. Instrumento de comunicação processual entre as partes e o juízo.',
        baseLegal: 'Art. 317, CPC', prazo: 'Variável',
        requisitos: ['Referência ao processo', 'Objeto do pedido', 'Fundamentação'],
        keywords: ['petição', 'intercorrente', 'incidental', 'juntada', 'requerimento', 'manifestação']
      },
      {
        id: 6, code: 'PET-EMENDA', name: 'Emenda à Inicial', category: 'judicial', subcategory: 'peticoes',
        description: 'Correção ou complementação da petição inicial determinada pelo juiz quando esta não preenche os requisitos legais. O autor deve sanar as irregularidades sob pena de indeferimento.',
        baseLegal: 'Art. 321, CPC', prazo: '15 dias',
        requisitos: ['Correção dos vícios apontados', 'Complementação de documentos', 'Adequação dos pedidos'],
        keywords: ['emenda', 'inicial', 'correção', 'complementação', 'adequação', 'vícios']
      },

      // ======================================================================
      // JUDICIAL — Recursos (ids 7-14)
      // ======================================================================
      {
        id: 7, code: 'REC-APEL', name: 'Apelação', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso cabível contra sentença de primeiro grau, permitindo a revisão integral da decisão pelo tribunal. É o recurso ordinário por excelência no processo civil brasileiro.',
        baseLegal: 'Art. 1.009, CPC', prazo: '15 dias',
        requisitos: ['Tempestividade', 'Preparo recursal', 'Razões do inconformismo', 'Pedido de reforma', 'Regularidade formal'],
        keywords: ['apelação', 'recurso', 'sentença', 'tribunal', 'reforma', 'segundo grau', 'revisão']
      },
      {
        id: 8, code: 'REC-AGRV', name: 'Agravo de Instrumento', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso interposto contra decisões interlocutórias que versem sobre as hipóteses previstas em lei. Permite a revisão imediata pelo tribunal sem aguardar a sentença final.',
        baseLegal: 'Art. 1.015, CPC', prazo: '15 dias',
        requisitos: ['Cabimento nas hipóteses legais', 'Peças obrigatórias', 'Preparo', 'Razões recursais', 'Pedido de efeito suspensivo'],
        keywords: ['agravo', 'instrumento', 'interlocutória', 'decisão', 'recurso', 'tribunal', 'urgência']
      },
      {
        id: 9, code: 'REC-RESP', name: 'Recurso Especial', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso dirigido ao Superior Tribunal de Justiça para uniformização da interpretação da legislação federal infraconstitucional. Exige prequestionamento e demonstração de violação à lei federal.',
        baseLegal: 'Art. 105, III, CF', prazo: '15 dias',
        requisitos: ['Prequestionamento', 'Violação à lei federal', 'Esgotamento das instâncias ordinárias', 'Demonstração de divergência jurisprudencial', 'Repercussão geral'],
        keywords: ['recurso especial', 'STJ', 'lei federal', 'prequestionamento', 'uniformização', 'divergência']
      },
      {
        id: 10, code: 'REC-REXT', name: 'Recurso Extraordinário', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso dirigido ao Supremo Tribunal Federal quando a decisão contrariar dispositivo constitucional. Exige demonstração de repercussão geral da questão constitucional debatida.',
        baseLegal: 'Art. 102, III, CF', prazo: '15 dias',
        requisitos: ['Repercussão geral', 'Prequestionamento', 'Violação constitucional', 'Esgotamento das instâncias', 'Preliminar formal de repercussão geral'],
        keywords: ['recurso extraordinário', 'STF', 'constituição', 'repercussão geral', 'constitucionalidade']
      },
      {
        id: 11, code: 'REC-EMBD', name: 'Embargos de Declaração', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso destinado a sanar obscuridade, contradição, omissão ou erro material em decisão judicial. Não visa à reforma do julgado, mas ao esclarecimento e integração da decisão.',
        baseLegal: 'Art. 1.022, CPC', prazo: '5 dias',
        requisitos: ['Obscuridade, contradição ou omissão', 'Indicação precisa do vício', 'Tempestividade'],
        keywords: ['embargos', 'declaração', 'obscuridade', 'omissão', 'contradição', 'esclarecimento', 'prequestionamento']
      },
      {
        id: 12, code: 'REC-EMBINF', name: 'Embargos Infringentes', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso cabível contra acórdão não unânime que houver reformado sentença de mérito. Previsto no CPC/73, mantido em situações específicas de transição processual.',
        baseLegal: 'Art. 530, CPC/73', prazo: '15 dias',
        requisitos: ['Acórdão não unânime', 'Reforma de sentença de mérito', 'Razões recursais', 'Tempestividade'],
        keywords: ['embargos', 'infringentes', 'divergência', 'voto vencido', 'acórdão', 'mérito']
      },
      {
        id: 13, code: 'REC-AGINT', name: 'Agravo Interno', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso cabível contra decisão monocrática do relator no tribunal. Leva a apreciação da questão ao órgão colegiado competente para revisão da decisão individual.',
        baseLegal: 'Art. 1.021, CPC', prazo: '15 dias',
        requisitos: ['Decisão monocrática', 'Razões de inconformismo', 'Pedido de reconsideração ao colegiado', 'Tempestividade'],
        keywords: ['agravo', 'interno', 'monocrática', 'relator', 'colegiado', 'tribunal', 'regimental']
      },
      {
        id: 14, code: 'REC-RORD', name: 'Recurso Ordinário', category: 'judicial', subcategory: 'recursos',
        description: 'Recurso dirigido ao STJ ou STF contra decisões denegatórias em mandado de segurança, habeas corpus e habeas data decididos em única instância pelos tribunais superiores.',
        baseLegal: 'Art. 1.027, CPC', prazo: '15 dias',
        requisitos: ['Decisão denegatória', 'Tribunal de origem competente', 'Razões recursais', 'Tempestividade'],
        keywords: ['recurso', 'ordinário', 'mandado', 'segurança', 'denegatória', 'STJ', 'STF']
      },

      // ======================================================================
      // JUDICIAL — Execução (ids 15-18)
      // ======================================================================
      {
        id: 15, code: 'EXEC-TIT', name: 'Execução de Título Extrajudicial', category: 'judicial', subcategory: 'execucao',
        description: 'Ação para cobrança forçada de obrigação representada por título executivo extrajudicial, como cheque, nota promissória ou contrato. O devedor é citado para pagar em 3 dias.',
        baseLegal: 'Art. 784, CPC', prazo: 'Variável',
        requisitos: ['Título executivo extrajudicial', 'Obrigação líquida, certa e exigível', 'Indicação de bens do devedor', 'Planilha de cálculo'],
        keywords: ['execução', 'título', 'extrajudicial', 'cobrança', 'penhora', 'devedor', 'crédito']
      },
      {
        id: 16, code: 'EXEC-SENT', name: 'Cumprimento de Sentença', category: 'judicial', subcategory: 'execucao',
        description: 'Fase processual destinada a efetivar a decisão judicial transitada em julgado. O devedor é intimado para pagar o valor da condenação sob pena de multa e honorários adicionais.',
        baseLegal: 'Art. 523, CPC', prazo: '15 dias',
        requisitos: ['Sentença transitada em julgado', 'Memória de cálculo atualizada', 'Intimação do devedor', 'Requerimento do credor'],
        keywords: ['cumprimento', 'sentença', 'execução', 'pagamento', 'multa', 'penhora', 'satisfação']
      },
      {
        id: 17, code: 'EXEC-EMBX', name: 'Embargos à Execução', category: 'judicial', subcategory: 'execucao',
        description: 'Ação de defesa do executado contra execução de título extrajudicial, permitindo alegar qualquer matéria de defesa. Requer garantia do juízo para ser recebida.',
        baseLegal: 'Art. 914, CPC', prazo: '15 dias',
        requisitos: ['Garantia do juízo', 'Matérias de defesa', 'Tempestividade', 'Documentos comprobatórios'],
        keywords: ['embargos', 'execução', 'defesa', 'executado', 'título', 'garantia', 'penhora']
      },
      {
        id: 18, code: 'EXEC-IMPE', name: 'Impugnação ao Cumprimento', category: 'judicial', subcategory: 'execucao',
        description: 'Defesa do devedor no cumprimento de sentença, alegando falta ou nulidade de citação, excesso de execução, ou causa extintiva da obrigação. Matérias de defesa são restritas.',
        baseLegal: 'Art. 525, CPC', prazo: '15 dias',
        requisitos: ['Matérias previstas em lei', 'Depósito ou garantia', 'Demonstração do excesso', 'Tempestividade'],
        keywords: ['impugnação', 'cumprimento', 'sentença', 'defesa', 'excesso', 'nulidade', 'executado']
      },

      // ======================================================================
      // JUDICIAL — Medidas (ids 19-22)
      // ======================================================================
      {
        id: 19, code: 'MED-TUTA', name: 'Tutela Antecipada', category: 'judicial', subcategory: 'medidas',
        description: 'Pedido de antecipação dos efeitos da tutela jurisdicional, concedida quando há probabilidade do direito e perigo de dano ou risco ao resultado útil do processo.',
        baseLegal: 'Art. 300, CPC', prazo: 'Variável',
        requisitos: ['Probabilidade do direito', 'Perigo de dano', 'Reversibilidade', 'Fundamentação detalhada', 'Provas documentais'],
        keywords: ['tutela', 'antecipada', 'urgência', 'liminar', 'provisória', 'perigo', 'dano']
      },
      {
        id: 20, code: 'MED-TUTC', name: 'Tutela Cautelar', category: 'judicial', subcategory: 'medidas',
        description: 'Medida de natureza conservativa destinada a assegurar o resultado prático do processo principal. Visa preservar direitos que podem ser prejudicados pela demora processual.',
        baseLegal: 'Art. 305, CPC', prazo: 'Variável',
        requisitos: ['Fumus boni iuris', 'Periculum in mora', 'Indicação da lide principal', 'Fundamentação'],
        keywords: ['tutela', 'cautelar', 'conservativa', 'preservação', 'urgência', 'fumus', 'periculum']
      },
      {
        id: 21, code: 'MED-LIMIN', name: 'Pedido de Liminar', category: 'judicial', subcategory: 'medidas',
        description: 'Requerimento de medida urgente a ser concedida pelo juiz antes da citação do réu. Exige demonstração de urgência extrema e relevância dos fundamentos.',
        baseLegal: 'Art. 300, CPC', prazo: 'Variável',
        requisitos: ['Urgência', 'Relevância do fundamento', 'Risco de dano irreparável', 'Provas pré-constituídas'],
        keywords: ['liminar', 'urgência', 'inaudita', 'altera', 'parte', 'medida', 'emergencial']
      },
      {
        id: 22, code: 'MED-SUSP', name: 'Pedido de Suspensão', category: 'judicial', subcategory: 'medidas',
        description: 'Requerimento para suspensão dos efeitos de decisão judicial que possa causar grave lesão à ordem, economia ou segurança pública. Dirigido ao presidente do tribunal.',
        baseLegal: 'Art. 1.059, CPC', prazo: 'Variável',
        requisitos: ['Grave lesão à ordem pública', 'Lesão à economia pública', 'Risco à segurança', 'Fundamentação'],
        keywords: ['suspensão', 'segurança', 'liminar', 'efeitos', 'ordem', 'pública', 'presidente']
      },

      // ======================================================================
      // JUDICIAL — Manifestações (ids 23-25)
      // ======================================================================
      {
        id: 23, code: 'PET-MEMO', name: 'Memoriais', category: 'judicial', subcategory: 'manifestacoes',
        description: 'Peça apresentada ao final da instrução processual contendo síntese dos fatos, provas e argumentos jurídicos. Substitui os debates orais quando o juiz converte a audiência.',
        baseLegal: 'Art. 364, CPC', prazo: '15 dias',
        requisitos: ['Síntese dos fatos', 'Análise das provas', 'Argumentação jurídica', 'Pedido conclusivo'],
        keywords: ['memoriais', 'alegações', 'instrução', 'síntese', 'provas', 'debates', 'conclusão']
      },
      {
        id: 24, code: 'PET-ALEG', name: 'Alegações Finais', category: 'judicial', subcategory: 'manifestacoes',
        description: 'Manifestação das partes ao final da fase instrutória, apresentando suas conclusões sobre os fatos e o direito aplicável. Última oportunidade de argumentação antes da sentença.',
        baseLegal: 'Art. 364, CPC', prazo: '15 dias',
        requisitos: ['Análise da instrução', 'Fundamentação jurídica', 'Pedido de procedência/improcedência', 'Referência às provas'],
        keywords: ['alegações', 'finais', 'conclusão', 'instrução', 'sentença', 'mérito', 'razões']
      },
      {
        id: 25, code: 'PET-MANIF', name: 'Manifestação', category: 'judicial', subcategory: 'manifestacoes',
        description: 'Peça processual genérica para a parte se pronunciar sobre qualquer questão determinada pelo juízo. Garante o contraditório e a ampla defesa no processo.',
        baseLegal: 'Art. 9º, CPC', prazo: '5 dias',
        requisitos: ['Referência à intimação', 'Pronunciamento sobre a matéria', 'Fundamentação'],
        keywords: ['manifestação', 'pronunciamento', 'contraditório', 'intimação', 'vista', 'ciência']
      },

      // ======================================================================
      // JUDICIAL — Remédios Constitucionais (ids 26-28)
      // ======================================================================
      {
        id: 26, code: 'PET-HABCOR', name: 'Habeas Corpus', category: 'judicial', subcategory: 'remedios',
        description: 'Remédio constitucional que protege o direito de locomoção contra ilegalidade ou abuso de poder. Pode ser preventivo (ameaça) ou repressivo (coação efetiva à liberdade).',
        baseLegal: 'Art. 5º, LXVIII, CF', prazo: 'Imediato',
        requisitos: ['Coação ilegal à liberdade', 'Identificação da autoridade coatora', 'Descrição dos fatos', 'Pedido de soltura ou salvo-conduto'],
        keywords: ['habeas', 'corpus', 'liberdade', 'prisão', 'coação', 'ilegalidade', 'locomoção']
      },
      {
        id: 27, code: 'PET-HABDAT', name: 'Habeas Data', category: 'judicial', subcategory: 'remedios',
        description: 'Remédio constitucional para assegurar o acesso a informações pessoais constantes de registros públicos ou retificação de dados incorretos. Exige recusa prévia na via administrativa.',
        baseLegal: 'Art. 5º, LXXII, CF', prazo: 'Variável',
        requisitos: ['Recusa administrativa prévia', 'Identificação do banco de dados', 'Informação pessoal', 'Prova da recusa'],
        keywords: ['habeas', 'data', 'informação', 'dados', 'registro', 'retificação', 'acesso']
      },
      {
        id: 28, code: 'PET-MSEG', name: 'Mandado de Segurança', category: 'judicial', subcategory: 'remedios',
        description: 'Remédio constitucional para proteger direito líquido e certo violado por ato de autoridade pública. Exige prova pré-constituída e deve ser impetrado no prazo decadencial de 120 dias.',
        baseLegal: 'Art. 5º, LXIX, CF', prazo: '120 dias',
        requisitos: ['Direito líquido e certo', 'Ato de autoridade', 'Prova pré-constituída', 'Prazo decadencial', 'Autoridade coatora identificada'],
        keywords: ['mandado', 'segurança', 'direito', 'líquido', 'certo', 'autoridade', 'coatora', 'ilegalidade']
      },

      // ======================================================================
      // JUDICIAL — Especiais (id 29)
      // ======================================================================
      {
        id: 29, code: 'PET-AFIN', name: 'Petição de Alta Finalidade', category: 'judicial', subcategory: 'especiais',
        description: 'Petição de natureza especial destinada a causas de grande complexidade ou valor estratégico. Exige fundamentação aprofundada e análise detalhada das questões jurídicas envolvidas.',
        baseLegal: 'Art. 319, CPC', prazo: 'Variável',
        requisitos: ['Fundamentação aprofundada', 'Análise estratégica', 'Documentação completa', 'Pedidos específicos'],
        keywords: ['petição', 'alta', 'finalidade', 'estratégica', 'complexa', 'especial', 'relevância']
      },

      // ======================================================================
      // ADMINISTRATIVO — Defesas (ids 30, 33, 34)
      // ======================================================================
      {
        id: 30, code: 'ADM-DPREV', name: 'Defesa Prévia Administrativa', category: 'administrativo', subcategory: 'defesas',
        description: 'Peça de defesa apresentada pelo administrado em processo administrativo antes da decisão final. Garante o contraditório e a ampla defesa no âmbito da Administração Pública.',
        baseLegal: 'Art. 2º, Lei 9.784/99', prazo: '10 dias',
        requisitos: ['Qualificação do autuado', 'Impugnação dos fatos', 'Fundamentação jurídica', 'Documentos comprobatórios'],
        keywords: ['defesa', 'prévia', 'administrativa', 'processo', 'autuação', 'administrado', 'contraditório']
      },
      {
        id: 33, code: 'ADM-IMPADM', name: 'Impugnação Administrativa', category: 'administrativo', subcategory: 'defesas',
        description: 'Peça destinada a impugnar atos, decisões ou procedimentos no âmbito administrativo. Permite ao administrado questionar a legalidade ou o mérito de determinações administrativas.',
        baseLegal: 'Art. 44, Lei 9.784/99', prazo: '5 dias',
        requisitos: ['Identificação do ato impugnado', 'Fundamentação de fato e de direito', 'Pedido de anulação ou revisão'],
        keywords: ['impugnação', 'administrativa', 'ato', 'ilegalidade', 'revisão', 'anulação', 'administrativo']
      },
      {
        id: 34, code: 'ADM-CONTR', name: 'Contrarrazões Administrativas', category: 'administrativo', subcategory: 'defesas',
        description: 'Peça de resposta a recurso administrativo interposto pela parte contrária. Permite ao administrado defender a manutenção da decisão recorrida apresentando argumentos contrários ao recurso.',
        baseLegal: 'Art. 62, Lei 9.784/99', prazo: '5 dias',
        requisitos: ['Referência ao recurso', 'Impugnação dos argumentos', 'Pedido de manutenção da decisão'],
        keywords: ['contrarrazões', 'administrativa', 'recurso', 'resposta', 'defesa', 'manutenção']
      },

      // ======================================================================
      // ADMINISTRATIVO — Recursos (ids 31, 32)
      // ======================================================================
      {
        id: 31, code: 'ADM-RADM', name: 'Recurso Administrativo', category: 'administrativo', subcategory: 'recursos',
        description: 'Recurso interposto pelo administrado contra decisão administrativa desfavorável. Pode ser dirigido à autoridade hierarquicamente superior para revisão do mérito e da legalidade.',
        baseLegal: 'Art. 56, Lei 9.784/99', prazo: '10 dias',
        requisitos: ['Legitimidade recursal', 'Tempestividade', 'Razões do inconformismo', 'Pedido de reforma'],
        keywords: ['recurso', 'administrativo', 'hierárquico', 'revisão', 'reforma', 'decisão', 'superior']
      },
      {
        id: 32, code: 'ADM-PADM', name: 'Pedido de Reconsideração', category: 'administrativo', subcategory: 'recursos',
        description: 'Requerimento dirigido à mesma autoridade que proferiu a decisão para que reconsidere seu posicionamento. Não interrompe o prazo para recurso administrativo hierárquico.',
        baseLegal: 'Art. 56, §1º, Lei 9.784/99', prazo: '10 dias',
        requisitos: ['Identificação da decisão', 'Fatos novos ou argumentos não apreciados', 'Pedido de reconsideração'],
        keywords: ['pedido', 'reconsideração', 'administrativo', 'revisão', 'mesma', 'autoridade', 'reforma']
      },

      // ======================================================================
      // ADMINISTRATIVO — Provocações (ids 35, 36)
      // ======================================================================
      {
        id: 35, code: 'ADM-DENUNCIA', name: 'Denúncia Administrativa', category: 'administrativo', subcategory: 'provocacoes',
        description: 'Comunicação formal de irregularidade ou ilegalidade praticada por agente público ou particular à Administração Pública. Direito constitucional de petição garantido a qualquer cidadão.',
        baseLegal: 'Art. 5º, XXXIV, CF', prazo: 'Variável',
        requisitos: ['Descrição dos fatos', 'Identificação do denunciado', 'Provas ou indícios', 'Identificação do denunciante'],
        keywords: ['denúncia', 'administrativa', 'irregularidade', 'ilegalidade', 'agente', 'público', 'petição']
      },
      {
        id: 36, code: 'ADM-REPRES', name: 'Representação Administrativa', category: 'administrativo', subcategory: 'provocacoes',
        description: 'Peça dirigida a órgão competente representando contra atos ou omissões de agentes públicos. Instrumento de controle social da Administração Pública e combate a irregularidades.',
        baseLegal: 'Art. 5º, XXXIV, CF', prazo: 'Variável',
        requisitos: ['Identificação do representante', 'Descrição dos fatos', 'Fundamentação legal', 'Provas disponíveis'],
        keywords: ['representação', 'administrativa', 'agente', 'público', 'controle', 'irregularidade', 'omissão']
      },

      // ======================================================================
      // ADMINISTRATIVO — Licitações (ids 37, 38, 39)
      // ======================================================================
      {
        id: 37, code: 'LIC-DISP', name: 'Dispensa de Licitação', category: 'administrativo', subcategory: 'licitacoes',
        description: 'Procedimento de contratação direta pela Administração Pública nas hipóteses em que a licitação é dispensável. Requer justificativa formal e razão de preço compatível com o mercado.',
        baseLegal: 'Art. 75, Lei 14.133/21', prazo: 'Variável',
        requisitos: ['Justificativa da dispensa', 'Pesquisa de preços', 'Parecer jurídico', 'Dotação orçamentária', 'Aprovação da autoridade competente'],
        keywords: ['dispensa', 'licitação', 'contratação', 'direta', 'compras', 'públicas', 'administração']
      },
      {
        id: 38, code: 'LIC-INEX', name: 'Inexigibilidade de Licitação', category: 'administrativo', subcategory: 'licitacoes',
        description: 'Contratação direta quando houver inviabilidade de competição, como fornecedor exclusivo ou serviço técnico singular. Exige comprovação da singularidade e notória especialização.',
        baseLegal: 'Art. 74, Lei 14.133/21', prazo: 'Variável',
        requisitos: ['Comprovação de exclusividade', 'Notória especialização', 'Justificativa técnica', 'Parecer jurídico'],
        keywords: ['inexigibilidade', 'licitação', 'exclusividade', 'fornecedor', 'único', 'singular', 'técnico']
      },
      {
        id: 39, code: 'LIC-REC', name: 'Recurso em Licitação', category: 'administrativo', subcategory: 'licitacoes',
        description: 'Recurso interposto por licitante contra decisão da comissão de licitação ou pregoeiro. Permite impugnar a habilitação, julgamento das propostas ou atos do procedimento licitatório.',
        baseLegal: 'Art. 165, Lei 14.133/21', prazo: '3 dias úteis',
        requisitos: ['Legitimidade do licitante', 'Tempestividade', 'Razões recursais', 'Manifestação de intenção'],
        keywords: ['recurso', 'licitação', 'impugnação', 'habilitação', 'proposta', 'pregoeiro', 'comissão']
      },

      // ======================================================================
      // TRIBUTÁRIO — Judicial (ids 40-45)
      // ======================================================================
      {
        id: 40, code: 'TRIB-REPIT', name: 'Repetição de Indébito Tributário', category: 'tributario', subcategory: 'judicial',
        description: 'Ação para restituição de tributo pago indevidamente ou a maior pelo contribuinte. Permite a devolução de valores com correção monetária e juros desde o pagamento indevido.',
        baseLegal: 'Art. 165, CTN', prazo: '5 anos',
        requisitos: ['Prova do pagamento indevido', 'Demonstração do erro', 'Cálculo do valor a restituir', 'Legitimidade ativa'],
        keywords: ['repetição', 'indébito', 'tributário', 'restituição', 'tributo', 'pagamento', 'indevido']
      },
      {
        id: 41, code: 'TRIB-ANUL', name: 'Anulatória de Débito Fiscal', category: 'tributario', subcategory: 'judicial',
        description: 'Ação para anular lançamento tributário ou inscrição em dívida ativa, questionando a validade do crédito fiscal. Permite discutir vícios formais e materiais do lançamento.',
        baseLegal: 'Art. 38, Lei 6.830/80', prazo: 'Variável',
        requisitos: ['Identificação do débito fiscal', 'Vícios do lançamento', 'Fundamentação tributária', 'Pedido de anulação'],
        keywords: ['anulatória', 'débito', 'fiscal', 'lançamento', 'dívida', 'ativa', 'nulidade', 'tributo']
      },
      {
        id: 42, code: 'TRIB-DECL', name: 'Declaratória Tributária', category: 'tributario', subcategory: 'judicial',
        description: 'Ação para declarar a inexistência de relação jurídico-tributária ou a não incidência de tributo sobre determinada situação. Útil para obter certeza jurídica antes do lançamento.',
        baseLegal: 'Art. 19, CPC', prazo: 'Variável',
        requisitos: ['Incerteza jurídica', 'Relação tributária questionada', 'Fundamentação constitucional/legal', 'Interesse de agir'],
        keywords: ['declaratória', 'tributária', 'inexistência', 'relação', 'incidência', 'tributo', 'certeza']
      },
      {
        id: 43, code: 'TRIB-MSTRIB', name: 'Mandado de Segurança Tributário', category: 'tributario', subcategory: 'judicial',
        description: 'Mandado de segurança impetrado contra ato de autoridade fiscal que viola direito líquido e certo do contribuinte. Instrumento célere para questionar cobranças tributárias ilegais.',
        baseLegal: 'Art. 5º, LXIX, CF', prazo: '120 dias',
        requisitos: ['Direito líquido e certo', 'Ato de autoridade fiscal', 'Prova pré-constituída', 'Prazo decadencial'],
        keywords: ['mandado', 'segurança', 'tributário', 'fiscal', 'autoridade', 'contribuinte', 'ilegalidade']
      },
      {
        id: 44, code: 'TRIB-EMBEXF', name: 'Embargos à Execução Fiscal', category: 'tributario', subcategory: 'judicial',
        description: 'Defesa do contribuinte executado em ação de execução fiscal movida pela Fazenda Pública. Permite questionar a certidão de dívida ativa e alegar qualquer matéria de defesa.',
        baseLegal: 'Art. 16, Lei 6.830/80', prazo: '30 dias',
        requisitos: ['Garantia do juízo', 'Impugnação da CDA', 'Matérias de defesa', 'Tempestividade'],
        keywords: ['embargos', 'execução', 'fiscal', 'CDA', 'dívida', 'ativa', 'fazenda', 'contribuinte']
      },
      {
        id: 45, code: 'TRIB-EPEF', name: 'Exceção de Pré-executividade Fiscal', category: 'tributario', subcategory: 'judicial',
        description: 'Defesa em execução fiscal sem necessidade de garantia do juízo, limitada a matérias de ordem pública cognoscíveis de ofício. Instrumento processual de criação jurisprudencial.',
        baseLegal: 'Súmula 393, STJ', prazo: 'Variável',
        requisitos: ['Matéria de ordem pública', 'Prova pré-constituída', 'Sem necessidade de dilação probatória'],
        keywords: ['exceção', 'pré-executividade', 'fiscal', 'ordem', 'pública', 'garantia', 'execução']
      },

      // ======================================================================
      // TRIBUTÁRIO — Administrativo (ids 46-50)
      // ======================================================================
      {
        id: 46, code: 'TRIB-IMPL', name: 'Impugnação de Lançamento', category: 'tributario', subcategory: 'administrativo',
        description: 'Defesa administrativa contra auto de infração ou lançamento tributário. Inaugura o contencioso administrativo fiscal perante a Delegacia da Receita Federal de Julgamento.',
        baseLegal: 'Art. 15, Dec. 70.235/72', prazo: '30 dias',
        requisitos: ['Identificação do lançamento', 'Razões de fato e de direito', 'Provas documentais', 'Pedido de cancelamento'],
        keywords: ['impugnação', 'lançamento', 'tributário', 'auto', 'infração', 'DRJ', 'defesa', 'fiscal']
      },
      {
        id: 47, code: 'TRIB-RVOLUNT', name: 'Recurso Voluntário ao CARF', category: 'tributario', subcategory: 'administrativo',
        description: 'Recurso dirigido ao Conselho Administrativo de Recursos Fiscais contra decisão desfavorável da DRJ. Segunda instância do contencioso administrativo fiscal federal.',
        baseLegal: 'Art. 33, Dec. 70.235/72', prazo: '30 dias',
        requisitos: ['Decisão da DRJ', 'Razões recursais', 'Tempestividade', 'Arrolamento de bens se aplicável'],
        keywords: ['recurso', 'voluntário', 'CARF', 'DRJ', 'tributário', 'fiscal', 'federal', 'conselho']
      },
      {
        id: 48, code: 'TRIB-RESP-FISCAL', name: 'Recurso Especial ao CSRF', category: 'tributario', subcategory: 'administrativo',
        description: 'Recurso dirigido à Câmara Superior de Recursos Fiscais quando houver divergência entre turmas do CARF. Visa uniformizar a jurisprudência administrativa tributária federal.',
        baseLegal: 'Art. 37, Dec. 70.235/72', prazo: '15 dias',
        requisitos: ['Divergência entre turmas', 'Demonstração do paradigma', 'Razões de reforma', 'Tempestividade'],
        keywords: ['recurso', 'especial', 'CSRF', 'CARF', 'divergência', 'uniformização', 'tributário']
      },
      {
        id: 49, code: 'TRIB-CONSULT', name: 'Consulta Tributária', category: 'tributario', subcategory: 'administrativo',
        description: 'Instrumento pelo qual o contribuinte formula consulta ao Fisco sobre interpretação da legislação tributária aplicável a caso concreto. Gera efeitos vinculantes enquanto vigente.',
        baseLegal: 'Art. 46, Dec. 70.235/72', prazo: 'Variável',
        requisitos: ['Descrição do fato concreto', 'Dúvida sobre a legislação', 'Fundamentação legal', 'Identificação do contribuinte'],
        keywords: ['consulta', 'tributária', 'interpretação', 'legislação', 'fisco', 'vinculante', 'contribuinte']
      },
      {
        id: 50, code: 'TRIB-REST', name: 'Pedido de Restituição Tributária', category: 'tributario', subcategory: 'administrativo',
        description: 'Requerimento administrativo para restituição de tributo pago indevidamente. Via administrativa para obter a devolução sem necessidade de ação judicial.',
        baseLegal: 'Art. 165, CTN', prazo: '5 anos',
        requisitos: ['Prova do pagamento indevido', 'Demonstração do valor', 'Identificação do tributo', 'Dados bancários para restituição'],
        keywords: ['restituição', 'tributária', 'administrativa', 'pagamento', 'indevido', 'devolução', 'pedido']
      },

      // ======================================================================
      // AMBIENTAL — Judicial (ids 51-54)
      // ======================================================================
      {
        id: 51, code: 'AMB-ACP', name: 'Ação Civil Pública Ambiental', category: 'ambiental', subcategory: 'judicial',
        description: 'Ação para responsabilizar agentes causadores de danos ao meio ambiente, podendo pleitear reparação in natura, indenização e cessação da atividade lesiva. Legitimidade do Ministério Público e outros entes.',
        baseLegal: 'Art. 1º, Lei 7.347/85', prazo: 'Imprescritível',
        requisitos: ['Dano ambiental comprovado', 'Nexo causal', 'Legitimidade ativa', 'Pedido de reparação', 'Prova técnica'],
        keywords: ['ação', 'civil', 'pública', 'ambiental', 'dano', 'reparação', 'meio', 'ambiente']
      },
      {
        id: 52, code: 'AMB-POPULAR', name: 'Ação Popular Ambiental', category: 'ambiental', subcategory: 'judicial',
        description: 'Ação que qualquer cidadão pode propor para anular ato lesivo ao meio ambiente e ao patrimônio público. Instrumento de participação popular na defesa ambiental.',
        baseLegal: 'Art. 5º, LXXIII, CF', prazo: '5 anos',
        requisitos: ['Cidadania do autor', 'Ato lesivo ao meio ambiente', 'Ilegalidade do ato', 'Lesividade demonstrada'],
        keywords: ['ação', 'popular', 'ambiental', 'cidadão', 'lesividade', 'patrimônio', 'anulação']
      },
      {
        id: 53, code: 'AMB-INDENIZ', name: 'Ação Indenizatória Ambiental', category: 'ambiental', subcategory: 'judicial',
        description: 'Ação para reparação de danos ambientais causados a particulares ou coletividade. Responsabilidade objetiva do poluidor, independente de culpa, com obrigação de reparar integralmente.',
        baseLegal: 'Art. 14, §1º, Lei 6.938/81', prazo: 'Variável',
        requisitos: ['Dano ambiental', 'Nexo de causalidade', 'Quantificação dos danos', 'Responsabilidade objetiva'],
        keywords: ['indenização', 'ambiental', 'dano', 'reparação', 'poluidor', 'responsabilidade', 'objetiva']
      },
      {
        id: 54, code: 'AMB-ANUL', name: 'Anulatória de Auto de Infração Ambiental', category: 'ambiental', subcategory: 'judicial',
        description: 'Ação para anular auto de infração ambiental lavrado por órgão fiscalizador. Permite questionar a legalidade da autuação e da penalidade imposta por via judicial.',
        baseLegal: 'Art. 70, Lei 9.605/98', prazo: 'Variável',
        requisitos: ['Identificação do auto de infração', 'Vícios formais ou materiais', 'Fundamentação legal', 'Pedido de anulação'],
        keywords: ['anulatória', 'auto', 'infração', 'ambiental', 'fiscalização', 'IBAMA', 'multa', 'penalidade']
      },

      // ======================================================================
      // AMBIENTAL — Administrativo (ids 55-56)
      // ======================================================================
      {
        id: 55, code: 'AMB-DPREV', name: 'Defesa Prévia Ambiental', category: 'ambiental', subcategory: 'administrativo',
        description: 'Defesa administrativa contra auto de infração ambiental lavrado pelo IBAMA ou órgão estadual/municipal. Primeira oportunidade de defesa no processo administrativo sancionador ambiental.',
        baseLegal: 'Art. 113, Dec. 6.514/08', prazo: '20 dias',
        requisitos: ['Impugnação dos fatos', 'Fundamentação técnica', 'Provas documentais', 'Pedido de arquivamento'],
        keywords: ['defesa', 'prévia', 'ambiental', 'auto', 'infração', 'IBAMA', 'sancionador', 'multa']
      },
      {
        id: 56, code: 'AMB-RADM', name: 'Recurso Administrativo Ambiental', category: 'ambiental', subcategory: 'administrativo',
        description: 'Recurso contra decisão de primeira instância administrativa que manteve o auto de infração ambiental. Dirigido à autoridade hierarquicamente superior no órgão ambiental.',
        baseLegal: 'Art. 127, Dec. 6.514/08', prazo: '20 dias',
        requisitos: ['Decisão de primeira instância', 'Razões de inconformismo', 'Documentação complementar', 'Tempestividade'],
        keywords: ['recurso', 'administrativo', 'ambiental', 'IBAMA', 'infração', 'segunda', 'instância']
      },

      // ======================================================================
      // AMBIENTAL — Licenciamento (ids 57-60)
      // ======================================================================
      {
        id: 57, code: 'AMB-EIA', name: 'Estudo de Impacto Ambiental', category: 'ambiental', subcategory: 'licenciamento',
        description: 'Documento técnico que avalia os impactos ambientais de empreendimentos potencialmente poluidores. Requisito obrigatório para licenciamento de atividades de significativo impacto ambiental.',
        baseLegal: 'Art. 2º, Res. CONAMA 1/86', prazo: 'Variável',
        requisitos: ['Diagnóstico ambiental', 'Análise de impactos', 'Medidas mitigadoras', 'Programa de monitoramento', 'Alternativas locacionais'],
        keywords: ['EIA', 'estudo', 'impacto', 'ambiental', 'licenciamento', 'CONAMA', 'diagnóstico']
      },
      {
        id: 58, code: 'AMB-RIMA', name: 'Relatório de Impacto Ambiental', category: 'ambiental', subcategory: 'licenciamento',
        description: 'Documento público que resume o EIA em linguagem acessível para consulta popular. Instrumento de participação social no processo de licenciamento ambiental.',
        baseLegal: 'Art. 9º, Res. CONAMA 1/86', prazo: 'Variável',
        requisitos: ['Resumo do EIA', 'Linguagem acessível', 'Mapas e ilustrações', 'Alternativas e conclusões'],
        keywords: ['RIMA', 'relatório', 'impacto', 'ambiental', 'público', 'consulta', 'participação']
      },
      {
        id: 59, code: 'AMB-LIC', name: 'Requerimento de Licença Ambiental', category: 'ambiental', subcategory: 'licenciamento',
        description: 'Pedido formal de licença ambiental (LP, LI ou LO) ao órgão competente para instalação ou operação de atividade potencialmente poluidora. Inicia o processo de licenciamento.',
        baseLegal: 'Art. 10, Lei 6.938/81', prazo: 'Variável',
        requisitos: ['Formulário de requerimento', 'Documentação técnica', 'Certidões ambientais', 'Projeto do empreendimento', 'Taxa de licenciamento'],
        keywords: ['licença', 'ambiental', 'requerimento', 'LP', 'LI', 'LO', 'licenciamento', 'IBAMA']
      },
      {
        id: 60, code: 'AMB-PRAD', name: 'Plano de Recuperação de Área Degradada', category: 'ambiental', subcategory: 'licenciamento',
        description: 'Documento técnico com medidas para recuperação de áreas degradadas por atividades de mineração, desmatamento ou outras intervenções. Obrigatório para encerramento de atividades impactantes.',
        baseLegal: 'Art. 225, §2º, CF', prazo: 'Variável',
        requisitos: ['Diagnóstico da degradação', 'Cronograma de recuperação', 'Técnicas de restauração', 'Monitoramento ambiental', 'Responsável técnico'],
        keywords: ['PRAD', 'recuperação', 'área', 'degradada', 'restauração', 'mineração', 'revegetação']
      },

      // ======================================================================
      // MINERÁRIO — Judicial (ids 61-63)
      // ======================================================================
      {
        id: 61, code: 'MIN-SERV', name: 'Ação de Servidão Minerária', category: 'minerario', subcategory: 'judicial',
        description: 'Ação para constituir servidão sobre propriedade de terceiro para fins de pesquisa ou lavra mineral. Permite o acesso e uso da superfície quando não houver acordo com o proprietário.',
        baseLegal: 'Art. 59, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Título minerário vigente', 'Tentativa de acordo', 'Justificativa da necessidade', 'Avaliação da indenização'],
        keywords: ['servidão', 'minerária', 'superfície', 'acesso', 'lavra', 'pesquisa', 'propriedade']
      },
      {
        id: 62, code: 'MIN-INDENIZ', name: 'Ação Indenizatória Minerária', category: 'minerario', subcategory: 'judicial',
        description: 'Ação para reparação de danos causados por atividade de mineração a proprietários superficiários ou ao meio ambiente. Abrange danos patrimoniais e extrapatrimoniais decorrentes da lavra.',
        baseLegal: 'Art. 27, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Dano comprovado', 'Atividade minerária como causa', 'Quantificação dos prejuízos', 'Nexo de causalidade'],
        keywords: ['indenização', 'minerária', 'dano', 'superficiário', 'lavra', 'reparação', 'mineração']
      },
      {
        id: 63, code: 'MIN-ANUL', name: 'Anulatória de Ato Minerário', category: 'minerario', subcategory: 'judicial',
        description: 'Ação para anular ato administrativo da ANM (Agência Nacional de Mineração) que concedeu ou negou direitos minerários. Permite questionar a legalidade de concessões ou cassações.',
        baseLegal: 'Art. 1º, Lei 4.717/65', prazo: '5 anos',
        requisitos: ['Ato administrativo da ANM', 'Ilegalidade ou vício', 'Legitimidade ativa', 'Pedido de anulação'],
        keywords: ['anulatória', 'ato', 'minerário', 'ANM', 'DNPM', 'concessão', 'cassação', 'ilegalidade']
      },

      // ======================================================================
      // MINERÁRIO — Administrativo (ids 64-73)
      // ======================================================================
      {
        id: 64, code: 'MIN-RAUTP', name: 'Requerimento de Autorização de Pesquisa', category: 'minerario', subcategory: 'administrativo',
        description: 'Pedido à ANM para obter autorização de pesquisa mineral em determinada área. Primeira etapa do processo de obtenção de direitos minerários no Brasil.',
        baseLegal: 'Art. 16, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Plano de pesquisa', 'Delimitação da área', 'Memorial descritivo', 'Documentação societária', 'Comprovante de recolhimento de emolumentos'],
        keywords: ['autorização', 'pesquisa', 'mineral', 'ANM', 'requerimento', 'área', 'prospecção']
      },
      {
        id: 65, code: 'MIN-RLAV', name: 'Requerimento de Lavra', category: 'minerario', subcategory: 'administrativo',
        description: 'Pedido de concessão de lavra à ANM após a conclusão dos trabalhos de pesquisa mineral com resultado positivo. Etapa que precede a exploração comercial do minério.',
        baseLegal: 'Art. 38, Dec.-Lei 227/67', prazo: '1 ano',
        requisitos: ['Relatório final de pesquisa aprovado', 'PAE', 'Licenças ambientais', 'Documentação técnica', 'Prova de capacidade financeira'],
        keywords: ['lavra', 'concessão', 'requerimento', 'mineração', 'exploração', 'ANM', 'mineral']
      },
      {
        id: 66, code: 'MIN-PLG', name: 'Pedido de Licenciamento Guia de Utilização', category: 'minerario', subcategory: 'administrativo',
        description: 'Requerimento para obter guia de utilização que permite a extração de substâncias minerais antes da concessão de lavra. Destinado a minerais de uso imediato na construção civil.',
        baseLegal: 'Art. 22, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Registro no município', 'Licença ambiental', 'Memorial descritivo', 'Documentação do requerente'],
        keywords: ['licenciamento', 'guia', 'utilização', 'mineral', 'extração', 'construção', 'civil']
      },
      {
        id: 67, code: 'MIN-PAE', name: 'Plano de Aproveitamento Econômico', category: 'minerario', subcategory: 'administrativo',
        description: 'Documento técnico obrigatório para o requerimento de lavra, contendo viabilidade econômica e planejamento da exploração mineral. Demonstra a exequibilidade técnica e financeira do empreendimento.',
        baseLegal: 'Art. 38, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Estudos de viabilidade', 'Reservas minerais', 'Método de lavra', 'Cronograma de produção', 'Análise econômica'],
        keywords: ['PAE', 'plano', 'aproveitamento', 'econômico', 'viabilidade', 'lavra', 'reservas']
      },
      {
        id: 68, code: 'MIN-RAL', name: 'Relatório Anual de Lavra', category: 'minerario', subcategory: 'administrativo',
        description: 'Relatório obrigatório apresentado anualmente à ANM pelos concessionários de lavra. Contém informações sobre produção, comercialização, investimentos e cumprimento de obrigações minerárias.',
        baseLegal: 'Art. 47, Dec.-Lei 227/67', prazo: 'Anual até 15/03',
        requisitos: ['Dados de produção', 'Comercialização', 'Investimentos realizados', 'CFEM recolhida', 'Situação ambiental'],
        keywords: ['RAL', 'relatório', 'anual', 'lavra', 'produção', 'ANM', 'CFEM', 'mineração']
      },
      {
        id: 69, code: 'MIN-ONERA', name: 'Oneração de Direitos Minerários', category: 'minerario', subcategory: 'administrativo',
        description: 'Requerimento para constituir ônus sobre direitos minerários, como garantia em operações financeiras. Permite utilizar títulos minerários como colateral para empréstimos e financiamentos.',
        baseLegal: 'Art. 55, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Título minerário vigente', 'Contrato de garantia', 'Anuência do credor', 'Documentação societária'],
        keywords: ['oneração', 'direitos', 'minerários', 'garantia', 'financiamento', 'ônus', 'título']
      },
      {
        id: 70, code: 'MIN-CESSAO', name: 'Cessão de Direitos Minerários', category: 'minerario', subcategory: 'administrativo',
        description: 'Transferência total ou parcial de direitos minerários entre titulares, mediante autorização da ANM. Permite a negociação de títulos de pesquisa ou lavra entre empresas mineradoras.',
        baseLegal: 'Art. 55, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Título minerário vigente', 'Contrato de cessão', 'Qualificação do cessionário', 'Aprovação da ANM'],
        keywords: ['cessão', 'direitos', 'minerários', 'transferência', 'titular', 'ANM', 'cessionário']
      },
      {
        id: 71, code: 'MIN-RENPESQ', name: 'Renúncia de Autorização de Pesquisa', category: 'minerario', subcategory: 'administrativo',
        description: 'Declaração formal de renúncia ao título de autorização de pesquisa mineral perante a ANM. Extingue os direitos e obrigações do titular sobre a área de pesquisa.',
        baseLegal: 'Art. 26, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Título de pesquisa vigente', 'Declaração de renúncia', 'Regularidade ambiental', 'Quitação de obrigações'],
        keywords: ['renúncia', 'autorização', 'pesquisa', 'mineral', 'extinção', 'título', 'ANM']
      },
      {
        id: 72, code: 'MIN-RENLAVRA', name: 'Renúncia de Concessão de Lavra', category: 'minerario', subcategory: 'administrativo',
        description: 'Declaração formal de renúncia à concessão de lavra perante a ANM. Requer comprovação de regularidade ambiental e cumprimento de obrigações de recuperação da área minerada.',
        baseLegal: 'Art. 55, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Concessão vigente', 'PRAD aprovado', 'Regularidade ambiental', 'Quitação de CFEM', 'Descomissionamento'],
        keywords: ['renúncia', 'concessão', 'lavra', 'extinção', 'encerramento', 'mineração', 'ANM']
      },
      {
        id: 73, code: 'MIN-DESIST', name: 'Desistência de Requerimento Minerário', category: 'minerario', subcategory: 'administrativo',
        description: 'Pedido de desistência de requerimento minerário em tramitação perante a ANM. Encerra o procedimento administrativo antes da concessão do título minerário.',
        baseLegal: 'Art. 32, Dec.-Lei 227/67', prazo: 'Variável',
        requisitos: ['Requerimento em tramitação', 'Declaração de desistência', 'Identificação do processo ANM'],
        keywords: ['desistência', 'requerimento', 'minerário', 'ANM', 'arquivamento', 'processo', 'cancelamento']
      },

      // ======================================================================
      // CONSTITUCIONAL — Controle Concentrado (ids 74-78)
      // ======================================================================
      {
        id: 74, code: 'CONST-ADI', name: 'Ação Direta de Inconstitucionalidade', category: 'constitucional', subcategory: 'controle_concentrado',
        description: 'Ação de controle concentrado de constitucionalidade julgada pelo STF para declarar a inconstitucionalidade de lei ou ato normativo federal ou estadual. Efeito erga omnes e vinculante.',
        baseLegal: 'Art. 102, I, a, CF', prazo: 'Imprescritível',
        requisitos: ['Legitimidade ativa restrita', 'Lei ou ato normativo', 'Fundamentação constitucional', 'Pedido de declaração de inconstitucionalidade'],
        keywords: ['ADI', 'inconstitucionalidade', 'STF', 'controle', 'concentrado', 'erga', 'omnes', 'lei']
      },
      {
        id: 75, code: 'CONST-ADC', name: 'Ação Declaratória de Constitucionalidade', category: 'constitucional', subcategory: 'controle_concentrado',
        description: 'Ação para declarar a constitucionalidade de lei ou ato normativo federal, eliminando controvérsia judicial relevante. Exige demonstração de controvérsia jurisdicional existente.',
        baseLegal: 'Art. 102, I, a, CF', prazo: 'Imprescritível',
        requisitos: ['Legitimidade ativa', 'Controvérsia judicial relevante', 'Lei federal questionada', 'Demonstração da controvérsia'],
        keywords: ['ADC', 'declaratória', 'constitucionalidade', 'STF', 'controvérsia', 'federal', 'lei']
      },
      {
        id: 76, code: 'CONST-ADPF', name: 'Arguição de Descumprimento de Preceito Fundamental', category: 'constitucional', subcategory: 'controle_concentrado',
        description: 'Ação constitucional para evitar ou reparar lesão a preceito fundamental resultante de ato do Poder Público. Tem caráter subsidiário, aplicável quando não houver outro meio eficaz.',
        baseLegal: 'Art. 102, §1º, CF', prazo: 'Imprescritível',
        requisitos: ['Preceito fundamental violado', 'Ato do Poder Público', 'Subsidiariedade', 'Legitimidade ativa'],
        keywords: ['ADPF', 'preceito', 'fundamental', 'descumprimento', 'STF', 'subsidiária', 'constitucional']
      },
      {
        id: 77, code: 'CONST-ADO', name: 'Ação Direta de Inconstitucionalidade por Omissão', category: 'constitucional', subcategory: 'controle_concentrado',
        description: 'Ação para reconhecer a mora legislativa do Poder competente na regulamentação de norma constitucional. Visa dar efetividade a dispositivos constitucionais que dependem de lei.',
        baseLegal: 'Art. 103, §2º, CF', prazo: 'Imprescritível',
        requisitos: ['Norma constitucional de eficácia limitada', 'Omissão legislativa', 'Legitimidade ativa', 'Demonstração da mora'],
        keywords: ['ADO', 'omissão', 'inconstitucionalidade', 'mora', 'legislativa', 'STF', 'regulamentação']
      },
      {
        id: 78, code: 'CONST-IF', name: 'Intervenção Federal', category: 'constitucional', subcategory: 'controle_concentrado',
        description: 'Medida excepcional pela qual a União intervém em estado-membro para assegurar a observância de princípios constitucionais sensíveis ou executar lei federal.',
        baseLegal: 'Art. 36, III, CF', prazo: 'Variável',
        requisitos: ['Hipóteses constitucionais', 'Provimento pelo STF', 'Decreto presidencial', 'Princípio constitucional violado'],
        keywords: ['intervenção', 'federal', 'estado', 'princípio', 'sensível', 'constitucional', 'excepcional']
      },

      // ======================================================================
      // CONSTITUCIONAL — Remédios (id 79)
      // ======================================================================
      {
        id: 79, code: 'CONST-MI', name: 'Mandado de Injunção', category: 'constitucional', subcategory: 'remedios',
        description: 'Remédio constitucional para viabilizar o exercício de direitos constitucionais quando a falta de norma regulamentadora torna inviável seu exercício. Supre a omissão legislativa no caso concreto.',
        baseLegal: 'Art. 5º, LXXI, CF', prazo: 'Variável',
        requisitos: ['Direito constitucional', 'Falta de norma regulamentadora', 'Inviabilidade do exercício', 'Legitimidade ativa'],
        keywords: ['mandado', 'injunção', 'omissão', 'regulamentação', 'direito', 'constitucional', 'exercício']
      },

      // ======================================================================
      // CONSTITUCIONAL — Controle Difuso (id 80)
      // ======================================================================
      {
        id: 80, code: 'CIV-CONT', name: 'Contencioso Constitucional Difuso', category: 'constitucional', subcategory: 'controle_difuso',
        description: 'Peça processual que argui incidentalmente a inconstitucionalidade de norma no curso de processo comum. O controle difuso é exercido por qualquer juiz ou tribunal no caso concreto.',
        baseLegal: 'Art. 97, CF', prazo: 'Variável',
        requisitos: ['Questão constitucional incidental', 'Fundamentação', 'Cláusula de reserva de plenário', 'Relevância para o caso concreto'],
        keywords: ['contencioso', 'constitucional', 'difuso', 'incidental', 'inconstitucionalidade', 'controle', 'reserva', 'plenário']
      }
    ],

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Get all types for a given category
     * @param {string} categoryId
     * @returns {Array}
     */
    getTypesByCategory: function(categoryId) {
      return this.types.filter(function(t) { return t.category === categoryId; });
    },

    /**
     * Get a type by its code
     * @param {string} code
     * @returns {Object|undefined}
     */
    getTypeByCode: function(code) {
      return this.types.find(function(t) { return t.code === code; });
    },

    /**
     * Get a type by its id
     * @param {number} id
     * @returns {Object|undefined}
     */
    getTypeById: function(id) {
      return this.types.find(function(t) { return t.id === id; });
    },

    /**
     * Get a category by its id
     * @param {string} categoryId
     * @returns {Object|undefined}
     */
    getCategoryById: function(categoryId) {
      return this.categories.find(function(c) { return c.id === categoryId; });
    },

    /**
     * Search types by keyword
     * @param {string} query
     * @returns {Array}
     */
    searchTypes: function(query) {
      var q = query.toLowerCase().trim();
      if (!q) return this.types;
      return this.types.filter(function(t) {
        return t.name.toLowerCase().includes(q) ||
               t.code.toLowerCase().includes(q) ||
               t.description.toLowerCase().includes(q) ||
               t.keywords.some(function(k) { return k.toLowerCase().includes(q); });
      });
    },

    /**
     * Get all subcategories within a category
     * @param {string} categoryId
     * @returns {Array<string>}
     */
    getSubcategories: function(categoryId) {
      var subs = {};
      this.types.forEach(function(t) {
        if (t.category === categoryId) subs[t.subcategory] = true;
      });
      return Object.keys(subs);
    },

    /**
     * Get total count of types
     * @returns {number}
     */
    getTotalTypes: function() {
      return this.types.length;
    }
  };

})();
