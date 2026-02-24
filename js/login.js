const DEFAULT_GITHUB_PAGES_API_BASE = 'https://fidelity-trading-app.onrender.com';

function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/$/, '');
}

function getConfiguredApiBase() {
  const globalBase = normalizeBaseUrl(window.FIDELITY_API_BASE);
  if (globalBase) return globalBase;

  const storedBase = normalizeBaseUrl(localStorage.getItem('FIDELITY_API_BASE'));
  if (storedBase) return storedBase;

  const host = window.location.hostname;

  if (window.location.protocol === 'file:' || !host) return 'http://localhost:5000';
  if (host === 'localhost' || host === '127.0.0.1') return `${window.location.protocol}//${host}:5000`;
  if (host.endsWith('github.io')) return DEFAULT_GITHUB_PAGES_API_BASE;

  return window.location.origin;
}

function getLoginApiCandidates() {
  const base = getConfiguredApiBase();
  return [`${base}/api/auth/login`, '/api/auth/login', 'http://localhost:5000/api/auth/login'];
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

async function postLogin(payload) {
  let lastError;

  for (const url of getLoginApiCandidates()) {
    try {
      console.log('Sending request', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response received', response.status);
      const raw = await response.text();
      const data = safeJsonParse(raw);

      if (!data) {
        lastError = new Error(`Non-JSON response from ${url}`);
        continue;
      }

      return { response, data };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Unable to reach login API');
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const { response, data } = await postLogin({ email, password });

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || '');
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Server connection error');
    }
  });
});
