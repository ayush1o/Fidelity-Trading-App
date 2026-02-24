document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const token = localStorage.getItem('token');

  const authPages = new Set(['index.html', 'login.html', 'signup.html']);
  const protectedPages = new Set(['dashboard.html', 'profile.html', 'wallet.html', 'spin.html']);

  // already logged in -> avoid auth pages
  if (token && authPages.has(currentPage)) {
    window.location.replace('dashboard.html');
    return;
  }

  // no token -> protect private pages
  if (!token && protectedPages.has(currentPage)) {
    window.location.replace('index.html');
    return;
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'profile.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  const walletBtn = document.getElementById('walletBtn');
  if (walletBtn) walletBtn.onclick = () => (window.location.href = 'wallet.html');

  const spinWheel = document.getElementById('spinWheel');
  if (spinWheel) spinWheel.onclick = () => (window.location.href = 'spin.html');
});
