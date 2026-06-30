// ============================================================
// SJIF Dashboard Page
// ============================================================
window.DashboardPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    // --- Data ---
    const auth = window.app && window.app.auth;
    const user = auth ? auth.getCurrentUser() : null;
    const store = window.app && window.app.store;
    const charts = window.app && window.app.charts;

    let docs = [];
    let procs = [];
    try {
      if (store) {
        docs = await store.getAllDocuments() || [];
        procs = await store.getAllProcesses() || [];
      }
    } catch (e) {
      docs = [];
      procs = [];
    }

    const totalDocs = docs.length;
    const analyzedDocs = docs.filter(function(d) { return d.analysis; }).length;
    const avgScore = analyzedDocs > 0
      ? Math.round(docs.reduce(function(sum, d) { return sum + (d.analysis ? (d.analysis.score || 0) : 0); }, 0) / analyzedDocs)
      : 0;
    const activeProcs = procs.filter(function(p) { return p.status !== 'arquivado' && p.status !== 'encerrado'; }).length;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = dd + '/' + mm + '/' + yyyy;

    // --- Scoped styles ---
    const style = document.createElement('style');
    style.textContent = `
      .dash-welcome {
        margin-bottom: 32px;
      }
      .dash-welcome h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-heading);
        margin-bottom: 4px;
      }
      .dash-welcome-date {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 300;
      }
      .dash-stats {
        display: grid;
        gap: 24px;
        margin-bottom: 32px;
      }
      .dash-stat-icon {
        font-size: 2rem;
        margin-bottom: 8px;
        filter: grayscale(0.1);
      }
      .dash-charts {
        display: grid;
        gap: 24px;
        margin-bottom: 32px;
      }
      .dash-recent-row {
        cursor: pointer;
        transition: background var(--duration) var(--ease);
      }
      .dash-recent-row:hover {
        background: var(--bg-card-hover);
      }
      .score-high { color: var(--success); font-weight: 600; }
      .score-mid  { color: var(--gold); font-weight: 600; }
      .score-low-mid { color: #E67E22; font-weight: 600; }
      .score-low  { color: var(--danger); font-weight: 600; }
      .dash-no-data {
        text-align: center;
        padding: 48px 24px;
        color: var(--text-muted);
      }
      .dash-no-data-icon {
        font-size: 3rem;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      .dash-no-data p {
        margin-bottom: 16px;
        font-size: 0.95rem;
      }
    `;
    container.appendChild(style);

    // --- Welcome ---
    const welcome = document.createElement('div');
    welcome.className = 'dash-welcome animate-in';
    welcome.innerHTML = '<h2>Bem-vindo, ' + window.SJIFUtils.escapeHtml(user ? user.name : 'Usuário') + '</h2>' +
      '<span class="dash-welcome-date">' + formattedDate + '</span>';
    container.appendChild(welcome);

    // --- Stat Cards ---
    var statsData = [
      { icon: '📄', value: window.SJIFUtils.formatNumber(totalDocs), label: 'Total Documentos' },
      { icon: '✅', value: window.SJIFUtils.formatNumber(analyzedDocs), label: 'Documentos Analisados' },
      { icon: '📊', value: avgScore + '%', label: 'Score Médio' },
      { icon: '⚖️', value: window.SJIFUtils.formatNumber(activeProcs), label: 'Processos Ativos' }
    ];

    var statsGrid = document.createElement('div');
    statsGrid.className = 'dash-stats grid grid-4';
    statsData.forEach(function(s, i) {
      var card = document.createElement('div');
      card.className = 'stat-card animate-in';
      card.style.animationDelay = (i * 80) + 'ms';
      card.innerHTML =
        '<div class="dash-stat-icon">' + s.icon + '</div>' +
        '<div class="stat-value">' + s.value + '</div>' +
        '<div class="stat-label">' + s.label + '</div>';
      statsGrid.appendChild(card);
    });
    container.appendChild(statsGrid);

    // --- Charts ---
    var chartsGrid = document.createElement('div');
    chartsGrid.className = 'dash-charts grid grid-2';

    // Chart left: Distribuição por Tipo
    var chartLeftCard = document.createElement('div');
    chartLeftCard.className = 'card animate-in';
    chartLeftCard.innerHTML =
      '<div class="card-header">Distribuição por Tipo</div>' +
      '<div class="card-body">' +
        '<div class="chart-container" style="height:300px">' +
          '<canvas id="chartDocsByType"></canvas>' +
        '</div>' +
      '</div>';
    chartsGrid.appendChild(chartLeftCard);

    // Chart right: Documentos por Área
    var chartRightCard = document.createElement('div');
    chartRightCard.className = 'card animate-in';
    chartRightCard.innerHTML =
      '<div class="card-header">Documentos por Área</div>' +
      '<div class="card-body">' +
        '<div class="chart-container" style="height:300px">' +
          '<canvas id="chartDocsByCategory"></canvas>' +
        '</div>' +
      '</div>';
    chartsGrid.appendChild(chartRightCard);

    container.appendChild(chartsGrid);

    // Build chart data
    var typeCounts = {};
    var categoryCounts = {};
    docs.forEach(function(d) {
      var typeName = (d.typeName || d.type || 'Desconhecido');
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
      var cat = (d.category || 'Outros');
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Render charts
    if (charts && totalDocs > 0) {
      try {
        charts.createDocumentsByTypeChart('chartDocsByType', typeCounts);
      } catch (e) { /* chart module may not be ready */ }
      try {
        charts.createDocumentsByCategoryChart('chartDocsByCategory', categoryCounts);
      } catch (e) { /* chart module may not be ready */ }
    }

    // --- Recent Documents ---
    if (totalDocs > 0) {
      var recentCard = document.createElement('div');
      recentCard.className = 'card animate-in';
      recentCard.innerHTML = '<div class="card-header">Documentos Recentes</div>';

      var sortedDocs = docs.slice().sort(function(a, b) {
        return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      });
      var recentDocs = sortedDocs.slice(0, 10);

      var tableHtml = '<div class="card-body" style="overflow-x:auto">' +
        '<table class="table">' +
        '<thead><tr>' +
        '<th>Nome</th><th>Tipo</th><th>Score</th><th>Data</th>' +
        '</tr></thead><tbody>';

      recentDocs.forEach(function(doc) {
        var score = doc.analysis ? (doc.analysis.score || 0) : '-';
        var scoreClass = '';
        if (typeof score === 'number') {
          scoreClass = SJIFUtils.getScoreClass(score);
        }
        var dateStr = window.SJIFUtils.formatDate(doc.createdAt || doc.date || new Date());
        var typeName = doc.typeName || doc.type || 'N/A';

        tableHtml += '<tr class="dash-recent-row" data-doc-id="' + doc.id + '">' +
          '<td>' + window.SJIFUtils.escapeHtml(window.SJIFUtils.truncate(doc.name || doc.fileName || 'Sem nome', 50)) + '</td>' +
          '<td><span class="badge">' + typeName + '</span></td>' +
          '<td><span class="' + scoreClass + '">' + (typeof score === 'number' ? score + '%' : score) + '</span></td>' +
          '<td>' + dateStr + '</td>' +
          '</tr>';
      });

      tableHtml += '</tbody></table></div>';
      recentCard.innerHTML += tableHtml;
      container.appendChild(recentCard);

      // Click handler for rows
      recentCard.querySelectorAll('.dash-recent-row').forEach(function(row) {
        row.addEventListener('click', function() {
          var docId = this.getAttribute('data-doc-id');
          if (docId) window.location.hash = '#/analysis/' + docId;
        });
      });
    } else {
      // No documents - suggest loading demo data
      var noData = document.createElement('div');
      noData.className = 'card animate-in';
      noData.innerHTML =
        '<div class="card-body dash-no-data">' +
          '<div class="dash-no-data-icon">📂</div>' +
          '<p>Nenhum documento encontrado.</p>' +
          '<p>Acesse as <a href="#/settings"><strong>Configurações</strong></a> para carregar dados de demonstração ou faça <a href="#/upload"><strong>upload</strong></a> de um documento.</p>' +
          '<a href="#/settings" class="btn btn-primary">Ir para Configurações</a>' +
        '</div>';
      container.appendChild(noData);
    }

    // --- Motor de Inteligência Judicial (Backend API Stats) ---
    try {
      const token = window.app && window.app.auth && window.app.auth.getSession
        ? (window.app.auth.getSession() || {}).token
        : null;
      const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
      const resp = await fetch('/api/mij/stats', { headers });
      if (resp.ok) {
        const mijStats = await resp.json();

        var mijSection = document.createElement('div');
        mijSection.className = 'animate-in';
        mijSection.style.marginTop = '32px';

        var mijHeader = document.createElement('h3');
        mijHeader.style.cssText = 'font-family:var(--font-display);color:var(--text-heading);margin-bottom:16px;font-size:1.1rem';
        mijHeader.textContent = '🧠 Motor de Inteligência Judicial';
        mijSection.appendChild(mijHeader);

        var mijStatsData = [
          { icon: '👨‍⚖️', value: window.SJIFUtils.formatNumber(mijStats.totalJulgadores || 0), label: 'Total Julgadores' },
          { icon: '📜', value: window.SJIFUtils.formatNumber(mijStats.totalDecisoes || 0), label: 'Total Decisões' },
          { icon: '🏛️', value: window.SJIFUtils.formatNumber(mijStats.totalTribunais || 0), label: 'Total Tribunais' }
        ];

        var mijGrid = document.createElement('div');
        mijGrid.className = 'dash-stats grid grid-3';
        mijStatsData.forEach(function(s, i) {
          var card = document.createElement('div');
          card.className = 'stat-card animate-in';
          card.style.animationDelay = (i * 80) + 'ms';
          card.innerHTML =
            '<div class="dash-stat-icon">' + s.icon + '</div>' +
            '<div class="stat-value">' + s.value + '</div>' +
            '<div class="stat-label">' + s.label + '</div>';
          mijGrid.appendChild(card);
        });
        mijSection.appendChild(mijGrid);

        container.appendChild(mijSection);
      }
    } catch (e) {
      // Backend offline or unavailable — show local data only, no error displayed
    }

    // --- Animate in ---
    window.SJIFUtils.staggerIn(container.querySelectorAll('.animate-in'), 80);
  }
};
