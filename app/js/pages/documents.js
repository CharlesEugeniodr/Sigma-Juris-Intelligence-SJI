// ============================================================
// SJIF Documents Page
// ============================================================
window.DocumentsPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const store = window.app && window.app.store;
    const taxonomy = window.SJIF_TAXONOMY;

    let docs = [];
    try {
      if (store) docs = await store.getAllDocuments() || [];
    } catch (e) {
      docs = [];
    }

    // --- Scoped styles ---
    const style = document.createElement('style');
    style.textContent = `
      .docs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .docs-header h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-heading);
        margin: 0;
      }
      .docs-filters {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        flex-wrap: wrap;
        align-items: center;
      }
      .docs-filters .search-input {
        flex: 1;
        min-width: 220px;
      }
      .docs-filters .select {
        min-width: 160px;
      }
      .docs-table-wrap {
        overflow-x: auto;
      }
      .docs-row {
        transition: background var(--duration) var(--ease);
      }
      .docs-row:hover {
        background: var(--bg-card-hover);
      }
      .docs-actions {
        display: flex;
        gap: 6px;
      }
      .score-high  { color: var(--success); font-weight: 600; }
      .score-mid   { color: var(--gold); font-weight: 600; }
      .score-low-mid { color: #E67E22; font-weight: 600; }
      .score-low   { color: var(--danger); font-weight: 600; }
      .cat-peticoes   { background: rgba(52,152,219,0.15); color: #3498DB; }
      .cat-recursos   { background: rgba(155,89,182,0.15); color: #9B59B6; }
      .cat-decisoes   { background: rgba(39,174,96,0.15);  color: #27AE60; }
      .cat-contratos  { background: rgba(243,156,18,0.15); color: #F39C12; }
      .cat-pareceres  { background: rgba(231,76,60,0.15);  color: #E74C3C; }
      .cat-outros     { background: rgba(149,165,166,0.15); color: #95A5A6; }
    `;
    container.appendChild(style);

    // --- Header ---
    var header = document.createElement('div');
    header.className = 'docs-header animate-in';
    header.innerHTML =
      '<h2>Documentos</h2>' +
      '<a href="#/upload" class="btn btn-primary">📤 Novo Upload</a>';
    container.appendChild(header);

    // --- Filter bar ---
    var filterBar = document.createElement('div');
    filterBar.className = 'docs-filters animate-in';

    // Search input
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Buscar documentos...';
    searchInput.id = 'docs-search';
    filterBar.appendChild(searchInput);

    // Category filter
    var catSelect = document.createElement('select');
    catSelect.className = 'select';
    catSelect.id = 'docs-cat-filter';
    catSelect.innerHTML = '<option value="">Todos</option>';
    if (taxonomy && taxonomy.categories) {
      taxonomy.categories.forEach(function(cat) {
        var catName = cat.name || cat;
        catSelect.innerHTML += '<option value="' + catName + '">' + catName + '</option>';
      });
    }
    filterBar.appendChild(catSelect);

    // Sort select
    var sortSelect = document.createElement('select');
    sortSelect.className = 'select';
    sortSelect.id = 'docs-sort';
    sortSelect.innerHTML =
      '<option value="date">Data</option>' +
      '<option value="score">Score</option>' +
      '<option value="name">Nome</option>';
    filterBar.appendChild(sortSelect);

    container.appendChild(filterBar);

    // --- Table card ---
    var tableCard = document.createElement('div');
    tableCard.className = 'card animate-in';
    tableCard.id = 'docs-table-card';
    container.appendChild(tableCard);

    // --- Render helpers ---
    function getScoreClass(score) {
      if (score > 80) return 'score-high';
      if (score > 60) return 'score-mid';
      if (score > 40) return 'score-low-mid';
      return 'score-low';
    }

    function getCategoryClass(category) {
      if (!category) return 'cat-outros';
      var norm = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (norm.includes('petic')) return 'cat-peticoes';
      if (norm.includes('recurs')) return 'cat-recursos';
      if (norm.includes('decis') || norm.includes('sentenc')) return 'cat-decisoes';
      if (norm.includes('contrat')) return 'cat-contratos';
      if (norm.includes('parecer')) return 'cat-pareceres';
      return 'cat-outros';
    }

    function renderTable(filteredDocs) {
      var card = document.getElementById('docs-table-card');
      card.innerHTML = '';

      if (filteredDocs.length === 0) {
        card.innerHTML =
          '<div class="card-body">' +
            '<div class="empty-state">' +
              '<div class="empty-state-icon">📄</div>' +
              '<div class="empty-state-title">Nenhum documento encontrado</div>' +
              '<div class="empty-state-text">Faça upload de um documento para começar.</div>' +
              '<a href="#/upload" class="btn btn-primary" style="margin-top:16px">📤 Fazer Upload</a>' +
            '</div>' +
          '</div>';
        return;
      }

      var html = '<div class="docs-table-wrap"><table class="table"><thead><tr>' +
        '<th>#</th><th>Nome</th><th>Tipo</th><th>Categoria</th><th>Score</th><th>Data</th><th>Ações</th>' +
        '</tr></thead><tbody>';

      filteredDocs.forEach(function(doc, i) {
        var score = doc.analysis ? (doc.analysis.score || 0) : 0;
        var scoreClass = getScoreClass(score);
        var dateStr = window.SJIFUtils.formatDate(doc.createdAt || doc.date || new Date());
        var typeName = doc.typeName || doc.type || 'N/A';
        var category = doc.category || 'Outros';
        var catClass = getCategoryClass(category);

        html += '<tr class="docs-row">' +
          '<td style="color:var(--text-muted)">' + (i + 1) + '</td>' +
          '<td>' + window.SJIFUtils.truncate(doc.name || doc.fileName || 'Sem nome', 45) + '</td>' +
          '<td><span class="badge">' + typeName + '</span></td>' +
          '<td><span class="badge ' + catClass + '">' + category + '</span></td>' +
          '<td><span class="' + scoreClass + '">' + (doc.analysis ? score + '%' : '—') + '</span></td>' +
          '<td style="white-space:nowrap">' + dateStr + '</td>' +
          '<td>' +
            '<div class="docs-actions">' +
              '<button class="btn btn-secondary btn-sm docs-view-btn" data-id="' + doc.id + '">Ver</button>' +
              '<button class="btn btn-danger btn-sm docs-del-btn" data-id="' + doc.id + '">Excluir</button>' +
            '</div>' +
          '</td>' +
          '</tr>';
      });

      html += '</tbody></table></div>';
      card.innerHTML = html;

      // View handlers
      card.querySelectorAll('.docs-view-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          window.location.hash = '#/analysis/' + this.getAttribute('data-id');
        });
      });

      // Delete handlers
      card.querySelectorAll('.docs-del-btn').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          var docId = this.getAttribute('data-id');
          var confirmed = confirm('Tem certeza que deseja excluir este documento?');
          if (!confirmed) return;
          try {
            if (store) await store.deleteDocument(docId);
            // Remove from local array
            docs = docs.filter(function(d) { return d.id !== docId; });
            applyFilters();
            window.SJIFUtils.showToast('Documento excluído com sucesso.', 'success');
          } catch (e) {
            window.SJIFUtils.showToast('Erro ao excluir documento.', 'error');
          }
        });
      });
    }

    function applyFilters() {
      var searchTerm = (document.getElementById('docs-search').value || '').toLowerCase();
      var catFilter = document.getElementById('docs-cat-filter').value;
      var sortBy = document.getElementById('docs-sort').value;

      var filtered = docs.filter(function(d) {
        var name = (d.name || d.fileName || '').toLowerCase();
        var typeName = (d.typeName || d.type || '').toLowerCase();
        var matchesSearch = !searchTerm || name.includes(searchTerm) || typeName.includes(searchTerm);
        var matchesCat = !catFilter || (d.category || 'Outros') === catFilter;
        return matchesSearch && matchesCat;
      });

      filtered.sort(function(a, b) {
        if (sortBy === 'score') {
          var sa = a.analysis ? (a.analysis.score || 0) : 0;
          var sb = b.analysis ? (b.analysis.score || 0) : 0;
          return sb - sa;
        }
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        // Default: date descending
        return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      });

      renderTable(filtered);
    }

    // --- Event listeners ---
    searchInput.addEventListener('input', window.SJIFUtils.debounce(applyFilters, 200));
    catSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    // --- Initial render ---
    applyFilters();

    // --- Animate in ---
    window.SJIFUtils.staggerIn(container.querySelectorAll('.animate-in'), 80);
  }
};
