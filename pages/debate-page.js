/* WTZ · 论战独立页：云端发现 + 登录 + 加载 debate.js */
(function(){
'use strict';

var K_API='gb_api_url', K_SESS='gb_session';
var CLOUD_URLS=[
  'https://wtz-YEE.github.io/cloud.txt',
  'https://fastly.jsdelivr.net/gh/wtz-YEE/wtz-YEE.github.io@main/cloud.txt',
  'https://raw.githubusercontent.com/wtz-YEE/wtz-YEE.github.io/main/cloud.txt'
];
var S={api:'',apis:[],user:null,loaded:false,discovering:false,tried:null};

function $(id){return document.getElementById(id)}
function ls(k){try{return localStorage.getItem(k)||''}catch(e){return ''}}
function lset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function ldel(k){try{localStorage.removeItem(k)}catch(e){}}
function norm(u){return String(u||'').trim().replace(/\/+$/,'')}
function isHttp(u){return /^https?:\/\//i.test(u)}
function readSess(){
  try{var s=JSON.parse(ls(K_SESS)||'null');if(s&&s.token&&s.username)return s}catch(e){}
  return null;
}
function writeSess(u){ if(u) lset(K_SESS,JSON.stringify(u)); else ldel(K_SESS); S.user=u; }
function addApis(list){
  (list||[]).forEach(function(u){
    u=norm(u);
    if(isHttp(u)&&S.apis.indexOf(u)<0) S.apis.push(u);
  });
}
function seeds(){
  var out=[];
  function add(u){u=norm(u);if(isHttp(u)&&out.indexOf(u)<0)out.push(u)}
  ls(K_API).split(/\s+/).forEach(add);
  add('http://127.0.0.1:8701');
  return out;
}

function fetchText(url,ms){
  return new Promise(function(res){
    var done=false, ac=window.AbortController?new AbortController():null;
    var t=setTimeout(function(){ if(!done){done=true;if(ac)ac.abort();res('')} },ms||4000);
    fetch(url,{cache:'no-store',signal:ac?ac.signal:undefined}).then(function(r){
      return r.ok?r.text():'';
    }).then(function(x){
      if(done)return;done=true;clearTimeout(t);res(x||'');
    },function(){
      if(done)return;done=true;clearTimeout(t);res('');
    });
  });
}

function probe(u){
  return new Promise(function(res){
    var done=false, ac=window.AbortController?new AbortController():null;
    var t=setTimeout(function(){ if(!done){done=true;if(ac)ac.abort();res(false)} },2200);
    fetch(u+'/health',{cache:'no-store',signal:ac?ac.signal:undefined}).then(function(r){
      if(done)return;done=true;clearTimeout(t);res(!!r&&r.ok);
    },function(){
      if(done)return;done=true;clearTimeout(t);res(false);
    });
  });
}

function probeAll(){
  if(!S.apis.length) return Promise.resolve('');
  return new Promise(function(res){
    var done=false, n=S.apis.length, left=n;
    S.apis.forEach(function(u){
      probe(u).then(function(ok){
        left--;
        if(ok&&!done){done=true;res(u);return}
        if(left<=0&&!done){done=true;res('')}
      });
    });
    setTimeout(function(){ if(!done){done=true;res(S.apis[0]||'')} },4200);
  });
}

function setApi(u){
  S.api=u||'';
  var el=$('dpApi'), st=$('dpState');
  if(el){
    el.textContent = S.api ? '已连接' : '未连接 · 本机模式';
    el.className = S.api ? 'dp-ok' : 'dp-bad';
  }
  if(st) st.textContent = S.api ? 'ONLINE' : 'LOCAL';
  if(S.api&&S.loaded&&window.__dbReload){
    try{document.dispatchEvent(new CustomEvent('wz:auth',{detail:{user:S.user}}))}catch(e){}
    try{window.__dbReload(true)}catch(e){}
  }
}

function discover(){
  if(S.discovering) return Promise.resolve(S.api);
  S.discovering=true;
  addApis(seeds());
  var t=Date.now();
  var urls=CLOUD_URLS.map(function(u){
    return fetchText(u+'?t='+t,4000).then(function(x){
      String(x||'').split(/\s+/).forEach(function(l){
        l=norm(l);
        if(isHttp(l)) addApis([l]);
      });
    });
  });
  return Promise.all(urls).then(probeAll,probeAll).then(function(u){
    S.discovering=false;
    setApi(u);
    return u;
  },function(){
    S.discovering=false;
    setApi('');
    return '';
  });
}

/* ---------- 云端调用 ---------- */
function call(path,payload){
  var body=Object.assign({token:S.user?S.user.token:''},payload||{});
  var list=S.apis.length?S.apis:(S.api?[S.api]:[]);
  if(!list.length){
    var e=new Error('云端未连接');
    e.isNetwork=true;
    return Promise.reject(e);
  }
  return new Promise(function(resolve,reject){
    var i=0;
    function next(){
      var base=list[i], url=base+path;
      fetch(url,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
      }).then(function(r){
        if(!r.ok) throw new Error('HTTP '+r.status+' @ '+url);
        return r.json();
      }).then(resolve,function(err){
        i++;
        if(i<list.length){ next(); return; }
        var e2=new Error((err&&err.message?err.message:'网络请求失败')+' @ '+url);
        e2.isNetwork=true;
        reject(e2);
      });
    }
    next();
  });
}

window.WZCM={
  call:call,
  user:function(){return S.user},
  api:function(){return S.api}
};

/* ---------- 登录 ---------- */
function msg(text,ok){
  var el=$('dpMsg');
  if(!el)return;
  el.textContent=text||'';
  el.className='dp-msg'+(ok===true?' ok':(ok===false?' bad':''));
  clearTimeout(msg.t);
  msg.t=setTimeout(function(){ if(el.textContent===text) el.textContent=''; },3800);
}
function renderAuth(){
  var who=$('dpWho'), out=$('dpOut'), u=$('dpUser'), p=$('dpPwd'), btn=$('dpLogin');
  if(who){
    who.textContent = S.user ? (S.user.username + (S.user.is_admin?' · 管理员':'')) : '未登录';
    who.className = S.user ? 'dp-ok' : '';
  }
  if(out) out.style.display = S.user ? '' : 'none';
  if(u) u.style.display = S.user ? 'none' : '';
  if(p) p.style.display = S.user ? 'none' : '';
  if(btn) btn.style.display = S.user ? 'none' : '';
}
function doLogin(){
  var u=($('dpUser').value||'').trim(), p=($('dpPwd').value||'');
  if(!u||!p){msg('账号和密码都要填',false);return}
  if(!S.api){msg('云端未连接，无法登录',false);return}
  var btn=$('dpLogin');
  if(btn){btn.disabled=true;btn.textContent='登录中…'}
  fetch(S.api+'/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username:u,password:p})
  }).then(function(r){return r.json()}).then(function(j){
    if(btn){btn.disabled=false;btn.textContent='登录'}
    if(!j||!j.ok){msg((j&&j.msg)||'登录失败',false);return}
    writeSess({username:j.username,token:j.token,is_admin:!!j.is_admin,ts:Date.now()});
    renderAuth();
    msg('已登录：'+j.username,true);
    try{document.dispatchEvent(new CustomEvent('wz:auth',{detail:{user:S.user}}))}catch(e){}
    if(window.__dbReload){try{window.__dbReload(true)}catch(e){}}
  }).catch(function(err){
    if(btn){btn.disabled=false;btn.textContent='登录'}
    msg('登录失败：'+(err&&err.message?err.message:'网络错误'),false);
  });
}
function doLogout(){
  var tk=S.user&&S.user.token;
  writeSess(null);
  renderAuth();
  msg('已退出',true);
  try{document.dispatchEvent(new CustomEvent('wz:auth',{detail:{user:null}}))}catch(e){}
  if(window.__dbReload){try{window.__dbReload(true)}catch(e){}}
  if(tk&&S.api){
    fetch(S.api+'/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tk})}).catch(function(){});
  }
}

/* ---------- 加载论战逻辑 ---------- */
function loadDebate(){
  if(S.loaded) return;
  S.loaded=true;
  var s=document.createElement('script');
  s.src='../debate.js?v=36';
  s.onerror=function(){
    S.loaded=false;
    var list=$('dbList');
    if(list) list.innerHTML='<div class="db-empty">论战脚本加载失败，请刷新重试</div>';
  };
  document.body.appendChild(s);
}

/* ---------- 时钟 ---------- */
(function(){
  var el=$('dpClock');
  function tick(){
    var d=new Date(),p=function(n){return n<10?'0'+n:n};
    if(el) el.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }
  tick();
  setInterval(tick,1000);
})();

function boot(){
  S.user=readSess();
  renderAuth();
  var btn=$('dpLogin'), out=$('dpOut'), pwd=$('dpPwd');
  if(btn) btn.addEventListener('click',doLogin);
  if(out) out.addEventListener('click',doLogout);
  if(pwd) pwd.addEventListener('keydown',function(e){ if(e.key==='Enter') doLogin(); });

  discover().then(function(u){
    if(!u){
      setTimeout(function(){
        discover().then(function(x){ if(x&&window.__dbReload) window.__dbReload(true); });
      },20000);
    }
    loadDebate();
  },function(){ loadDebate(); });
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();

})();
