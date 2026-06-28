(function() {
  'use strict';

  window.SJIFUtils = {

    // === Security ===

    escapeHtml: function(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },

    // === Formatting ===

    formatDate(date, format = 'dd/MM/yyyy') {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return '';

      if (format === 'relative') {
        const now = new Date();
        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffWeek = Math.floor(diffDay / 7);
        const diffMonth = Math.floor(diffDay / 30);

        if (diffSec < 60) return 'agora mesmo';
        if (diffMin < 60) return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
        if (diffHour < 24) return `há ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
        if (diffDay === 1) return 'ontem';
        if (diffDay < 7) return `há ${diffDay} dias`;
        if (diffWeek === 1) return 'há 1 semana';
        if (diffWeek < 4) return `há ${diffWeek} semanas`;
        if (diffMonth === 1) return 'há 1 mês';
        if (diffMonth < 12) return `há ${diffMonth} meses`;
        return `há mais de 1 ano`;
      }

      const pad = (n) => String(n).padStart(2, '0');
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());

      if (format === 'dd/MM/yyyy HH:mm') return `${day}/${month}/${year} ${hours}:${minutes}`;
      return `${day}/${month}/${year}`;
    },

    formatNumber(num) {
      if (num == null || isNaN(num)) return '0';
      return Number(num).toLocaleString('pt-BR');
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
    },

    truncate(str, maxLen = 100) {
      if (!str || str.length <= maxLen) return str || '';
      return str.substring(0, maxLen - 3) + '...';
    },

    slugify(str) {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    // === ID Generation ===

    generateId() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    getScoreClass: function(score) {
      if (score >= 80) return 'score-high';
      if (score >= 60) return 'score-mid';
      if (score >= 40) return 'score-low-mid';
      return 'score-low';
    },

    generateProcessNumber() {
      const seq = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
      const dd = String(Math.floor(Math.random() * 99)).padStart(2, '0');
      const year = new Date().getFullYear();
      const justice = 8;
      const tr = 13;
      const origin = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
      return `${seq}-${dd}.${year}.${justice}.${tr}.${origin}`;
    },

    // === Text Extraction ===

    async extractTextFromFile(file) {
      if (!file) return '';
      const ext = file.name.split('.').pop().toLowerCase();
      if (['txt', 'md', 'csv', 'log'].includes(ext)) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
          reader.readAsText(file, 'UTF-8');
        });
      }
      return `[Conteúdo do arquivo: ${file.name}]`;
    },

    // === Debounce / Throttle ===

    debounce(fn, delay = 300) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    throttle(fn, delay = 300) {
      let lastCall = 0;
      let timer = null;
      return function(...args) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);
        clearTimeout(timer);
        if (remaining <= 0) {
          lastCall = now;
          fn.apply(this, args);
        } else {
          timer = setTimeout(() => {
            lastCall = Date.now();
            fn.apply(this, args);
          }, remaining);
        }
      };
    },

    // === DOM Helpers ===

    $(selector) {
      return document.querySelector(selector);
    },

    $$(selector) {
      return Array.from(document.querySelectorAll(selector));
    },

    createElement(tag, attrs = {}, children = []) {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') el.className = value;
        else if (key === 'textContent') el.textContent = value;
        else if (key === 'innerHTML') el.innerHTML = value;
        else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
        else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        }
        else el.setAttribute(key, value);
      });
      children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
      });
      return el;
    },

    showToast(message, type = 'info', duration = 4000) {
      // Create toast container if it doesn't exist
      let container = document.getElementById('sjif-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'sjif-toast-container';
        Object.assign(container.style, {
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: '10000',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none'
        });
        document.body.appendChild(container);
      }

      const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
      const colors = {
        success: { bg: 'linear-gradient(135deg, #00b894, #00cec9)', border: '#00b894' },
        warning: { bg: 'linear-gradient(135deg, #fdcb6e, #f39c12)', border: '#f39c12' },
        error: { bg: 'linear-gradient(135deg, #e17055, #d63031)', border: '#d63031' },
        info: { bg: 'linear-gradient(135deg, #74b9ff, #0984e3)', border: '#0984e3' }
      };

      const toast = document.createElement('div');
      toast.innerHTML = `<span style="margin-right:8px;font-size:18px">${icons[type] || icons.info}</span><span>${message}</span>`;
      Object.assign(toast.style, {
        background: (colors[type] || colors.info).bg,
        color: '#fff',
        padding: '14px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        pointerEvents: 'auto',
        cursor: 'pointer',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        opacity: '0',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${(colors[type] || colors.info).border}`
      });

      container.appendChild(toast);
      // Trigger animation
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      });

      const removeToast = () => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      };

      toast.addEventListener('click', removeToast);
      setTimeout(removeToast, duration);
    },

    showModal(title, content, actions = []) {
      // Remove existing modal
      this.closeModal();

      const overlay = document.createElement('div');
      overlay.id = 'sjif-modal-overlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10001',
        opacity: '0',
        transition: 'opacity 0.3s ease'
      });

      const modal = document.createElement('div');
      Object.assign(modal.style, {
        background: 'linear-gradient(135deg, rgba(30,30,60,0.95), rgba(20,20,50,0.98))',
        borderRadius: '20px',
        padding: '32px',
        minWidth: '400px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        transform: 'scale(0.9)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
      });

      // Title
      const titleEl = document.createElement('h2');
      titleEl.textContent = title;
      Object.assign(titleEl.style, {
        margin: '0 0 20px 0',
        fontSize: '22px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #74b9ff, #a29bfe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      });
      modal.appendChild(titleEl);

      // Content
      const contentEl = document.createElement('div');
      Object.assign(contentEl.style, { marginBottom: '24px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' });
      if (typeof content === 'string') {
        contentEl.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        contentEl.appendChild(content);
      }
      modal.appendChild(contentEl);

      // Actions
      if (actions.length > 0) {
        const actionsEl = document.createElement('div');
        Object.assign(actionsEl.style, { display: 'flex', justifyContent: 'flex-end', gap: '12px' });
        actions.forEach(action => {
          const btn = document.createElement('button');
          btn.textContent = action.label;
          const isPrimary = action.type === 'primary';
          const isDanger = action.type === 'danger';
          Object.assign(btn.style, {
            padding: '10px 24px',
            borderRadius: '10px',
            border: isPrimary || isDanger ? 'none' : '1px solid rgba(255,255,255,0.2)',
            background: isDanger ? 'linear-gradient(135deg, #e17055, #d63031)' : isPrimary ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : 'transparent',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          });
          btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; });
          btn.addEventListener('mouseleave', () => { btn.style.transform = 'translateY(0)'; btn.style.boxShadow = 'none'; });
          btn.addEventListener('click', () => {
            if (action.onClick) action.onClick();
            else window.SJIFUtils.closeModal();
          });
          actionsEl.appendChild(btn);
        });
        modal.appendChild(actionsEl);
      }

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Animate in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      });

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal();
      });

      // Close on Escape
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    },

    closeModal() {
      const overlay = document.getElementById('sjif-modal-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        const modal = overlay.querySelector('div');
        if (modal) modal.style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
      }
    },

    // === Animation ===

    animateIn(element, delay = 0) {
      if (!element) return;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
    },

    staggerIn(elements, baseDelay = 100) {
      const els = elements instanceof NodeList ? Array.from(elements) : elements;
      els.forEach((el, i) => {
        this.animateIn(el, i * baseDelay);
      });
    }
  };
})();
