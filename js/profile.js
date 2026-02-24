document.addEventListener('DOMContentLoaded', () => {
  console.log('[profile] DOM loaded');

  const token = localStorage.getItem('token');
  if (!token) {
    console.log('[profile] no token found -> redirecting to index.html');
    window.location.replace('index.html');
    return;
  }


  const profileEmail = document.getElementById('profileEmail');
  if (profileEmail) {
    const username = localStorage.getItem('username') || 'User';
    profileEmail.textContent = `Signed in as ${username}`;
    console.log('[profile] profile content populated');
  }

  const backBtn = document.getElementById('backToDashboard');
  if (backBtn) {
    console.log('[profile] backToDashboard found, attaching click listener');
    backBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('[profile] backToDashboard clicked -> dashboard.html');
      window.location.href = 'dashboard.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('[profile] logout clicked');
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
});
