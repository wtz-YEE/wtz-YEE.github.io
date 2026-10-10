/* ===== 独立页共享工具 · _shared.js ===== */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
window.esc=esc;
if(typeof $!=='function')window.$=function(i){return document.getElementById(i)};
if(typeof toast!=='function')window.toast=function(a,b){try{var d=document.getElementById('gTst');if(!d){d=document.createElement('div');d.id='gTst';d.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:2147483647;border:1px solid rgba(255,255,255,.22);background:rgba(10,10,12,.96);color:#e6edef;font-family:Consolas,monospace;font-size:12px;letter-spacing:.16em;padding:10px 18px;box-shadow:0 0 24px rgba(255,255,255,.08);transition:opacity .25s;pointer-events:none';document.body.appendChild(d)}d.innerHTML='<b style="color:#ffd60a">'+esc(a)+'</b>'+(b?'<span style="color:#8a8a8a;margin-left:8px">'+esc(b)+'</span>':'');d.style.opacity='1';clearTimeout(d._t);d._t=setTimeout(function(){d.style.opacity='0'},2200)}catch(e){try{alert(a)}catch(x){}}};
function apiBase(){try{var u=localStorage.getItem('gb_api_url')||'',a=(u||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});return (a[0]||'').replace(/\/+$/,'')}catch(e){return''}}
window.apiBase=apiBase;
function apiToken(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return (s&&s.token)||''}catch(e){return''}}
window.apiToken=apiToken;
window.call=function(path,payload){var b=apiBase();if(!b)return Promise.reject('no-cloud');return fetch(b+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({token:apiToken()},payload||{}))}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})['catch'](function(e){throw e})};
(function(){try{var t=localStorage.getItem('gb_api_url');if(!t){setTimeout(function(){fetch('https://wtz-yee.github.io/port.txt').then(function(r){return r.text()}).then(function(x){if(x&&x.length>4)localStorage.setItem('gb_api_url',x)})['catch'](function(){})},900)}}catch(e){}})();
})();
