document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const token = localStorage.getItem('token');

  console.log('[auth] DOM loaded on page:', currentPage);

  const authPages = new Set(['index.html', 'login.html', 'signup.html']);
  const protectedPages = new Set(['dashboard.html', 'profile.html', 'wallet.html', 'spin.html']);

  if (token && authPages.has(currentPage)) {
    console.log('[auth] token exists on auth page -> redirecting to dashboard.html');
    window.location.replace('dashboard.html');
    return;
  }

  if (!token && protectedPages.has(currentPage)) {
    console.log('[auth] missing token on protected page -> redirecting to index.html');
    window.location.replace('index.html');
    return;
  }

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    console.log('[auth] profileBtn found, attaching click listener');
    profileBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('[auth] profileBtn clicked -> navigating to profile.html');
      window.location.href = 'profile.html';
    });
  } else {
    console.log('[auth] profileBtn not found on this page');
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('[auth] logout clicked -> clearing session');
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  const walletBtn = document.getElementById('walletBtn');
  if (walletBtn) {
    walletBtn.onclick = () => {
      console.log('[auth] walletBtn clicked');
      window.location.href = 'wallet.html';
    };
  }

  const spinWheel = document.getElementById('spinWheel');
  if (spinWheel) {
    spinWheel.onclick = () => {
      console.log('[auth] spinWheel clicked');
      window.location.href = 'spin.html';
    };
  }
});
