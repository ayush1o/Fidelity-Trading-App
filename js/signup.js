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

const SIGNUP_API_CANDIDATES = [
  `${getConfiguredApiBase()}/api/auth/signup`,
  '/api/auth/signup',
  'http://localhost:5000/api/auth/signup'
];

function safeJsonParse(raw){
  try { return JSON.parse(raw); }
  catch { return null; }
}

async function postSignup(payload){

  for(const url of SIGNUP_API_CANDIDATES){
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

  throw new Error('Unable to reach signup API');
}

document.addEventListener('DOMContentLoaded',()=>{

  const signupForm = document.getElementById('signupForm');
  if(!signupForm) return;

  signupForm.addEventListener('submit',async e=>{
    e.preventDefault();

    if(password.value !== confirmPassword.value){
      alert('Passwords do not match');
      return;
    }

    try{
      const {response,data} =
        await postSignup({
          name:name.value.trim(),
          email:email.value.trim(),
          password:password.value
        });

      if(response.ok && data.success){
        localStorage.setItem('token',data.token);
        localStorage.setItem('username',data.user?.name||name.value);
        window.location.href='dashboard.html';
      }else{
        alert(data.message||'Signup failed');
      }

    }catch(err){
      console.error(err);
      alert('Server connection error');
    }
  });
});
