function getLoginApiCandidates() {
  const host = window.location.hostname;

  if (!host || window.location.protocol === 'file:') {
    return ['http://localhost:5000/api/auth/login'];
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return [
      `${window.location.protocol}//${host}:5000/api/auth/login`,
      'http://localhost:5000/api/auth/login',
      '/api/auth/login'
    ];
  }

  return ['/api/auth/login', 'http://localhost:5000/api/auth/login'];
}

const LOGIN_API_CANDIDATES = getLoginApiCandidates();

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
      const data = await response.json();
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
      alert('Server connection error');
    }
  });
});
