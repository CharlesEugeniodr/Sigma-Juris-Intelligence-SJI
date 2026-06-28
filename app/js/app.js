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
        const path = item.dataset.path || item.getAttribute('data-path');
        if (path) {
          window.location.hash = '#/' + path;
        }
      });
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
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

  route() {
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
          if (window.DashboardPage) window.DashboardPage.render();
          break;
        case 'upload':
          if (window.UploadPage) window.UploadPage.render();
          break;
        case 'documents':
          if (window.DocumentsPage) window.DocumentsPage.render();
          break;
        case 'analysis':
          if (window.AnalysisPage) window.AnalysisPage.render(param);
          break;
        case 'taxonomy':
          if (window.TaxonomyPage) window.TaxonomyPage.render();
          break;
        case 'processes':
          if (window.ProcessesPage) window.ProcessesPage.render();
          break;
        case 'settings':
          if (window.SettingsPage) window.SettingsPage.render();
          break;
        default:
          if (window.DashboardPage) window.DashboardPage.render();
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
      const userAvatar = document.getElementById('sidebar-user-avatar');
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
    if (login) login.style.display = 'flex';
    if (main) main.style.display = 'none';
    if (window.LoginPage) window.LoginPage.render();
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
      const itemPath = item.dataset.path || item.getAttribute('data-path');
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
      settings: 'Configurações'
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

    const breadcrumb = document.getElementById('topbar-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = `SJIF / ${titles[path] || 'Dashboard'}`;
  }
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.app = new SJIFApp();
    await window.app.init();
    console.log('✅ SJIF App initialized successfully');
  } catch (err) {
    console.error('❌ SJIF App initialization error:', err);
  }
});
