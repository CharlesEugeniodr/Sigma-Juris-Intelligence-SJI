// ============================================================
// SJIF Login Page
// ============================================================
window.LoginPage = {
  render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    // --- Scoped styles ---
    const style = document.createElement('style');
    style.textContent = `
      .login-wrapper {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0A0E14 0%, #0F2027 40%, #1A3A4A 70%, #0A0E14 100%);
        z-index: 2000;
        overflow: hidden;
      }
      .login-grid-bg {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
      }
      .login-glow {
        position: absolute;
        width: 500px; height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }
      .login-card {
        position: relative;
        width: 100%;
        max-width: 420px;
        padding: 48px 40px 36px;
        background: rgba(17,24,32,0.85);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(212,175,55,0.12);
        border-radius: 20px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.05);
        text-align: center;
        opacity: 0;
        transform: translateY(30px);
        animation: loginSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
      }
      @keyframes loginSlideIn {
        to { opacity: 1; transform: translateY(0); }
      }
      .login-icon { margin-bottom: 20px; }
      .login-icon svg {
        width: 52px; height: 68px;
        filter: drop-shadow(0 0 16px rgba(212,175,55,0.25));
      }
      .login-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 2rem;
        font-weight: 700;
        color: #E0E4E5;
        margin-bottom: 2px;
        letter-spacing: 0.04em;
      }
      .login-subtitle {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.65rem;
        font-weight: 400;
        color: #D4AF37;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        margin-bottom: 36px;
      }
      .login-field {
        position: relative;
        margin-bottom: 18px;
        text-align: left;
      }
      .login-field label {
        display: block;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.7rem;
        font-weight: 500;
        color: #6B7A8D;
        margin-bottom: 6px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .login-field input {
        width: 100%;
        padding: 14px 16px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(212,175,55,0.1);
        border-radius: 10px;
        color: #E0E4E5;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.9rem;
        font-weight: 300;
        outline: none;
        transition: all 0.3s ease;
      }
      .login-field input:focus {
        border-color: rgba(212,175,55,0.4);
        box-shadow: 0 0 0 3px rgba(212,175,55,0.06);
        background: rgba(255,255,255,0.06);
      }
      .login-field input::placeholder { color: #4A5568; }
      .login-pw-toggle {
        position: absolute;
        right: 14px;
        bottom: 13px;
        background: none;
        border: none;
        color: #6B7A8D;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0;
        transition: color 0.2s;
      }
      .login-pw-toggle:hover { color: #D4AF37; }
      .login-btn {
        width: 100%;
        padding: 15px;
        margin-top: 10px;
        background: linear-gradient(135deg, #D4AF37 0%, #F2D06B 50%, #D4AF37 100%);
        background-size: 200% 200%;
        border: none;
        border-radius: 10px;
        color: #0F2027;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(212,175,55,0.25);
      }
      .login-btn:hover {
        background-position: 100% 100%;
        box-shadow: 0 6px 28px rgba(212,175,55,0.4);
        transform: translateY(-1px);
      }
      .login-btn:active { transform: translateY(0); }
      .login-error {
        margin-top: 16px;
        padding: 10px 14px;
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.25);
        border-radius: 8px;
        color: #E74C3C;
        font-size: 0.8rem;
        font-weight: 400;
        display: none;
      }
      .login-error.visible { display: block; }
      .login-footer {
        margin-top: 32px;
        font-size: 0.65rem;
        color: rgba(107,122,141,0.5);
        font-weight: 300;
      }
      .login-divider {
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #D4AF37, transparent);
        margin: 0 auto 28px;
        border-radius: 1px;
      }
    `;
    container.appendChild(style);

    // --- Layout ---
    const wrapper = document.createElement('div');
    wrapper.className = 'login-wrapper';
    wrapper.innerHTML = `
      <div class="login-grid-bg"></div>
      <div class="login-glow"></div>
      <div class="login-card">
        <div class="login-icon">
          <svg viewBox="0 0 60 80" fill="none">
            <defs>
              <linearGradient id="lgGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#D4AF37"/>
                <stop offset="50%" style="stop-color:#F2D06B"/>
                <stop offset="100%" style="stop-color:#D4AF37"/>
              </linearGradient>
            </defs>
            <path d="M 6 6 L 54 6 L 54 14 L 22 14 L 38 38 L 22 62 L 54 62 L 54 70 L 6 70 L 28 38 Z" fill="url(#lgGold)"/>
            <line x1="30" y1="70" x2="30" y2="78" stroke="#D4AF37" stroke-width="2.5"/>
            <line x1="18" y1="78" x2="42" y2="78" stroke="#D4AF37" stroke-width="2.5"/>
          </svg>
        </div>
        <div class="login-title">Sigma</div>
        <div class="login-subtitle">Juris Intelligence</div>
        <div class="login-divider"></div>
        <form id="login-form" autocomplete="off">
          <div class="login-field">
            <label for="login-email">E-mail</label>
            <input type="email" id="login-email" value="admin@sigma.juris" placeholder="seu@email.com" />
          </div>
          <div class="login-field">
            <label for="login-password">Senha</label>
            <input type="password" id="login-password" placeholder="••••••••" />
            <button type="button" class="login-pw-toggle" id="login-pw-toggle" aria-label="Mostrar senha">👁</button>
          </div>
          <button type="submit" class="login-btn">Entrar</button>
          <div class="login-error" id="login-error"></div>
        </form>
        <div class="login-footer">© 2026 Sigma Sihf Soluções Analíticas Ltda</div>
      </div>
    `;
    container.appendChild(wrapper);

    // --- Interactions ---
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const pwInput = document.getElementById('login-password');
    const pwToggle = document.getElementById('login-pw-toggle');
    const errorEl = document.getElementById('login-error');

    pwToggle.addEventListener('click', () => {
      const show = pwInput.type === 'password';
      pwInput.type = show ? 'text' : 'password';
      pwToggle.textContent = show ? '🙈' : '👁';
    });

    const doLogin = async (e) => {
      if (e) e.preventDefault();
      errorEl.classList.remove('visible');
      const email = emailInput.value.trim();
      const password = pwInput.value;
      if (!email || !password) {
        errorEl.textContent = 'Preencha todos os campos.';
        errorEl.classList.add('visible');
        return;
      }
      try {
        const auth = window.SJIFAuth || (window.app && window.app.auth);
        if (auth) {
          const result = auth.login(email, password);
          if (result === false || (result && result.error)) {
            errorEl.textContent = (result && result.error) || 'Credenciais inválidas.';
            errorEl.classList.add('visible');
            return;
          }
        }
        window.location.hash = '#/dashboard';
      } catch (err) {
        errorEl.textContent = err.message || 'Erro ao autenticar.';
        errorEl.classList.add('visible');
      }
    };

    form.addEventListener('submit', doLogin);
  },

  renderInto(target) {
    const container = target || document.getElementById('page-container');
    if (!container) return;
    // Temporarily override page-container reference
    const origContainer = document.getElementById('page-container');
    // Use the target as container
    container.innerHTML = '';
    // Re-run render but targeting our container
    const style = document.createElement('style');
    style.textContent = `
      .login-wrapper {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0A0E14 0%, #0F2027 40%, #1A3A4A 70%, #0A0E14 100%);
        z-index: 2000;
        overflow: hidden;
      }
      .login-grid-bg {
        position: absolute; inset: 0;
        background-image: linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
      }
      .login-glow {
        position: absolute; width: 500px; height: 500px; border-radius: 50%;
        background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
        top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
      }
      .login-card-new {
        position: relative; width: 100%; max-width: 420px; padding: 48px 40px 36px;
        background: rgba(17,24,32,0.85);
        backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(212,175,55,0.12); border-radius: 20px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        text-align: center;
        opacity: 0; transform: translateY(30px);
        animation: loginSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
      }
      @keyframes loginSlideIn { to { opacity: 1; transform: translateY(0); } }
      .login-icon-new { margin-bottom: 20px; }
      .login-icon-new svg { width: 52px; height: 68px; filter: drop-shadow(0 0 16px rgba(212,175,55,0.25)); }
      .login-title-new { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 700; color: #E0E4E5; margin-bottom: 2px; }
      .login-subtitle-new { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 400; color: #D4AF37; letter-spacing: 0.35em; text-transform: uppercase; margin-bottom: 36px; }
      .login-field-new { position: relative; margin-bottom: 18px; text-align: left; }
      .login-field-new label { display: block; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 500; color: #6B7A8D; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
      .login-field-new input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.15); border-radius: 10px; color: #E0E4E5; font-size: 0.95rem; font-family: 'Montserrat', sans-serif; outline: none; transition: border-color 0.3s; box-sizing: border-box; }
      .login-field-new input:focus { border-color: rgba(212,175,55,0.5); }
      .login-btn-new { width: 100%; padding: 16px; margin-top: 10px; border: none; border-radius: 10px; background: linear-gradient(135deg, #D4AF37, #F2D06B, #D4AF37); background-size: 200% 200%; color: #0F2027; font-size: 0.85rem; font-family: 'Montserrat', sans-serif; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(212,175,55,0.25); }
      .login-btn-new:hover { box-shadow: 0 6px 28px rgba(212,175,55,0.4); transform: translateY(-1px); }
      .login-error-new { margin-top: 16px; padding: 10px 14px; background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.25); border-radius: 8px; color: #E74C3C; font-size: 0.8rem; display: none; }
      .login-error-new.visible { display: block; }
      .login-footer-new { margin-top: 32px; font-size: 0.65rem; color: rgba(107,122,141,0.5); font-weight: 300; }
      .login-divider-new { width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 auto 28px; border-radius: 1px; }
    `;
    container.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'login-wrapper';
    wrapper.innerHTML = `
      <div class="login-grid-bg"></div>
      <div class="login-glow"></div>
      <div class="login-card-new">
        <div class="login-icon-new">
          <svg viewBox="0 0 60 80" fill="none">
            <defs><linearGradient id="lgGold2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="50%" style="stop-color:#F2D06B"/><stop offset="100%" style="stop-color:#D4AF37"/></linearGradient></defs>
            <path d="M 6 6 L 54 6 L 54 14 L 22 14 L 38 38 L 22 62 L 54 62 L 54 70 L 6 70 L 28 38 Z" fill="url(#lgGold2)"/>
            <line x1="30" y1="70" x2="30" y2="78" stroke="#D4AF37" stroke-width="2.5"/>
            <line x1="18" y1="78" x2="42" y2="78" stroke="#D4AF37" stroke-width="2.5"/>
          </svg>
        </div>
        <div class="login-title-new">Sigma</div>
        <div class="login-subtitle-new">Juris Intelligence</div>
        <div class="login-divider-new"></div>
        <form id="sjif-login-form" autocomplete="off">
          <div class="login-field-new">
            <label>E-mail</label>
            <input type="email" id="sjif-login-email" value="admin@sigma.juris" placeholder="seu@email.com" />
          </div>
          <div class="login-field-new">
            <label>Senha</label>
            <input type="password" id="sjif-login-password" placeholder="Senha" />
          </div>
          <button type="submit" class="login-btn-new">Entrar</button>
          <div class="login-error-new" id="sjif-login-error"></div>
        </form>
        <div class="login-footer-new">&copy; 2026 Sigma Sihf Solucoes Analiticas Ltda</div>
      </div>
    `;
    container.appendChild(wrapper);

    // Interactions
    const form = document.getElementById('sjif-login-form');
    const emailInput = document.getElementById('sjif-login-email');
    const pwInput = document.getElementById('sjif-login-password');
    const errorEl = document.getElementById('sjif-login-error');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorEl.classList.remove('visible');
      const email = emailInput.value.trim();
      const password = pwInput.value;
      if (!email || !password) {
        errorEl.textContent = 'Preencha todos os campos.';
        errorEl.classList.add('visible');
        return;
      }
      try {
        const auth = (window.app && window.app.auth);
        if (auth) {
          const result = auth.login(email, password);
          if (!result || !result.success) {
            errorEl.textContent = (result && result.error) || 'Credenciais invalidas.';
            errorEl.classList.add('visible');
            return;
          }
        }
        // Remove login overlay
        wrapper.remove();
        if (window.app) {
          window.app.showMainApp();
          window.location.hash = '#/dashboard';
        }
      } catch (err) {
        errorEl.textContent = err.message || 'Erro ao autenticar.';
        errorEl.classList.add('visible');
      }
    });
  }
};
