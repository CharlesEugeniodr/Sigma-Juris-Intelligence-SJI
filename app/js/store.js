(function() {
  'use strict';

  // ── Type mapping helper ──────────────────────────────────────────────
  const TYPE_MAP = {
    'PET-INI':       'Petição Inicial',
    'PET-CONT':      'Contestação',
    'REC-APEL':      'Apelação Cível',
    'REC-RESP':      'Recurso Especial',
    'REC-EMBD':      'Embargos de Declaração',
    'REC-AGRV':      'Agravo de Instrumento',
    'PET-MSEG':      'Mandado de Segurança',
    'MED-TUTA':      'Tutela Antecipada',
    'EXEC-TIT':      'Execução de Título',
    'EXEC-SENT':     'Cumprimento de Sentença',
    'ADM-DPREV':     'Defesa Prévia Administrativa',
    'ADM-RADM':      'Recurso Administrativo',
    'TRIB-IMPL':     'Impugnação de Lançamento',
    'TRIB-RVOLUNT':  'Recurso Voluntário',
    'AMB-ACP':       'Ação Civil Pública',
    'AMB-DPREV':     'Defesa Prévia Ambiental',
    'MIN-RAUTP':     'Requerimento de Autorização',
    'MIN-PAE':       'Plano de Aproveitamento Econômico'
  };

  // ── UUID v4 generator (delegated to SJIFUtils) ──────────────────────

  // ── Random date within the last N days ───────────────────────────────
  function randomDateInLastDays(days) {
    var now = Date.now();
    var offset = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
    return new Date(now - offset).toISOString();
  }

  // ════════════════════════════════════════════════════════════════════
  //  SJIFStore
  // ════════════════════════════════════════════════════════════════════
  class SJIFStore {
    constructor() {
      this.dbName = 'sjif_db';
      this.dbVersion = 1;
      this.db = null;
    }

    // ── Initialisation ─────────────────────────────────────────────────
    async init() {
      if (this.db) return this.db;

      return new Promise(function(resolve, reject) {
        var request = indexedDB.open(this.dbName, this.dbVersion);

        request.onupgradeneeded = function(event) {
          var db = event.target.result;

          // documents store
          if (!db.objectStoreNames.contains('documents')) {
            var docStore = db.createObjectStore('documents', { keyPath: 'id' });
            docStore.createIndex('type', 'type', { unique: false });
            docStore.createIndex('typeCode', 'typeCode', { unique: false });
            docStore.createIndex('category', 'category', { unique: false });
            docStore.createIndex('status', 'status', { unique: false });
            docStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
          }

          // processes store
          if (!db.objectStoreNames.contains('processes')) {
            var procStore = db.createObjectStore('processes', { keyPath: 'id' });
            procStore.createIndex('number', 'number', { unique: false });
            procStore.createIndex('area', 'area', { unique: false });
            procStore.createIndex('status', 'status', { unique: false });
          }

          // analyses store
          if (!db.objectStoreNames.contains('analyses')) {
            var anaStore = db.createObjectStore('analyses', { keyPath: 'id' });
            anaStore.createIndex('documentId', 'documentId', { unique: false });
            anaStore.createIndex('createdAt', 'createdAt', { unique: false });
          }

          // settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        };

        request.onsuccess = function(event) {
          this.db = event.target.result;
          resolve(this.db);
        }.bind(this);

        request.onerror = function(event) {
          reject(new Error('IndexedDB open failed: ' + event.target.error));
        };
      }.bind(this));
    }

    // ── Internal helpers ───────────────────────────────────────────────
    _getStore(storeName, mode) {
      if (!this.db) {
        throw new Error('Database not initialised. Call init() first.');
      }
      var tx = this.db.transaction(storeName, mode || 'readonly');
      return tx.objectStore(storeName);
    }

    _promisify(request) {
      return new Promise(function(resolve, reject) {
        request.onsuccess = function() { resolve(request.result); };
        request.onerror   = function() { reject(request.error); };
      });
    }

    // ════════════════════════════════════════════════════════════════════
    //  Documents CRUD
    // ════════════════════════════════════════════════════════════════════
    async addDocument(doc) {
      if (!doc.id) doc.id = window.SJIFUtils.generateId();
      if (!doc.uploadedAt) doc.uploadedAt = new Date().toISOString();
      if (!doc.status) doc.status = 'pending';
      var store = this._getStore('documents', 'readwrite');
      await this._promisify(store.add(doc));
      return doc;
    }

    async getDocument(id) {
      var store = this._getStore('documents', 'readonly');
      return this._promisify(store.get(id));
    }

    async getAllDocuments() {
      var store = this._getStore('documents', 'readonly');
      var docs = await this._promisify(store.getAll());
      docs.sort(function(a, b) {
        return (b.uploadedAt || '').localeCompare(a.uploadedAt || '');
      });
      return docs;
    }

    async updateDocument(id, updates) {
      var store = this._getStore('documents', 'readwrite');
      var existing = await this._promisify(store.get(id));
      if (!existing) throw new Error('Document not found: ' + id);
      var merged = Object.assign({}, existing, updates, { id: id });
      await this._promisify(store.put(merged));
      return merged;
    }

    async deleteDocument(id) {
      var store = this._getStore('documents', 'readwrite');
      return this._promisify(store.delete(id));
    }

    // ════════════════════════════════════════════════════════════════════
    //  Processes CRUD
    // ════════════════════════════════════════════════════════════════════
    async addProcess(proc) {
      if (!proc.id) proc.id = window.SJIFUtils.generateId();
      if (!proc.status) proc.status = 'active';
      if (!proc.createdAt) proc.createdAt = new Date().toISOString();
      var store = this._getStore('processes', 'readwrite');
      await this._promisify(store.add(proc));
      return proc;
    }

    async getProcess(id) {
      var store = this._getStore('processes', 'readonly');
      return this._promisify(store.get(id));
    }

    async getAllProcesses() {
      var store = this._getStore('processes', 'readonly');
      return this._promisify(store.getAll());
    }

    async updateProcess(id, updates) {
      var store = this._getStore('processes', 'readwrite');
      var existing = await this._promisify(store.get(id));
      if (!existing) throw new Error('Process not found: ' + id);
      var merged = Object.assign({}, existing, updates, { id: id });
      await this._promisify(store.put(merged));
      return merged;
    }

    // ════════════════════════════════════════════════════════════════════
    //  Analyses CRUD
    // ════════════════════════════════════════════════════════════════════
    async addAnalysis(analysis) {
      if (!analysis.id) analysis.id = window.SJIFUtils.generateId();
      if (!analysis.createdAt) analysis.createdAt = new Date().toISOString();
      var store = this._getStore('analyses', 'readwrite');
      await this._promisify(store.add(analysis));
      return analysis;
    }

    async getAnalysis(id) {
      var store = this._getStore('analyses', 'readonly');
      return this._promisify(store.get(id));
    }

    async getAnalysesByDocument(docId) {
      var store = this._getStore('analyses', 'readonly');
      var index = store.index('documentId');
      return this._promisify(index.getAll(docId));
    }

    // ════════════════════════════════════════════════════════════════════
    //  Stats / Aggregation
    // ════════════════════════════════════════════════════════════════════
    async getStats() {
      var docs      = await this.getAllDocuments();
      var processes = await this.getAllProcesses();
      var analyses  = await this._promisify(this._getStore('analyses', 'readonly').getAll());

      var totalScore = 0;
      var scoredCount = 0;
      for (var i = 0; i < docs.length; i++) {
        if (typeof docs[i].score === 'number') {
          totalScore += docs[i].score;
          scoredCount++;
        }
      }

      return {
        totalDocuments:  docs.length,
        totalProcesses:  processes.length,
        totalAnalyses:   analyses.length,
        averageScore:    scoredCount > 0 ? Math.round((totalScore / scoredCount) * 100) / 100 : 0,
        analyzedCount:   docs.filter(function(d) { return d.status === 'analyzed'; }).length,
        pendingCount:    docs.filter(function(d) { return d.status === 'pending';  }).length
      };
    }

    async getDocumentCountByType() {
      var docs = await this.getAllDocuments();
      var counts = {};
      for (var i = 0; i < docs.length; i++) {
        var t = docs[i].type || docs[i].typeCode || 'unknown';
        counts[t] = (counts[t] || 0) + 1;
      }
      return counts;
    }

    async getDocumentCountByCategory() {
      var docs = await this.getAllDocuments();
      var counts = {};
      for (var i = 0; i < docs.length; i++) {
        var c = docs[i].category || 'unknown';
        counts[c] = (counts[c] || 0) + 1;
      }
      return counts;
    }

    async getAverageScore() {
      var docs = await this.getAllDocuments();
      var total = 0;
      var count = 0;
      for (var i = 0; i < docs.length; i++) {
        if (typeof docs[i].score === 'number') {
          total += docs[i].score;
          count++;
        }
      }
      return count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    }

    async getRecentDocuments(limit) {
      if (typeof limit === 'undefined') limit = 10;
      var docs = await this.getAllDocuments(); // already sorted desc
      return docs.slice(0, limit);
    }

    // ════════════════════════════════════════════════════════════════════
    //  Demo data seeding
    // ════════════════════════════════════════════════════════════════════
    async seedDemoData() {
      // Check if data already exists
      var existing = await this.getAllDocuments();
      if (existing.length > 0) return { seeded: false, message: 'Data already exists' };

      // ── 18 sample documents ──────────────────────────────────────────
      var demoDocuments = [
        {
          name: 'Petição Inicial - Ação de Cobrança',
          typeCode: 'PET-INI',
          category: 'judicial',
          score: 87,
          content: 'Excelentíssimo Senhor Doutor Juiz de Direito da Vara Cível da Comarca de Belo Horizonte/MG. A autora, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na Rua dos Inconfidentes, 1.200, Belo Horizonte/MG, vem, respeitosamente, à presença de Vossa Excelência, por intermédio de seus advogados, propor a presente Ação de Cobrança em face de XYZ Ltda., pelos fatos e fundamentos a seguir expostos. Trata-se de cobrança de valores decorrentes de prestação de serviços jurídicos especializados, conforme contrato firmado em 15 de março de 2025, cujo inadimplemento perfaz o montante de R$ 150.000,00 (cento e cinquenta mil reais), devidamente atualizado pelos índices do TJMG.'
        },
        {
          name: 'Contestação - Processo nº 0012345',
          typeCode: 'PET-CONT',
          category: 'judicial',
          score: 92,
          content: 'Excelentíssimo Senhor Doutor Juiz de Direito da 5ª Vara Cível da Comarca de Belo Horizonte/MG. Nos autos da Ação de Cobrança nº 0012345-67.2026.8.13.0024, a ré, devidamente qualificada nos autos, vem, por seu advogado, apresentar Contestação, nos termos do art. 335 e seguintes do CPC. Preliminarmente, arguiu-se a inépcia da petição inicial, a falta de interesse de agir e a prescrição trienal prevista no art. 206, § 3º, V, do Código Civil. No mérito, demonstrou-se a inexistência de débito, uma vez que todos os pagamentos foram realizados tempestivamente, conforme comprovantes acostados aos autos.'
        },
        {
          name: 'Apelação Cível nº 2024.001',
          typeCode: 'REC-APEL',
          category: 'judicial',
          score: 78,
          content: 'Egrégio Tribunal de Justiça do Estado de Minas Gerais. A apelante, inconformada com a r. sentença proferida pelo MM. Juízo da 3ª Vara Cível da Comarca de Belo Horizonte, que julgou improcedentes os pedidos formulados na inicial, vem, respeitosamente, interpor o presente Recurso de Apelação, com fundamento no art. 1.009 do CPC/2015. A sentença recorrida merece reforma, pois incorreu em error in judicando ao desconsiderar as provas documentais produzidas nos autos, em especial o laudo pericial contábil que atestou a existência do crédito no valor de R$ 280.000,00.'
        },
        {
          name: 'Recurso Especial - REsp 1.234.567',
          typeCode: 'REC-RESP',
          category: 'judicial',
          score: 95,
          content: 'Excelentíssimo Senhor Ministro Presidente do Superior Tribunal de Justiça. O recorrente, com fundamento no art. 105, III, "a" e "c", da Constituição Federal, interpõe o presente Recurso Especial contra o v. acórdão proferido pela 2ª Câmara Cível do TJMG, que negou provimento à apelação, mantendo sentença que violou dispositivos do Código Civil e do CPC. Demonstra-se o prequestionamento dos arts. 389, 395 e 405 do CC/2002, bem como dos arts. 373, I, e 489, § 1º, do CPC/2015, configurando negativa de vigência à legislação federal.'
        },
        {
          name: 'Embargos de Declaração',
          typeCode: 'REC-EMBD',
          category: 'judicial',
          score: 88,
          content: 'Egrégio Tribunal de Justiça do Estado de Minas Gerais. O embargante, nos termos do art. 1.022 do CPC/2015, opõe os presentes Embargos de Declaração em face do v. acórdão de fls. 450/478, apontando omissão quanto à análise dos arts. 421 e 422 do Código Civil, relativos à boa-fé objetiva e à função social do contrato. O acórdão embargado deixou de se pronunciar sobre questão essencial suscitada nas contrarrazões, qual seja, a aplicação da teoria do adimplemento substancial ao caso concreto, matéria de ordem pública que deveria ter sido enfrentada de ofício.'
        },
        {
          name: 'Agravo de Instrumento',
          typeCode: 'REC-AGRV',
          category: 'judicial',
          score: 73,
          content: 'Egrégio Tribunal de Justiça do Estado de Minas Gerais. A agravante, inconformada com a r. decisão interlocutória proferida pelo MM. Juízo da 7ª Vara Cível de Belo Horizonte, que indeferiu o pedido de tutela de urgência, interpõe o presente Agravo de Instrumento, com fundamento no art. 1.015, I, do CPC/2015, requerendo a concessão de efeito suspensivo ativo. A decisão agravada deve ser reformada, pois presentes os requisitos do art. 300 do CPC: a probabilidade do direito e o perigo de dano irreparável, conforme demonstrado pela documentação acostada.'
        },
        {
          name: 'Mandado de Segurança Preventivo',
          typeCode: 'PET-MSEG',
          category: 'judicial',
          score: 91,
          content: 'Excelentíssimo Senhor Doutor Juiz Federal da Seção Judiciária de Minas Gerais. A impetrante, empresa mineradora regularmente constituída, com sede em Belo Horizonte/MG, vem impetrar o presente Mandado de Segurança Preventivo, com pedido liminar, em face de ato coator do Ilmo. Sr. Superintendente do IBAMA/MG, que notificou a impetrante para suspensão imediata de atividades de lavra, em flagrante violação ao direito líquido e certo de exercício de atividade econômica autorizada pelo DNPM, nos termos do art. 5º, LXIX, da CF/88 e Lei nº 12.016/2009.'
        },
        {
          name: 'Tutela Antecipada de Urgência',
          typeCode: 'MED-TUTA',
          category: 'judicial',
          score: 85,
          content: 'Excelentíssimo Senhor Doutor Juiz de Direito da Vara de Fazenda Pública de Belo Horizonte/MG. A requerente, com fundamento nos arts. 300 a 302 do CPC/2015, formula pedido de Tutela Antecipada de Urgência em caráter antecedente, requerendo a suspensão dos efeitos do auto de infração nº 2025/AI-4567, lavrado pela Secretaria de Meio Ambiente do Estado de Minas Gerais, que impôs multa de R$ 500.000,00 (quinhentos mil reais) por suposta irregularidade ambiental. Demonstra-se a fumaça do bom direito e o perigo de dano irreparável, consistente na inscrição do débito em dívida ativa.'
        },
        {
          name: 'Execução de Título Extrajudicial',
          typeCode: 'EXEC-TIT',
          category: 'judicial',
          score: 82,
          content: 'Excelentíssimo Senhor Doutor Juiz de Direito da Vara Cível da Comarca de Belo Horizonte/MG. O exequente, devidamente qualificado, vem promover a presente Execução de Título Extrajudicial em face do executado, com fundamento nos arts. 784 e 786 do CPC/2015. O título executivo consiste em contrato de prestação de serviços com cláusula de confissão de dívida, firmado em 10 de janeiro de 2025, representativo de obrigação líquida, certa e exigível no valor de R$ 320.000,00, acrescido de juros moratórios de 1% ao mês e correção monetária pelo IPCA desde o vencimento.'
        },
        {
          name: 'Cumprimento de Sentença',
          typeCode: 'EXEC-SENT',
          category: 'judicial',
          score: 76,
          content: 'Excelentíssimo Senhor Doutor Juiz de Direito da 2ª Vara Cível da Comarca de Belo Horizonte/MG. O exequente, nos autos do Processo nº 0023456-78.2024.8.13.0024, vem requerer o Cumprimento de Sentença, nos termos dos arts. 523 e seguintes do CPC/2015. A sentença transitou em julgado em 15 de março de 2026, condenando o réu ao pagamento de R$ 175.000,00, devidamente atualizado. Intimado pessoalmente, o devedor não efetuou o pagamento no prazo de 15 dias, incidindo a multa de 10% e honorários advocatícios de 10%, conforme art. 523, § 1º, do CPC.'
        },
        {
          name: 'Defesa Prévia Administrativa - IBAMA',
          typeCode: 'ADM-DPREV',
          category: 'administrativo',
          score: 89,
          content: 'Ilustríssimo Senhor Superintendente do IBAMA no Estado de Minas Gerais. A autuada, empresa de mineração devidamente autorizada pelo DNPM, apresenta a presente Defesa Prévia Administrativa contra o Auto de Infração nº 2026/AI-0789, lavrado em 20 de maio de 2026, que imputou à defendente a prática de infração ambiental prevista no art. 70 da Lei nº 9.605/98 c/c art. 66 do Decreto nº 6.514/2008. Demonstra-se a regularidade das operações, comprovada pelas licenças ambientais vigentes (LO nº 123/2024 - SUPRAM) e pelos relatórios de monitoramento ambiental aprovados pela FEAM.'
        },
        {
          name: 'Recurso Administrativo ao CGEN',
          typeCode: 'ADM-RADM',
          category: 'administrativo',
          score: 84,
          content: 'Ao Conselho de Gestão do Patrimônio Genético - CGEN. A recorrente, instituição de pesquisa cadastrada no SisGen sob o nº BR-2025-0456, interpõe o presente Recurso Administrativo em face da decisão que indeferiu o pedido de autorização de acesso ao patrimônio genético da biodiversidade brasileira, nos termos da Lei nº 13.123/2015 e do Decreto nº 8.772/2016. A decisão recorrida fundamentou-se em suposta insuficiência do plano de repartição de benefícios, contudo, a recorrente demonstra o integral cumprimento dos requisitos legais e regulamentares.'
        },
        {
          name: 'Impugnação de Lançamento - IRPJ',
          typeCode: 'TRIB-IMPL',
          category: 'tributario',
          score: 93,
          content: 'Ilustríssimo Senhor Delegado da Receita Federal do Brasil em Belo Horizonte/MG. A impugnante, sociedade empresária inscrita no CNPJ sob o nº 45.678.901/0001-23, apresenta a presente Impugnação ao Auto de Infração nº 2026/IRPJ-3456, nos termos do art. 15 do Decreto nº 70.235/72. O lançamento de ofício, no valor de R$ 2.300.000,00, referente ao IRPJ dos exercícios 2023 e 2024, fundamentou-se em suposta dedução indevida de despesas operacionais. Demonstra-se a plena regularidade das deduções realizadas, em conformidade com os arts. 299 e 311 do RIR/2018 e a jurisprudência consolidada do CARF.'
        },
        {
          name: 'Recurso Voluntário ao CARF',
          typeCode: 'TRIB-RVOLUNT',
          category: 'tributario',
          score: 90,
          content: 'Egrégio Conselho Administrativo de Recursos Fiscais - CARF. A recorrente interpõe o presente Recurso Voluntário, com fundamento no art. 33 do Decreto nº 70.235/72, contra a decisão da DRJ/BH que manteve integralmente o Auto de Infração nº 2025/IRPJ-1234, relativo à exigência de IRPJ e CSLL dos exercícios 2022 a 2024. A decisão recorrida desconsiderou as operações de reestruturação societária realizadas pela recorrente, caracterizando-as como planejamento tributário abusivo, em contrariedade à jurisprudência pacificada do CARF sobre o tema (Acórdão 1402-006.789).'
        },
        {
          name: 'Ação Civil Pública Ambiental',
          typeCode: 'AMB-ACP',
          category: 'ambiental',
          score: 86,
          content: 'Excelentíssimo Senhor Doutor Juiz Federal da Vara Ambiental de Belo Horizonte/MG. O Ministério Público Federal, com fundamento na Lei nº 7.347/85 e no art. 129, III, da CF/88, propõe a presente Ação Civil Pública Ambiental em face da mineradora ré, visando à reparação de danos causados ao meio ambiente na região do Alto Jequitinhonha/MG. A atividade minerária desenvolvida pela ré, sem a devida licença ambiental de operação, causou degradação em área de 150 hectares de Mata Atlântica, poluição de cursos d\'água e assoreamento de nascentes, afetando comunidades tradicionais e a fauna silvestre da região.'
        },
        {
          name: 'Defesa Prévia Ambiental - IBAMA',
          typeCode: 'AMB-DPREV',
          category: 'ambiental',
          score: 79,
          content: 'Ilustríssimo Senhor Superintendente do IBAMA em Minas Gerais. A autuada apresenta Defesa Prévia contra o Auto de Infração nº 2026/AMB-0234, que impôs multa de R$ 1.200.000,00 por suposta degradação de Área de Preservação Permanente (APP) na margem do Rio das Velhas. Demonstra-se que a intervenção na APP foi previamente autorizada pela Resolução CONAMA nº 369/2006 e pelo Termo de Autorização emitido pela SUPRAM/Central, sendo a atividade de utilidade pública para implantação de barragem de rejeitos, com o devido Plano de Recuperação de Áreas Degradadas (PRAD) aprovado.'
        },
        {
          name: 'Requerimento de Autorização de Pesquisa',
          typeCode: 'MIN-RAUTP',
          category: 'minerario',
          score: 94,
          content: 'Ilustríssimo Senhor Diretor-Geral da Agência Nacional de Mineração - ANM. A requerente, sociedade mineradora constituída nos termos da legislação brasileira, com sede em Belo Horizonte/MG, vem requerer Autorização de Pesquisa para substância mineral (minério de lítio) na área localizada no município de Araçuaí, Vale do Jequitinhonha/MG, com coordenadas geográficas delimitadas conforme memorial descritivo anexo, perfazendo área total de 2.000 hectares. O requerimento atende a todos os requisitos do art. 16 do Código de Mineração (Decreto-Lei nº 227/67) e da Resolução ANM nº 25/2020.'
        },
        {
          name: 'Plano de Aproveitamento Econômico',
          typeCode: 'MIN-PAE',
          category: 'minerario',
          score: 88,
          content: 'Ilustríssimo Senhor Diretor-Geral da Agência Nacional de Mineração - ANM. A titular do Alvará de Pesquisa nº 830.456/2024, em cumprimento ao art. 22 do Código de Mineração, apresenta o Plano de Aproveitamento Econômico (PAE) da jazida de minério de ferro localizada no município de Itabirito/MG. O estudo demonstra a viabilidade técnico-econômica da lavra, com reserva medida de 45 milhões de toneladas de minério com teor médio de 62% Fe, vida útil estimada de 20 anos e investimento total previsto de R$ 350 milhões, com geração de 800 empregos diretos e 2.400 indiretos.'
        }
      ];

      // Assign ids, types, dates, and status to each doc
      var docIds = [];
      for (var i = 0; i < demoDocuments.length; i++) {
        var doc = demoDocuments[i];
        doc.id = window.SJIFUtils.generateId();
        doc.type = TYPE_MAP[doc.typeCode] || doc.typeCode;
        doc.uploadedAt = randomDateInLastDays(90);
        doc.analyzedAt = new Date(
          new Date(doc.uploadedAt).getTime() + Math.floor(Math.random() * 3600000) + 60000
        ).toISOString();
        doc.status = 'analyzed';
        docIds.push(doc.id);
      }

      // Persist all documents
      for (var j = 0; j < demoDocuments.length; j++) {
        await this.addDocument(demoDocuments[j]);
      }

      // ── 4 processes ──────────────────────────────────────────────────
      var demoProcesses = [
        {
          id: window.SJIFUtils.generateId(),
          number: '0001234-56.2026.8.13.0001',
          area: 'Cível',
          court: 'TJMG',
          status: 'active',
          createdAt: randomDateInLastDays(60),
          documents: [docIds[0], docIds[1]]
        },
        {
          id: window.SJIFUtils.generateId(),
          number: '0005678-90.2025.8.13.0002',
          area: 'Tributário',
          court: 'TRF-1',
          status: 'active',
          createdAt: randomDateInLastDays(60),
          documents: [docIds[12], docIds[13]]
        },
        {
          id: window.SJIFUtils.generateId(),
          number: '0009876-54.2026.8.13.0003',
          area: 'Ambiental',
          court: 'TJMG',
          status: 'active',
          createdAt: randomDateInLastDays(60),
          documents: [docIds[14], docIds[15]]
        },
        {
          id: window.SJIFUtils.generateId(),
          number: '0003210-12.2026.8.13.0004',
          area: 'Minerário',
          court: 'TRF-1',
          status: 'active',
          createdAt: randomDateInLastDays(60),
          documents: [docIds[16], docIds[17]]
        }
      ];

      for (var p = 0; p < demoProcesses.length; p++) {
        await this.addProcess(demoProcesses[p]);
      }

      // ── Analysis entries (one per document) ──────────────────────────
      var analysisLabels = [
        'Análise de Conformidade Processual',
        'Verificação de Requisitos Formais',
        'Análise de Fundamentação Jurídica',
        'Verificação de Prazos e Tempestividade',
        'Análise de Consistência Argumentativa',
        'Verificação de Jurisprudência Aplicável',
        'Análise de Petitório e Causa de Pedir',
        'Verificação de Documentos Comprobatórios',
        'Análise de Legitimidade e Interesse',
        'Verificação de Competência Jurisdicional',
        'Análise de Requisitos Administrativos',
        'Verificação de Conformidade Regulatória',
        'Análise Tributária Detalhada',
        'Verificação de Base de Cálculo',
        'Análise de Impacto Ambiental',
        'Verificação de Licenciamento',
        'Análise de Viabilidade Minerária',
        'Verificação de Conformidade ANM'
      ];

      for (var k = 0; k < demoDocuments.length; k++) {
        var findings = [];
        var numFindings = 2 + Math.floor(Math.random() * 4);
        var findingTexts = [
          'Estrutura formal adequada aos padrões processuais vigentes.',
          'Fundamentação jurídica coerente com a jurisprudência do tribunal.',
          'Citação correta dos dispositivos legais aplicáveis.',
          'Pedidos formulados de forma clara e precisa.',
          'Documentação comprobatória suficiente para instrução do feito.',
          'Argumentação lógica e consistente ao longo de toda a peça.',
          'Tempestividade verificada — peça protocolada dentro do prazo legal.',
          'Observância dos requisitos formais do CPC/2015.',
          'Necessidade de complementação de provas para fortalecimento da tese.',
          'Recomenda-se revisão da estratégia argumentativa para maior persuasão.'
        ];
        for (var f = 0; f < numFindings; f++) {
          findings.push(findingTexts[Math.floor(Math.random() * findingTexts.length)]);
        }

        await this.addAnalysis({
          id: window.SJIFUtils.generateId(),
          documentId: demoDocuments[k].id,
          documentName: demoDocuments[k].name,
          type: analysisLabels[k] || 'Análise Geral',
          score: demoDocuments[k].score,
          findings: findings,
          summary: 'Análise concluída com pontuação ' + demoDocuments[k].score + '/100. O documento apresenta qualidade ' +
            (demoDocuments[k].score >= 90 ? 'excelente' : demoDocuments[k].score >= 80 ? 'boa' : 'satisfatória') +
            ', atendendo aos requisitos formais e materiais aplicáveis.',
          createdAt: demoDocuments[k].analyzedAt
        });
      }

      return {
        seeded: true,
        documents: demoDocuments.length,
        processes: demoProcesses.length,
        analyses: demoDocuments.length
      };
    }
  }

  window.SJIFStore = SJIFStore;
})();
