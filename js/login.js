const GITHUB_PAGES_API_BASE =
  'https://fidelity-trading-app.onrender.com';

function getConfiguredApiBase(){
  const host = window.location.hostname;

  if (window.location.protocol === 'file:' || !host)
    return 'http://localhost:5000';

  if (host === 'localhost' || host === '127.0.0.1')
    return `${window.location.protocol}//${host}:5000`;

  if (host.endsWith('github.io'))
    return GITHUB_PAGES_API_BASE;

  return window.location.origin;
}

const LOGIN_API_CANDIDATES = [
  `${getConfiguredApiBase()}/api/auth/login`,
  '/api/auth/login',
  'http://localhost:5000/api/auth/login'
];

function safeJsonParse(raw){
  try { return JSON.parse(raw); }
  catch { return null; }
}

async function postLogin(payload){

  for(const url of LOGIN_API_CANDIDATES){
    try{
      console.log('Sending request →',url);

      const response = await fetch(url,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });

      const raw = await response.text();
      const data = safeJsonParse(raw);
      if(!data) continue;

      return {response,data};
    }catch{}
  }

  throw new Error('Unable to reach login API');
}

document.addEventListener('DOMContentLoaded',()=>{

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if(!loginForm) return;
  if(!emailInput || !passwordInput) return;

  loginForm.addEventListener('submit',async e=>{
    e.preventDefault();

    try{
      const {response,data} =
        await postLogin({
          email: emailInput.value.trim(),
          password: passwordInput.value
        });

      if(response.ok && data.success){
        localStorage.setItem('token',data.token);
        localStorage.setItem('username',data.user?.name||'');
        window.location.href='dashboard.html';
      }else{
        alert(data.message||'Login failed');
      }

    }catch(err){
      console.error(err);
      alert('Server connection error');
    }
  });
});
