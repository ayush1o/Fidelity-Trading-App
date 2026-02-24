const GITHUB_PAGES_API_BASE = 'https://fidelity-trading-app.onrender.com';

function getConfiguredApiBase() {
  if (window.FIDELITY_API_BASE && window.FIDELITY_API_BASE.trim()) {
    return window.FIDELITY_API_BASE.trim().replace(/\/$/, '');
  }

  const fromStorage = localStorage.getItem('FIDELITY_API_BASE');
  if (fromStorage && fromStorage.trim()) {
    return fromStorage.trim().replace(/\/$/, '');
  }

  const host = window.location.hostname;

  if (window.location.protocol === 'file:' || !host) {
    return 'http://localhost:5000';
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return `${window.location.protocol}//${host}:5000`;
  }

  if (host.endsWith('github.io')) {
    return GITHUB_PAGES_API_BASE;
  }

  return window.location.origin;
}

function getLoginApiCandidates() {
  const base = getConfiguredApiBase();
  return [`${base}/api/auth/login`, '/api/auth/login', 'http://localhost:5000/api/auth/login'];
}

const LOGIN_API_CANDIDATES = getLoginApiCandidates();

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

async function postLogin(payload) {
  let lastError;

  for (const url of LOGIN_API_CANDIDATES) {
    try {
      console.log('Sending request', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    } catch (error) {
      lastError = error;
      console.warn('Login request attempt failed for', url, error.message);
    }
  }

  throw lastError || new Error('Unable to reach login API');
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (!loginForm) {
    console.error('Login form not found');
    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      const { response, data } = await postLogin({ email, password });

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || '');
        window.location.href = 'dashboard.html';
        return;
      }

      alert(data.message || 'Login failed');
    } catch (error) {
      console.error('Login request failed:', error);
      alert('Server connection error. Configure window.FIDELITY_API_BASE with your backend URL.');
    }
  });
});
