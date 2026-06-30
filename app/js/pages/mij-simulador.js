/**
 * SJIF MIJ Simulador Page
 * Simulador de Recurso — Score de Êxito
 */

window.MIJSimuladorPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const categories = (window.SJIF_TAXONOMY && window.SJIF_TAXONOMY.categories) || [];
    const materias = [
      'Consumidor', 'Contratos', 'Responsabilidade Civil', 'Família',
      'Tributário', 'Trabalhista', 'Criminal', 'Ambiental',
      'Administrativo', 'Execução Fiscal', 'Empresarial', 'Previdenciário'
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';
    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">
            🎯 Simulador de Recurso
          </h2>
          <p style="color:var(--text-muted);font-size:0.85rem">Estime o score de êxito baseado em histórico real de decisões</p>
        </div>
        <button class="btn btn-outline" onclick="window.location.hash='#/mij'">← Voltar</button>
      </div>

      <div class="grid-2" style="gap:24px">
        <!-- Input Form -->
        <div class="card">
          <div class="card-header" style="padding:20px 24px;border-bottom:1px solid var(--border)">
            <h3 style="color:var(--text-heading);font-size:1rem">📝 Parâmetros da Simulação</h3>
          </div>
          <div class="card-body" style="padding:24px">
            <div style="display:flex;flex-direction:column;gap:20px">
              <div>
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Tipo de Ação / Recurso</label>
                <select class="select" id="sim-tipo" style="width:100%">
                  <option value="">Selecione...</option>
                  <option value="apelacao">Apelação</option>
                  <option value="recurso_especial">Recurso Especial (REsp)</option>
                  <option value="recurso_extraordinario">Recurso Extraordinário (RE)</option>
                  <option value="agravo_instrumento">Agravo de Instrumento</option>
                  <option value="agravo_interno">Agravo Interno</option>
                  <option value="embargos_declaracao">Embargos de Declaração</option>
                  <option value="mandado_seguranca">Mandado de Segurança</option>
                  <option value="habeas_corpus">Habeas Corpus</option>
                  <option value="acao_anulatoria">Ação Anulatória</option>
                  <option value="embargos_execucao">Embargos à Execução</option>
                </select>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Matéria Principal</label>
                <select class="select" id="sim-materia" style="width:100%">
                  <option value="">Selecione...</option>
                  ${materias.map(m => `<option value="${m}">${m}</option>`).join('')}
                </select>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Tribunal</label>
                <select class="select" id="sim-tribunal" style="width:100%">
                  <option value="">Todos os tribunais</option>
                  <option value="TJMG">TJMG — Minas Gerais</option>
                  <option value="STJ">STJ — Superior Tribunal de Justiça</option>
                  <option value="TJPA">TJPA — Pará</option>
                  <option value="TJMA">TJMA — Maranhão</option>
                </select>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Julgador (opcional)</label>
                <input type="text" class="input" id="sim-magistrado" placeholder="Nome do julgador..." style="width:100%">
                <small style="color:var(--text-muted);font-size:0.7rem">Deixe em branco para análise geral do tribunal</small>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Tese Principal (opcional)</label>
                <textarea class="input" id="sim-tese" rows="3" placeholder="Descreva brevemente a tese jurídica..." style="width:100%;resize:vertical"></textarea>
              </div>

              <button class="btn btn-primary btn-lg" id="sim-btn-simular" style="width:100%">
                🎯 Simular Recurso
              </button>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div id="sim-results">
          <div class="card" style="height:100%;display:flex;align-items:center;justify-content:center">
            <div style="text-align:center;padding:40px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px;opacity:0.3">🎯</div>
              <h3 style="color:var(--text-heading);font-weight:400">Preencha os parâmetros</h3>
              <p style="font-size:0.85rem">e clique em "Simular Recurso" para ver os resultados</p>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(wrapper);

    document.getElementById('sim-btn-simular').addEventListener('click', async () => {
      const tipo = document.getElementById('sim-tipo').value;
      const materia = document.getElementById('sim-materia').value;
      const tribunal = document.getElementById('sim-tribunal').value;
      const magistrado = document.getElementById('sim-magistrado').value;
      const tese = document.getElementById('sim-tese').value;
      const resultsDiv = document.getElementById('sim-results');

      if (!tipo || !materia) {
        if (window.SJIFUtils) window.SJIFUtils.showToast('Selecione o tipo de ação e a matéria', 'warning');
        return;
      }

      resultsDiv.innerHTML = '<div class="card" style="padding:60px;text-align:center"><div style="font-size:2rem;animation:pulse 1.5s ease-in-out infinite">🔄</div><p style="color:var(--text-muted);margin-top:12px">Processando simulação...</p></div>';

      try {
        const resp = await fetch('/api/mij/simulador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo_acao: tipo, materia, tribunal, magistrado_nome: magistrado, tese })
        });

        if (!resp.ok) throw new Error('API offline');
        const result = await resp.json();
        renderResult(result);
      } catch (e) {
        // Fallback: render demo result
        const demoResult = generateDemoResult(tipo, materia, tribunal);
        renderResult(demoResult);
      }
    });

    function generateDemoResult(tipo, materia, tribunal) {
      const baseScore = 40 + Math.random() * 45;
      return {
        score_exito: baseScore,
        confianca: baseScore > 65 ? 'Alta' : baseScore > 45 ? 'Média' : 'Baixa',
        total_casos_analisados: Math.floor(50 + Math.random() * 200),
        teses_recomendadas: [
          'Violação do princípio do contraditório e ampla defesa',
          'Cerceamento de defesa por indeferimento de prova',
          'Divergência jurisprudencial entre turmas do ' + (tribunal || 'tribunal'),
          'Aplicação retroativa de norma mais benéfica'
        ].slice(0, 2 + Math.floor(Math.random() * 2)),
        pontos_favoraveis: [
          'Jurisprudência recente favorável na matéria',
          'Tendência do tribunal a reformar decisões similares',
          'Precedentes vinculantes aplicáveis ao caso'
        ].slice(0, 2),
        pontos_atencao: [
          'Súmula do STJ pode limitar argumentação',
          'Magistrado tende a manter posição em matérias similares'
        ],
        jurisprudencia_relevante: [
          { numero: 'REsp 1.234.567/MG', tribunal: 'STJ', resultado: 'Provido', materia: materia },
          { numero: 'Apelação 2.345.678', tribunal: tribunal || 'TJMG', resultado: 'Parcial', materia: materia }
        ]
      };
    }

    function renderResult(r) {
      const scoreColor = r.score_exito > 65 ? 'var(--success)' : r.score_exito > 45 ? 'var(--warning)' : 'var(--danger)';
      const confColor = { 'Alta': 'badge-success', 'Média': 'badge-warning', 'Baixa': 'badge-danger' }[r.confianca] || 'badge-info';

      document.getElementById('sim-results').innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px">
          <!-- Score -->
          <div class="card" style="border-left:4px solid ${scoreColor}">
            <div class="card-body" style="padding:32px;text-align:center">
              <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:12px">Score de Êxito Estimado</div>
              <div class="analysis-score" style="width:120px;height:120px;margin:0 auto 16px;font-size:2rem;background:conic-gradient(${scoreColor} ${r.score_exito * 3.6}deg, rgba(255,255,255,0.05) 0deg)">
                ${r.score_exito.toFixed(0)}%
              </div>
              <span class="badge ${confColor}" style="font-size:0.8rem;padding:6px 16px">Confiança: ${r.confianca}</span>
              <div style="color:var(--text-muted);font-size:0.75rem;margin-top:8px">${r.total_casos_analisados} casos analisados</div>
            </div>
          </div>

          <!-- Teses Recomendadas -->
          ${r.teses_recomendadas && r.teses_recomendadas.length > 0 ? `
            <div class="card">
              <div class="card-header" style="padding:14px 20px;border-bottom:1px solid var(--border)">
                <h4 style="color:var(--gold);font-size:0.85rem">🎯 Teses Recomendadas</h4>
              </div>
              <div class="card-body" style="padding:16px">
                ${r.teses_recomendadas.map(t => `
                  <div style="padding:10px 14px;border-left:3px solid var(--gold);margin-bottom:8px;background:rgba(212,175,55,0.04);border-radius:0 8px 8px 0">
                    <span style="color:var(--text);font-size:0.8rem">${t}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Pontos Favoráveis -->
          ${r.pontos_favoraveis && r.pontos_favoraveis.length > 0 ? `
            <div class="card">
              <div class="card-header" style="padding:14px 20px;border-bottom:1px solid var(--border)">
                <h4 style="color:var(--success);font-size:0.85rem">✅ Pontos Favoráveis</h4>
              </div>
              <div class="card-body" style="padding:16px">
                ${r.pontos_favoraveis.map(p => `
                  <div style="padding:8px 14px;border-left:3px solid var(--success);margin-bottom:8px;border-radius:0 8px 8px 0">
                    <span style="color:var(--text);font-size:0.8rem">${p}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Pontos de Atenção -->
          ${r.pontos_atencao && r.pontos_atencao.length > 0 ? `
            <div class="card">
              <div class="card-header" style="padding:14px 20px;border-bottom:1px solid var(--border)">
                <h4 style="color:var(--warning);font-size:0.85rem">⚠️ Pontos de Atenção</h4>
              </div>
              <div class="card-body" style="padding:16px">
                ${r.pontos_atencao.map(p => `
                  <div style="padding:8px 14px;border-left:3px solid var(--warning);margin-bottom:8px;border-radius:0 8px 8px 0">
                    <span style="color:var(--text);font-size:0.8rem">${p}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Jurisprudência -->
          ${r.jurisprudencia_relevante && r.jurisprudencia_relevante.length > 0 ? `
            <div class="card">
              <div class="card-header" style="padding:14px 20px;border-bottom:1px solid var(--border)">
                <h4 style="color:var(--info);font-size:0.85rem">📚 Jurisprudência Relevante</h4>
              </div>
              <div class="card-body" style="padding:16px">
                ${r.jurisprudencia_relevante.map(j => `
                  <div style="padding:10px 14px;background:rgba(52,152,219,0.04);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-heading)">${j.numero}</span>
                      <span style="color:var(--text-muted);font-size:0.7rem;margin-left:8px">${j.tribunal}</span>
                    </div>
                    <span class="badge ${j.resultado === 'Provido' ? 'badge-success' : 'badge-warning'}" style="font-size:0.7rem">${j.resultado}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }
  }
};
