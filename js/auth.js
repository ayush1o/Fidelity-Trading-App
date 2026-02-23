document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  const token = localStorage.getItem('token');

  if (
    token &&
    (page === 'index.html' || page === 'login.html' || page === 'signup.html' || page === '')
  ) {
    window.location.replace('dashboard.html');
    return;
  }

  if (!token && page === 'dashboard.html') {
    window.location.replace('index.html');
    return;
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  const API_BASE =
    location.protocol === 'file:' || !location.hostname
      ? 'http://localhost:5000/api/auth'
      : `${location.protocol}//${location.hostname}:5000/api/auth`;

  async function submitAuth(endpoint, payload) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch (_error) {
      throw new Error('Invalid server response');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Authentication failed');
    }

    return data;
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const data = await submitAuth('/signup', {
          name: document.getElementById('name')?.value.trim(),
          email: document.getElementById('email')?.value.trim(),
          password: document.getElementById('password')?.value
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || '');
        window.location.replace('dashboard.html');
      } catch (error) {
        alert(error.message || 'Server connection error');
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const data = await submitAuth('/login', {
          email: document.getElementById('email')?.value.trim(),
          password: document.getElementById('password')?.value
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || '');
        window.location.replace('dashboard.html');
      } catch (error) {
        alert(error.message || 'Server connection error');
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  const walletBtn = document.getElementById('walletBtn');
  if (walletBtn) walletBtn.onclick = () => (location.href = 'wallet.html');

  const spinWheel = document.getElementById('spinWheel');
  if (spinWheel) spinWheel.onclick = () => (location.href = 'spin.html');
});
