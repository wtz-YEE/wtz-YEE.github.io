/* ===== 页面专属启动动画 · intro.js ===== */
(function(){
  'use strict';
  var V={
    home:{a:'WTZ',b:'PERSONAL SITE / FOUR SECTIONS',d:1250,c:'ARCHIVE / 00'},
    project:{a:'PROJECTS',b:'ARCHIVE / 01',d:1100,c:'SECTION / 01'},
    games:{a:'ARCADE',b:'GAME MODE / 02',d:1100,c:'SECTION / 02'},
    community:{a:'NIGHTWATCH',b:'COMMUNITY / 03',d:1200,c:'SECTION / 03'},
    misc:{a:'MISC',b:'TOOLBOX / 04',d:1200,c:'SECTION / 04'},
    wip:{a:'WIP',b:'BUILD NOT FINAL',d:1100,c:'STATUS / IN DEVELOPMENT'},
    video:{a:'VIDEO',b:'ARCHIVE / NOW SHOWING',d:1250,c:'VIDEO LIBRARY'},
    admin:{a:'ROOT',b:'CONTROL / ACCESS',d:1050,c:'ADMIN CONSOLE'},
    terminal:{a:'TTY',b:'PRTS / INTERFACE',d:1000,c:'TERMINAL / ONLINE'},
    live2d:{a:'LIVE2D',b:'CHARACTER / ONLINE',d:1100,c:'LIVE2D / BOOT'}
  };
  var body=document.body;
  var key=body&&body.getAttribute('data-intro');
  if(!key||!V[key])return;
  try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){}
  var d=V[key];
  var wi=document.createElement('div');
  wi.className='wi wi--'+key;
  wi.setAttribute('aria-hidden','true');
  wi.style.setProperty('--wi-d',d.d+'ms');
  var art=document.createElement('div');art.className='wi-art';
  art.innerHTML='<i></i><i></i><i></i>';
  var copy=document.createElement('div');copy.className='wi-copy';
  var b=document.createElement('b');b.textContent=d.a;
  var s=document.createElement('span');s.textContent=d.b;
  copy.appendChild(b);copy.appendChild(s);
  var prog=document.createElement('div');prog.className='wi-prog';
  prog.innerHTML='<i></i>';
  var cl=document.createElement('div');cl.className='wi-corner-l';cl.textContent='WTZ // SYSTEM';
  var cr=document.createElement('div');cr.className='wi-corner';cr.textContent=d.c;
  wi.appendChild(art);wi.appendChild(copy);wi.appendChild(prog);wi.appendChild(cl);wi.appendChild(cr);
  document.body.appendChild(wi);
  document.documentElement.classList.add('wi-lock');
  var done=false,to=null;
  function end(){
    if(done)return;done=true;
    if(to)clearTimeout(to);
    wi.classList.add('out');
    setTimeout(function(){
      if(wi.parentNode)wi.parentNode.removeChild(wi);
      document.documentElement.classList.remove('wi-lock');
    },280);
  }
  to=setTimeout(end,d.d);
  wi.addEventListener('click',end,{passive:true});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter')end()},{once:true});
})();
