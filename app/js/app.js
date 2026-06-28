/**
 * SJIF App — Main Application Controller
 * Sigma—Juris Intelligence Framework v2.0
 * 
 * Router SPA, inicialização e orquestração de módulos.
 */

class SJIFApp {
  constructor() {
    this.store = new window.SJIFStore();
    this.auth = new window.SJIFAuth();
    this.analyzer = new window.SJIFAnalyzer();
    this.classifier = new window.SJIFClassifier();
    this.charts = new window.SJIFCharts();
    this.currentPage = null;
  }

  async init() {
    await this.store.init();
    this.setupRouter();
    this.setupSidebar();
    this.setupLogout();
    this.checkAuth();
  }

  setupRouter() {
    window.addEventListener('hashchange', () => this.route());
  }

  setupSidebar() {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const path = item.dataset.page || item.dataset.path || item.getAttribute('data-page');
        if (path) {
          window.location.hash = '#/' + path;
        }
      });
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  checkAuth() {
    if (this.auth.isAuthenticated()) {
      this.showMainApp();
      if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#/login') {
        window.location.hash = '#/dashboard';
      } else {
        this.route();
      }
    } else {
      this.showLogin();
    }
  }

  async route() {
    const hash = window.location.hash || '#/dashboard';
    const parts = hash.replace('#/', '').split('/');
    const path = parts[0] || 'dashboard';
    const param = parts.slice(1).join('/') || null;

    if (!this.auth.isAuthenticated() && path !== 'login') {
      this.showLogin();
      return;
    }

    if (path === 'login') {
      if (this.auth.isAuthenticated()) {
        window.location.hash = '#/dashboard';
        return;
      }
      this.showLogin();
      return;
    }

    // Destroy previous charts
    if (this.charts && typeof this.charts.destroyAll === 'function') {
      this.charts.destroyAll();
    }

    this.showMainApp();

    const container = document.getElementById('page-container');
    if (container) container.innerHTML = '';

    try {
      switch (path) {
        case 'dashboard':
          if (window.DashboardPage) await window.DashboardPage.render();
          break;
        case 'upload':
          if (window.UploadPage) await window.UploadPage.render();
          break;
        case 'documents':
          if (window.DocumentsPage) await window.DocumentsPage.render();
          break;
        case 'analysis':
          if (window.AnalysisPage) await window.AnalysisPage.render(param);
          break;
        case 'taxonomy':
          if (window.TaxonomyPage) await window.TaxonomyPage.render();
          break;
        case 'processes':
          if (window.ProcessesPage) await window.ProcessesPage.render();
          break;
        case 'settings':
          if (window.SettingsPage) await window.SettingsPage.render();
          break;
        // MIJ Routes (lazy-loaded — graceful fallback if module not yet available)
        case 'mij':
          if (param === 'magistrados') {
            if (window.MIJMagistradosPage) {
              await window.MIJMagistradosPage.render();
            } else {
              container.innerHTML = '<div class="empty-state"><p>Carregando módulo MIJ Magistrados...</p></div>';
            }
          } else if (param === 'simulador') {
            if (window.MIJSimuladorPage) {
              await window.MIJSimuladorPage.render();
            } else {
              container.innerHTML = '<div class="empty-state"><p>Carregando módulo MIJ Simulador...</p></div>';
            }
          } else if (param === 'tribunal') {
            if (window.MIJDashboardPage) {
              await window.MIJDashboardPage.render('tribunal');
            } else {
              container.innerHTML = '<div class="empty-state"><p>Carregando módulo MIJ...</p></div>';
            }
          } else if (param === 'relatorio') {
            if (window.MIJDashboardPage) {
              await window.MIJDashboardPage.render();
            } else {
              container.innerHTML = '<div class="empty-state"><p>Carregando módulo MIJ...</p></div>';
            }
          } else {
            if (window.MIJDashboardPage) {
              await window.MIJDashboardPage.render();
            } else {
              container.innerHTML = '<div class="empty-state"><p>Carregando módulo MIJ...</p></div>';
            }
          }
          break;
        default:
          if (window.DashboardPage) await window.DashboardPage.render();
      }
    } catch (err) {
      console.error('Route error:', err);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <div style="font-size:3rem;margin-bottom:16px">⚠️</div>
            <h3>Erro ao carregar página</h3>
            <p style="color:var(--text-muted)">${err.message}</p>
            <button class="btn btn-primary" onclick="window.location.hash='#/dashboard'" style="margin-top:16px">Voltar ao Dashboard</button>
          </div>
        `;
      }
    }

    this.updateSidebar(path);
    this.updateTopbar(path);
    this.currentPage = path;
  }

  showMainApp() {
    const login = document.getElementById('login-page');
    const main = document.getElementById('main-app');
    if (login) login.style.display = 'none';
    if (main) main.style.display = 'flex';

    // Update user info in sidebar
    const user = this.auth.getCurrentUser();
    if (user) {
      const userName = document.getElementById('sidebar-user-name');
      const userRole = document.getElementById('sidebar-user-role');
      const userAvatar = document.getElementById('sidebar-avatar');
      if (userName) userName.textContent = user.name;
      if (userRole) {
        const roles = { admin: 'Administrador', analyst: 'Analista', consultant: 'Consultor' };
        userRole.textContent = roles[user.role] || user.role;
      }
      if (userAvatar) userAvatar.textContent = user.avatar || user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    }
  }

  showLogin() {
    const login = document.getElementById('login-page');
    const main = document.getElementById('main-app');
    if (main) main.style.display = 'none';
    if (!login) return;
    login.style.display = 'block';
    login.innerHTML = '';

    // Build login UI entirely in JS (no template literals, no external deps)
    var s = document.createElement('style');
    s.textContent = '.lw{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0A0E14 0%,#0F2027 40%,#1A3A4A 70%,#0A0E14 100%);z-index:2000;overflow:hidden;font-family:Montserrat,sans-serif}'
      + '.lbg{position:absolute;inset:0;background-image:linear-gradient(rgba(212,175,55,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.02) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}'
      + '.lgw{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.06) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}'
      + '.lc{position:relative;width:100%;max-width:420px;padding:48px 40px 36px;background:rgba(17,24,32,.85);backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(212,175,55,.12);border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,.5);text-align:center;animation:lsi .6s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(30px)}'
      + '@keyframes lsi{to{opacity:1;transform:translateY(0)}}'
      + '.lt{font-family:Playfair Display,Georgia,serif;font-size:2rem;font-weight:700;color:#E0E4E5;margin-bottom:2px}'
      + '.ls{font-size:.65rem;font-weight:400;color:#D4AF37;letter-spacing:.35em;text-transform:uppercase;margin-bottom:36px}'
      + '.ld{width:40px;height:2px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);margin:0 auto 28px;border-radius:1px}'
      + '.lf{position:relative;margin-bottom:18px;text-align:left}'
      + '.lf label{display:block;font-size:.7rem;font-weight:500;color:#6B7A8D;margin-bottom:6px;letter-spacing:.05em;text-transform:uppercase}'
      + '.lf input{width:100%;padding:14px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:10px;color:#E0E4E5;font-size:.95rem;font-family:Montserrat,sans-serif;outline:none;transition:border-color .3s;box-sizing:border-box}'
      + '.lf input:focus{border-color:rgba(212,175,55,.5)}'
      + '.lb{width:100%;padding:16px;margin-top:10px;border:none;border-radius:10px;background:linear-gradient(135deg,#D4AF37,#F2D06B,#D4AF37);background-size:200% 200%;color:#0F2027;font-size:.85rem;font-family:Montserrat,sans-serif;font-weight:600;letter-spacing:.1em;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 20px rgba(212,175,55,.25)}'
      + '.lb:hover{box-shadow:0 6px 28px rgba(212,175,55,.4);transform:translateY(-1px)}'
      + '.le{margin-top:16px;padding:10px 14px;background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.25);border-radius:8px;color:#E74C3C;font-size:.8rem;display:none}'
      + '.le.v{display:block}'
      + '.lftr{margin-top:32px;font-size:.65rem;color:rgba(107,122,141,.5);font-weight:300}';
    login.appendChild(s);

    var w = document.createElement('div');
    w.className = 'lw';

    var bg = document.createElement('div');
    bg.className = 'lbg';
    w.appendChild(bg);

    var glow = document.createElement('div');
    glow.className = 'lgw';
    w.appendChild(glow);

    var card = document.createElement('div');
    card.className = 'lc';

    // Icon
    var icon = document.createElement('div');
    icon.style.marginBottom = '20px';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 60 80');
    svg.setAttribute('width', '52');
    svg.setAttribute('height', '68');
    svg.style.filter = 'drop-shadow(0 0 16px rgba(212,175,55,.25))';
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = 'lgG'; grad.setAttribute('x1','0%'); grad.setAttribute('y1','0%'); grad.setAttribute('x2','100%'); grad.setAttribute('y2','100%');
    var s1 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','#D4AF37');
    var s2 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s2.setAttribute('offset','50%'); s2.setAttribute('stop-color','#F2D06B');
    var s3 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s3.setAttribute('offset','100%'); s3.setAttribute('stop-color','#D4AF37');
    grad.appendChild(s1); grad.appendChild(s2); grad.appendChild(s3); defs.appendChild(grad); svg.appendChild(defs);
    var path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M 6 6 L 54 6 L 54 14 L 22 14 L 38 38 L 22 62 L 54 62 L 54 70 L 6 70 L 28 38 Z');
    path.setAttribute('fill','url(#lgG)'); svg.appendChild(path);
    icon.appendChild(svg); card.appendChild(icon);

    // Title
    var t = document.createElement('div'); t.className = 'lt'; t.textContent = 'Sigma'; card.appendChild(t);
    var sub = document.createElement('div'); sub.className = 'ls'; sub.textContent = 'Juris Intelligence'; card.appendChild(sub);
    var div = document.createElement('div'); div.className = 'ld'; card.appendChild(div);

    // Form
    var form = document.createElement('form');
    form.autocomplete = 'off';

    var f1 = document.createElement('div'); f1.className = 'lf';
    var l1 = document.createElement('label'); l1.textContent = 'E-mail'; f1.appendChild(l1);
    var i1 = document.createElement('input'); i1.type = 'email'; i1.value = 'admin@sigma.juris'; i1.placeholder = 'seu@email.com'; f1.appendChild(i1);
    form.appendChild(f1);

    var f2 = document.createElement('div'); f2.className = 'lf';
    var l2 = document.createElement('label'); l2.textContent = 'Senha'; f2.appendChild(l2);
    var i2 = document.createElement('input'); i2.type = 'password'; i2.placeholder = 'Senha'; f2.appendChild(i2);
    form.appendChild(f2);

    var btn = document.createElement('button'); btn.type = 'submit'; btn.className = 'lb'; btn.textContent = 'Entrar';
    form.appendChild(btn);

    var err = document.createElement('div'); err.className = 'le';
    form.appendChild(err);

    card.appendChild(form);

    var ftr = document.createElement('div'); ftr.className = 'lftr'; ftr.textContent = '\u00A9 2026 Sigma Sihf Solucoes Analiticas Ltda';
    card.appendChild(ftr);

    w.appendChild(card);
    login.appendChild(w);

    // Login handler
    var self = this;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      err.className = 'le';
      var email = i1.value.trim();
      var password = i2.value;
      if (!email || !password) { err.textContent = 'Preencha todos os campos.'; err.className = 'le v'; return; }
      var result = self.auth.login(email, password);
      if (!result || !result.success) { err.textContent = (result && result.error) || 'Credenciais invalidas.'; err.className = 'le v'; return; }
      w.remove();
      self.showMainApp();
      window.location.hash = '#/dashboard';
    });
  }

  logout() {
    this.auth.logout();
    this.showLogin();
    window.location.hash = '#/login';
    if (window.SJIFUtils) {
      window.SJIFUtils.showToast('Sessão encerrada com sucesso', 'info');
    }
  }

  updateSidebar(activePath) {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const itemPath = item.dataset.page || item.dataset.path || item.getAttribute('data-page');
      if (itemPath === activePath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  updateTopbar(path) {
    const titles = {
      dashboard: 'Dashboard',
      upload: 'Upload & Análise',
      documents: 'Documentos',
      analysis: 'Resultado da Análise',
      taxonomy: 'Taxonomia de Peças',
      processes: 'Gestão de Processos',
      settings: 'Configurações',
      mij: 'Inteligência Judicial'
    };

    const icons = {
      dashboard: '📊',
      upload: '📤',
      documents: '📄',
      analysis: '🔍',
      taxonomy: '🏷️',
      processes: '⚖️',
      settings: '⚙️'
    };

    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = titles[path] || 'Dashboard';

    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) breadcrumb.textContent = `SJIF / ${titles[path] || 'Dashboard'}`;
  }
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.app = new SJIFApp();
    await window.app.init();
    console.log('✅ SJIF App initialized successfully');

    // Hamburger menu toggle for mobile
    var hamburger = document.getElementById('hamburger-btn');
    var sidebar = document.getElementById('sidebar');
    if (hamburger && sidebar) {
      hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('open');
      });
      // Close sidebar when clicking a nav link on mobile
      sidebar.addEventListener('click', function(e) {
        if (e.target.closest('.sidebar-nav-item') && window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    }
  } catch (err) {
    console.error('❌ SJIF App initialization error:', err);
  }
});
