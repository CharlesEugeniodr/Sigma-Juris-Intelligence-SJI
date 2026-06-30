/**
 * SJIF MIJ Dashboard Page
 * Motor de Inteligência Judicial — Painel Principal
 */

window.MIJDashboardPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';

    // Try to fetch from API, fallback to demo
    let stats = null;
    try {
      const resp = await fetch('/api/mij/stats');
      if (resp.ok) stats = await resp.json();
    } catch (e) { /* API not available yet */ }

    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">
            🧠 Inteligência Judicial
          </h2>
          <p style="color:var(--text-muted);font-size:0.85rem">
            Motor de análise preditiva baseado em decisões de TJMG, STJ, TJPA e TJMA
          </p>
        </div>
        <span class="badge" style="background:linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05));color:var(--gold);padding:8px 16px;font-size:0.75rem;letter-spacing:0.1em">
          ⭐ MÓDULO PREMIUM
        </span>
      </div>

      <!-- KPI Cards -->
      <div class="grid-4" style="gap:16px;margin-bottom:32px">
        <div class="stat-card">
          <div class="stat-value">${stats ? stats.total_magistrados : '—'}</div>
          <div class="stat-label">🧑‍⚖️ Julgadores Mapeados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats ? stats.total_decisoes : '—'}</div>
          <div class="stat-label">📋 Decisões Analisadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats ? stats.total_tribunais : '4'}</div>
          <div class="stat-label">🏛️ Tribunais</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats ? stats.ipt_medio + '%' : '—'}</div>
          <div class="stat-label">📊 IPT Médio</div>
        </div>
      </div>

      <!-- Tribunais -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-header" style="padding:20px 24px;border-bottom:1px solid var(--border)">
          <h3 style="color:var(--text-heading);font-size:1rem">🏛️ Tribunais Piloto</h3>
        </div>
        <div class="card-body" style="padding:24px">
          <div class="grid-4" style="gap:16px">
            ${['TJMG', 'STJ', 'TJPA', 'TJMA'].map(t => {
              const info = {
                'TJMG': { nome: 'Tribunal de Justiça de Minas Gerais', estado: 'MG', color: '#3498DB', icon: '⚖️' },
                'STJ': { nome: 'Superior Tribunal de Justiça', estado: 'DF', color: '#E74C3C', icon: '🏛️' },
                'TJPA': { nome: 'Tribunal de Justiça do Pará', estado: 'PA', color: '#27AE60', icon: '⚖️' },
                'TJMA': { nome: 'Tribunal de Justiça do Maranhão', estado: 'MA', color: '#F39C12', icon: '⚖️' }
              }[t];
              return `
                <div class="card" style="cursor:pointer;border-left:3px solid ${info.color};transition:all 0.3s" 
                     onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'"
                     onclick="window.location.hash='#/mij/tribunal/${t}'">
                  <div class="card-body" style="padding:20px">
                    <div style="font-size:1.5rem;margin-bottom:8px">${info.icon}</div>
                    <h4 style="color:var(--text-heading);font-size:0.95rem;margin-bottom:4px">${t}</h4>
                    <p style="color:var(--text-muted);font-size:0.75rem">${info.nome}</p>
                    <p style="color:var(--text-muted);font-size:0.7rem;margin-top:8px">${info.estado}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid-3" style="gap:16px;margin-bottom:32px">
        <div class="card" style="cursor:pointer;transition:all 0.3s" onclick="window.location.hash='#/mij/magistrados'"
             onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
          <div class="card-body" style="padding:32px;text-align:center">
            <div style="font-size:2.5rem;margin-bottom:12px">👨‍⚖️</div>
            <h3 style="color:var(--text-heading);font-size:1rem;margin-bottom:8px">Consultar Julgador</h3>
            <p style="color:var(--text-muted);font-size:0.8rem">Perfil decisório, tendências e métricas por julgador</p>
          </div>
        </div>

        <div class="card" style="cursor:pointer;transition:all 0.3s" onclick="window.location.hash='#/mij/simulador'"
             onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
          <div class="card-body" style="padding:32px;text-align:center">
            <div style="font-size:2.5rem;margin-bottom:12px">🎯</div>
            <h3 style="color:var(--text-heading);font-size:1rem;margin-bottom:8px">Simulador de Recurso</h3>
            <p style="color:var(--text-muted);font-size:0.8rem">Estime o score de êxito com base em histórico real</p>
          </div>
        </div>

        <div class="card" style="cursor:pointer;transition:all 0.3s" onclick="window.location.hash='#/mij/relatorio'"
             onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
          <div class="card-body" style="padding:32px;text-align:center">
            <div style="font-size:2.5rem;margin-bottom:12px">📋</div>
            <h3 style="color:var(--text-heading);font-size:1rem;margin-bottom:8px">Relatório Estratégico</h3>
            <p style="color:var(--text-muted);font-size:0.8rem">Gere relatórios completos com teses e jurisprudência</p>
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div class="card">
        <div class="card-body" style="padding:20px;display:flex;align-items:center;gap:16px">
          <div style="width:12px;height:12px;border-radius:50%;background:${stats ? 'var(--success)' : 'var(--warning)'};flex-shrink:0"></div>
          <div>
            <span style="color:var(--text-heading);font-size:0.85rem">${stats ? 'API MIJ Online' : 'API MIJ Offline — Execute o servidor backend'}</span>
            <span style="color:var(--text-muted);font-size:0.75rem;display:block;margin-top:2px">
              ${stats ? 'Conectado ao Motor de Inteligência Judicial' : 'python -m uvicorn server.main:app --reload --port 8000'}
            </span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(wrapper);
  }
};
