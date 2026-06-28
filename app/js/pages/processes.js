/**
 * SJIF Processes Page
 * Gestão de Processos Judiciais
 */

window.ProcessesPage = {
  async render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    if (!window.app || !window.app.store) { container.innerHTML = '<p>Carregando...</p>'; return; }

    const processes = await window.app.store.getAllProcesses();
    const documents = await window.app.store.getAllDocuments();
    const categories = (window.SJIF_TAXONOMY && window.SJIF_TAXONOMY.categories) || [];

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';
    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:4px">Gestão de Processos</h2>
          <p style="color:var(--text-muted);font-size:0.85rem">${processes.length} processo(s) cadastrado(s)</p>
        </div>
        <button class="btn btn-primary" id="btn-new-process">+ Novo Processo</button>
      </div>

      <div id="processes-grid" class="grid-3" style="gap:16px"></div>
    `;
    container.appendChild(wrapper);

    const grid = document.getElementById('processes-grid');
    const btnNew = document.getElementById('btn-new-process');

    function getStatusBadge(status) {
      const map = {
        'Ativo': 'badge-success',
        'Suspenso': 'badge-warning',
        'Arquivado': 'badge-info'
      };
      return `<span class="badge ${map[status] || 'badge-info'}">${status}</span>`;
    }

    function getCategoryInfo(areaId) {
      const cat = categories.find(c => c.id === areaId);
      return cat ? { name: cat.name, icon: cat.icon, color: cat.color } : { name: areaId || 'Geral', icon: '📄', color: '#6B7A8D' };
    }

    function renderProcesses() {
      if (processes.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div style="font-size:4rem;margin-bottom:16px">⚖️</div>
            <h3 style="color:var(--text-heading)">Nenhum processo cadastrado</h3>
            <p style="color:var(--text-muted);margin-bottom:20px">Cadastre um processo para começar a vincular documentos</p>
            <button class="btn btn-primary" onclick="document.getElementById('btn-new-process').click()">Cadastrar Processo</button>
          </div>
        `;
        return;
      }

      grid.innerHTML = processes.map(proc => {
        const cat = getCategoryInfo(proc.area);
        const linkedDocs = documents.filter(d => d.processId === proc.id);
        const createdAt = proc.createdAt ? new Date(proc.createdAt).toLocaleDateString('pt-BR') : '—';

        return `
          <div class="card" style="transition:all 0.3s ease" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
            <div class="card-body" style="padding:24px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
                ${getStatusBadge(proc.status || 'Ativo')}
                <span style="font-size:0.7rem;color:var(--text-muted)">${createdAt}</span>
              </div>

              <h4 style="font-family:var(--font-mono);color:var(--text-heading);font-size:0.9rem;margin-bottom:8px;word-break:break-all">${proc.number || 'Sem número'}</h4>

              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="font-size:0.8rem">${cat.icon}</span>
                <span style="font-size:0.8rem;color:var(--text)">${cat.name}</span>
              </div>

              ${proc.court ? `<p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:12px">🏛️ ${proc.court}</p>` : ''}

              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border)">
                <span style="font-size:0.75rem;color:var(--text-muted)">📄 ${linkedDocs.length} documento(s)</span>
                <button class="btn btn-sm btn-outline" onclick="ProcessesPage.deleteProcess('${proc.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // New Process modal
    btnNew.addEventListener('click', () => {
      const formHTML = `
        <form id="new-process-form">
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Número do Processo</label>
            <input type="text" class="input" id="proc-number" placeholder="0001234-56.2026.8.13.0001" style="width:100%">
            <small style="color:var(--text-muted);font-size:0.7rem">Deixe em branco para gerar automaticamente</small>
          </div>

          <div style="margin-bottom:16px">
            <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Área</label>
            <select class="select" id="proc-area" style="width:100%">
              ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom:16px">
            <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Vara / Tribunal</label>
            <input type="text" class="input" id="proc-court" placeholder="Ex: 5ª Vara Cível de Belo Horizonte" style="width:100%">
          </div>

          <div style="margin-bottom:16px">
            <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Status</label>
            <select class="select" id="proc-status" style="width:100%">
              <option value="Ativo">Ativo</option>
              <option value="Suspenso">Suspenso</option>
              <option value="Arquivado">Arquivado</option>
            </select>
          </div>
        </form>
      `;

      if (window.SJIFUtils && window.SJIFUtils.showModal) {
        window.SJIFUtils.showModal('Novo Processo', formHTML, [
          { label: 'Cancelar', class: 'btn btn-secondary', onClick: () => window.SJIFUtils.closeModal() },
          { label: 'Salvar Processo', class: 'btn btn-primary', onClick: async () => {
            const number = document.getElementById('proc-number').value || window.SJIFUtils.generateProcessNumber();
            const area = document.getElementById('proc-area').value;
            const court = document.getElementById('proc-court').value;
            const status = document.getElementById('proc-status').value;

            const newProcess = {
              id: window.SJIFUtils.generateId(),
              number,
              area,
              court,
              status,
              documents: [],
              createdAt: new Date().toISOString()
            };

            await window.app.store.addProcess(newProcess);
            processes.push(newProcess);
            window.SJIFUtils.closeModal();
            window.SJIFUtils.showToast('Processo cadastrado com sucesso!', 'success');
            renderProcesses();
          }}
        ]);
      }
    });

    renderProcesses();
  },

  async deleteProcess(id) {
    if (!confirm('Tem certeza que deseja excluir este processo?')) return;
    try {
      await window.app.store.deleteProcess(id);
      SJIFUtils.showToast('Processo excluído com sucesso', 'success');
      ProcessesPage.render(document.getElementById('page-container'));
    } catch(e) {
      SJIFUtils.showToast('Erro ao excluir: ' + e.message, 'error');
    }
  }
};
