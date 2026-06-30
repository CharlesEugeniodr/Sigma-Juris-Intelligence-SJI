/**
 * SJIF MIJ Magistrados Page
 * Consulta de perfil decisório de magistrados
 */

window.MIJMagistradosPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';
    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">
            👨‍⚖️ Consulta de Julgadores
          </h2>
          <p style="color:var(--text-muted);font-size:0.85rem">Perfil decisório e tendências por julgador</p>
        </div>
        <button class="btn btn-outline" onclick="window.location.hash='#/mij'">← Voltar</button>
      </div>

      <!-- Search Bar -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-body" style="padding:24px">
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <input type="text" class="input" id="mij-search-nome" placeholder="Nome do julgador..." style="flex:2;min-width:200px">
            <select class="select" id="mij-search-tribunal" style="flex:1;min-width:140px">
              <option value="">Todos os Tribunais</option>
              <option value="TJMG">TJMG</option>
              <option value="STJ">STJ</option>
              <option value="TJPA">TJPA</option>
              <option value="TJMA">TJMA</option>
            </select>
            <button class="btn btn-primary" id="mij-btn-buscar">🔍 Buscar</button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div id="mij-magistrados-results"></div>

      <!-- Perfil Detail (hidden initially) -->
      <div id="mij-perfil-detail" style="display:none"></div>
    `;
    container.appendChild(wrapper);

    const searchBtn = document.getElementById('mij-btn-buscar');
    const searchInput = document.getElementById('mij-search-nome');
    const searchTribunal = document.getElementById('mij-search-tribunal');
    const resultsDiv = document.getElementById('mij-magistrados-results');

    const buscar = async () => {
      const nome = searchInput.value.trim();
      const tribunal = searchTribunal.value;

      resultsDiv.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">🔄 Buscando...</div>';

      try {
        const params = new URLSearchParams();
        if (nome) params.append('nome', nome);
        if (tribunal) params.append('tribunal', tribunal);

        const resp = await fetch('/api/mij/magistrados?' + params.toString());
        if (!resp.ok) throw new Error('API offline');

        const magistrados = await resp.json();
        renderResults(magistrados);
      } catch (e) {
        resultsDiv.innerHTML = `
          <div class="empty-state">
            <div style="font-size:3rem;margin-bottom:16px">🔌</div>
            <h3 style="color:var(--text-heading)">API MIJ não disponível</h3>
            <p style="color:var(--text-muted);margin-bottom:16px">Inicie o servidor backend para consultar julgadores</p>
            <code style="color:var(--gold);font-size:0.8rem;background:rgba(212,175,55,0.08);padding:8px 16px;border-radius:8px">
              python -m uvicorn server.main:app --reload --port 8000
            </code>
          </div>
        `;
      }
    };

    function renderResults(magistrados) {
      if (!magistrados || magistrados.length === 0) {
        resultsDiv.innerHTML = `
          <div class="empty-state">
            <div style="font-size:3rem;margin-bottom:16px">🔍</div>
            <h3 style="color:var(--text-heading)">Nenhum julgador encontrado</h3>
            <p style="color:var(--text-muted)">Tente outro nome ou tribunal</p>
          </div>
        `;
        return;
      }

      resultsDiv.innerHTML = `
        <p style="color:var(--text-muted);font-size:0.8rem;margin-bottom:16px">${magistrados.length} resultado(s)</p>
        <div class="grid-2" style="gap:16px">
          ${magistrados.map(m => `
            <div class="card" style="cursor:pointer;transition:all 0.3s" 
                 onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'"
                 onclick="MIJMagistradosPage.showPerfil(${m.id})">
              <div class="card-body" style="padding:24px">
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
                  <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--navy-mid),var(--navy-light));display:flex;align-items:center;justify-content:center;font-size:1.2rem">👨‍⚖️</div>
                  <div>
                    <h4 style="color:var(--text-heading);font-size:0.95rem">${m.nome}</h4>
                    <div style="display:flex;gap:8px;margin-top:4px">
                      <span class="badge badge-info">${m.tribunal}</span>
                      ${m.vara ? `<span style="color:var(--text-muted);font-size:0.7rem">${m.vara}</span>` : ''}
                    </div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border)">
                  <div style="text-align:center">
                    <div style="font-size:1.1rem;font-weight:700;color:var(--gold)">${m.total_decisoes || '—'}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted)">Decisões</div>
                  </div>
                  <div style="text-align:center">
                    <div style="font-size:1.1rem;font-weight:700;color:var(--success)">${m.taxa_procedencia != null ? m.taxa_procedencia.toFixed(0) + '%' : '—'}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted)">Procedência</div>
                  </div>
                  <div style="text-align:center">
                    <div style="font-size:1.1rem;font-weight:700;color:${(m.taxa_reforma || 0) > 30 ? 'var(--danger)' : 'var(--text-heading)'}">${m.taxa_reforma != null ? m.taxa_reforma.toFixed(0) + '%' : '—'}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted)">Reforma</div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    searchBtn.addEventListener('click', buscar);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscar(); });

    // Auto-search on load
    buscar();
  },

  async showPerfil(magistradoId) {
    const container = document.getElementById('page-container');
    if (!container) return;

    try {
      const [perfilResp, decisoesResp] = await Promise.all([
        fetch(`/api/mij/magistrados/${magistradoId}`),
        fetch(`/api/mij/magistrados/${magistradoId}/decisoes?limit=20`)
      ]);

      if (!perfilResp.ok) throw new Error('Perfil não encontrado');
      const perfil = await perfilResp.json();
      const decisoes = decisoesResp.ok ? await decisoesResp.json() : [];

      container.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'animate-in';

      const metricas = perfil.metricas_json ? JSON.parse(perfil.metricas_json) : {};

      wrapper.innerHTML = `
        <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
          <button class="btn btn-outline btn-sm" onclick="MIJMagistradosPage.render()">← Voltar à busca</button>
          <div style="display:flex; gap:8px;">
            <button id="btn-export-pdf" class="btn btn-outline btn-sm">PDF</button>
            <button id="btn-export-docx" class="btn btn-outline btn-sm">DOCX</button>
          </div>
        </div>

        <!-- Header -->
        <div class="card" style="margin-bottom:24px;border-left:4px solid var(--gold)">
          <div class="card-body" style="padding:32px;display:flex;align-items:center;gap:24px;flex-wrap:wrap">
            <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0">👨‍⚖️</div>
            <div style="flex:1">
              <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">${perfil.nome}</h2>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
                <span class="badge badge-info">${perfil.tribunal}</span>
                ${perfil.vara ? `<span class="badge" style="background:rgba(255,255,255,0.06);color:var(--text)">${perfil.vara}</span>` : ''}
                ${perfil.comarca ? `<span style="color:var(--text-muted);font-size:0.8rem">📍 ${perfil.comarca}</span>` : ''}
              </div>
            </div>
            <div style="display:flex;gap:24px;flex-wrap:wrap">
              <div style="text-align:center">
                <div style="font-size:2rem;font-weight:700;color:var(--gold)">${perfil.total_decisoes || 0}</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">Decisões</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:2rem;font-weight:700;color:var(--success)">${perfil.taxa_procedencia != null ? perfil.taxa_procedencia.toFixed(1) + '%' : '—'}</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">Procedência</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:2rem;font-weight:700;color:var(--danger)">${perfil.taxa_reforma != null ? perfil.taxa_reforma.toFixed(1) + '%' : '—'}</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">Reforma</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid-2" style="gap:16px;margin-bottom:24px">
          <!-- Radar Chart -->
          <div class="card">
            <div class="card-header" style="padding:16px 24px;border-bottom:1px solid var(--border)">
              <h3 style="color:var(--text-heading);font-size:0.9rem">📊 Perfil por Matéria</h3>
            </div>
            <div class="card-body" style="padding:24px">
              <div class="chart-container" style="height:280px">
                <canvas id="mij-radar-materias"></canvas>
              </div>
            </div>
          </div>

          <!-- Stats Breakdown -->
          <div class="card">
            <div class="card-header" style="padding:16px 24px;border-bottom:1px solid var(--border)">
              <h3 style="color:var(--text-heading);font-size:0.9rem">📈 Métricas Detalhadas</h3>
            </div>
            <div class="card-body" style="padding:24px">
              <div style="display:flex;flex-direction:column;gap:12px">
                ${[
                  { label: 'SET Global', value: perfil.set_global || metricas.set_global, icon: '🎯' },
                  { label: 'IPT', value: perfil.ipt || metricas.ipt, icon: '📊' },
                  { label: 'IAJ', value: perfil.iaj || metricas.iaj, icon: '⚖️' },
                  { label: 'Tempo Médio', value: perfil.tempo_medio_dias ? perfil.tempo_medio_dias.toFixed(0) + ' dias' : '—', icon: '⏱️', noBar: true }
                ].map(m => `
                  <div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                      <span style="color:var(--text);font-size:0.8rem">${m.icon} ${m.label}</span>
                      <span style="color:var(--gold);font-weight:600;font-size:0.8rem">${typeof m.value === 'number' ? m.value.toFixed(1) + '%' : (m.value || '—')}</span>
                    </div>
                    ${!m.noBar ? `
                      <div class="progress-bar" style="height:6px">
                        <div class="progress-fill" style="width:${typeof m.value === 'number' ? Math.min(m.value, 100) : 0}%"></div>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Temporal Trend Chart -->
        <div class="card" id="mij-trend-card" style="margin-bottom:24px">
          <div class="card-header" style="padding:16px 24px;border-bottom:1px solid var(--border)">
            <h3 style="color:var(--text-heading);font-size:0.9rem">📈 Tendência Temporal</h3>
          </div>
          <div class="card-body" style="padding:24px">
            <canvas id="mij-trend-chart" style="max-height:250px"></canvas>
            <div id="mij-trend-empty" style="display:none;text-align:center;padding:20px;color:var(--text-muted);font-size:0.8rem">
              Dados insuficientes para exibir tendência temporal (mínimo 2 períodos)
            </div>
          </div>
        </div>

        <!-- Recent Decisions -->
        <div class="card">
          <div class="card-header" style="padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
            <h3 style="color:var(--text-heading);font-size:0.9rem">📋 Últimas Decisões</h3>
            <span style="color:var(--text-muted);font-size:0.75rem">${decisoes.length || 0} registros</span>
          </div>
          <div class="card-body" style="padding:0">
            ${decisoes.length > 0 ? `
              <table class="table" style="margin:0">
                <thead>
                  <tr>
                    <th>Processo</th>
                    <th>Tipo</th>
                    <th>Matéria</th>
                    <th>Resultado</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  ${decisoes.map(d => {
                    const resultColor = {
                      'procedente': 'var(--success)', 'provido': 'var(--success)',
                      'improcedente': 'var(--danger)', 'desprovido': 'var(--danger)',
                      'parcialmente_procedente': 'var(--warning)', 'parcial_provimento': 'var(--warning)',
                      'não_conhecido': 'var(--text-muted)'
                    }[d.resultado] || 'var(--text)';

                    const resultLabel = {
                      'procedente': '✅ Procedente', 'provido': '✅ Provido',
                      'improcedente': '❌ Improcedente', 'desprovido': '❌ Desprovido',
                      'parcialmente_procedente': '⚠️ Parcial', 'parcial_provimento': '⚠️ Parcial',
                      'não_conhecido': '⊘ Não Conhecido'
                    }[d.resultado] || d.resultado;

                    return `
                      <tr>
                        <td style="font-family:var(--font-mono);font-size:0.75rem">${d.processo_numero || '—'}</td>
                        <td><span class="badge">${d.tipo || '—'}</span></td>
                        <td style="font-size:0.8rem">${d.materia || '—'}</td>
                        <td style="color:${resultColor};font-size:0.8rem;font-weight:600">${resultLabel}</td>
                        <td style="font-size:0.75rem;color:var(--text-muted)">${d.data_decisao || '—'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : `
              <div style="padding:40px;text-align:center;color:var(--text-muted)">Sem decisões registradas</div>
            `}
          </div>
        </div>
      `;

      container.appendChild(wrapper);

      // Render radar chart if Chart.js is available and we have materia data
      if (window.Chart && metricas.materias) {
        const labels = Object.keys(metricas.materias).slice(0, 8);
        const data = labels.map(l => metricas.materias[l]?.procedencia || 0);
        
        var radarCanvas = document.getElementById('mij-radar-materias');
        var existingChart = Chart.getChart(radarCanvas);
        if (existingChart) existingChart.destroy();
        new Chart(radarCanvas, {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Taxa de Procedência (%)',
              data: data,
              backgroundColor: 'rgba(212,175,55,0.15)',
              borderColor: '#D4AF37',
              pointBackgroundColor: '#D4AF37',
              pointBorderColor: '#D4AF37',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { min: 0, max: 100, ticks: { color: '#6B7A8D', backdropColor: 'transparent' }, grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#C5CDD5', font: { size: 10, family: 'Montserrat' } } } },
            plugins: { legend: { display: false } }
          }
        });
      }

      // Render temporal trend chart
      if (window.Chart) {
        var months = {};
        (decisoes || []).forEach(function(d) {
          var date = new Date(d.data_julgamento || d.data || Date.now());
          var key = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0');
          if (!months[key]) months[key] = { total: 0, procedente: 0 };
          months[key].total++;
          if (d.resultado === 'procedente' || d.resultado === 'parcialmente_procedente') months[key].procedente++;
        });

        var trendLabels = Object.keys(months).sort();
        var trendData = trendLabels.map(function(k) { return Math.round((months[k].procedente / months[k].total) * 100); });

        if (trendLabels.length > 1) {
          setTimeout(function() {
            try {
              var trendCanvas = document.getElementById('mij-trend-chart');
              if (trendCanvas) {
                var existingTrend = Chart.getChart(trendCanvas);
                if (existingTrend) existingTrend.destroy();
                new Chart(trendCanvas, {
                  type: 'line',
                  data: {
                    labels: trendLabels,
                    datasets: [{
                      label: 'Taxa de Procedência (%)',
                      data: trendData,
                      borderColor: '#D4AF37',
                      backgroundColor: 'rgba(212,175,55,0.1)',
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#D4AF37',
                      pointRadius: 4
                    }]
                  },
                  options: {
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8E9AAB' } },
                      x: { grid: { display: false }, ticks: { color: '#8E9AAB', font: { size: 10 } } }
                    },
                    plugins: { legend: { labels: { color: '#8E9AAB' } } }
                  }
                });
              }
            } catch(e) { console.warn('Trend chart error:', e); }
          }, 100);
        } else {
          var trendEmpty = document.getElementById('mij-trend-empty');
          var trendChartEl = document.getElementById('mij-trend-chart');
          if (trendEmpty) trendEmpty.style.display = 'block';
          if (trendChartEl) trendChartEl.style.display = 'none';
        }
      }

      // --- Export Buttons Event Listeners ---
      const btnPdf = container.querySelector('#btn-export-pdf');
      if (btnPdf) {
          btnPdf.addEventListener('click', () => {
              if (typeof html2pdf !== 'undefined') {
                  const element = container.querySelector('.animate-in') || container;
                  html2pdf().from(element).save('relatorio-sjif.pdf');
              } else {
                  alert("Biblioteca PDF não carregada.");
              }
          });
      }

      const btnDocx = container.querySelector('#btn-export-docx');
      if (btnDocx) {
          btnDocx.addEventListener('click', () => {
              var content = container.querySelector('.animate-in') || container;
              var header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Relatório SJIF</title></head><body>';
              var footer = '</body></html>';
              var html = header + content.innerHTML + footer;
              var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = url;
              a.download = 'relatorio-sjif.doc';
              a.click();
              URL.revokeObjectURL(url);
          });
      }

    } catch (e) {
      container.innerHTML = `
        <div class="empty-state">
          <div style="font-size:3rem;margin-bottom:16px">⚠️</div>
          <h3 style="color:var(--text-heading)">Erro ao carregar perfil</h3>
          <p style="color:var(--text-muted)">${e.message}</p>
          <button class="btn btn-primary" onclick="MIJMagistradosPage.render()" style="margin-top:16px">Voltar</button>
        </div>
      `;
    }
  }
};
