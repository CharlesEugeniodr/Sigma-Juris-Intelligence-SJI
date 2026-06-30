// ============================================================
// SJIF Analysis Page
// ============================================================
window.AnalysisPage = {
  async render(documentId) {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const store = window.app && window.app.store;
    const charts = window.app && window.app.charts;

    // --- Load document ---
    let doc = null;
    try {
      if (store) doc = await store.getDocument(documentId);
    } catch (e) {
      doc = null;
    }

    if (!doc) {
      container.innerHTML =
        '<div class="card" style="margin-top:32px">' +
          '<div class="card-body" style="text-align:center;padding:48px">' +
            '<div style="font-size:3rem;margin-bottom:16px;opacity:0.5">🔍</div>' +
            '<h3 style="color:var(--text-heading);margin-bottom:8px">Documento não encontrado</h3>' +
            '<p style="color:var(--text-muted);margin-bottom:20px">O documento solicitado não existe ou foi removido.</p>' +
            '<a href="#/documents" class="btn btn-primary">← Voltar para Documentos</a>' +
          '</div>' +
        '</div>';
      return;
    }

    const analysis = doc.analysis || {};
    const score = analysis.score || 0;
    const elements = analysis.elements || {};
    const coerencia = analysis.coerencia || {};
    const entities = analysis.entities || {};

    // --- Scoped styles ---
    const style = document.createElement('style');
    style.textContent = `
      .analysis-back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--gold);
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 20px;
        transition: color var(--duration) var(--ease);
      }
      .analysis-back:hover { color: var(--gold-light); }
      .analysis-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 28px;
      }
      .analysis-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-heading);
        margin-bottom: 8px;
        word-break: break-word;
      }
      .analysis-header-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .analysis-header-date {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-top: 4px;
      }
      .analysis-layout {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 24px;
        margin-bottom: 32px;
      }
      @media (max-width: 900px) {
        .analysis-layout { grid-template-columns: 1fr; }
      }
      .analysis-score-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px 24px;
      }
      .analysis-score-circle {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        margin-bottom: 12px;
      }
      .analysis-score-circle::before {
        content: '';
        position: absolute;
        inset: 8px;
        border-radius: 50%;
        background: var(--bg-card);
      }
      .analysis-score-number {
        position: relative;
        z-index: 1;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-heading);
        font-family: var(--font-body);
      }
      .analysis-score-pct {
        position: relative;
        z-index: 1;
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 400;
      }
      .analysis-elements-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-heading);
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(212,175,55,0.1);
      }
      .analysis-elements-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      @media (max-width: 700px) {
        .analysis-elements-grid { grid-template-columns: repeat(2, 1fr); }
      }
      .analysis-el-card {
        padding: 14px;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(212,175,55,0.06);
        border-radius: var(--radius-sm);
        transition: all var(--duration) var(--ease);
      }
      .analysis-el-card:hover {
        background: rgba(212,175,55,0.04);
        border-color: rgba(212,175,55,0.15);
      }
      .analysis-el-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .analysis-el-icon {
        font-size: 1.2rem;
      }
      .analysis-el-name {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-heading);
      }
      .analysis-el-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        font-size: 0.75rem;
        color: var(--text-muted);
      }
      .analysis-el-found { color: var(--success); }
      .analysis-el-missing { color: var(--danger); }
      .analysis-el-bar {
        height: 4px;
        background: rgba(255,255,255,0.06);
        border-radius: 2px;
        overflow: hidden;
      }
      .analysis-el-bar-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.6s var(--ease);
      }
      .analysis-entities-section {
        margin-top: 24px;
      }
      .analysis-entities-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-heading);
        margin-bottom: 12px;
      }
      .analysis-entity-group {
        margin-bottom: 16px;
      }
      .analysis-entity-label {
        font-size: 0.7rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }
      .analysis-entity-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .analysis-entity-items {
        list-style: none;
        padding: 0;
      }
      .analysis-entity-items li {
        padding: 4px 0;
        font-size: 0.85rem;
        color: var(--text);
        border-bottom: 1px solid rgba(255,255,255,0.03);
      }
      .analysis-criteria-table {
        width: 100%;
        font-size: 0.85rem;
      }
      .analysis-criteria-table td {
        padding: 8px 12px;
      }
      .analysis-criteria-table tr:nth-child(even) {
        background: rgba(255,255,255,0.02);
      }
      .analysis-criteria-score {
        font-weight: 600;
        text-align: right;
      }
      .analysis-feedback-card {
        padding: 14px 16px;
        border-radius: var(--radius-sm);
        margin-bottom: 10px;
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--text);
      }
      .analysis-feedback-strong {
        border-left: 3px solid var(--success);
        background: rgba(39,174,96,0.06);
      }
      .analysis-feedback-weak {
        border-left: 3px solid var(--danger);
        background: rgba(231,76,60,0.06);
      }
      .analysis-feedback-rec {
        border-left: 3px solid var(--gold);
        background: rgba(212,175,55,0.06);
      }
      .analysis-section-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-heading);
        margin-bottom: 10px;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .analysis-bottom {
        text-align: center;
        padding: 24px;
      }
      .analysis-elements-radar {
        padding: 24px;
      }
      .analysis-elements-radar .chart-container {
        max-width: 400px;
        margin: 0 auto;
      }
      .analysis-suggestions-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .analysis-suggestions-list li {
        padding: 10px 14px;
        margin-bottom: 8px;
        border-left: 3px solid var(--gold);
        background: rgba(212,175,55,0.06);
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--text);
      }
      .analysis-suggestions-list li::before {
        content: '💡 ';
      }
    `;
    container.appendChild(style);

    // --- Back link ---
    var backLink = document.createElement('a');
    backLink.className = 'analysis-back animate-in';
    backLink.href = '#/documents';
    backLink.textContent = '← Voltar para Documentos';
    container.appendChild(backLink);

    // --- Header ---
    var headerDiv = document.createElement('div');
    headerDiv.className = 'analysis-header animate-in';
    var typeName = doc.typeName || doc.type || 'N/A';
    var category = doc.category || 'Outros';
    var dateStr = window.SJIFUtils.formatDate(doc.createdAt || doc.date || new Date());
    headerDiv.innerHTML =
      '<div>' +
        '<h2>' + (doc.name || doc.fileName || 'Documento') + '</h2>' +
        '<div class="analysis-header-badges">' +
          '<span class="badge badge-info">' + typeName + '</span>' +
          '<span class="badge">' + category + '</span>' +
        '</div>' +
        '<div class="analysis-header-date">Criado em ' + dateStr + '</div>' +
      '</div>' +
      '<div class="analysis-actions" style="display:flex;gap:8px">' +
        '<button id="btn-export-pdf" class="btn btn-outline btn-sm">PDF</button>' +
        '<button id="btn-export-docx" class="btn btn-outline btn-sm">DOCX</button>' +
      '</div>';
    container.appendChild(headerDiv);

    // --- Two column layout ---
    var layout = document.createElement('div');
    layout.className = 'analysis-layout';

    // ========== LEFT COLUMN ==========
    var leftCol = document.createElement('div');

    // Overall Score
    var scoreCard = document.createElement('div');
    scoreCard.className = 'card animate-in';
    var scoreColor = getScoreColor(score);
    var conicGrad = 'conic-gradient(' + scoreColor + ' ' + (score * 3.6) + 'deg, rgba(255,255,255,0.06) ' + (score * 3.6) + 'deg)';
    scoreCard.innerHTML =
      '<div class="analysis-score-wrap">' +
        '<div class="analysis-score-circle" style="background:' + conicGrad + '">' +
          '<span class="analysis-score-number">' + score + '</span>' +
          '<span class="analysis-score-pct">pontos</span>' +
        '</div>' +
        '<div style="font-size:0.85rem;color:var(--text-muted)">Score Geral da Análise SJIF</div>' +
      '</div>';
    leftCol.appendChild(scoreCard);

    // 9 Elements
    var elementsCard = document.createElement('div');
    elementsCard.className = 'card animate-in';
    elementsCard.innerHTML = '<div class="card-header">9 Elementos da Análise SJIF</div>';
    var elemBody = document.createElement('div');
    elemBody.className = 'card-body';

    var elementDefs = [
      { key: 'fatos',          icon: '📋', name: 'Fatos' },
      { key: 'provas',         icon: '🔍', name: 'Provas' },
      { key: 'hipoteses',      icon: '💡', name: 'Hipóteses' },
      { key: 'inferencias',    icon: '🔗', name: 'Inferências' },
      { key: 'normas',         icon: '📜', name: 'Normas' },
      { key: 'jurisprudencia', icon: '⚖️', name: 'Jurisprudência' },
      { key: 'doutrina',       icon: '📚', name: 'Doutrina' },
      { key: 'conclusao',      icon: '🎯', name: 'Conclusão' },
      { key: 'recomendacao',   icon: '💬', name: 'Recomendação' }
    ];

    var elemGrid = document.createElement('div');
    elemGrid.className = 'analysis-elements-grid';

    elementDefs.forEach(function(def) {
      var el = elements[def.key] || {};
      var found = el.found !== undefined ? el.found : (el.count > 0);
      var count = el.count || 0;
      var elScore = el.score || 0;
      var barColor = getScoreColor(elScore);

      var card = document.createElement('div');
      card.className = 'analysis-el-card';
      card.innerHTML =
        '<div class="analysis-el-header">' +
          '<span class="analysis-el-icon">' + def.icon + '</span>' +
          '<span class="analysis-el-name">' + def.name + '</span>' +
        '</div>' +
        '<div class="analysis-el-meta">' +
          '<span class="' + (found ? 'analysis-el-found' : 'analysis-el-missing') + '">' +
            (found ? '✅' : '❌') +
          '</span>' +
          '<span>' + count + ' ite' + (count === 1 ? 'm' : 'ns') + '</span>' +
        '</div>' +
        '<div class="analysis-el-bar">' +
          '<div class="analysis-el-bar-fill" style="width:' + elScore + '%;background:' + barColor + '"></div>' +
        '</div>';
      elemGrid.appendChild(card);
    });

    elemBody.appendChild(elemGrid);
    elementsCard.appendChild(elemBody);
    leftCol.appendChild(elementsCard);

    // --- Radar Chart: 9 SJIF Elements ---
    var elemRadarCard = document.createElement('div');
    elemRadarCard.className = 'card animate-in';
    elemRadarCard.innerHTML = '<div class="card-header">Radar dos 9 Elementos</div>';
    var elemRadarBody = document.createElement('div');
    elemRadarBody.className = 'analysis-elements-radar';
    var elemRadarContainer = document.createElement('div');
    elemRadarContainer.className = 'chart-container';
    var elemRadarCanvas = document.createElement('canvas');
    elemRadarCanvas.id = 'analysis-radar-chart';
    elemRadarContainer.appendChild(elemRadarCanvas);
    elemRadarBody.appendChild(elemRadarContainer);
    elemRadarCard.appendChild(elemRadarBody);
    leftCol.appendChild(elemRadarCard);

    // Build radar data from the 9 elements
    var radarLabels = [];
    var radarScores = [];
    elementDefs.forEach(function(def) {
      radarLabels.push(def.name);
      var el = elements[def.key] || {};
      radarScores.push(el.score || 0);
    });

    // Create the chart after canvas is in the DOM (deferred)
    setTimeout(function() {
      var radarCtx = document.getElementById('analysis-radar-chart');
      if (radarCtx && typeof Chart !== 'undefined') {
        try {
          new Chart(radarCtx, {
            type: 'radar',
            data: {
              labels: radarLabels,
              datasets: [{
                label: 'Score por Elemento',
                data: radarScores,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderColor: '#D4AF37',
                borderWidth: 2,
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#D4AF37',
                pointRadius: 4,
                pointHoverRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: 'rgba(255,255,255,0.05)' },
                  angleLines: { color: 'rgba(255,255,255,0.05)' },
                  pointLabels: { color: '#8E9AAB', font: { size: 11 } },
                  ticks: { display: false }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });
        } catch (e) {
          console.warn('SJIF: Could not create elements radar chart', e);
        }
      }
    }, 50);

    // --- Sugestões de Melhoria ---
    var sugestoes = analysis.sugestoes || analysis.suggestions || [];
    if (sugestoes.length > 0) {
      var sugCard = document.createElement('div');
      sugCard.className = 'card animate-in';
      sugCard.innerHTML = '<div class="card-header" style="color:var(--gold)">📝 Sugestões de Melhoria</div>';
      var sugBody = document.createElement('div');
      sugBody.className = 'card-body';
      var sugList = document.createElement('ul');
      sugList.className = 'analysis-suggestions-list';
      sugestoes.forEach(function(s) {
        var li = document.createElement('li');
        li.textContent = typeof s === 'string' ? s : (s.text || s.description || s.titulo || JSON.stringify(s));
        sugList.appendChild(li);
      });
      sugBody.appendChild(sugList);
      sugCard.appendChild(sugBody);
      leftCol.appendChild(sugCard);
    }

    // Entities section
    var entitiesCard = document.createElement('div');
    entitiesCard.className = 'card animate-in';
    entitiesCard.innerHTML = '<div class="card-header">Entidades Extraídas</div>';
    var entBody = document.createElement('div');
    entBody.className = 'card-body';

    var entityGroups = [
      { key: 'leis',            label: 'Leis', type: 'tags' },
      { key: 'jurisprudencia',  label: 'Jurisprudência', type: 'tags' },
      { key: 'partes',          label: 'Partes', type: 'list' },
      { key: 'valores',         label: 'Valores', type: 'tags' },
      { key: 'datas',           label: 'Datas', type: 'tags' }
    ];

    var hasEntities = false;
    entityGroups.forEach(function(g) {
      var items = entities[g.key] || [];
      if (items.length === 0) return;
      hasEntities = true;

      var group = document.createElement('div');
      group.className = 'analysis-entity-group';
      group.innerHTML = '<div class="analysis-entity-label">' + g.label + '</div>';

      if (g.type === 'tags') {
        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'analysis-entity-tags';
        items.forEach(function(item) {
          var t = document.createElement('span');
          t.className = 'tag';
          t.textContent = typeof item === 'string' ? item : (item.text || item.value || JSON.stringify(item));
          tagsDiv.appendChild(t);
        });
        group.appendChild(tagsDiv);
      } else {
        var ul = document.createElement('ul');
        ul.className = 'analysis-entity-items';
        items.forEach(function(item) {
          var li = document.createElement('li');
          li.textContent = typeof item === 'string' ? item : (item.name || item.text || JSON.stringify(item));
          ul.appendChild(li);
        });
        group.appendChild(ul);
      }

      entBody.appendChild(group);
    });

    if (!hasEntities) {
      entBody.innerHTML += '<div style="color:var(--text-muted);font-size:0.85rem;padding:12px 0">Nenhuma entidade extraída.</div>';
    }
    entitiesCard.appendChild(entBody);
    leftCol.appendChild(entitiesCard);

    layout.appendChild(leftCol);

    // ========== RIGHT COLUMN ==========
    var rightCol = document.createElement('div');

    // MCJ Radar chart
    var radarCard = document.createElement('div');
    radarCard.className = 'card animate-in';
    radarCard.innerHTML =
      '<div class="card-header">Radar MCJ — Coerência</div>' +
      '<div class="card-body">' +
        '<div class="chart-container" style="max-width:360px;margin:0 auto">' +
          '<canvas id="radarMCJ"></canvas>' +
        '</div>' +
      '</div>';
    rightCol.appendChild(radarCard);

    // Score breakdown
    var breakdownCard = document.createElement('div');
    breakdownCard.className = 'card animate-in';
    breakdownCard.innerHTML = '<div class="card-header">Detalhamento dos Critérios</div>';
    var breakdownBody = document.createElement('div');
    breakdownBody.className = 'card-body';

    var criteria = coerencia.criteria || coerencia.scores || {};
    var criteriaKeys = Object.keys(criteria);
    if (criteriaKeys.length > 0) {
      var ctHtml = '<table class="analysis-criteria-table">';
      criteriaKeys.forEach(function(key) {
        var val = criteria[key];
        var numVal = typeof val === 'number' ? val : (val && val.score ? val.score : 0);
        ctHtml += '<tr>' +
          '<td style="color:var(--text)">' + formatCriteriaName(key) + '</td>' +
          '<td class="analysis-criteria-score" style="color:' + getScoreColor(numVal) + '">' + numVal + '%</td>' +
          '</tr>';
      });
      ctHtml += '</table>';
      breakdownBody.innerHTML = ctHtml;
    } else {
      breakdownBody.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem">Sem dados de critérios disponíveis.</div>';
    }
    breakdownCard.appendChild(breakdownBody);
    rightCol.appendChild(breakdownCard);

    // Pontos Fortes
    var strengths = analysis.strengths || analysis.pontosFortes || [];
    if (strengths.length > 0) {
      var strongCard = document.createElement('div');
      strongCard.className = 'card animate-in';
      strongCard.innerHTML = '<div class="card-header" style="color:var(--success)">✅ Pontos Fortes</div>';
      var strongBody = document.createElement('div');
      strongBody.className = 'card-body';
      strengths.forEach(function(s) {
        var item = document.createElement('div');
        item.className = 'analysis-feedback-card analysis-feedback-strong';
        item.textContent = typeof s === 'string' ? s : (s.text || s.description || JSON.stringify(s));
        strongBody.appendChild(item);
      });
      strongCard.appendChild(strongBody);
      rightCol.appendChild(strongCard);
    }

    // Pontos Fracos
    var weaknesses = analysis.weaknesses || analysis.pontosFracos || [];
    if (weaknesses.length > 0) {
      var weakCard = document.createElement('div');
      weakCard.className = 'card animate-in';
      weakCard.innerHTML = '<div class="card-header" style="color:var(--danger)">⚠️ Pontos Fracos</div>';
      var weakBody = document.createElement('div');
      weakBody.className = 'card-body';
      weaknesses.forEach(function(w) {
        var item = document.createElement('div');
        item.className = 'analysis-feedback-card analysis-feedback-weak';
        item.textContent = typeof w === 'string' ? w : (w.text || w.description || JSON.stringify(w));
        weakBody.appendChild(item);
      });
      weakCard.appendChild(weakBody);
      rightCol.appendChild(weakCard);
    }

    // Recomendações
    var recommendations = analysis.recommendations || analysis.recomendacoes || [];
    if (recommendations.length > 0) {
      var recCard = document.createElement('div');
      recCard.className = 'card animate-in';
      recCard.innerHTML = '<div class="card-header" style="color:var(--gold)">💡 Recomendações</div>';
      var recBody = document.createElement('div');
      recBody.className = 'card-body';
      recommendations.forEach(function(r) {
        var item = document.createElement('div');
        item.className = 'analysis-feedback-card analysis-feedback-rec';
        item.textContent = typeof r === 'string' ? r : (r.text || r.description || JSON.stringify(r));
        recBody.appendChild(item);
      });
      recCard.appendChild(recBody);
      rightCol.appendChild(recCard);
    }

    layout.appendChild(rightCol);
    container.appendChild(layout);

    // --- Render radar chart ---
    if (charts && coerencia.criteria) {
      try {
        charts.createRadarChart('radarMCJ', coerencia.criteria);
      } catch (e) { /* chart module may not be ready */ }
    }

    // --- Bottom action ---
    var bottomDiv = document.createElement('div');
    bottomDiv.className = 'analysis-bottom animate-in';
    bottomDiv.innerHTML = '<a href="#/upload" class="btn btn-primary">📤 Nova Análise</a>';
    container.appendChild(bottomDiv);

    // --- Export Buttons Event Listeners ---
    const btnPdf = container.querySelector('#btn-export-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            if (typeof html2pdf !== 'undefined') {
                const element = container.querySelector('.analysis-layout') || container;
                html2pdf().from(element).save('relatorio-sjif.pdf');
            } else {
                alert("Biblioteca PDF não carregada.");
            }
        });
    }

    const btnDocx = container.querySelector('#btn-export-docx');
    if (btnDocx) {
        btnDocx.addEventListener('click', () => {
            var content = container.querySelector('.analysis-layout') || container;
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

    // --- Animate in ---
    window.SJIFUtils.staggerIn(container.querySelectorAll('.animate-in'), 60);

    // --- Helper functions ---
    function getScoreColor(s) {
      var cls = SJIFUtils.getScoreClass(s);
      if (cls === 'excellent') return 'var(--success)';
      if (cls === 'good') return 'var(--gold)';
      if (cls === 'average') return '#E67E22';
      return 'var(--danger)';
    }

    function formatCriteriaName(key) {
      var names = {
        'logica':        'Lógica',
        'consistencia':  'Consistência',
        'fundamentacao': 'Fundamentação',
        'clareza':       'Clareza',
        'completude':    'Completude',
        'persuasao':     'Persuasão',
        'relevancia':    'Relevância',
        'coerencia':     'Coerência'
      };
      return names[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    }
  }
};
