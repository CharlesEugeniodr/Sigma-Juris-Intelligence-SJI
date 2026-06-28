(function() {
  'use strict';

  /**
   * SJIFAuth — Authentication manager for Sigma Juris Intelligence Framework.
   *
   * Handles credential validation against a static user list, creates
   * time-limited sessions stored in localStorage, and provides helpers for
   * permission / role checks, session refresh and auth-gating.
   *
   * @class SJIFAuth
   */
  class SJIFAuth {
    /**
     * Create a new SJIFAuth instance.
     * Initialises the localStorage key name and the default session duration
     * (8 hours).
     */
    constructor() {
      /** @type {string} localStorage key used to persist the session object */
      this.sessionKey = 'sjif_session';

      /** @type {number} Session lifetime in milliseconds (8 h) */
      this.sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
    }

    /**
     * Built-in user catalogue.
     * Each entry contains the credentials, display metadata and permission set
     * used during login validation.
     *
     * @static
     * @type {Array<{email:string, password:string, name:string, role:string, avatar:string, permissions:string[]}>}
     */
    static USERS = [
      {
        email: 'admin@sigma.juris',
        password: 'Sigma2026!',
        name: 'Charles Eugênio',
        role: 'admin',
        avatar: 'CE',
        permissions: ['read', 'write', 'delete', 'admin', 'export', 'analyze']
      },
      {
        email: 'analista@sigma.juris',
        password: 'Analista2026!',
        name: 'Ana Silva',
        role: 'analyst',
        avatar: 'AS',
        permissions: ['read', 'write', 'analyze']
      }
    ];

    /**
     * Authenticate a user with e-mail and password.
     *
     * On success a session object is persisted to localStorage and the method
     * returns the sanitised user profile together with a generated token.
     *
     * @param   {string} email    — User e-mail address.
     * @param   {string} password — Plain-text password.
     * @returns {{success:boolean, user?:object, token?:string, error?:string}}
     *          Result object.  `success` is `true` when credentials match.
     */
    login(email, password) {
      if (!email || !password) {
        return { success: false, error: 'E-mail e senha são obrigatórios.' };
      }

      const user = SJIFAuth.USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return { success: false, error: 'Credenciais inválidas. Verifique e-mail e senha.' };
      }

      const token = btoa(
        user.email + ':' + Date.now() + ':' + Math.random().toString(36).substr(2)
      );

      const session = {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          permissions: user.permissions
        },
        token: token,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.sessionDuration).toISOString()
      };

      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return { success: true, user: session.user, token: token };
    }

    /**
     * Destroy the current session by removing it from localStorage.
     *
     * @returns {void}
     */
    logout() {
      localStorage.removeItem(this.sessionKey);
    }

    /**
     * Determine whether a valid, non-expired session exists.
     *
     * @returns {boolean} `true` when the session exists and has not expired.
     */
    isAuthenticated() {
      const session = this.getSession();
      if (!session) return false;
      return new Date(session.expiresAt) > new Date();
    }

    /**
     * Return the profile of the currently authenticated user, or `null` if
     * the session is missing / expired.
     *
     * @returns {{email:string, name:string, role:string, avatar:string, permissions:string[]}|null}
     */
    getCurrentUser() {
      if (!this.isAuthenticated()) return null;
      const session = this.getSession();
      return session ? session.user : null;
    }

    /**
     * Retrieve and parse the raw session object stored in localStorage.
     *
     * Returns `null` when no session is stored or when the stored value
     * cannot be parsed as JSON.
     *
     * @returns {object|null} The parsed session, or `null`.
     */
    getSession() {
      try {
        const raw = localStorage.getItem(this.sessionKey);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }

    /**
     * Guard method — redirects the browser to `/login.html` when the user is
     * not authenticated.  The current URL is saved in `sessionStorage` so the
     * login page can redirect back after a successful sign-in.
     *
     * @returns {boolean} `true` if authenticated; `false` right before the
     *          redirect is triggered.
     */
    requireAuth() {
      if (!this.isAuthenticated()) {
        sessionStorage.setItem('sjif_redirect', window.location.href);
        window.location.href = '/login.html';
        return false;
      }
      return true;
    }

    /**
     * Check whether the currently authenticated user possesses a given
     * permission string (e.g. `'read'`, `'admin'`, `'export'`).
     *
     * @param   {string}  permission — Permission key to test.
     * @returns {boolean} `true` when the user is logged in **and** holds the
     *          requested permission.
     */
    hasPermission(permission) {
      const user = this.getCurrentUser();
      if (!user) return false;
      return user.permissions && user.permissions.includes(permission);
    }

    /**
     * Convenience helper — returns `true` when the current user's role is
     * `'admin'`.
     *
     * @returns {boolean}
     */
    isAdmin() {
      const user = this.getCurrentUser();
      return user && user.role === 'admin';
    }

    /**
     * Extend the current session's expiry by another full session duration
     * (8 hours from now) and persist the updated session to localStorage.
     *
     * @returns {boolean} `true` on success; `false` when no session exists.
     */
    refreshSession() {
      const session = this.getSession();
      if (!session) return false;
      session.expiresAt = new Date(Date.now() + this.sessionDuration).toISOString();
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return true;
    }
  }

  // Expose globally — no ES modules.
  window.SJIFAuth = SJIFAuth;
})();
