function getSignupApiCandidates() {
  const host = window.location.hostname;

  if (!host || window.location.protocol === 'file:') {
    return ['http://localhost:5000/api/auth/signup'];
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return [
      `${window.location.protocol}//${host}:5000/api/auth/signup`,
      'http://localhost:5000/api/auth/signup',
      '/api/auth/signup'
    ];
  }

  return ['/api/auth/signup', 'http://localhost:5000/api/auth/signup'];
}

const SIGNUP_API_CANDIDATES = getSignupApiCandidates();

async function postSignup(payload) {
  let lastError;

  for (const url of SIGNUP_API_CANDIDATES) {
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
      console.warn('Signup request attempt failed for', url, error.message);
    }
  }

  throw lastError || new Error('Unable to reach signup API');
}

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
      const { response, data } = await postSignup({ name, email, password });

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
