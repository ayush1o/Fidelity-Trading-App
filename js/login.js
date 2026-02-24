document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!loginForm || !emailInput || !passwordInput) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { ok, data } = await window.DemoApi.post('/api/auth/login', {
      email: emailInput.value,
      password: passwordInput.value
    });

    if (ok && data.success) {
      localStorage.setItem('demoAuthenticated', 'true');
      localStorage.setItem('demoDisplayName', data.user?.name || 'Demo User');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Demo login failed');
    }

    loginForm.reset();
  });
});
