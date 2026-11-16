/* ===== 全站通用导航条 · nav.js =====
   替换旧顶部导航：header.top / header.cm-top / header#status / 带 .logo 的页面 header
   保留旧 header 里的时钟、徽章、登录按钮等局部控件，移入新导航右侧。
*/
(function(){
  'use strict';
  if(window.__WTZ_UNIVERSAL_NAV__) return;
  window.__WTZ_UNIVERSAL_NAV__=1;

  var self=document.currentScript;
  var base='';
  try{ if(self&&self.src) base=new URL('.',self.src).href; }catch(e){}

  var LINKS=[
    {k:'home',n:'00',t:'首页',f:'index.html'},
    {k:'project',n:'01',t:'项目',f:'项目.html'},
    {k:'games',n:'02',t:'游戏',f:'游戏.html'},
    {k:'community',n:'03',t:'社区',f:'社区.html'},
    {k:'misc',n:'04',t:'杂项',f:'杂项.html'},
    {k:'video',n:'05',t:'视频库',f:'pages/视频播放.html',hot:1},
    {k:'wip',n:'06',t:'开发中',f:'开发中.html'}
  ];

  function css(){
    if(document.querySelector('link[data-unav-css]')) return;
    var l=document.createElement('link');
    l.rel='stylesheet';l.href=base+'nav.css?v=32';l.setAttribute('data-unav-css','1');
    l.onerror=function(){this.onerror=null;this.href='https://fastly.jsdelivr.net/gh/wtz-YEE/wtz-YEE.github.io@main/nav.css'};
    document.head.appendChild(l);
  }
  function findOld(){
    var hs=document.querySelectorAll('header');
    for(var i=0;i<hs.length;i++){
      var h=hs[i],cl=' '+h.className+' ';
      if(cl.indexOf(' top ')>-1||cl.indexOf(' cm-top ')>-1||h.id==='status')return h;
      if(h.querySelector('.logo')&&h.querySelector('nav'))return h;
    }
    return null;
  }
  function labelOf(h){
    var e=h.querySelector('.st-l,.tl,.logo,h1');
    return e?String(e.textContent||'').replace(/\s+/g,' ').trim():'';
  }
  function activeKey(){
    var f='';
    try{f=decodeURIComponent((location.pathname.split('/').pop()||'index.html')).toLowerCase()}catch(e){}
    if(f===''||f==='index.html')return 'home';
    if(f==='项目.html')return 'project';
    if(f==='游戏.html')return 'games';
    if(f==='社区.html')return 'community';
    if(f==='杂项.html')return 'misc';
    if(f==='开发中.html')return 'wip';
    if(f.indexOf('视频')===0)return 'video';
    return '';
  }

  function clockText(){
    var d=new Date(),p=function(n){return n<10?'0'+n:n};
    return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }

  function boot(){
    var old=findOld();
    if(!old)return;
    css();

    var nav=document.createElement('nav');
    nav.className='unav';
    nav.setAttribute('aria-label','全站导航');

    var inner=document.createElement('div');inner.className='unav-in';

    var brand=document.createElement('a');brand.className='unav-brand';brand.href=base+'index.html';
    brand.innerHTML='<span class="unav-mark"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 L54 20 V44 L32 58 L10 44 V20 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 18 L42 24 V38 L32 44 L22 38 V24 Z" fill="currentColor"/></svg></span><span class="unav-brandtext"><b>WTZ</b><i>ARCHIVE OS</i></span>';
    inner.appendChild(brand);

    var active=activeKey();
    var page=document.createElement('span');page.className='unav-page';
    var lb=labelOf(old);
    if(lb&&lb.indexOf('WTZ')===0){
      var hit=LINKS.filter(function(x){return x.k===active})[0];
      if(hit)lb=hit.t;
    }
    if(lb&&LINKS.some(function(x){return x.t===lb}))lb='';
    if(lb){page.textContent=lb;inner.appendChild(page)}

    var links=document.createElement('div');links.className='unav-links';
    LINKS.forEach(function(x){
      var a=document.createElement('a');a.href=base+x.f;a.dataset.k=x.k;
      if(x.k===active)a.className='on';
      if(x.hot)a.className=(a.className?a.className+' ':'')+'hot';
      a.innerHTML='<i>'+x.n+'</i><span>'+x.t+'</span>';
      links.appendChild(a);
    });
    inner.appendChild(links);

    var right=document.createElement('div');right.className='unav-right';

    var clock=old.querySelector('#clk,#cmClock,#clock');
    if(clock){
      clock.classList.add('unav-clock');
      right.appendChild(clock);
    }else{
      var c=document.createElement('span');c.className='unav-clock';c.id='unavClock';c.textContent=clockText();
      right.appendChild(c);
      setInterval(function(){if(c)c.textContent=clockText()},1000);
    }

    var local=document.createElement('div');local.className='unav-local';
    var ctrls=old.querySelectorAll('#pmBadge,#ntBadge,#achBtn,#permBadge,#navLoginBtn,.pbadge,.cm-ic');
    for(var i=0;i<ctrls.length;i++){
      var el=ctrls[i];
      if(el.id==='navLoginBtn'&&!el.textContent)el.textContent='登录';
      local.appendChild(el);
    }
    right.appendChild(local);

    var menu=document.createElement('button');menu.type='button';menu.className='unav-menu';menu.setAttribute('aria-label','打开导航菜单');
    menu.innerHTML='<span class="um-i"><i></i><i></i><i></i></span><span>菜单</span>';
    right.appendChild(menu);
    inner.appendChild(right);
    nav.appendChild(inner);

    old.style.display='none';
    old.parentNode.insertBefore(nav,old);

    /* 折叠菜单 */
    var scrim=document.createElement('div');scrim.className='unav-scrim';
    var drawer=document.createElement('div');drawer.className='unav-drawer';
    var dhead=document.createElement('div');dhead.className='unav-dhead';
    dhead.innerHTML='<span>WTZ // NAVIGATION</span>';
    var close=document.createElement('button');close.type='button';close.textContent='关闭';dhead.appendChild(close);
    drawer.appendChild(dhead);
    var dl=document.createElement('div');dl.className='unav-dlinks';
    LINKS.forEach(function(x){
      var a=document.createElement('a');a.href=base+x.f;
      if(x.k===active)a.className='on';
      a.innerHTML='<i>'+x.n+'</i><span>'+x.t+'</span>';
      dl.appendChild(a);
    });
    drawer.appendChild(dl);
    var df=document.createElement('div');df.className='unav-dfoot';
    df.innerHTML='<b>WTZ // PERSONAL SITE</b>ARCHIVE OS · 2026<br>PROJECTS · GAMES · COMMUNITY · MISC';
    drawer.appendChild(df);
    scrim.appendChild(drawer);document.body.appendChild(scrim);

    function open(){scrim.classList.add('on');document.body.classList.add('unav-open')}
    function shut(){scrim.classList.remove('on');document.body.classList.remove('unav-open')}
    menu.addEventListener('click',open);
    close.addEventListener('click',shut);
    scrim.addEventListener('click',function(e){if(e.target===scrim)shut()});
    dl.addEventListener('click',function(e){if(e.target.closest('a'))shut()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')shut()});

    /* 旧登录按钮可能由 shared-nav.js 稍后注入，捕获后移入新导航 */
    function moveLogin(){
      var b=document.getElementById('navLoginBtn');
      if(b&&!local.contains(b)){local.appendChild(b)}
    }
    moveLogin();
    try{
      var mo=new MutationObserver(moveLogin);
      mo.observe(old,{childList:true,subtree:true});
      setTimeout(function(){moveLogin();mo.disconnect();if(old.parentNode)old.parentNode.removeChild(old)},1200);
    }catch(e){setTimeout(function(){if(old.parentNode)old.parentNode.removeChild(old)},1200)}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
