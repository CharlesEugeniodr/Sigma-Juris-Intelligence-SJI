/**
 * SJIF Settings Page
 * Configurações do Sistema
 */

window.SettingsPage = {
  render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const user = window.app.auth.getCurrentUser() || { name: 'Usuário', email: '—', role: 'admin', avatar: 'US' };
    const roleLabels = { admin: 'Administrador', analyst: 'Analista', consultant: 'Consultor' };

    const wrapper = document.createElement('div');
    wrapper.className = 'animate-in';
    wrapper.innerHTML = `
      <h2 style="font-family:var(--font-display);color:var(--text-heading);margin-bottom:32px">Configurações</h2>

      <!-- User Profile -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-body" style="padding:32px;display:flex;align-items:center;gap:24px">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--navy);flex-shrink:0">${user.avatar || 'US'}</div>
          <div>
            <h3 style="color:var(--text-heading);margin-bottom:4px">${user.name}</h3>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:8px">${user.email}</p>
            <span class="badge badge-success">${roleLabels[user.role] || user.role}</span>
          </div>
        </div>
      </div>

      <!-- Demo Data -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-header" style="padding:20px 24px;border-bottom:1px solid var(--border)">
          <h3 style="color:var(--text-heading);font-size:1rem">📊 Dados de Demonstração</h3>
        </div>
        <div class="card-body" style="padding:24px">
          <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:20px;line-height:1.7">
            Carregue dados de exemplo para explorar as funcionalidades do sistema.
            Os dados incluem 15+ documentos jurídicos com análises completas em diversas áreas do Direito.
          </p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" id="btn-seed-data">
              📥 Carregar Dados de Demonstração
            </button>
            <button class="btn btn-danger" id="btn-clear-data">
              🗑️ Limpar Todos os Dados
            </button>
          </div>
          <div id="seed-status" style="margin-top:16px"></div>
        </div>
      </div>

      <!-- About -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-header" style="padding:20px 24px;border-bottom:1px solid var(--border)">
          <h3 style="color:var(--text-heading);font-size:1rem">ℹ️ Sobre o Sistema</h3>
        </div>
        <div class="card-body" style="padding:24px">
          <div style="text-align:center;padding:20px 0">
            <div style="font-family:var(--font-display);font-size:1.6rem;color:var(--text-heading);margin-bottom:4px">Sigma—Juris Intelligence</div>
            <div style="color:var(--gold);font-size:0.75rem;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:16px">Framework v2.0 — MVP</div>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:24px">Sistema Integrado de Inteligência Jurídica</p>

            <div style="width:60px;height:1px;background:var(--border);margin:0 auto 24px"></div>

            <div style="font-size:0.85rem;color:var(--text);margin-bottom:4px">Propriedade de <strong>Charles de Paula Eugênio</strong></div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">Sigma Sihf Soluções Analíticas Ltda</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">CNPJ: 01.851.824/0001-38</div>

            <div style="font-size:0.7rem;color:rgba(255,255,255,0.25)">© 2026 Todos os direitos reservados</div>
          </div>
        </div>
      </div>

      <!-- Links -->
      <div class="card">
        <div class="card-header" style="padding:20px 24px;border-bottom:1px solid var(--border)">
          <h3 style="color:var(--text-heading);font-size:1rem">🔗 Atalhos</h3>
        </div>
        <div class="card-body" style="padding:24px">
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a href="../assets/brand/brand_guidelines.html" target="_blank" class="btn btn-outline" style="text-decoration:none">
              🎨 Brand Guidelines
            </a>
            <a href="../index.html" target="_blank" class="btn btn-outline" style="text-decoration:none">
              🏠 Portal Principal
            </a>
            <a href="https://github.com/CharlesEugeniodr/Sigma-Juris-Intelligence-SJI" target="_blank" class="btn btn-outline" style="text-decoration:none">
              📦 GitHub Repository
            </a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(wrapper);

    // Seed Data button
    document.getElementById('btn-seed-data').addEventListener('click', async () => {
      const btn = document.getElementById('btn-seed-data');
      const status = document.getElementById('seed-status');
      btn.disabled = true;
      btn.textContent = '⏳ Carregando...';
      status.innerHTML = '<div class="progress-bar"><div class="progress-fill" style="width:50%;animation:shimmer 1.5s ease-in-out infinite"></div></div>';

      try {
        await window.app.store.seedDemoData();
        status.innerHTML = '<div style="color:var(--success);font-size:0.85rem">✅ Dados carregados com sucesso!</div>';
        if (window.SJIFUtils) window.SJIFUtils.showToast('Dados de demonstração carregados!', 'success');
      } catch (err) {
        status.innerHTML = `<div style="color:var(--danger);font-size:0.85rem">❌ Erro: ${err.message}</div>`;
      }

      btn.disabled = false;
      btn.textContent = '📥 Carregar Dados de Demonstração';
    });

    // Clear Data button
    document.getElementById('btn-clear-data').addEventListener('click', async () => {
      if (!confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.')) return;

      try {
        // Clear IndexedDB
        const dbReq = indexedDB.deleteDatabase('sjif_db');
        dbReq.onsuccess = async () => {
          await window.app.store.init();
          if (window.SJIFUtils) window.SJIFUtils.showToast('Todos os dados foram removidos', 'info');
          window.SettingsPage.render();
        };
        dbReq.onerror = () => {
          if (window.SJIFUtils) window.SJIFUtils.showToast('Erro ao limpar dados', 'error');
        };
      } catch (err) {
        if (window.SJIFUtils) window.SJIFUtils.showToast('Erro: ' + err.message, 'error');
      }
    });
  }
};
