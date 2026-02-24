(function (global) {
  const DEMO_ACCOUNT = {
    email: 'admin@demo.com',
    password: '1234',
    name: 'Demo Admin'
  };

  function isGitHubPages() {
    return window.location.hostname.endsWith('github.io');
  }

  function mockDelay(data, ok = true) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok, data }), 300);
    });
  }

  async function login(payload) {
    const email = (payload.email || '').trim().toLowerCase();
    const password = payload.password || '';

    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      return mockDelay({
        success: true,
        user: { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email },
        mode: 'demo'
      });
    }

    return mockDelay(
      {
        success: false,
        message:
          'Demo login only: use admin@demo.com and password 1234.'
      },
      false
    );
  }

  async function signup(payload) {
    const name = (payload.name || 'Demo User').trim();
    return mockDelay({
      success: true,
      user: { name, email: 'demo-user@example.com' },
      mode: 'demo',
      message: 'Demo account created locally. No real registration occurs.'
    });
  }

  async function post(path, payload) {
    if (isGitHubPages()) {
      if (path.includes('/login')) return login(payload);
      if (path.includes('/signup')) return signup(payload);
    }

    if (path.includes('/login')) return login(payload);
    if (path.includes('/signup')) return signup(payload);

    return mockDelay({ success: false, message: 'Unsupported demo endpoint.' }, false);
  }

  global.DemoApi = { post, login, signup, isGitHubPages };
})(window);
