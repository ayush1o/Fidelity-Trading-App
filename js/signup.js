const SIGNUP_API_URL = 'http://localhost:5000/api/auth/signup';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');

  if (!signupForm) {
    console.error('Signup form not found');
    return;
  }

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const name = document.getElementById('name')?.value.trim();
    const dob = document.getElementById('dob')?.value;
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!name || !dob || !phone || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      console.log('Sending request');
      const response = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      console.log('Response received');
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.name || name);
        window.location.href = 'dashboard.html';
        return;
      }

      alert(data.message || 'Signup failed');
    } catch (error) {
      console.error('Signup request failed:', error);
      alert('Server connection error');
    }
  });
});
