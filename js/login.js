function getLoginApiUrl() {
  const host = window.location.hostname;

  if (!host || window.location.protocol === 'file:') {
    return 'http://localhost:5000/api/auth/login';
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return `${window.location.protocol}//${host}:5000/api/auth/login`;
  }

  return '/api/auth/login';
}

const LOGIN_API_URL = getLoginApiUrl();

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
      console.log('Sending request', LOGIN_API_URL);
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response received', response.status);

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : {};

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || '');
        window.location.href = 'dashboard.html';
        return;
      }

      alert(data.message || 'Login failed');
    } catch (error) {
      console.error('Login request failed:', error);
      alert('Server connection error');
    }
  });
});
