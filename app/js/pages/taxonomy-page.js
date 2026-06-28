/**
 * SJIF Taxonomy Page
 * Catálogo de Peças Processuais
 */

window.TaxonomyPage = {
  render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const taxonomy = window.SJIF_TAXONOMY;
    if (!taxonomy) {
      container.innerHTML = '<div class="empty-state"><h3>Taxonomia não carregada</h3></div>';
      return;
    }

    const types = taxonomy.types || [];
    const categories = taxonomy.categories || [];

    // State
    let activeCategory = 'todos';
    let searchQuery = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';
    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">Catálogo de Peças Processuais</h2>
          <p style="color:var(--text-muted);font-size:0.85rem">${types.length} tipos cadastrados em ${categories.length} categorias</p>
        </div>
      </div>

      <div style="margin-bottom:24px">
        <input type="text" class="input search-input" id="taxonomy-search" placeholder="Buscar peças processuais..." style="max-width:400px;width:100%">
      </div>

      <div class="tabs" id="taxonomy-tabs" style="margin-bottom:32px">
        <div class="tab-item active" data-cat="todos">Todos (${types.length})</div>
        ${categories.map(c => {
          const count = types.filter(t => t.category === c.id).length;
          return `<div class="tab-item" data-cat="${c.id}">${c.icon} ${c.name} (${count})</div>`;
        }).join('')}
      </div>

      <div id="taxonomy-grid" class="grid-3" style="gap:16px"></div>
    `;

    container.appendChild(wrapper);

    const grid = document.getElementById('taxonomy-grid');
    const searchInput = document.getElementById('taxonomy-search');
    const tabs = document.getElementById('taxonomy-tabs');

    function renderTypes() {
      let filtered = types;

      if (activeCategory !== 'todos') {
        filtered = filtered.filter(t => t.category === activeCategory);
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        filtered = filtered.filter(t => {
          const text = `${t.code} ${t.name} ${t.description} ${(t.keywords || []).join(' ')}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return text.includes(q);
        });
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div style="font-size:3rem;margin-bottom:16px">🔍</div>
            <h3>Nenhuma peça encontrada</h3>
            <p style="color:var(--text-muted)">Tente outro termo de busca ou categoria</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(t => {
        const cat = categories.find(c => c.id === t.category);
        const catColor = cat ? cat.color : '#6B7A8D';
        const catName = cat ? cat.name : t.category;
        const catIcon = cat ? cat.icon : '📄';
        const desc = t.description && t.description.length > 100 ? t.description.substring(0, 100) + '...' : (t.description || '');

        return `
          <div class="card" style="cursor:pointer;transition:all 0.3s ease" onclick="TaxonomyPage.showDetail(${t.id})" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
            <div class="card-body" style="padding:20px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <span class="tag" style="font-family:var(--font-mono);background:rgba(${hexToRgb(catColor)},0.12);color:${catColor};border:1px solid rgba(${hexToRgb(catColor)},0.2)">${t.code}</span>
                <span style="font-size:0.65rem;color:var(--text-muted);background:rgba(255,255,255,0.03);padding:3px 8px;border-radius:4px">${catIcon} ${catName}</span>
              </div>
              <h4 style="color:var(--text-heading);margin-bottom:8px;font-size:0.9rem;font-weight:600">${t.name}</h4>
              <p style="color:var(--text-muted);font-size:0.78rem;line-height:1.5">${desc}</p>
              ${t.baseLegal ? `<div style="margin-top:10px;font-size:0.7rem;color:var(--gold);opacity:0.7">📜 ${t.baseLegal}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    // Tab clicks
    tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-item');
      if (!tab) return;
      tabs.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.cat;
      renderTypes();
    });

    // Search
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTypes();
    });

    renderTypes();
  },

  showDetail(typeId) {
    const taxonomy = window.SJIF_TAXONOMY;
    const type = taxonomy.types.find(t => t.id === typeId);
    if (!type) return;

    const cat = taxonomy.categories.find(c => c.id === type.category);
    const catName = cat ? cat.name : type.category;
    const catIcon = cat ? cat.icon : '📄';
    const catColor = cat ? cat.color : '#6B7A8D';

    const content = `
      <div style="margin-bottom:20px">
        <span class="tag" style="font-family:var(--font-mono);font-size:0.85rem;padding:6px 14px;background:rgba(${hexToRgb(catColor)},0.12);color:${catColor}">${type.code}</span>
        <span class="badge" style="margin-left:8px;background:rgba(${hexToRgb(catColor)},0.12);color:${catColor}">${catIcon} ${catName}</span>
      </div>

      <p style="color:var(--text);line-height:1.7;margin-bottom:20px">${type.description || 'Sem descrição disponível.'}</p>

      ${type.baseLegal ? `
        <div class="card" style="margin-bottom:16px;background:rgba(212,175,55,0.04);border-color:rgba(212,175,55,0.15)">
          <div class="card-body" style="padding:16px">
            <strong style="color:var(--gold);font-size:0.8rem">📜 Base Legal</strong>
            <p style="color:var(--text);margin-top:4px">${type.baseLegal}</p>
          </div>
        </div>
      ` : ''}

      ${type.prazo ? `
        <div class="card" style="margin-bottom:16px">
          <div class="card-body" style="padding:16px">
            <strong style="color:var(--text-heading);font-size:0.8rem">⏱️ Prazo</strong>
            <p style="color:var(--text);margin-top:4px">${type.prazo}</p>
          </div>
        </div>
      ` : ''}

      ${type.requisitos && type.requisitos.length > 0 ? `
        <div style="margin-bottom:20px">
          <strong style="color:var(--text-heading);font-size:0.85rem;display:block;margin-bottom:10px">📋 Requisitos</strong>
          <ul style="list-style:none;padding:0">
            ${type.requisitos.map(r => `<li style="padding:6px 0;color:var(--text);font-size:0.85rem;border-bottom:1px solid var(--border)">✓ ${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${type.keywords && type.keywords.length > 0 ? `
        <div>
          <strong style="color:var(--text-heading);font-size:0.85rem;display:block;margin-bottom:10px">🏷️ Keywords</strong>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${type.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    `;

    if (window.SJIFUtils && window.SJIFUtils.showModal) {
      window.SJIFUtils.showModal(type.name, content, [
        { label: 'Fechar', class: 'btn btn-secondary', action: () => window.SJIFUtils.closeModal() }
      ]);
    }
  }
};

// Helper to convert hex to rgb
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
