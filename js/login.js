const LOGIN_API_URL = 'http://localhost:5000/api/auth/login';

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
      console.log('Sending request');
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response received');
      const data = await response.json();

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
